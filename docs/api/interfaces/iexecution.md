[bpmn-server](../README.md) / IExecution

# Interface: IExecution

## Hierarchy

- [`IServerComponent`](IServerComponent.md)

  ↳ **`IExecution`**

## Implemented by

- [`Execution`](../classes/Execution.md)

## Table of contents

### Properties

- [appDelegate](IExecution.md#appdelegate)
- [cache](IExecution.md#cache)
- [configuration](IExecution.md#configuration)
- [cron](IExecution.md#cron)
- [dataStore](IExecution.md#datastore)
- [definition](IExecution.md#definition)
- [definitions](IExecution.md#definitions)
- [engine](IExecution.md#engine)
- [errors](IExecution.md#errors)
- [id](IExecution.md#id)
- [instance](IExecution.md#instance)
- [isLocked](IExecution.md#islocked)
- [item](IExecution.md#item)
- [listener](IExecution.md#listener)
- [logger](IExecution.md#logger)
- [messageMatchingKey](IExecution.md#messagematchingkey)
- [name](IExecution.md#name)
- [options](IExecution.md#options)
- [process](IExecution.md#process)
- [promises](IExecution.md#promises)
- [server](IExecution.md#server)
- [status](IExecution.md#status)
- [tokens](IExecution.md#tokens)
- [uids](IExecution.md#uids)
- [userName](IExecution.md#username)
- [worker](IExecution.md#worker)

### Methods

- [appendData](IExecution.md#appenddata)
- [doExecutionEvent](IExecution.md#doexecutionevent)
- [doItemEvent](IExecution.md#doitemevent)
- [end](IExecution.md#end)
- [error](IExecution.md#error)
- [execute](IExecution.md#execute)
- [getAndCreateData](IExecution.md#getandcreatedata)
- [getData](IExecution.md#getdata)
- [getItems](IExecution.md#getitems)
- [getItemsData](IExecution.md#getitemsdata)
- [getNewId](IExecution.md#getnewid)
- [getNodeById](IExecution.md#getnodebyid)
- [getState](IExecution.md#getstate)
- [getToken](IExecution.md#gettoken)
- [getUUID](IExecution.md#getuuid)
- [info](IExecution.md#info)
- [log](IExecution.md#log)
- [report](IExecution.md#report)
- [restored](IExecution.md#restored)
- [resume](IExecution.md#resume)
- [save](IExecution.md#save)
- [signalEvent](IExecution.md#signalevent)
- [signalItem](IExecution.md#signalitem)
- [signalRepeatTimerEvent](IExecution.md#signalrepeattimerevent)
- [stop](IExecution.md#stop)
- [terminate](IExecution.md#terminate)
- [tokenEnded](IExecution.md#tokenended)

## Properties

### appDelegate

• **appDelegate**: [`IAppDelegate`](IAppDelegate.md)

#### Overrides

[IServerComponent](IServerComponent.md).[appDelegate](IServerComponent.md#appdelegate)

#### Defined in

[interfaces/engine.ts:72](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-72)

___

### cache

• **cache**: `any`

#### Inherited from

[IServerComponent](IServerComponent.md).[cache](IServerComponent.md#cache)

#### Defined in

[interfaces/server.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/server.ts#lines-25)

___

### configuration

• **configuration**: [`IConfiguration`](IConfiguration.md)

#### Inherited from

[IServerComponent](IServerComponent.md).[configuration](IServerComponent.md#configuration)

#### Defined in

[interfaces/server.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/server.ts#lines-22)

___

### cron

• **cron**: `any`

#### Inherited from

[IServerComponent](IServerComponent.md).[cron](IServerComponent.md#cron)

#### Defined in

[interfaces/server.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/server.ts#lines-24)

___

### dataStore

• **dataStore**: [`IDataStore`](IDataStore.md)

#### Inherited from

[IServerComponent](IServerComponent.md).[dataStore](IServerComponent.md#datastore)

#### Defined in

[interfaces/server.ts:28](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/server.ts#lines-28)

___

### definition

• **definition**: [`IDefinition`](IDefinition.md)

#### Defined in

[interfaces/engine.ts:71](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-71)

___

### definitions

• **definitions**: `any`

#### Inherited from

[IServerComponent](IServerComponent.md).[definitions](IServerComponent.md#definitions)

#### Defined in

[interfaces/server.ts:29](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/server.ts#lines-29)

___

### engine

• **engine**: `any`

#### Inherited from

[IServerComponent](IServerComponent.md).[engine](IServerComponent.md#engine)

#### Defined in

[interfaces/server.ts:27](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/server.ts#lines-27)

___

### errors

• **errors**: `any`

#### Defined in

[interfaces/engine.ts:79](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-79)

___

### id

• **id**: `any`

#### Defined in

[interfaces/engine.ts:85](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-85)

___

### instance

• **instance**: [`IInstanceData`](IInstanceData.md)

#### Defined in

[interfaces/engine.ts:68](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-68)

___

### isLocked

• **isLocked**: `boolean`

#### Defined in

[interfaces/engine.ts:77](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-77)

___

### item

• **item**: `any`

#### Defined in

[interfaces/engine.ts:80](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-80)

___

### listener

• **listener**: `any`

#### Defined in

[interfaces/engine.ts:76](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-76)

___

### logger

• **logger**: [`ILogger`](ILogger.md)

#### Overrides

[IServerComponent](IServerComponent.md).[logger](IServerComponent.md#logger)

#### Defined in

[interfaces/engine.ts:73](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-73)

___

### messageMatchingKey

• **messageMatchingKey**: `any`

#### Defined in

[interfaces/engine.ts:81](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-81)

___

### name

• **name**: `any`

#### Defined in

[interfaces/engine.ts:88](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-88)

___

### options

• **options**: `any`

#### Defined in

[interfaces/engine.ts:87](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-87)

___

### process

• **process**: `any`

#### Defined in

[interfaces/engine.ts:74](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-74)

___

### promises

• **promises**: `any`

#### Defined in

[interfaces/engine.ts:75](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-75)

___

### server

• **server**: [`IBPMNServer`](IBPMNServer.md)

#### Overrides

[IServerComponent](IServerComponent.md).[server](IServerComponent.md#server)

#### Defined in

[interfaces/engine.ts:69](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-69)

___

### status

• **status**: `any`

#### Defined in

[interfaces/engine.ts:86](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-86)

___

### tokens

• **tokens**: `Map`\<`any`, [`IToken`](IToken.md)\>

#### Defined in

[interfaces/engine.ts:70](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-70)

___

### uids

• **uids**: `Object`

#### Defined in

[interfaces/engine.ts:122](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-122)

___

### userName

• **userName**: `any`

#### Defined in

[interfaces/engine.ts:83](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-83)

___

### worker

• **worker**: `any`

#### Defined in

[interfaces/engine.ts:82](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-82)

## Methods

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

[interfaces/engine.ts:130](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-130)

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

[interfaces/engine.ts:125](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-125)

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

[interfaces/engine.ts:126](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-126)

___

### end

▸ **end**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[interfaces/engine.ts:95](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-95)

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

[interfaces/engine.ts:129](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-129)

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

[interfaces/engine.ts:102](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-102)

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

[interfaces/engine.ts:132](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-132)

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

[interfaces/engine.ts:131](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-131)

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

[interfaces/engine.ts:117](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-117)

___

### getItemsData

▸ **getItemsData**(): [`IItemData`](IItemData.md)[]

#### Returns

[`IItemData`](IItemData.md)[]

#### Defined in

[interfaces/engine.ts:93](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-93)

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

[interfaces/engine.ts:123](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-123)

___

### getNodeById

▸ **getNodeById**(`id`): [`Node`](../classes/Node.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

[`Node`](../classes/Node.md)

#### Defined in

[interfaces/engine.ts:90](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-90)

___

### getState

▸ **getState**(): [`IInstanceData`](IInstanceData.md)

#### Returns

[`IInstanceData`](IInstanceData.md)

#### Defined in

[interfaces/engine.ts:118](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-118)

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

[interfaces/engine.ts:91](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-91)

___

### getUUID

▸ **getUUID**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/engine.ts:124](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-124)

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

[interfaces/engine.ts:128](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-128)

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

[interfaces/engine.ts:127](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-127)

___

### report

▸ **report**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:121](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-121)

___

### restored

▸ **restored**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:119](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-119)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:120](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-120)

___

### save

▸ **save**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[interfaces/engine.ts:94](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-94)

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

[interfaces/engine.ts:114](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-114)

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

[interfaces/engine.ts:113](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-113)

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

[interfaces/engine.ts:115](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-115)

___

### stop

▸ **stop**(): `void`

causes the execution to stop from running any further

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:100](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-100)

___

### terminate

▸ **terminate**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:101](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-101)

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

[interfaces/engine.ts:92](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-92)
