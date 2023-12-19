[bpmn-server](../README.md) / IAPIEngine

# Interface: IAPIEngine

common parameters:

- query:      MongoDB query to locate the target instance or item

- data:       input Data 

- user:       an instance of ISecureUser object 

- options:    various options, this is an open object that is based through the run-time

Returns IExecution
containing the instance and the results of the call

*

## Implemented by

- [`APIEngine`](../classes/APIEngine.md)

## Table of contents

### Methods

- [assign](IAPIEngine.md#assign)
- [invoke](IAPIEngine.md#invoke)
- [start](IAPIEngine.md#start)
- [startEvent](IAPIEngine.md#startevent)
- [throwMessage](IAPIEngine.md#throwmessage)
- [throwSignal](IAPIEngine.md#throwsignal)

## Methods

### assign

▸ **assign**(`query`, `data`, `assignment`, `user`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

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

[API/API.ts:52](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-52)

___

### invoke

▸ **invoke**(`query`, `data`, `user`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

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

[API/API.ts:51](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-51)

___

### start

▸ **start**(`modelName`, `data`, `user`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

start a new Instance of specified model
*

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

[API/API.ts:50](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-50)

___

### startEvent

▸ **startEvent**(`query`, `elementId`, `data`, `user`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

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

[API/API.ts:55](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-55)

___

### throwMessage

▸ **throwMessage**(`messageId`, `data`, `messageMatchingKey`, `user`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

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

[API/API.ts:53](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-53)

___

### throwSignal

▸ **throwSignal**(`signalId`, `data`, `messageMatchingKey`, `user`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

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

[API/API.ts:54](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-54)
