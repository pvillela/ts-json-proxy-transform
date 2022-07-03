/*
    Example execution of the proxy function that proxies the Postman echo service with
    request and response transformations. The example uses the Postman collection
    `Hello Proxy.postman_collection.json` in the `example-data` directory to test
    the transformations.
 */

/* eslint-disable @typescript-eslint/no-explicit-any,
   @typescript-eslint/no-unsafe-assignment,
   @typescript-eslint/no-unsafe-member-access */

import { proxy } from "./proxy";
import { IncomingHttpHeaders } from "http";

function reqTransform(_path: string, data: unknown, reqHeaders: IncomingHttpHeaders): unknown {
  const origReqBody = data as any;
  console.log("********* origReqBody:", JSON.stringify(origReqBody));
  const msg = origReqBody.message;
  if (msg) {
    const trfmReqBody = { ...origReqBody };
    trfmReqBody.message = (origReqBody.message as string) + " - by proxy";
    console.log("********* trfmReqBody:", JSON.stringify(trfmReqBody));
    // Set a custom header.
    reqHeaders.foo = "bar";
    console.log("********* reqHeaders:", reqHeaders);
    // Notice below headers are not returned so input headers will be used.
    return trfmReqBody;
  }
  throw new Error("Unable to transform request.");
}

function resTransform(_path: string, data: unknown): unknown {
  const origResData = data as any;
  console.log("********* origResData:", origResData);
  const msg = origResData.data.message;
  if (msg) {
    const result = {
      result: msg,
    };
    const trfmResData = { ...origResData };
    trfmResData.data = result;
    console.log("********* trfmResData:", trfmResData);
    console.log("********* Manual computation of content-length header value:", JSON.stringify(trfmResData).length);
    return trfmResData;
  }
  throw new Error("Unable to transform response.");
}

proxy(
  8000,
  "https://postman-echo.com",
  { reqTransform, resTransform }
);
