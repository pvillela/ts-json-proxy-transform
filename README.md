# ts-proxy-transform

This library implements a simple TypeScript proxy server function based on Express and Axios. The proxy server supports optional transformations of the request before it goes to the target service and/or the response after it returns from the target service.

The [src/proxy-run-example.ts](./src/proxy-run-example.ts) file contains an example that proxies the Postman echo service (see below) with request and response transformations. The example uses the Postman collection `Hello Proxy.postman_collection.json` in the `example-data` directory to test the transformations.

The [example-data](./example-data) directory contains:
- `Hello-World.postman_collection.json` -- the out-of-the-box [Postman](https://learning.postman.com/docs/getting-started/installation-and-updates/) collection that uses the [Postman echo service](https://www.postman.com/postman/workspace/published-postman-templates/documentation/631643-f695cab7-6878-eb55-7943-ad88e1ccfd65?ctx=documentation) to illustrate simple API testing.
- `Hello-Proxy-Post.postman_collection.json` -- a modification of the above collection to illustrate the testing of the example transformation functions in `src/proxy-run-example.ts`.
- `Hello-Proxy-Put.postman_collection.json` -- same as the above, but to illustrate PUT requests instead of POSTs.
