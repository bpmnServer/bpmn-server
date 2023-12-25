[bpmn-server](../API.md) / IAPIEngine

# Interface: IAPIEngine

common parameters:

- query:      MongoDB query to locate the target instance or item

- data:       input Data 

- user:       an instance of ISecureUser object 

- options:    various options, this is an open object that is based through the run-time

Returns IExecution
containing the instance and the results of the call

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

## Methods

### start

▸ **start**(`modelName`, `data`, `user`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

start a new Instance of specified model

#### Parameters

| Name | Type |
| :------ | :------ |
| `modelName` | `any` |
| `data` | `Object` |
| `user` | [`ISecureUser`](ISecureUser.md) |
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[API/API.ts:50](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/API/API.ts#L50)

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
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[API/API.ts:54](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/API/API.ts#L54)

___

### assign

▸ **assign**(`query`, `data`, `assignment`, `user`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

provide assignment data to a user task

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `data` | `any` |
| `assignment` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[API/API.ts:58](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/API/API.ts#L58)

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
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[API/API.ts:62](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/API/API.ts#L62)

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
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[API/API.ts:66](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/API/API.ts#L66)

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
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[API/API.ts:70](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/API/API.ts#L70)
