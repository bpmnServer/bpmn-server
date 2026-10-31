[bpmn-server](../readme.md) / IEngine

# Interface: IEngine

## Implemented by

- [`Engine`](../classes/Engine.md)

## Table of contents

### Methods

- [start](IEngine.md#start)
- [get](IEngine.md#get)
- [invoke](IEngine.md#invoke)
- [assign](IEngine.md#assign)
- [startRepeatTimerEvent](IEngine.md#startrepeattimerevent)
- [startEvent](IEngine.md#startevent)
- [throwMessage](IEngine.md#throwmessage)
- [throwSignal](IEngine.md#throwsignal)
- [restart](IEngine.md#restart)

## Methods

### start

▸ **start**(`name`, `data?`, `startNodeId?`, `userName?`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

loads a definitions  and start execution

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `any` | name of the process to start |
| `data?` | `any` | input data |
| `startNodeId?` | `string` | in process has multiple start node; you need to specify which one |
| `userName?` | `string` | - |
| `options?` | `any` | - |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[interfaces/server.ts:40](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/server.ts#L40)

___

### get

▸ **get**(`instanceQuery`): `Promise`\<[`IExecution`](IExecution.md)\>

restores an instance into memeory or provides you access to a running instance

this will also resume execution

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `instanceQuery` | `any` | criteria to fetch the instance query example: ```jsonl { id: instanceId} { data: {caseId: 1005}} { items.id : 'abcc111322'} { items.itemKey : 'businesskey here'} ``` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[interfaces/server.ts:58](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/server.ts#L58)

___

### invoke

▸ **invoke**(`itemQuery`, `data`, `userName?`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

Continue an existing item that is in a wait state

-------------------------------------------------

scenario:

```
itemId 	{itemId: value }
itemKey 	{itemKey: value}
instance,task	{instanceId: instanceId, elementId: value }
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `itemQuery` | `any` | criteria to retrieve the item |
| `data` | `Object` |  |
| `userName?` | `string` | - |
| `options?` | `Object` | - |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[interfaces/server.ts:75](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/server.ts#L75)

___

### assign

▸ **assign**(`itemQuery`, `data`, `assignment`, `userName`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemQuery` | `any` |
| `data` | `Object` |
| `assignment` | `Object` |
| `userName` | `string` |
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[interfaces/server.ts:77](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/server.ts#L77)

___

### startRepeatTimerEvent

▸ **startRepeatTimerEvent**(`instanceId`, `prevItem`, `data`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |
| `prevItem` | [`IItem`](IItem.md) |
| `data` | `Object` |
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[interfaces/server.ts:80](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/server.ts#L80)

___

### startEvent

▸ **startEvent**(`instanceId`, `elementId`, `data?`, `userName?`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

Invoking an event (usually start event of a secondary process) against an existing instance
or
Invoking a start event (of a secondary process) against an existing instance
----------------------------------------------------------------------------
	 instance,task
```
	{instanceId: instanceId, elementId: value }
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |
| `elementId` | `any` |
| `data?` | `Object` |
| `userName?` | `string` |
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[interfaces/server.ts:98](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/server.ts#L98)

___

### throwMessage

▸ **throwMessage**(`messageId`, `data`, `matchingQuery`): `Promise`\<[`IExecution`](IExecution.md)\>

signal/message raise a signal or throw a message

will seach for a matching event/task given the signalId/messageId

that can be againt a running instance or it may start a new instance
----------------------------------------------------------------------------

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageId` | `any` | the id of the message or signal as per bpmn definition |
| `data` | `Object` | message data |
| `matchingQuery` | `Object` | - |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[interfaces/server.ts:112](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/server.ts#L112)

___

### throwSignal

▸ **throwSignal**(`signalId`, `data`, `matchingQuery`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `any` |
| `data` | `Object` |
| `matchingQuery` | `Object` |

#### Returns

`any`

#### Defined in

[interfaces/server.ts:113](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/server.ts#L113)

___

### restart

▸ **restart**(`itemQuery`, `data`, `userName`, `options`): `Promise`\<[`IExecution`](IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemQuery` | `any` |
| `data` | `any` |
| `userName` | `any` |
| `options` | `any` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[interfaces/server.ts:114](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/server.ts#L114)
