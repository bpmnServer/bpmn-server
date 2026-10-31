[bpmn-server](../readme.md) / APIEngine

# Class: APIEngine

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

- [getUser](APIEngine.md#getuser)
- [start](APIEngine.md#start)
- [invoke](APIEngine.md#invoke)
- [assign](APIEngine.md#assign)
- [throwMessage](APIEngine.md#throwmessage)
- [throwSignal](APIEngine.md#throwsignal)
- [startEvent](APIEngine.md#startevent)
- [restart](APIEngine.md#restart)

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

[API/API.ts:44](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L44)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[API/API.ts:42](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L42)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[API/API.ts:47](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L47)

## Methods

### getUser

▸ **getUser**(`user`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `any` |

#### Returns

`any`

#### Inherited from

APIComponent.getUser

#### Defined in

[API/API.ts:50](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L50)

___

### start

▸ **start**(`name`, `data?`, `user?`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

start a new Instance of specified model

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `any` | name of the model to start. |
| `data` | `Object` | - |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) | user object {} |
| `options` | [`IEngineOptions`](../interfaces/IEngineOptions.md) | - |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[start](../interfaces/IAPIEngine.md#start)

#### Defined in

[API/API.ts:220](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L220)

___

### invoke

▸ **invoke**(`query`, `data?`, `user?`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

continue with the execution of a particular item that is in a wait state, typically a user task

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `data` | `Object` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | [`IEngineOptions`](../interfaces/IEngineOptions.md) |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[invoke](../interfaces/IAPIEngine.md#invoke)

#### Defined in

[API/API.ts:224](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L224)

___

### assign

▸ **assign**(`query`, `data`, `assignment`, `user?`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

provide assignment data to a user task
Also, updates item data

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `data` | `any` |
| `assignment` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | [`IEngineOptions`](../interfaces/IEngineOptions.md) |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[assign](../interfaces/IAPIEngine.md#assign)

#### Defined in

[API/API.ts:230](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L230)

___

### throwMessage

▸ **throwMessage**(`messageId`, `data`, `messageMatchingKey`, `user?`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

throw a message with an id, system will identify receiving item

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | [`IEngineOptions`](../interfaces/IEngineOptions.md) |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[throwMessage](../interfaces/IAPIEngine.md#throwmessage)

#### Defined in

[API/API.ts:235](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L235)

___

### throwSignal

▸ **throwSignal**(`signalId`, `data`, `messageMatchingKey`, `user?`, `options?`): `Promise`\<`any`\>

throw a signal with an id, system will identify receiving item(s)

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | [`IEngineOptions`](../interfaces/IEngineOptions.md) |

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[throwSignal](../interfaces/IAPIEngine.md#throwsignal)

#### Defined in

[API/API.ts:238](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L238)

___

### startEvent

▸ **startEvent**(`query`, `elementId`, `data?`, `user?`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

start a second event node (in a subprocess) for a running instance

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `elementId` | `any` |
| `data` | `Object` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | [`IEngineOptions`](../interfaces/IEngineOptions.md) |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[startEvent](../interfaces/IAPIEngine.md#startevent)

#### Defined in

[API/API.ts:241](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L241)

___

### restart

▸ **restart**(`itemQuery`, `data`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

restarting an already completed instance at a particular node
this function requires `dataStore.enableSavePoints` to be true in configuration.ts
this add a savePoint for each item, allowing you to select that item to restore it

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `itemQuery` | `any` | Query to find a single item |
| `data` | `any` | - |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) | - |
| `options` | `Object` | - |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[restart](../interfaces/IAPIEngine.md#restart)

#### Defined in

[API/API.ts:244](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L244)
