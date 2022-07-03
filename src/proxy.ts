/*
    Implementation of a very simple HTTP proxy using Express and Axios.
    This proxy supports optional transformations of the request before it goes to
    the target service and/or the response after it returns from the target service.
 */

import axios, { AxiosRequestHeaders } from "axios";
import express, { Request, Response } from "express";
import { IncomingHttpHeaders } from "http";

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
    reqTransform?: (path: string, data: unknown, headers: IncomingHttpHeaders) => unknown;
    resTransform?: (path: string, data: unknown) => unknown;
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

    const transformRequest =
      reqTransform
      && ((data: unknown, axiosHeaders?: AxiosRequestHeaders): string => {
        if (!axiosHeaders) throw new Error("No headers.");
        // Convert to IncomingHeaders type.
        for (const key in axiosHeaders) {
          if (typeof axiosHeaders[key] !== "string") {
            axiosHeaders[key] = axiosHeaders[key].toString();
          }
        }
        const result = reqTransform(path, data, axiosHeaders as IncomingHttpHeaders);
        return JSON.stringify(result);
      });

    const transformResponse =
      resTransform
      && ((data: unknown): unknown => {
        const result = resTransform(path, data);
        return JSON.stringify(result);
      });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const reqData = reqP.body;
    const reqHeaders = reqP.headers;

    // Let Axios generate appropriate host and content-length headers.
    delete reqHeaders.host;
    delete reqHeaders["content-length"];

    axios({
      method,
      url: baseSvcUrl + path,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: reqData,
      headers: reqHeaders as AxiosRequestHeaders,
      transformRequest,
      transformResponse
    })
      .then((resS) => {
        // eslint-disable-next-line no-param-reassign
        // resP.charset = "utf8";

        resP.status(resS.status);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const resData = resS.data;
        const resHeaders = resS.headers;

        // Let Express generate appropriate content-length header.
        // delete resHeaders["content-length"];

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
