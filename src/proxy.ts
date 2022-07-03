/*
    Implementation of a very simple HTTP proxy using Express and Axios.
    This proxy supports optional transformations of the request before it goes to
    the target service and/or the response after it returns from the target service.
 */

import axios, { AxiosRequestHeaders } from "axios";
import express, { Request, Response } from "express";
import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http";

/**
 * Data type of input to request transformation function.
 */
export type ReqTransformIn = {
  /**
   * Enables the transformation function to have differentiated logic depending on the
   * endpoint's path.
   */
  path: string;

  /**
   * The object payload of the original request.
   */
  data: unknown;

  /**
   * The headers of the original request.
   */
  headers: IncomingHttpHeaders;
};

/**
 * Data type of output of request transformation function.
 */
export type ReqTransformOut = {
  /**
   * The transformed object payload.
   */
  data?: unknown;

  /**
   * The transformed headers.
   */
  headers?: IncomingHttpHeaders;
};

/**
 * Data type of input to response transformation function.
 */
export type ResTransformIn = {
  /**
   * Enables the transformation function to have differentiated logic depending on the
   * endpoint's path.
   */
  path: string;

  /**
   * The object content of the target service's response.
   */
  data: unknown;

  /**
   * The headers of the target service's response.
   */
  headers: OutgoingHttpHeaders;
};


/**
 * Data type of output of response transformation function.
 */
export type ResTransformOut = {
  /**
   * The transformed response object.
   */
  data?: unknown;

  /**
   * The transformed headers.
   */
  headers?: OutgoingHttpHeaders;
};

/**
 * Implements the proxy server.
 *
 * @param prxPort The port on which the proxy listens.
 * @param baseSvcUrl The URL of the target service that is being proxied.
 * @param options Optional functions to transform the request body and/or response data.
 *  The transform functions do not need to set the headers for content-type, host, and
 *  content-length as they are set automatically. If the `headers` field of a transform
 *  function response is undefined then the original untransformed headers are used, with
 *  the appropriate automatic setting of the host and content-length headers.
 */
export function proxy(
  prxPort: number,
  baseSvcUrl: string,
  options?: {
    reqTransform?: (input: ReqTransformIn) => ReqTransformOut;
    resTransform?: (input: ResTransformIn) => ResTransformOut;
  }
): void {
  const reqTransform = options?.reqTransform;
  const resTransform = options?.resTransform;

  const app = express();

  // Enable Express JSON middleware.
  app.use(
    express.json({
      verify: (req: Request, res: Response, buf: Buffer) => {
        try {
          JSON.parse(buf.toString());
        } catch (e) {
          res.status(400);
          res.send("invalidJsonError");
          throw Error("Invalid JSON");
        }
      },
    })
  );

  app.all("/*", (reqP, resP) => {
    const method = reqP.method;
    if (method != "POST" && method != "PUT" && method != "PATCH") {
      throw new Error(`Invalid HTTP method ${reqP.method}`);
    }

    const path = reqP.path;

    const reqTransformIn = {
      path: reqP.path,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: reqP.body,
      headers: reqP.headers
    };
    const reqTransformOut = reqTransform ? reqTransform(reqTransformIn) : reqTransformIn;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const reqData = reqTransformOut.data ? reqTransformOut.data : reqTransformIn.data;
    const reqHeaders = reqTransformOut.headers ? reqTransformOut.headers : reqTransformIn.headers;

    // Let Axios generate appropriate host and content-length headers.
    delete reqHeaders.host;
    delete reqHeaders["content-length"];

    axios({
      method,
      url: baseSvcUrl + path,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: reqData,
      headers: reqHeaders as AxiosRequestHeaders
    })
      .then((resS) => {
        // eslint-disable-next-line no-param-reassign
        resP.charset = "utf8";

        resP.status(resS.status);

        const resTransformIn = {
          path: reqP.path,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: resS.data,
          headers: resS.headers
        };
        const resTransformOut = resTransform ? resTransform(resTransformIn) : resTransformIn;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const resData = resTransformOut.data ? resTransformOut.data : resTransformIn.data;
        const resHeaders = resTransformOut.headers ? resTransformOut.headers : resTransformIn.headers;

        // Let Express generate appropriate content-length header.
        delete resHeaders["content-length"];

        // eslint-disable-next-line promise/always-return
        for (const k in resHeaders) {
          const header = resHeaders[k];
          if (header) {
            resP.setHeader(k, header);
          }
        }

        resP.send(resData);
      })
      .catch((error) => {
        resP.status(500);
        resP.send(error);
        console.error("ERROR:", error);
      });
  });

  app.listen(prxPort, () => {
    console.log(`Application is running on port ${prxPort}`);
  });
}
