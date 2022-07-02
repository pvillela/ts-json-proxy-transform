/*
    Implementation of a very simple HTTP proxy using Express and Axios.
    This proxy supports optional transformations of the request before it goes to
    the target service and/or the response after it returns from the target service.
 */

import axios, { AxiosRequestHeaders } from "axios";
import express, { Request, Response } from "express";
import { IncomingHttpHeaders } from "http";

export type ReqTransformIn = {
  path: string;
  data: unknown;
  headers: IncomingHttpHeaders;
};

export type ReqTransformOut = {
  data?: unknown;
  headers?: IncomingHttpHeaders;
};

export type ResTransformIn = {
  path: string;
  data: unknown;
  headers: Record<string, string> & {"set-cookie"?: string[]};
};

export type ResTransformOut = {
  data?: unknown;
  headers?: Record<string, string> & {"set-cookie"?: string[]};
};

/**
 * Implements the proxy server.
 *
 * @param prxPort The port on which the proxy listens.
 * @param baseSvcUrl The URL of the target service that is being proxied.
 * @param options Optional functions to transform the request body and/or response data.
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
    const url = new URL(baseSvcUrl);
    reqHeaders.host = url.host;

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

        // eslint-disable-next-line promise/always-return
        for (const k in resHeaders) {
          resP.setHeader(k, resHeaders[k]);
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
