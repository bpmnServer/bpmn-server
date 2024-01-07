[bpmn-server](../readme.md) / APIEngine

# Class: APIEngine

common parameters:

- query:      MongoDB query to locate the target instance or item

- data:       input Data 

- user:       an instance of ISecureUser object 

- options:    various options, this is an open object that is based through the run-time

Returns IExecution
containing the instance and the results of the call

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

- [start](APIEngine.md#start)
- [invoke](APIEngine.md#invoke)
- [assign](APIEngine.md#assign)
- [throwMessage](APIEngine.md#throwmessage)
- [throwSignal](APIEngine.md#throwsignal)
- [startEvent](APIEngine.md#startevent)

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

[API/API.ts:24](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L24)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[API/API.ts:22](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L22)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[API/API.ts:27](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L27)

## Methods

### start

▸ **start**(`name`, `data?`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

start a new Instance of specified model

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

[API/API.ts:155](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L155)

___

### invoke

▸ **invoke**(`query`, `data?`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

continue with the execution of a particular item that is in a wait state, typically a user task

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

[API/API.ts:159](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L159)

___

### assign

▸ **assign**(`query`, `data`, `assignment`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

provide assignment data to a user task

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

[API/API.ts:164](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L164)

___

### throwMessage

▸ **throwMessage**(`messageId`, `data`, `messageMatchingKey`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

throw a message with an id, system will identify receiving item

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

[API/API.ts:168](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L168)

___

### throwSignal

▸ **throwSignal**(`signalId`, `data`, `messageMatchingKey`, `user`, `options?`): `Promise`\<`any`\>

throw a signal with an id, system will identify receiving item(s)

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

[API/API.ts:171](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L171)

___

### startEvent

▸ **startEvent**(`query`, `elementId`, `data?`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

start a second event node (in a subprocess) for a running instance

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

[API/API.ts:174](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L174)
