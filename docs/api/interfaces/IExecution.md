[bpmn-server](../API.md) / IExecution

# Interface: IExecution

## Hierarchy

- [`IServerComponent`](IServerComponent.md)

  ↳ **`IExecution`**

## Implemented by

- [`Execution`](../classes/Execution.md)

## Table of contents

### Properties

- [instance](IExecution.md#instance)
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
- [options](IExecution.md#options)
- [name](IExecution.md#name)
- [uids](IExecution.md#uids)
- [configuration](IExecution.md#configuration)
- [cron](IExecution.md#cron)
- [cache](IExecution.md#cache)
- [engine](IExecution.md#engine)
- [dataStore](IExecution.md#datastore)
- [definitions](IExecution.md#definitions)

### Methods

- [getNodeById](IExecution.md#getnodebyid)
- [getToken](IExecution.md#gettoken)
- [tokenEnded](IExecution.md#tokenended)
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
- [info](IExecution.md#info)
- [error](IExecution.md#error)
- [appendData](IExecution.md#appenddata)
- [getData](IExecution.md#getdata)
- [getAndCreateData](IExecution.md#getandcreatedata)

## Properties

### instance

• **instance**: [`IInstanceData`](IInstanceData.md)

#### Defined in

[interfaces/engine.ts:68](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L68)

___

### server

• **server**: [`IBPMNServer`](IBPMNServer.md)

#### Overrides

[IServerComponent](IServerComponent.md).[server](IServerComponent.md#server)

#### Defined in

[interfaces/engine.ts:69](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L69)

___

### tokens

• **tokens**: `Map`\<`any`, [`IToken`](IToken.md)\>

#### Defined in

[interfaces/engine.ts:70](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L70)

___

### definition

• **definition**: [`IDefinition`](IDefinition.md)

#### Defined in

[interfaces/engine.ts:71](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L71)

___

### appDelegate

• **appDelegate**: [`IAppDelegate`](IAppDelegate.md)

#### Overrides

[IServerComponent](IServerComponent.md).[appDelegate](IServerComponent.md#appdelegate)

#### Defined in

[interfaces/engine.ts:72](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L72)

___

### logger

• **logger**: [`ILogger`](ILogger.md)

#### Overrides

[IServerComponent](IServerComponent.md).[logger](IServerComponent.md#logger)

#### Defined in

[interfaces/engine.ts:73](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L73)

___

### process

• **process**: `any`

#### Defined in

[interfaces/engine.ts:74](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L74)

___

### promises

• **promises**: `any`

#### Defined in

[interfaces/engine.ts:75](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L75)

___

### listener

• **listener**: `any`

#### Defined in

[interfaces/engine.ts:76](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L76)

___

### isLocked

• **isLocked**: `boolean`

#### Defined in

[interfaces/engine.ts:77](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L77)

___

### errors

• **errors**: `any`

#### Defined in

[interfaces/engine.ts:79](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L79)

___

### item

• **item**: `any`

#### Defined in

[interfaces/engine.ts:80](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L80)

___

### messageMatchingKey

• **messageMatchingKey**: `any`

#### Defined in

[interfaces/engine.ts:81](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L81)

___

### worker

• **worker**: `any`

#### Defined in

[interfaces/engine.ts:82](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L82)

___

### userName

• **userName**: `any`

#### Defined in

[interfaces/engine.ts:83](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L83)

___

### id

• **id**: `any`

#### Defined in

[interfaces/engine.ts:85](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L85)

___

### status

• **status**: `any`

#### Defined in

[interfaces/engine.ts:86](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L86)

___

### options

• **options**: `any`

#### Defined in

[interfaces/engine.ts:87](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L87)

___

### name

• **name**: `any`

#### Defined in

[interfaces/engine.ts:88](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L88)

___

### uids

• **uids**: `Object`

#### Defined in

[interfaces/engine.ts:122](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L122)

___

### configuration

• **configuration**: [`IConfiguration`](IConfiguration.md)

#### Inherited from

[IServerComponent](IServerComponent.md).[configuration](IServerComponent.md#configuration)

#### Defined in

[interfaces/server.ts:22](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/server.ts#L22)

___

### cron

• **cron**: `any`

#### Inherited from

[IServerComponent](IServerComponent.md).[cron](IServerComponent.md#cron)

#### Defined in

[interfaces/server.ts:24](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/server.ts#L24)

___

### cache

• **cache**: `any`

#### Inherited from

[IServerComponent](IServerComponent.md).[cache](IServerComponent.md#cache)

#### Defined in

[interfaces/server.ts:25](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/server.ts#L25)

___

### engine

• **engine**: `any`

#### Inherited from

[IServerComponent](IServerComponent.md).[engine](IServerComponent.md#engine)

#### Defined in

[interfaces/server.ts:27](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/server.ts#L27)

___

### dataStore

• **dataStore**: [`IDataStore`](IDataStore.md)

#### Inherited from

[IServerComponent](IServerComponent.md).[dataStore](IServerComponent.md#datastore)

#### Defined in

[interfaces/server.ts:28](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/server.ts#L28)

___

### definitions

• **definitions**: `any`

#### Inherited from

[IServerComponent](IServerComponent.md).[definitions](IServerComponent.md#definitions)

#### Defined in

[interfaces/server.ts:29](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/server.ts#L29)

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

[interfaces/engine.ts:90](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L90)

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

[interfaces/engine.ts:91](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L91)

___

### tokenEnded

▸ **tokenEnded**(`token`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`IToken`](IToken.md) |

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:92](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L92)

___

### getItemsData

▸ **getItemsData**(): [`IItemData`](IItemData.md)[]

#### Returns

[`IItemData`](IItemData.md)[]

#### Defined in

[interfaces/engine.ts:93](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L93)

___

### save

▸ **save**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[interfaces/engine.ts:94](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L94)

___

### end

▸ **end**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[interfaces/engine.ts:95](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L95)

___

### stop

▸ **stop**(): `void`

causes the execution to stop from running any further

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:100](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L100)

___

### terminate

▸ **terminate**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:101](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L101)

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

[interfaces/engine.ts:102](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L102)

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

[interfaces/engine.ts:113](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L113)

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

[interfaces/engine.ts:114](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L114)

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

[interfaces/engine.ts:115](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L115)

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

[interfaces/engine.ts:117](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L117)

___

### getState

▸ **getState**(): [`IInstanceData`](IInstanceData.md)

#### Returns

[`IInstanceData`](IInstanceData.md)

#### Defined in

[interfaces/engine.ts:118](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L118)

___

### restored

▸ **restored**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:119](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L119)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:120](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L120)

___

### report

▸ **report**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:121](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L121)

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

[interfaces/engine.ts:123](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L123)

___

### getUUID

▸ **getUUID**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/engine.ts:124](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L124)

___

### doExecutionEvent

▸ **doExecutionEvent**(`process`, `event`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `process` | `any` |
| `event` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[interfaces/engine.ts:125](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L125)

___

### doItemEvent

▸ **doItemEvent**(`item`, `event`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `event` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[interfaces/engine.ts:126](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L126)

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

[interfaces/engine.ts:127](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L127)

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

[interfaces/engine.ts:128](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L128)

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

[interfaces/engine.ts:129](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L129)

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

[interfaces/engine.ts:130](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L130)

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

[interfaces/engine.ts:131](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L131)

___

### getAndCreateData

▸ **getAndCreateData**(`dataPath`, `asArray?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataPath` | `any` |
| `asArray?` | `boolean` |

#### Returns

`any`

#### Defined in

[interfaces/engine.ts:132](https://github.com/bpmnServer/bpmn-server/blob/637b6d1/src/interfaces/engine.ts#L132)
