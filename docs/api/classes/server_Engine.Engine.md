[bpmn-server](../README.md) / [Exports](../modules.md) / [server/Engine](../modules/server_Engine.md) / Engine

# Class: Engine

[server/Engine](../modules/server_Engine.md).Engine

super class for various objects that are part of the server

## Hierarchy

- [`ServerComponent`](server_ServerComponent.ServerComponent.md)

  ↳ **`Engine`**

## Implements

- [`IEngine`](../interfaces/interfaces_server.IEngine.md)

## Table of contents

### Constructors

- [constructor](server_Engine.Engine.md#constructor)

### Properties

- [server](server_Engine.Engine.md#server)

### Accessors

- [appDelegate](server_Engine.Engine.md#appdelegate)
- [cache](server_Engine.Engine.md#cache)
- [configuration](server_Engine.Engine.md#configuration)
- [cron](server_Engine.Engine.md#cron)
- [dataStore](server_Engine.Engine.md#datastore)
- [definitions](server_Engine.Engine.md#definitions)
- [engine](server_Engine.Engine.md#engine)
- [listener](server_Engine.Engine.md#listener)
- [logger](server_Engine.Engine.md#logger)

### Methods

- [assign](server_Engine.Engine.md#assign)
- [get](server_Engine.Engine.md#get)
- [invoke](server_Engine.Engine.md#invoke)
- [invokeItem](server_Engine.Engine.md#invokeitem)
- [lock](server_Engine.Engine.md#lock)
- [release](server_Engine.Engine.md#release)
- [restore](server_Engine.Engine.md#restore)
- [start](server_Engine.Engine.md#start)
- [startEvent](server_Engine.Engine.md#startevent)
- [startRepeatTimerEvent](server_Engine.Engine.md#startrepeattimerevent)
- [throwMessage](server_Engine.Engine.md#throwmessage)
- [throwSignal](server_Engine.Engine.md#throwsignal)

## Constructors

### constructor

• **new Engine**(`server`): [`Engine`](server_Engine.Engine.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`Engine`](server_Engine.Engine.md)

#### Overrides

[ServerComponent](server_ServerComponent.ServerComponent.md).[constructor](server_ServerComponent.ServerComponent.md#constructor)

#### Defined in

[src/server/Engine.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Engine.ts#L12)

## Properties

### server

• **server**: `any`

#### Inherited from

[ServerComponent](server_ServerComponent.ServerComponent.md).[server](server_ServerComponent.ServerComponent.md#server)

#### Defined in

[src/server/ServerComponent.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L9)

## Accessors

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[src/server/ServerComponent.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L18)

___

### cache

• `get` **cache**(): [`CacheManager`](server_CacheManager.CacheManager.md)

#### Returns

[`CacheManager`](server_CacheManager.CacheManager.md)

#### Inherited from

ServerComponent.cache

#### Defined in

[src/server/ServerComponent.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L17)

___

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.configuration

#### Defined in

[src/server/ServerComponent.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L14)

___

### cron

• `get` **cron**(): [`Cron`](server_Cron.Cron.md)

#### Returns

[`Cron`](server_Cron.Cron.md)

#### Inherited from

ServerComponent.cron

#### Defined in

[src/server/ServerComponent.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L16)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.dataStore

#### Defined in

[src/server/ServerComponent.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L20)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.definitions

#### Defined in

[src/server/ServerComponent.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L21)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/interfaces_server.IEngine.md)

#### Returns

[`IEngine`](../interfaces/interfaces_server.IEngine.md)

#### Inherited from

ServerComponent.engine

#### Defined in

[src/server/ServerComponent.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L19)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.listener

#### Defined in

[src/server/ServerComponent.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L22)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.logger

#### Defined in

[src/server/ServerComponent.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L15)

## Methods

### assign

▸ **assign**(`itemQuery`, `data?`, `assignment?`, `userName`, `options?`): `Promise`\<[`Execution`](engine_Execution.Execution.md)\>

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

`Promise`\<[`Execution`](engine_Execution.Execution.md)\>

#### Implementation of

[IEngine](../interfaces/interfaces_server.IEngine.md).[assign](../interfaces/interfaces_server.IEngine.md#assign)

#### Defined in

[src/server/Engine.ts:173](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Engine.ts#L173)

___

### get

▸ **get**(`instanceQuery`): `Promise`\<[`Execution`](engine_Execution.Execution.md)\>

restores an instance into memeory or provides you access to a running instance

this will also resume execution

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `instanceQuery` | `any` | criteria to fetch the instance query example: { id: instanceId} { data: {caseId: 1005}} { items.item.id : 'abcc111322'} { items.item.itemKey : 'businesskey here'} |

#### Returns

`Promise`\<[`Execution`](engine_Execution.Execution.md)\>

#### Implementation of

[IEngine](../interfaces/interfaces_server.IEngine.md).[get](../interfaces/interfaces_server.IEngine.md#get)

#### Defined in

[src/server/Engine.ts:85](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Engine.ts#L85)

___

### invoke

▸ **invoke**(`itemQuery`, `data?`, `userName?`, `options?`): `Promise`\<[`Execution`](engine_Execution.Execution.md)\>

Continue an existing item that is in a wait state

-------------------------------------------------
scenario:
		itemId			{itemId: value }
		itemKey			{itemKey: value}
		instance,task	{instanceId: instanceId, elementId: value }

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `itemQuery` | `any` | `undefined` | criteria to retrieve the item |
| `data` | `Object` | `{}` |  |
| `userName` | `string` | `null` | - |
| `options` | `Object` | `{}` | - |

#### Returns

`Promise`\<[`Execution`](engine_Execution.Execution.md)\>

#### Implementation of

[IEngine](../interfaces/interfaces_server.IEngine.md).[invoke](../interfaces/interfaces_server.IEngine.md#invoke)

#### Defined in

[src/server/Engine.ts:214](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Engine.ts#L214)

___

### invokeItem

▸ **invokeItem**(`itemQuery`, `data?`): `Promise`\<[`Execution`](engine_Execution.Execution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemQuery` | `any` |
| `data` | `Object` |

#### Returns

`Promise`\<[`Execution`](engine_Execution.Execution.md)\>

#### Defined in

[src/server/Engine.ts:160](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Engine.ts#L160)

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

[src/server/Engine.ts:95](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Engine.ts#L95)

___

### release

▸ **release**(`execution`): `Promise`\<`void`\>

release instance lock

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`Execution`](engine_Execution.Execution.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/server/Engine.ts:104](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Engine.ts#L104)

___

### restore

▸ **restore**(`instanceId`): `Promise`\<[`Execution`](engine_Execution.Execution.md)\>

*
Loads instance into memory for purpose of execution
Locks instance first if required
check if in cache

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |

#### Returns

`Promise`\<[`Execution`](engine_Execution.Execution.md)\>

#### Defined in

[src/server/Engine.ts:128](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Engine.ts#L128)

___

### start

▸ **start**(`name`, `data?`, `startNodeId?`, `userName?`, `options?`): `Promise`\<[`Execution`](engine_Execution.Execution.md)\>

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

`Promise`\<[`Execution`](engine_Execution.Execution.md)\>

#### Implementation of

[IEngine](../interfaces/interfaces_server.IEngine.md).[start](../interfaces/interfaces_server.IEngine.md#start)

#### Defined in

[src/server/Engine.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Engine.ts#L23)

___

### startEvent

▸ **startEvent**(`instanceId`, `elementId`, `data?`): `Promise`\<[`Execution`](engine_Execution.Execution.md)\>

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

`Promise`\<[`Execution`](engine_Execution.Execution.md)\>

#### Implementation of

[IEngine](../interfaces/interfaces_server.IEngine.md).[startEvent](../interfaces/interfaces_server.IEngine.md#startevent)

#### Defined in

[src/server/Engine.ts:312](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Engine.ts#L312)

___

### startRepeatTimerEvent

▸ **startRepeatTimerEvent**(`instanceId`, `prevItem`, `data?`, `options?`): `Promise`\<[`Execution`](engine_Execution.Execution.md)\>

Repeat Timers need to create new Item

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |
| `prevItem` | `any` |
| `data` | `Object` |
| `options` | `Object` |

#### Returns

`Promise`\<[`Execution`](engine_Execution.Execution.md)\>

#### Implementation of

[IEngine](../interfaces/interfaces_server.IEngine.md).[startRepeatTimerEvent](../interfaces/interfaces_server.IEngine.md#startrepeattimerevent)

#### Defined in

[src/server/Engine.ts:275](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Engine.ts#L275)

___

### throwMessage

▸ **throwMessage**(`messageId`, `data?`, `matchingQuery?`): `Promise`\<[`Execution`](engine_Execution.Execution.md)\>

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

`Promise`\<[`Execution`](engine_Execution.Execution.md)\>

#### Implementation of

[IEngine](../interfaces/interfaces_server.IEngine.md).[throwMessage](../interfaces/interfaces_server.IEngine.md#throwmessage)

#### Defined in

[src/server/Engine.ts:336](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Engine.ts#L336)

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

[IEngine](../interfaces/interfaces_server.IEngine.md).[throwSignal](../interfaces/interfaces_server.IEngine.md#throwsignal)

#### Defined in

[src/server/Engine.ts:393](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Engine.ts#L393)
