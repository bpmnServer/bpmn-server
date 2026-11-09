[bpmn-server](../readme.md) / IAPIEngine

# Interface: IAPIEngine

## Implemented by

- [`APIEngine`](../classes/APIEngine.md)

## Table of contents

### Methods

- [start](IAPIEngine.md#start)
- [invoke](IAPIEngine.md#invoke)
- [assign](IAPIEngine.md#assign)
- [throwMessage](IAPIEngine.md#throwmessage)
- [throwSignal](IAPIEngine.md#throwsignal)
- [startEvent](IAPIEngine.md#startevent)
- [restart](IAPIEngine.md#restart)
- [upgrade](IAPIEngine.md#upgrade)

## Methods

### start

▸ **start**(`modelName`, `data`, `user`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

start a new Instance of specified model

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `modelName` | `any` | name of the model to start. |
| `data` | `Object` | - |
| `user` | [`ISecureUser`](ISecureUser.md) | user object {} |
| `options?` | [`IEngineOptions`](IEngineOptions.md) | - |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:105](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L105)

___

### invoke

▸ **invoke**(`query`, `data`, `user`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

continue with the execution of a particular item that is in a wait state, typically a user task

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `data` | `Object` |
| `user` | [`ISecureUser`](ISecureUser.md) |
| `options?` | [`IEngineOptions`](IEngineOptions.md) |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:112](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L112)

___

### assign

▸ **assign**(`query`, `data`, `assignment`, `user`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

provide assignment data to a user task
Also, updates item data

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `data` | `any` |
| `assignment` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |
| `options?` | [`IEngineOptions`](IEngineOptions.md) |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:117](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L117)

___

### throwMessage

▸ **throwMessage**(`messageId`, `data`, `messageMatchingKey`, `user`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

throw a message with an id, system will identify receiving item

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |
| `options?` | [`IEngineOptions`](IEngineOptions.md) |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:121](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L121)

___

### throwSignal

▸ **throwSignal**(`signalId`, `data`, `messageMatchingKey`, `user`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

throw a signal with an id, system will identify receiving item(s)

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |
| `options?` | [`IEngineOptions`](IEngineOptions.md) |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:125](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L125)

___

### startEvent

▸ **startEvent**(`query`, `elementId`, `data`, `user`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

start a second event node (in a subprocess) for a running instance

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `elementId` | `any` |
| `data` | `Object` |
| `user` | [`ISecureUser`](ISecureUser.md) |
| `options?` | [`IEngineOptions`](IEngineOptions.md) |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:129](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L129)

___

### restart

▸ **restart**(`itemQuery`, `data`, `userName`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

restarting an already completed instance at a particular node
this function requires `dataStore.enableSavePoints` to be true in configuration.ts
this add a savePoint for each item, allowing you to select that item to restore it

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `itemQuery` | `any` | Query to find a single item |
| `data` | `any` | - |
| `userName` | `any` | - |
| `options?` | `any` | - |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:143](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L143)

___

### upgrade

▸ **upgrade**(`model`, `afterNodeIds`, `user`): `Promise`\<`string`[] \| \{ `errors`: `any`  }\>

upgrade running instances with the latest revised bpmn model
default behaviour is that running instances will retain the model at start
However, this routine will upgrade already started instances with the revised model

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `model` | `string` | Model Name |
| `afterNodeIds` | `string`[] | list of nodeIds, to check if already started, don't apply the upgrade |
| `user` | [`ISecureUser`](ISecureUser.md) | - |

#### Returns

`Promise`\<`string`[] \| \{ `errors`: `any`  }\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:154](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L154)
