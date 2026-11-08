[bpmn-server](../readme.md) / IExecution

# Interface: IExecution

## Hierarchy

- [`IServerComponent`](IServerComponent.md)

  ↳ **`IExecution`**

## Implemented by

- [`Execution`](../classes/Execution.md)

## Table of contents

### Properties

- [instance](IExecution.md#instance)
- [operation](IExecution.md#operation)
- [server](IExecution.md#server)
- [tokens](IExecution.md#tokens)
- [definition](IExecution.md#definition)
- [appDelegate](IExecution.md#appdelegate)
- [logger](IExecution.md#logger)
- [process](IExecution.md#process)
- [promises](IExecution.md#promises)
- [listener](IExecution.md#listener)
- [isLocked](IExecution.md#islocked)
- [errors](IExecution.md#errors)
- [item](IExecution.md#item)
- [messageMatchingKey](IExecution.md#messagematchingkey)
- [worker](IExecution.md#worker)
- [userName](IExecution.md#username)
- [id](IExecution.md#id)
- [status](IExecution.md#status)
- [action](IExecution.md#action)
- [options](IExecution.md#options)
- [name](IExecution.md#name)
- [uids](IExecution.md#uids)
- [configuration](IExecution.md#configuration)
- [cron](IExecution.md#cron)
- [cache](IExecution.md#cache)
- [engine](IExecution.md#engine)
- [dataStore](IExecution.md#datastore)
- [scriptHandler](IExecution.md#scripthandler)
- [definitions](IExecution.md#definitions)

### Methods

- [getNodeById](IExecution.md#getnodebyid)
- [getToken](IExecution.md#gettoken)
- [getItemsData](IExecution.md#getitemsdata)
- [save](IExecution.md#save)
- [end](IExecution.md#end)
- [stop](IExecution.md#stop)
- [terminate](IExecution.md#terminate)
- [execute](IExecution.md#execute)
- [signalItem](IExecution.md#signalitem)
- [signalEvent](IExecution.md#signalevent)
- [signalRepeatTimerEvent](IExecution.md#signalrepeattimerevent)
- [getItems](IExecution.md#getitems)
- [getState](IExecution.md#getstate)
- [restored](IExecution.md#restored)
- [resume](IExecution.md#resume)
- [report](IExecution.md#report)
- [getNewId](IExecution.md#getnewid)
- [getUUID](IExecution.md#getuuid)
- [doExecutionEvent](IExecution.md#doexecutionevent)
- [doItemEvent](IExecution.md#doitemevent)
- [log](IExecution.md#log)
- [logS](IExecution.md#logs)
- [logE](IExecution.md#loge)
- [info](IExecution.md#info)
- [decision](IExecution.md#decision)
- [error](IExecution.md#error)
- [appendData](IExecution.md#appenddata)
- [getData](IExecution.md#getdata)
- [processQueue](IExecution.md#processqueue)

## Properties

### instance

• **instance**: [`IInstanceData`](IInstanceData.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:101](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L101)

___

### operation

• `Optional` **operation**: `string`

What the call running it does: `start`, `signal`, `assign`, `cancel`, …

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:103](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L103)

___

### server

• **server**: [`IBPMNServer`](IBPMNServer.md)

#### Overrides

[IServerComponent](IServerComponent.md).[server](IServerComponent.md#server)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:104](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L104)

___

### tokens

• **tokens**: `Map`\<`any`, [`IToken`](IToken.md)\>

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:105](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L105)

___

### definition

• **definition**: [`IDefinition`](IDefinition.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:106](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L106)

___

### appDelegate

• **appDelegate**: [`IAppDelegate`](IAppDelegate.md)

#### Overrides

[IServerComponent](IServerComponent.md).[appDelegate](IServerComponent.md#appdelegate)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:107](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L107)

___

### logger

• **logger**: [`ILogger`](ILogger.md)

#### Overrides

[IServerComponent](IServerComponent.md).[logger](IServerComponent.md#logger)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:108](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L108)

___

### process

• **process**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:109](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L109)

___

### promises

• **promises**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:110](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L110)

___

### listener

• **listener**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:111](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L111)

___

### isLocked

• **isLocked**: `boolean`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:112](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L112)

___

### errors

• **errors**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:114](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L114)

___

### item

• **item**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:115](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L115)

___

### messageMatchingKey

• **messageMatchingKey**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:116](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L116)

___

### worker

• **worker**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:117](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L117)

___

### userName

• **userName**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:118](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L118)

___

### id

• **id**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:120](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L120)

___

### status

• **status**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:121](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L121)

___

### action

• **action**: [`NODE_ACTION`](../enums/NODE_ACTION.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:122](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L122)

___

### options

• **options**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:123](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L123)

___

### name

• **name**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:124](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L124)

___

### uids

• **uids**: `Object`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:157](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L157)

___

### configuration

• **configuration**: [`IConfiguration`](IConfiguration.md)

#### Inherited from

[IServerComponent](IServerComponent.md).[configuration](IServerComponent.md#configuration)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L34)

___

### cron

• **cron**: `any`

#### Inherited from

[IServerComponent](IServerComponent.md).[cron](IServerComponent.md#cron)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:36](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L36)

___

### cache

• **cache**: `any`

#### Inherited from

[IServerComponent](IServerComponent.md).[cache](IServerComponent.md#cache)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L37)

___

### engine

• **engine**: `any`

#### Inherited from

[IServerComponent](IServerComponent.md).[engine](IServerComponent.md#engine)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:39](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L39)

___

### dataStore

• **dataStore**: [`IDataStore`](IDataStore.md)

#### Inherited from

[IServerComponent](IServerComponent.md).[dataStore](IServerComponent.md#datastore)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:40](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L40)

___

### scriptHandler

• **scriptHandler**: [`IScriptHandler`](IScriptHandler.md)

#### Inherited from

[IServerComponent](IServerComponent.md).[scriptHandler](IServerComponent.md#scripthandler)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:41](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L41)

___

### definitions

• **definitions**: `any`

#### Inherited from

[IServerComponent](IServerComponent.md).[definitions](IServerComponent.md#definitions)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:42](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L42)

## Methods

### getNodeById

▸ **getNodeById**(`id`): [`Node`](../classes/Node.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

[`Node`](../classes/Node.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:126](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L126)

___

### getToken

▸ **getToken**(`id`): [`IToken`](IToken.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

[`IToken`](IToken.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:127](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L127)

___

### getItemsData

▸ **getItemsData**(): [`IItemData`](IItemData.md)[]

#### Returns

[`IItemData`](IItemData.md)[]

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:128](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L128)

___

### save

▸ **save**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:129](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L129)

___

### end

▸ **end**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:130](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L130)

___

### stop

▸ **stop**(): `void`

causes the execution to stop from running any further

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:135](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L135)

___

### terminate

▸ **terminate**(): `void`

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:136](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L136)

___

### execute

▸ **execute**(`startNodeId?`, `inputData?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `startNodeId?` | `any` |
| `inputData?` | `Object` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:137](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L137)

___

### signalItem

▸ **signalItem**(`executionId`, `inputData`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

invoke scenarios:
     itemId
     elementId   - but only one is active
     elementId   - for a startEvent in a secondary process

#### Parameters

| Name | Type |
| :------ | :------ |
| `executionId` | `any` |
| `inputData` | `any` |
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:148](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L148)

___

### signalEvent

▸ **signalEvent**(`executionId`, `inputData`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `executionId` | `any` |
| `inputData` | `any` |
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:149](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L149)

___

### signalRepeatTimerEvent

▸ **signalRepeatTimerEvent**(`executionId`, `prevItem`, `inputData`, `options?`): `Promise`\<[`IExecution`](IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `executionId` | `any` |
| `prevItem` | `any` |
| `inputData` | `any` |
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:150](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L150)

___

### getItems

▸ **getItems**(`query?`): [`IItem`](IItem.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `any` |

#### Returns

[`IItem`](IItem.md)[]

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:152](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L152)

___

### getState

▸ **getState**(): [`IInstanceData`](IInstanceData.md)

#### Returns

[`IInstanceData`](IInstanceData.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:153](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L153)

___

### restored

▸ **restored**(): `void`

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:154](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L154)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:155](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L155)

___

### report

▸ **report**(): `void`

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:156](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L156)

___

### getNewId

▸ **getNewId**(`scope`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `string` |

#### Returns

`number`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:158](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L158)

___

### getUUID

▸ **getUUID**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:159](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L159)

___

### doExecutionEvent

▸ **doExecutionEvent**(`process`, `event`, `eventDetails?`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `process` | `any` |
| `event` | `any` |
| `eventDetails?` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:160](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L160)

___

### doItemEvent

▸ **doItemEvent**(`item`, `event`, `eventDetails?`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `event` | `any` |
| `eventDetails?` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:161](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L161)

___

### log

▸ **log**(`...msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:162](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L162)

___

### logS

▸ **logS**(`...msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:163](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L163)

___

### logE

▸ **logE**(`...msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:164](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L164)

___

### info

▸ **info**(`...msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:165](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L165)

___

### decision

▸ **decision**(`...msg`): `void`

Why the engine took a path, kept in the instance log as a decision entry.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:167](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L167)

___

### error

▸ **error**(`msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:168](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L168)

___

### appendData

▸ **appendData**(`inputData`, `item`, `dataPath?`, `assignment?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputData` | `any` |
| `item` | [`IItem`](IItem.md) |
| `dataPath?` | `any` |
| `assignment?` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:169](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L169)

___

### getData

▸ **getData**(`dataPath`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataPath` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:170](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L170)

___

### processQueue

▸ **processQueue**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:171](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L171)
