# json-proxy-transform API

## Table of contents

### Type Aliases

- [ReqTransformIn](modules.md#reqtransformin)
- [ReqTransformOut](modules.md#reqtransformout)
- [ResTransformIn](modules.md#restransformin)
- [ResTransformOut](modules.md#restransformout)

### Functions

- [proxy](modules.md#proxy)

## Type Aliases

### ReqTransformIn

Ƭ **ReqTransformIn**: `Object`

Data type of input to request transformation function.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `unknown` | The object payload of the original request. |
| `headers` | `IncomingHttpHeaders` | The headers of the original request. |
| `path` | `string` | The request path. Enables the transformation function to have differentiated logic depending on the endpoint's path. |

#### Defined in

[proxy.ts:14](https://github.com/pvillela/ts-json-proxy-transform/blob/99c72d1/src/proxy.ts#L14)

___

### ReqTransformOut

Ƭ **ReqTransformOut**: `Object`

Data type of output of request transformation function.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `unknown` | The transformed object payload. |
| `headers?` | `IncomingHttpHeaders` | The transformed headers. |

#### Defined in

[proxy.ts:35](https://github.com/pvillela/ts-json-proxy-transform/blob/99c72d1/src/proxy.ts#L35)

___

### ResTransformIn

Ƭ **ResTransformIn**: `Object`

Data type of input to response transformation function.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `unknown` | The object content of the target service's response. |
| `headers` | `OutgoingHttpHeaders` | The headers of the target service's response. |
| `path` | `string` | The request path. Enables the transformation function to have differentiated logic depending on the endpoint's path. |
| `status` | `number` | The response status code. Enables the transformation function to have differentiated logic depending on the response status code. |

#### Defined in

[proxy.ts:50](https://github.com/pvillela/ts-json-proxy-transform/blob/99c72d1/src/proxy.ts#L50)

___

### ResTransformOut

Ƭ **ResTransformOut**: `Object`

Data type of output of response transformation function.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `unknown` | The transformed response object. |
| `headers?` | `OutgoingHttpHeaders` | The transformed headers. |

#### Defined in

[proxy.ts:78](https://github.com/pvillela/ts-json-proxy-transform/blob/99c72d1/src/proxy.ts#L78)

## Functions

### proxy

▸ **proxy**(`prxPort`, `baseSvcUrl`, `options?`): `void`

Implements the proxy server.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prxPort` | `number` | The port on which the proxy listens. |
| `baseSvcUrl` | `string` | The URL of the target service that is being proxied. |
| `options?` | `Object` | Optional functions to transform the request body and/or response data.  The transform functions do not need to set the headers for content-type, host, and  content-length as they are set automatically. If the `headers` field of a transform  function response is undefined then the original untransformed headers are used, with  the appropriate automatic setting of the host and content-length headers. |
| `options.reqTransform?` | (`input`: [`ReqTransformIn`](modules.md#reqtransformin)) => [`ReqTransformOut`](modules.md#reqtransformout) | - |
| `options.resTransform?` | (`input`: [`ResTransformIn`](modules.md#restransformin)) => [`ResTransformOut`](modules.md#restransformout) | - |

#### Returns

`void`
