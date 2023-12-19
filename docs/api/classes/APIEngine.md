[bpmn-server](../README.md) / APIEngine

# Class: APIEngine

common parameters:

- query:      MongoDB query to locate the target instance or item

- data:       input Data 

- user:       an instance of ISecureUser object 

- options:    various options, this is an open object that is based through the run-time

Returns IExecution
containing the instance and the results of the call

*

## Hierarchy

- `APIComponent`

  ↳ **`APIEngine`**

## Implements

- [`IAPIEngine`](../interfaces/IAPIEngine.md)

## Table of contents

### Constructors

- [constructor](APIEngine.md#constructor)

### Properties

- [api](APIEngine.md#api)

### Accessors

- [server](APIEngine.md#server)

### Methods

- [assign](APIEngine.md#assign)
- [invoke](APIEngine.md#invoke)
- [start](APIEngine.md#start)
- [startEvent](APIEngine.md#startevent)
- [throwMessage](APIEngine.md#throwmessage)
- [throwSignal](APIEngine.md#throwsignal)

## Constructors

### constructor

• **new APIEngine**(`api`): [`APIEngine`](APIEngine.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `any` |

#### Returns

[`APIEngine`](APIEngine.md)

#### Inherited from

APIComponent.constructor

#### Defined in

[API/API.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-24)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[API/API.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-22)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[API/API.ts:27](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-27)

## Methods

### assign

▸ **assign**(`query`, `data`, `assignment`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `data` | `any` |
| `assignment` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[assign](../interfaces/IAPIEngine.md#assign)

#### Defined in

[API/API.ts:92](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-92)

___

### invoke

▸ **invoke**(`query`, `data?`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `data` | `Object` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[invoke](../interfaces/IAPIEngine.md#invoke)

#### Defined in

[API/API.ts:87](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-87)

___

### start

▸ **start**(`name`, `data?`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

start a new Instance of specified model
*

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `data` | `Object` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[start](../interfaces/IAPIEngine.md#start)

#### Defined in

[API/API.ts:83](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-83)

___

### startEvent

▸ **startEvent**(`query`, `elementId`, `data?`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `elementId` | `any` |
| `data` | `Object` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[startEvent](../interfaces/IAPIEngine.md#startevent)

#### Defined in

[API/API.ts:102](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-102)

___

### throwMessage

▸ **throwMessage**(`messageId`, `data`, `messageMatchingKey`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[throwMessage](../interfaces/IAPIEngine.md#throwmessage)

#### Defined in

[API/API.ts:96](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-96)

___

### throwSignal

▸ **throwSignal**(`signalId`, `data`, `messageMatchingKey`, `user`, `options?`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[throwSignal](../interfaces/IAPIEngine.md#throwsignal)

#### Defined in

[API/API.ts:99](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-99)
