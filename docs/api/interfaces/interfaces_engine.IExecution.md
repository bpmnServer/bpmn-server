[bpmn-server](../README.md) / [Exports](../modules.md) / [interfaces/engine](../modules/interfaces_engine.md) / IExecution

# Interface: IExecution

[interfaces/engine](../modules/interfaces_engine.md).IExecution

## Hierarchy

- [`IServerComponent`](interfaces_server.IServerComponent.md)

  ↳ **`IExecution`**

## Implemented by

- [`Execution`](../classes/engine_Execution.Execution.md)

## Table of contents

### Properties

- [appDelegate](interfaces_engine.IExecution.md#appdelegate)
- [cache](interfaces_engine.IExecution.md#cache)
- [configuration](interfaces_engine.IExecution.md#configuration)
- [cron](interfaces_engine.IExecution.md#cron)
- [dataStore](interfaces_engine.IExecution.md#datastore)
- [definition](interfaces_engine.IExecution.md#definition)
- [definitions](interfaces_engine.IExecution.md#definitions)
- [engine](interfaces_engine.IExecution.md#engine)
- [errors](interfaces_engine.IExecution.md#errors)
- [id](interfaces_engine.IExecution.md#id)
- [instance](interfaces_engine.IExecution.md#instance)
- [isLocked](interfaces_engine.IExecution.md#islocked)
- [item](interfaces_engine.IExecution.md#item)
- [listener](interfaces_engine.IExecution.md#listener)
- [logger](interfaces_engine.IExecution.md#logger)
- [messageMatchingKey](interfaces_engine.IExecution.md#messagematchingkey)
- [name](interfaces_engine.IExecution.md#name)
- [options](interfaces_engine.IExecution.md#options)
- [process](interfaces_engine.IExecution.md#process)
- [promises](interfaces_engine.IExecution.md#promises)
- [server](interfaces_engine.IExecution.md#server)
- [status](interfaces_engine.IExecution.md#status)
- [tokens](interfaces_engine.IExecution.md#tokens)
- [uids](interfaces_engine.IExecution.md#uids)
- [userName](interfaces_engine.IExecution.md#username)
- [worker](interfaces_engine.IExecution.md#worker)

### Methods

- [appendData](interfaces_engine.IExecution.md#appenddata)
- [doExecutionEvent](interfaces_engine.IExecution.md#doexecutionevent)
- [doItemEvent](interfaces_engine.IExecution.md#doitemevent)
- [end](interfaces_engine.IExecution.md#end)
- [error](interfaces_engine.IExecution.md#error)
- [execute](interfaces_engine.IExecution.md#execute)
- [getAndCreateData](interfaces_engine.IExecution.md#getandcreatedata)
- [getData](interfaces_engine.IExecution.md#getdata)
- [getItems](interfaces_engine.IExecution.md#getitems)
- [getItemsData](interfaces_engine.IExecution.md#getitemsdata)
- [getNewId](interfaces_engine.IExecution.md#getnewid)
- [getNodeById](interfaces_engine.IExecution.md#getnodebyid)
- [getState](interfaces_engine.IExecution.md#getstate)
- [getToken](interfaces_engine.IExecution.md#gettoken)
- [getUUID](interfaces_engine.IExecution.md#getuuid)
- [info](interfaces_engine.IExecution.md#info)
- [log](interfaces_engine.IExecution.md#log)
- [report](interfaces_engine.IExecution.md#report)
- [restored](interfaces_engine.IExecution.md#restored)
- [resume](interfaces_engine.IExecution.md#resume)
- [save](interfaces_engine.IExecution.md#save)
- [signalEvent](interfaces_engine.IExecution.md#signalevent)
- [signalItem](interfaces_engine.IExecution.md#signalitem)
- [signalRepeatTimerEvent](interfaces_engine.IExecution.md#signalrepeattimerevent)
- [stop](interfaces_engine.IExecution.md#stop)
- [terminate](interfaces_engine.IExecution.md#terminate)
- [tokenEnded](interfaces_engine.IExecution.md#tokenended)

## Properties

### appDelegate

• **appDelegate**: [`IAppDelegate`](interfaces_common.IAppDelegate.md)

#### Overrides

[IServerComponent](interfaces_server.IServerComponent.md).[appDelegate](interfaces_server.IServerComponent.md#appdelegate)

#### Defined in

[src/interfaces/engine.ts:72](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L72)

___

### cache

• **cache**: `any`

#### Inherited from

[IServerComponent](interfaces_server.IServerComponent.md).[cache](interfaces_server.IServerComponent.md#cache)

#### Defined in

[src/interfaces/server.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L25)

___

### configuration

• **configuration**: [`IConfiguration`](interfaces_common.IConfiguration.md)

#### Inherited from

[IServerComponent](interfaces_server.IServerComponent.md).[configuration](interfaces_server.IServerComponent.md#configuration)

#### Defined in

[src/interfaces/server.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L22)

___

### cron

• **cron**: `any`

#### Inherited from

[IServerComponent](interfaces_server.IServerComponent.md).[cron](interfaces_server.IServerComponent.md#cron)

#### Defined in

[src/interfaces/server.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L24)

___

### dataStore

• **dataStore**: [`IDataStore`](interfaces_datastore.IDataStore.md)

#### Inherited from

[IServerComponent](interfaces_server.IServerComponent.md).[dataStore](interfaces_server.IServerComponent.md#datastore)

#### Defined in

[src/interfaces/server.ts:28](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L28)

___

### definition

• **definition**: [`IDefinition`](interfaces_elements.IDefinition.md)

#### Defined in

[src/interfaces/engine.ts:71](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L71)

___

### definitions

• **definitions**: `any`

#### Inherited from

[IServerComponent](interfaces_server.IServerComponent.md).[definitions](interfaces_server.IServerComponent.md#definitions)

#### Defined in

[src/interfaces/server.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L29)

___

### engine

• **engine**: `any`

#### Inherited from

[IServerComponent](interfaces_server.IServerComponent.md).[engine](interfaces_server.IServerComponent.md#engine)

#### Defined in

[src/interfaces/server.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L27)

___

### errors

• **errors**: `any`

#### Defined in

[src/interfaces/engine.ts:79](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L79)

___

### id

• **id**: `any`

#### Defined in

[src/interfaces/engine.ts:85](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L85)

___

### instance

• **instance**: [`IInstanceData`](interfaces_DataObjects.IInstanceData.md)

#### Defined in

[src/interfaces/engine.ts:68](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L68)

___

### isLocked

• **isLocked**: `boolean`

#### Defined in

[src/interfaces/engine.ts:77](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L77)

___

### item

• **item**: `any`

#### Defined in

[src/interfaces/engine.ts:80](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L80)

___

### listener

• **listener**: `any`

#### Defined in

[src/interfaces/engine.ts:76](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L76)

___

### logger

• **logger**: [`ILogger`](interfaces_common.ILogger.md)

#### Overrides

[IServerComponent](interfaces_server.IServerComponent.md).[logger](interfaces_server.IServerComponent.md#logger)

#### Defined in

[src/interfaces/engine.ts:73](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L73)

___

### messageMatchingKey

• **messageMatchingKey**: `any`

#### Defined in

[src/interfaces/engine.ts:81](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L81)

___

### name

• **name**: `any`

#### Defined in

[src/interfaces/engine.ts:88](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L88)

___

### options

• **options**: `any`

#### Defined in

[src/interfaces/engine.ts:87](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L87)

___

### process

• **process**: `any`

#### Defined in

[src/interfaces/engine.ts:74](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L74)

___

### promises

• **promises**: `any`

#### Defined in

[src/interfaces/engine.ts:75](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L75)

___

### server

• **server**: [`IBPMNServer`](interfaces_server.IBPMNServer.md)

#### Overrides

[IServerComponent](interfaces_server.IServerComponent.md).[server](interfaces_server.IServerComponent.md#server)

#### Defined in

[src/interfaces/engine.ts:69](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L69)

___

### status

• **status**: `any`

#### Defined in

[src/interfaces/engine.ts:86](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L86)

___

### tokens

• **tokens**: `Map`\<`any`, [`IToken`](interfaces_engine.IToken.md)\>

#### Defined in

[src/interfaces/engine.ts:70](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L70)

___

### uids

• **uids**: `Object`

#### Defined in

[src/interfaces/engine.ts:122](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L122)

___

### userName

• **userName**: `any`

#### Defined in

[src/interfaces/engine.ts:83](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L83)

___

### worker

• **worker**: `any`

#### Defined in

[src/interfaces/engine.ts:82](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L82)

## Methods

### appendData

▸ **appendData**(`inputData`, `item`, `dataPath?`, `assignment?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputData` | `any` |
| `item` | [`IItem`](interfaces_engine.IItem.md) |
| `dataPath?` | `any` |
| `assignment?` | `any` |

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:130](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L130)

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

[src/interfaces/engine.ts:125](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L125)

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

[src/interfaces/engine.ts:126](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L126)

___

### end

▸ **end**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/interfaces/engine.ts:95](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L95)

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

[src/interfaces/engine.ts:129](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L129)

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

[src/interfaces/engine.ts:102](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L102)

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

[src/interfaces/engine.ts:132](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L132)

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

[src/interfaces/engine.ts:131](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L131)

___

### getItems

▸ **getItems**(`query?`): [`IItem`](interfaces_engine.IItem.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `any` |

#### Returns

[`IItem`](interfaces_engine.IItem.md)[]

#### Defined in

[src/interfaces/engine.ts:117](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L117)

___

### getItemsData

▸ **getItemsData**(): [`IItemData`](interfaces_DataObjects.IItemData.md)[]

#### Returns

[`IItemData`](interfaces_DataObjects.IItemData.md)[]

#### Defined in

[src/interfaces/engine.ts:93](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L93)

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

[src/interfaces/engine.ts:123](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L123)

___

### getNodeById

▸ **getNodeById**(`id`): [`Node`](../classes/elements_Node.Node.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

[`Node`](../classes/elements_Node.Node.md)

#### Defined in

[src/interfaces/engine.ts:90](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L90)

___

### getState

▸ **getState**(): [`IInstanceData`](interfaces_DataObjects.IInstanceData.md)

#### Returns

[`IInstanceData`](interfaces_DataObjects.IInstanceData.md)

#### Defined in

[src/interfaces/engine.ts:118](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L118)

___

### getToken

▸ **getToken**(`id`): [`IToken`](interfaces_engine.IToken.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

[`IToken`](interfaces_engine.IToken.md)

#### Defined in

[src/interfaces/engine.ts:91](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L91)

___

### getUUID

▸ **getUUID**(): `any`

#### Returns

`any`

#### Defined in

[src/interfaces/engine.ts:124](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L124)

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

[src/interfaces/engine.ts:128](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L128)

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

[src/interfaces/engine.ts:127](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L127)

___

### report

▸ **report**(): `void`

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:121](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L121)

___

### restored

▸ **restored**(): `void`

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:119](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L119)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:120](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L120)

___

### save

▸ **save**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/interfaces/engine.ts:94](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L94)

___

### signalEvent

▸ **signalEvent**(`executionId`, `inputData`, `options?`): `Promise`\<[`IExecution`](interfaces_engine.IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `executionId` | `any` |
| `inputData` | `any` |
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](interfaces_engine.IExecution.md)\>

#### Defined in

[src/interfaces/engine.ts:114](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L114)

___

### signalItem

▸ **signalItem**(`executionId`, `inputData`, `options?`): `Promise`\<[`IExecution`](interfaces_engine.IExecution.md)\>

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

`Promise`\<[`IExecution`](interfaces_engine.IExecution.md)\>

#### Defined in

[src/interfaces/engine.ts:113](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L113)

___

### signalRepeatTimerEvent

▸ **signalRepeatTimerEvent**(`executionId`, `prevItem`, `inputData`, `options?`): `Promise`\<[`IExecution`](interfaces_engine.IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `executionId` | `any` |
| `prevItem` | `any` |
| `inputData` | `any` |
| `options?` | `Object` |

#### Returns

`Promise`\<[`IExecution`](interfaces_engine.IExecution.md)\>

#### Defined in

[src/interfaces/engine.ts:115](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L115)

___

### stop

▸ **stop**(): `void`

causes the execution to stop from running any further

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:100](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L100)

___

### terminate

▸ **terminate**(): `void`

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:101](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L101)

___

### tokenEnded

▸ **tokenEnded**(`token`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`IToken`](interfaces_engine.IToken.md) |

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:92](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L92)
