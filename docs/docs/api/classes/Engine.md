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

- [runningCounter](Engine.md#runningcounter)
- [callsCounter](Engine.md#callscounter)
- [workers](Engine.md#workers)
- [closing](Engine.md#closing)
- [server](Engine.md#server)

### Accessors

- [configuration](Engine.md#configuration)
- [logger](Engine.md#logger)
- [cron](Engine.md#cron)
- [cache](Engine.md#cache)
- [appDelegate](Engine.md#appdelegate)
- [engine](Engine.md#engine)
- [dataStore](Engine.md#datastore)
- [lockManager](Engine.md#lockmanager)
- [definitions](Engine.md#definitions)
- [listener](Engine.md#listener)
- [scriptHandler](Engine.md#scripthandler)

### Methods

- [close](Engine.md#close)
- [drain](Engine.md#drain)
- [start](Engine.md#start)
- [retry](Engine.md#retry)
- [restart](Engine.md#restart)
- [get](Engine.md#get)
- [cancel](Engine.md#cancel)
- [lock](Engine.md#lock)
- [release](Engine.md#release)
- [restore](Engine.md#restore)
- [invokeItem](Engine.md#invokeitem)
- [assign](Engine.md#assign)
- [invoke](Engine.md#invoke)
- [startRepeatTimerEvent](Engine.md#startrepeattimerevent)
- [startEvent](Engine.md#startevent)
- [throwMessage](Engine.md#throwmessage)
- [waitingFor](Engine.md#waitingfor)
- [throwSignal](Engine.md#throwsignal)
- [status](Engine.md#status)
- [deleteInstances](Engine.md#deleteinstances)
- [tagInstance](Engine.md#taginstance)
- [upgrade](Engine.md#upgrade)
- [upgradeRunning](Engine.md#upgraderunning)
- [findOneItem](Engine.md#findoneitem)
- [assertOpen](Engine.md#assertopen)
- [handOff](Engine.md#handoff)
- [report](Engine.md#report)
- [exception](Engine.md#exception)
- [sanitizeData](Engine.md#sanitizedata)

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

[packages/bpmn-server/src/server/Engine.ts:46](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L46)

## Properties

### runningCounter

• **runningCounter**: `number` = `0`

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:41](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L41)

___

### callsCounter

• **callsCounter**: `number` = `0`

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:42](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L42)

___

### workers

• `Private` `Readonly` **workers**: `Set`\<`Promise`\<`unknown`\>\>

Executions handed off with `noWait`, still running.

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:44](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L44)

___

### closing

• `Private` **closing**: `boolean` = `false`

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:45](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L45)

___

### server

• **server**: `any`

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:10](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L10)

## Accessors

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.configuration

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L15)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.logger

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L16)

___

### cron

• `get` **cron**(): [`Cron`](Cron.md)

#### Returns

[`Cron`](Cron.md)

#### Inherited from

ServerComponent.cron

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L17)

___

### cache

• `get` **cache**(): [`ICacheManager`](../interfaces/ICacheManager.md)

#### Returns

[`ICacheManager`](../interfaces/ICacheManager.md)

#### Inherited from

ServerComponent.cache

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L18)

___

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L19)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/IEngine.md)

#### Returns

[`IEngine`](../interfaces/IEngine.md)

#### Inherited from

ServerComponent.engine

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L20)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.dataStore

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L21)

___

### lockManager

• `get` **lockManager**(): `any`

The lock port: the configuration's, else the data store's.

#### Returns

`any`

#### Inherited from

ServerComponent.lockManager

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L23)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.definitions

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L24)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.listener

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L25)

___

### scriptHandler

• `get` **scriptHandler**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.scriptHandler

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L26)

## Methods

### close

▸ **close**(): `void`

From now on, new calls are refused; running ones finish.

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:55](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L55)

___

### drain

▸ **drain**(`timeout?`): `Promise`\<`boolean`\>

Waits until no call runs and no handed-off execution is running, or `timeout` ms pass; true when idle.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `timeout` | `number` | `10_000` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:57](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L57)

___

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

[packages/bpmn-server/src/server/Engine.ts:73](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L73)

___

### retry

▸ **retry**(`itemQuery`, `userName?`): `Promise`\<[`Execution`](Execution.md)\>

Runs a failed item's work again: an item whose status is `error` (its work threw; statusDetails.error says
why), and the instance on from it.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `itemQuery` | `any` | `undefined` |
| `userName` | `string` | `null` |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[retry](../interfaces/IEngine.md#retry)

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:137](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L137)

___

### restart

▸ **restart**(`itemQuery`, `data`, `userName`, `options?`): `Promise`\<[`Execution`](Execution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemQuery` | `any` |
| `data` | `any` |
| `userName` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[restart](../interfaces/IEngine.md#restart)

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:160](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L160)

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

[packages/bpmn-server/src/server/Engine.ts:210](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L210)

___

### cancel

▸ **cancel**(`instanceQuery`, `userName?`, `options?`): `Promise`\<[`Execution`](Execution.md)\>

Cancels a running instance: its tokens are terminated (their waiting items end as
terminated), its timers on this server are cancelled, `process.terminated` is emitted, and it
is saved as `terminated`: never deleted. An instance that has ended or was cancelled before is
left as it is.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `instanceQuery` | `any` | `undefined` | criteria to fetch the instance, as for `get` |
| `userName` | `string` | `null` | - |
| `options` | `Object` | `{}` | - |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[cancel](../interfaces/IEngine.md#cancel)

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:232](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L232)

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

[packages/bpmn-server/src/server/Engine.ts:268](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L268)

___

### release

▸ **release**(`execution`, `id?`): `Promise`\<`void`\>

release instance lock

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `execution` | [`Execution`](Execution.md) | `undefined` |
| `id` | `any` | `null` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:280](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L280)

___

### restore

▸ **restore**(`instanceId`, `itemId?`): `Promise`\<[`Execution`](Execution.md)\>

*
Loads instance into memory for purpose of execution
Locks instance first if required
check if in cache

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `instanceId` | `any` | `undefined` |
| `itemId` | `any` | `null` |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:294](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L294)

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

[packages/bpmn-server/src/server/Engine.ts:318](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L318)

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

[packages/bpmn-server/src/server/Engine.ts:331](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L331)

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

[packages/bpmn-server/src/server/Engine.ts:379](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L379)

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

[packages/bpmn-server/src/server/Engine.ts:435](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L435)

___

### startEvent

▸ **startEvent**(`instanceId`, `elementId`, `data?`, `userName?`, `options?`): `Promise`\<[`Execution`](Execution.md)\>

Invoking an event (usually start event of a secondary process) against an existing instance
or
Invoking a start event (of a secondary process) against an existing instance
----------------------------------------------------------------------------
	 instance,task
```
	{instanceId: instanceId, elementId: value }
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `instanceId` | `any` | `undefined` |
| `elementId` | `any` | `undefined` |
| `data` | `Object` | `{}` |
| `userName` | `string` | `null` |
| `options` | `Object` | `{}` |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[startEvent](../interfaces/IEngine.md#startevent)

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:480](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L480)

___

### throwMessage

▸ **throwMessage**(`messageId`, `data?`, `matchingQuery?`): `Promise`\<[`Execution`](Execution.md)\>

A message has one receiver (a signal is the broadcast): the first waiting item the matching
query finds (an instance waiting for it: a catch event, a receive task, a boundary event), else,
when none waits, a definition whose start event it is, started. A waiting instance is never
passed over for a new one (the upstream tried the start events first).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageId` | `any` | the message's name |
| `data` | `Object` | - |
| `matchingQuery` | `Object` | what narrows the waiting instances (their id, their data) |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[throwMessage](../interfaces/IEngine.md#throwmessage)

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:521](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L521)

___

### waitingFor

▸ **waitingFor**(`kind`, `name`, `matchingQuery?`): `Promise`\<`any`\>

The items waiting for a message or signal (`kind`: messageId or signalId), the matching query narrowing their instances.

#### Parameters

| Name | Type |
| :------ | :------ |
| `kind` | ``"messageId"`` \| ``"signalId"`` |
| `name` | `string` |
| `matchingQuery` | `Object` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:545](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L545)

___

### throwSignal

▸ **throwSignal**(`signalId`, `data?`, `matchingQuery?`, `from?`): `Promise`\<`any`[]\>

Throws a signal: starts the models whose start event catches it, and invokes the items waiting for it.
`from` is the item throwing it inside an instance: that instance's own catching items are signalled on its
running execution (an engine call on it would be refused: the throwing call holds it).

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `any` |
| `data` | `Object` |
| `matchingQuery` | `Object` |
| `from?` | [`IItem`](../interfaces/IItem.md) |

#### Returns

`Promise`\<`any`[]\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[throwSignal](../interfaces/IEngine.md#throwsignal)

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:568](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L568)

___

### status

▸ **status**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `running` | `number` |
| `calls` | `number` |
| `handedOff` | `number` |

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:629](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L629)

___

### deleteInstances

▸ **deleteInstances**(`query`): `Promise`\<\{ `deletedCount`: `number`  }\>

Removes the instances a query matches, each under its lock, so a call running it finishes first, and with its timers,
so nothing fires for it after. What changes an instance is the engine's: its host asks.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<\{ `deletedCount`: `number`  }\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[deleteInstances](../interfaces/IEngine.md#deleteinstances)

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:637](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L637)

___

### tagInstance

▸ **tagInstance**(`instanceId`, `tag`): `Promise`\<`void`\>

Marks a saved instance with a tag of the caller's (a test's run), as the data store does.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |
| `tag` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[tagInstance](../interfaces/IEngine.md#taginstance)

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:657](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L657)

___

### upgrade

▸ **upgrade**(`model`, `afterNodeIds`): `Promise`\<`string`[] \| \{ `errors`: `any`  }\>

Points the saved instances of `model` at its current definition source, each under its
instance lock; with `afterNodeIds`, only the instances that have not reached any of them.

#### Parameters

| Name | Type |
| :------ | :------ |
| `model` | `string` |
| `afterNodeIds` | `string`[] |

#### Returns

`Promise`\<`string`[] \| \{ `errors`: `any`  }\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[upgrade](../interfaces/IEngine.md#upgrade)

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:669](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L669)

___

### upgradeRunning

▸ **upgradeRunning**(`models?`, `options?`): `Promise`\<[`IUpgradeReport`](../interfaces/IUpgradeReport.md)[]\>

Moves the instances that have not ended onto their model's current saved source: a model saved again
(with the data store's saveSource, each instance runs the source it started with) reaches the instances
still running, not only those started afterwards. Unlike upgrade(), it needs no node ids and leaves the
ended instances alone: their source is the record of what ran.

- The saved model must pass verifyModel; one with errors is refused and none of its instances changed.
- An instance on a step (waiting, or part-way) that the new model does not have would be stranded: it is
  left as it is and reported.
- Each instance changes under its instance lock and is checked again once the lock is held; one another
  call holds past the lock wait is reported as busy, to try again.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `models` | `string`[] | `[]` | the models to upgrade; none: every model that has instances still running |
| `options` | `Object` | `{}` | dryRun: report what would change, change nothing |
| `options.dryRun?` | `boolean` | `undefined` | - |

#### Returns

`Promise`\<[`IUpgradeReport`](../interfaces/IUpgradeReport.md)[]\>

#### Implementation of

[IEngine](../interfaces/IEngine.md).[upgradeRunning](../interfaces/IEngine.md#upgraderunning)

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:721](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L721)

___

### findOneItem

▸ **findOneItem**(`itemQuery`): `Promise`\<`any`\>

The one item `itemQuery` names; none, or more than one, is an error.

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemQuery` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:803](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L803)

___

### assertOpen

▸ **assertOpen**(): `void`

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:811](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L811)

___

### handOff

▸ **handOff**(`execution`, `run`): `void`

Keeps a handed-off execution's worker until it settles (then its lock is released); its rejection stays on `execution.worker`, for whoever awaits it, and is reported.

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`Execution`](Execution.md) |
| `run` | `Promise`\<`unknown`\> |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:815](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L815)

___

### report

▸ **report**(`error`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:821](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L821)

___

### exception

▸ **exception**(`exc`, `execution`): `Promise`\<`never`\>

A failed call: reported, the execution dropped from the cache (its state in memory may be
part-way; the next call restores it from the store), `process.exception` emitted, and the
error thrown to the caller as it is (the engine has always thrown here).

#### Parameters

| Name | Type |
| :------ | :------ |
| `exc` | `any` |
| `execution` | `any` |

#### Returns

`Promise`\<`never`\>

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:830](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L830)

___

### sanitizeData

▸ **sanitizeData**(`data`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/server/Engine.ts:845](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Engine.ts#L845)
