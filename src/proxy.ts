/*
    Implementation of a very simple HTTP proxy using Express and Axios.
    This proxy supports optional transformations of the request before it goes to
    the target service and/or the response after it returns from the target service.
 */

import axios from "axios";
import express, { Request, Response } from "express";

/**
 * Implements the proxy server.
 *
 * @param prxPort The port on which the proxy listens.
 * @param svcUrl The URL of the target service that is being proxied.
 * @param options Optional functions to transform the request body and/or response data.
 */
export function proxy(
  prxPort: number,
  svcUrl: string,
  options?: {
    reqTransform?: (body: unknown) => unknown;
    resTransform?: (data: unknown) => unknown;
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

  app.post("/", (reqP, resP) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const reqBodyT = reqTransform ? reqTransform(reqP.body) : reqP.body;
    axios
      .post(svcUrl, reqBodyT)
      .then((resS) => {
        // eslint-disable-next-line no-param-reassign
        resP.charset = "utf8";

        resP.status(resS.status);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,promise/always-return
        const resDataT = resTransform ? resTransform(resS.data) : resS.data;

        resP.send(resDataT);
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
