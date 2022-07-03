# json-proxy-transform

This library implements a simple proxy server for JSON HTTP APIs that can transform the request before it goes to the target service and/or the response after it returns from the target service. It is written in TypeScript and is based on [Express](https://www.npmjs.com/package/express) and [Axios](https://www.npmjs.com/package/axios).

This proxy is suitable for test environments and test use cases, but is not recommended for production use.

The [src/proxy-run-example.ts](src/proxy-run-example.ts) file contains an example that proxies the [Postman echo service](https://www.postman.com/postman/workspace/published-postman-templates/documentation/631643-f695cab7-6878-eb55-7943-ad88e1ccfd65?ctx=documentation) (see below) with request and response transformations. The examples in the `examples-data` directory (see below) can be used to call the proxy service. The Postman collection example files require the Postman app and the curl examples can be used without Postman.

The [example-data](example-data) directory contains:
- `Hello-World.postman_collection.json` -- the out-of-the-box [Postman](https://learning.postman.com/docs/getting-started/installation-and-updates/) collection that uses the Postman echo service to illustrate simple API testing.
- `Hello-Proxy-Post.postman_collection.json` -- a modification of the above collection to illustrate the testing of the example transformation functions in `src/proxy-run-example.ts`.
- `Hello-Proxy-Put.postman_collection.json` -- same as the above, but to illustrate PUT requests instead of POSTs.
- `hello-proxy-post-curl.sh` -- curl script with same POST request as `Hello-Proxy-Post.postman_collection.json`.
- `hello-proxy-put-curl.sh` -- same as the above, but to illustrate PUT requests instead of POSTs.

## API documentation

See [docs/modules.md](docs/modules.md).


### Implementation note

While Axios directly provides the ability to transform requests and responses, I chose, after much exploration, not to use that feature as it adds much unnecessary complexity to the implementation of this library. The main problem is that much of the default Axios behaviour goes away when `transformRequest` and `transformResponse` are used, so it is necessary make calls to JSON.stringify, parse JSON data, set several headers, etc. In addition, the Axios `transformRequest` function uses the `AxiosRequestHeaders` type which is different from the standard `IncomingHttpHeaders` type. To avoid introducing an API dependency on `AxiosRequestHeaders`, it would be necessary for the implementation to iterate over the latter to make it compatible with `IncomingHttpHeaders`.
