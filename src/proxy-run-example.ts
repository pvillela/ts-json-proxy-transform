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
  console.log("********* origReqBody:", JSON.stringify(origReqBody));
  const msg = origReqBody.message;
  if (msg) {
    const trfmReqBody = { ...origReqBody };
    trfmReqBody.message = (origReqBody.message as string) + " - by proxy";
    console.log("********* trfmReqBody:", JSON.stringify(trfmReqBody));
    const headers = input.headers;
    // delete headers["content-length"];
    headers["content-length"] = JSON.stringify(trfmReqBody).length.toString();
    console.log("********* headers:", headers);
    return { data: trfmReqBody, headers };
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
    const headers = input.headers;
    // delete headers["content-length"];
    headers["content-length"] = JSON.stringify(trfmResData).length.toString();
    console.log("********* headers:", headers);
    return { data: trfmResData, headers };
  }
  throw new Error("Unable to transform response.");
}

proxy(
  8000,
  "https://postman-echo.com",
  { reqTransform, resTransform }
);
