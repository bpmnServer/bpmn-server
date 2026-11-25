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
- [deleteInstances](IEngine.md#deleteinstances)
- [tagInstance](IEngine.md#taginstance)
- [startEvent](IEngine.md#startevent)
- [throwMessage](IEngine.md#throwmessage)
- [throwSignal](IEngine.md#throwsignal)
- [retry](IEngine.md#retry)
- [restart](IEngine.md#restart)
- [cancel](IEngine.md#cancel)
- [upgrade](IEngine.md#upgrade)
- [upgradeRunning](IEngine.md#upgraderunning)

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

[packages/bpmn-server/src/interfaces/server.ts:57](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L57)

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

[packages/bpmn-server/src/interfaces/server.ts:75](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L75)

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

[packages/bpmn-server/src/interfaces/server.ts:92](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L92)

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

[packages/bpmn-server/src/interfaces/server.ts:94](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L94)

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

[packages/bpmn-server/src/interfaces/server.ts:97](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L97)

___

### deleteInstances

▸ **deleteInstances**(`query`): `Promise`\<\{ `deletedCount`: `number`  }\>

Removes the instances a query matches, each under its lock and with its timers.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<\{ `deletedCount`: `number`  }\>

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:100](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L100)

___

### tagInstance

▸ **tagInstance**(`instanceId`, `tag`): `Promise`\<`void`\>

Marks a saved instance with a tag of the caller's.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |
| `tag` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:102](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L102)

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

[packages/bpmn-server/src/interfaces/server.ts:120](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L120)

___

### throwMessage

▸ **throwMessage**(`messageId`, `data`, `matchingQuery`, `from?`): `Promise`\<[`IExecution`](IExecution.md)\>

`from`: the item throwing it, in an instance; the Rationale says whom it reached, and each receiver from whom.

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageId` | `any` |
| `data` | `Object` |
| `matchingQuery` | `Object` |
| `from?` | [`IItem`](IItem.md) |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:135](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L135)

___

### throwSignal

▸ **throwSignal**(`signalId`, `data`, `matchingQuery`, `from?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `any` |
| `data` | `Object` |
| `matchingQuery` | `Object` |
| `from?` | [`IItem`](IItem.md) |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:136](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L136)

___

### retry

▸ **retry**(`itemQuery`, `userName?`): `Promise`\<[`IExecution`](IExecution.md)\>

Runs a failed item's work again (an item whose status is `error`), and the instance on from it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemQuery` | `any` |
| `userName?` | `string` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:138](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L138)

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

[packages/bpmn-server/src/interfaces/server.ts:139](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L139)

___

### cancel

▸ **cancel**(`instanceQuery`, `userName?`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

Cancels a running instance: terminated and saved, never deleted.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceQuery` | `any` |
| `userName?` | `string` |
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:141](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L141)

___

### upgrade

▸ **upgrade**(`model`, `afterNodeIds`): `Promise`\<`string`[] \| \{ `errors`: `any`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `model` | `string` |
| `afterNodeIds` | `string`[] |

#### Returns

`Promise`\<`string`[] \| \{ `errors`: `any`  }\>

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:143](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L143)

___

### upgradeRunning

▸ **upgradeRunning**(`models?`, `options?`): `Promise`\<[`IUpgradeReport`](IUpgradeReport.md)[]\>

Moves the instances that have not ended onto their model's current saved source (see Engine.upgradeRunning).

#### Parameters

| Name | Type |
| :------ | :------ |
| `models?` | `string`[] |
| `options?` | `Object` |
| `options.dryRun?` | `boolean` |

#### Returns

`Promise`\<[`IUpgradeReport`](IUpgradeReport.md)[]\>

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:145](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L145)
