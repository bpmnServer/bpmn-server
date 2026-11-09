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
- [retry](APIEngine.md#retry)
- [restart](APIEngine.md#restart)
- [upgrade](APIEngine.md#upgrade)

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

[packages/bpmn-server/src/API/API.ts:63](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L63)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[packages/bpmn-server/src/API/API.ts:61](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L61)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[packages/bpmn-server/src/API/API.ts:66](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L66)

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

[packages/bpmn-server/src/API/API.ts:69](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L69)

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

[packages/bpmn-server/src/API/API.ts:248](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L248)

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

[packages/bpmn-server/src/API/API.ts:253](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L253)

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

[packages/bpmn-server/src/API/API.ts:259](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L259)

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

[packages/bpmn-server/src/API/API.ts:264](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L264)

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

[packages/bpmn-server/src/API/API.ts:270](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L270)

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

[packages/bpmn-server/src/API/API.ts:274](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L274)

___

### retry

▸ **retry**(`itemQuery`, `user?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

Runs a failed item's work again (its status `error`), and the instance on from it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemQuery` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:280](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L280)

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

[packages/bpmn-server/src/API/API.ts:284](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L284)

___

### upgrade

▸ **upgrade**(`model`, `afterNodeIds`, `user?`): `Promise`\<`string`[] \| \{ `errors`: `any`  }\>

upgrade running instances with the latest revised bpmn model
default behaviour is that running instances will retain the model at start
However, this routine will upgrade already started instances with the revised model

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `model` | `any` | Model Name |
| `afterNodeIds` | `any` | list of nodeIds, to check if already started, don't apply the upgrade |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) | - |

#### Returns

`Promise`\<`string`[] \| \{ `errors`: `any`  }\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[upgrade](../interfaces/IAPIEngine.md#upgrade)

#### Defined in

[packages/bpmn-server/src/API/API.ts:289](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L289)
