[bpmn-server](../readme.md) / Engine

# Class: Engine

super class for various objects that are part of the server

## Hierarchy

- [`ServerComponent`](ServerComponent.md)

  ↳ **`Engine`**

## Implements

- [`IEngine`](../interfaces/IEngine.md)

## Table of contents

### Constructors

- [constructor](Engine.md#constructor)

### Properties

- [server](Engine.md#server)

### Accessors

- [configuration](Engine.md#configuration)
- [logger](Engine.md#logger)
- [cron](Engine.md#cron)
- [cache](Engine.md#cache)
- [appDelegate](Engine.md#appdelegate)
- [engine](Engine.md#engine)
- [dataStore](Engine.md#datastore)
- [definitions](Engine.md#definitions)
- [listener](Engine.md#listener)

### Methods

- [start](Engine.md#start)
- [get](Engine.md#get)
- [lock](Engine.md#lock)
- [release](Engine.md#release)
- [restore](Engine.md#restore)
- [invokeItem](Engine.md#invokeitem)
- [assign](Engine.md#assign)
- [invoke](Engine.md#invoke)
- [startRepeatTimerEvent](Engine.md#startrepeattimerevent)
- [startEvent](Engine.md#startevent)
- [throwMessage](Engine.md#throwmessage)
- [throwSignal](Engine.md#throwsignal)

## Constructors

### constructor

• **new Engine**(`server`): [`Engine`](Engine.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`Engine`](Engine.md)

#### Overrides

[ServerComponent](ServerComponent.md).[constructor](ServerComponent.md#constructor)

#### Defined in

[server/Engine.ts:12](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/Engine.ts#L12)

## Properties

### server

• **server**: `any`

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[server/ServerComponent.ts:9](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/ServerComponent.ts#L9)

## Accessors

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.configuration

#### Defined in

[server/ServerComponent.ts:14](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/ServerComponent.ts#L14)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.logger

#### Defined in

[server/ServerComponent.ts:15](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/ServerComponent.ts#L15)

___

### cron

• `get` **cron**(): [`Cron`](Cron.md)

#### Returns

[`Cron`](Cron.md)

#### Inherited from

ServerComponent.cron

#### Defined in

[server/ServerComponent.ts:16](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/ServerComponent.ts#L16)

___

### cache

• `get` **cache**(): [`CacheManager`](CacheManager.md)

#### Returns

[`CacheManager`](CacheManager.md)

#### Inherited from

ServerComponent.cache

#### Defined in

[server/ServerComponent.ts:17](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/ServerComponent.ts#L17)

___

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[server/ServerComponent.ts:18](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/ServerComponent.ts#L18)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/IEngine.md)

#### Returns

[`IEngine`](../interfaces/IEngine.md)

#### Inherited from

ServerComponent.engine

#### Defined in

[server/ServerComponent.ts:19](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/ServerComponent.ts#L19)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.dataStore

#### Defined in

[server/ServerComponent.ts:20](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/ServerComponent.ts#L20)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.definitions

#### Defined in

[server/ServerComponent.ts:21](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/ServerComponent.ts#L21)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.listener

#### Defined in

[server/ServerComponent.ts:22](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/ServerComponent.ts#L22)

## Methods

### start

▸ **start**(`name`, `data?`, `startNodeId?`, `userName?`, `options?`): `Promise`\<[`Execution`](Execution.md)\>

loads a definitions  and start execution

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `any` | `undefined` | name of the process to start |
| `data` | `any` | `{}` | input data |
| `startNodeId` | `string` | `null` | in process has multiple start node; you need to specify which one |
| `userName` | `string` | `null` | - |
| `options` | `Object` | `{}` | - |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[start](../interfaces/IEngine.md#start)

#### Defined in

[server/Engine.ts:23](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/Engine.ts#L23)

___

### get

▸ **get**(`instanceQuery`): `Promise`\<[`Execution`](Execution.md)\>

restores an instance into memeory or provides you access to a running instance

this will also resume execution

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `instanceQuery` | `any` | criteria to fetch the instance query example: ```jsonl { id: instanceId} { data: {caseId: 1005}} { items.id : 'abcc111322'} { items.itemKey : 'businesskey here'} ``` |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[get](../interfaces/IEngine.md#get)

#### Defined in

[server/Engine.ts:88](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/Engine.ts#L88)

___

### lock

▸ **lock**(`executionId`): `Promise`\<`void`\>

lock instance

#### Parameters

| Name | Type |
| :------ | :------ |
| `executionId` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/Engine.ts:98](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/Engine.ts#L98)

___

### release

▸ **release**(`execution`): `Promise`\<`void`\>

release instance lock

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`Execution`](Execution.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/Engine.ts:107](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/Engine.ts#L107)

___

### restore

▸ **restore**(`instanceId`): `Promise`\<[`Execution`](Execution.md)\>

*
Loads instance into memory for purpose of execution
Locks instance first if required
check if in cache

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Defined in

[server/Engine.ts:131](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/Engine.ts#L131)

___

### invokeItem

▸ **invokeItem**(`itemQuery`, `data?`): `Promise`\<[`Execution`](Execution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemQuery` | `any` |
| `data` | `Object` |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Defined in

[server/Engine.ts:163](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/Engine.ts#L163)

___

### assign

▸ **assign**(`itemQuery`, `data?`, `assignment?`, `userName`, `options?`): `Promise`\<[`Execution`](Execution.md)\>

update an existing item that is in a wait state with an assignment
can modify data or assignment or both

-------------------------------------------------

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `itemQuery` | `any` | criteria to retrieve the item |
| `data` | `Object` |  |
| `assignment` | `Object` | - |
| `userName` | `string` | - |
| `options` | `Object` | - |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[assign](../interfaces/IEngine.md#assign)

#### Defined in

[server/Engine.ts:176](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/Engine.ts#L176)

___

### invoke

▸ **invoke**(`itemQuery`, `data?`, `userName?`, `options?`): `Promise`\<[`Execution`](Execution.md)\>

Continue an existing item that is in a wait state

-------------------------------------------------

scenario:

```
itemId 	{itemId: value }
itemKey 	{itemKey: value}
instance,task	{instanceId: instanceId, elementId: value }
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `itemQuery` | `any` | `undefined` | criteria to retrieve the item |
| `data` | `Object` | `{}` |  |
| `userName` | `string` | `null` | - |
| `options` | `Object` | `{}` | - |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[invoke](../interfaces/IEngine.md#invoke)

#### Defined in

[server/Engine.ts:221](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/Engine.ts#L221)

___

### startRepeatTimerEvent

▸ **startRepeatTimerEvent**(`instanceId`, `prevItem`, `data?`, `options?`): `Promise`\<[`Execution`](Execution.md)\>

Repeat Timers need to create new Item

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |
| `prevItem` | `any` |
| `data` | `Object` |
| `options` | `Object` |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[startRepeatTimerEvent](../interfaces/IEngine.md#startrepeattimerevent)

#### Defined in

[server/Engine.ts:282](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/Engine.ts#L282)

___

### startEvent

▸ **startEvent**(`instanceId`, `elementId`, `data?`): `Promise`\<[`Execution`](Execution.md)\>

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
| `data` | `Object` |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[startEvent](../interfaces/IEngine.md#startevent)

#### Defined in

[server/Engine.ts:319](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/Engine.ts#L319)

___

### throwMessage

▸ **throwMessage**(`messageId`, `data?`, `matchingQuery?`): `Promise`\<[`Execution`](Execution.md)\>

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

`Promise`\<[`Execution`](Execution.md)\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[throwMessage](../interfaces/IEngine.md#throwmessage)

#### Defined in

[server/Engine.ts:343](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/Engine.ts#L343)

___

### throwSignal

▸ **throwSignal**(`signalId`, `data?`, `matchingQuery?`): `Promise`\<`any`[]\>

signal/message raise a signal or throw a message 

will seach for a matching event/task given the signalId/messageId

that can be againt a running instance or it may start a new instance 
----------------------------------------------------------------------------

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signalId` | `any` | - |
| `data` | `Object` | message data |
| `matchingQuery` | `Object` | should match the itemKey (if specified) |

#### Returns

`Promise`\<`any`[]\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[throwSignal](../interfaces/IEngine.md#throwsignal)

#### Defined in

[server/Engine.ts:400](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/server/Engine.ts#L400)
