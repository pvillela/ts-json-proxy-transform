/*
    Example execution of the proxy function that proxies the Postman echo service with
    request and response transformations. The example uses the Postman collection
    `Hello Proxy.postman_collection.json` in the `example-data` directory to test
    the transformations.
 */

/* eslint-disable @typescript-eslint/no-explicit-any,
   @typescript-eslint/no-unsafe-assignment,
   @typescript-eslint/no-unsafe-member-access */

import { proxy, ReqTransformIn, ReqTransformOut, ResTransformIn, ResTransformOut } from "./proxy";

function reqTransform(input: ReqTransformIn): ReqTransformOut {
  const origReqBody = input.data as any;
  console.log("********* origReqBody:", origReqBody);
  const msg = origReqBody.message;
  if (msg) {
    const trfmReqBody = { ...origReqBody };
    trfmReqBody.message = (origReqBody.message as string) + " - by proxy";
    console.log("********* trfmReqBody:", trfmReqBody);
    return { data: trfmReqBody };
  }
  throw new Error("Unable to transform request.");
}

function resTransform(input: ResTransformIn): ResTransformOut {
  const origResData = input.data as any;
  console.log("********* origResData:", origResData);
  const msg = origResData.data.message;
  if (msg) {
    const result = {
      result: msg,
    };
    const trfmResData = { ...origResData };
    trfmResData.data = result;
    console.log("********* trfmResData:", trfmResData);
    return { data: trfmResData };
  }
  throw new Error("Unable to transform response.");
}

proxy(
  8000,
  "http://postman-echo.com",
  { reqTransform, resTransform }
);
