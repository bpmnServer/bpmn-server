[bpmn-server](../readme.md) / Execution

# Class: Execution

is accessed two ways:
     execute - start process
     signal  - invoke a node (userTask, event, etc.)

## Hierarchy

- [`ServerComponent`](ServerComponent.md)

  ↳ **`Execution`**

## Implements

- [`IExecution`](../interfaces/IExecution.md)

## Table of contents

### Constructors

- [constructor](Execution.md#constructor)

### Properties

- [instance](Execution.md#instance)
- [tokens](Execution.md#tokens)
- [definition](Execution.md#definition)
- [process](Execution.md#process)
- [errors](Execution.md#errors)
- [item](Execution.md#item)
- [messageMatchingKey](Execution.md#messagematchingkey)
- [worker](Execution.md#worker)
- [userName](Execution.md#username)
- [promises](Execution.md#promises)
- [servicesProvider](Execution.md#servicesprovider)
- [isLocked](Execution.md#islocked)
- [options](Execution.md#options)
- [operation](Execution.md#operation)
- [uids](Execution.md#uids)
- [server](Execution.md#server)

### Accessors

- [id](Execution.md#id)
- [name](Execution.md#name)
- [status](Execution.md#status)
- [execution](Execution.md#execution)
- [listener](Execution.md#listener)
- [configuration](Execution.md#configuration)
- [logger](Execution.md#logger)
- [cron](Execution.md#cron)
- [cache](Execution.md#cache)
- [appDelegate](Execution.md#appdelegate)
- [engine](Execution.md#engine)
- [dataStore](Execution.md#datastore)
- [definitions](Execution.md#definitions)

### Methods

- [tillDone](Execution.md#tilldone)
- [getNodeById](Execution.md#getnodebyid)
- [getToken](Execution.md#gettoken)
- [tokenEnded](Execution.md#tokenended)
- [end](Execution.md#end)
- [terminate](Execution.md#terminate)
- [stop](Execution.md#stop)
- [execute](Execution.md#execute)
- [assign](Execution.md#assign)
- [signalItem](Execution.md#signalitem)
- [restart](Execution.md#restart)
- [signalEvent](Execution.md#signalevent)
- [signalRepeatTimerEvent](Execution.md#signalrepeattimerevent)
- [save](Execution.md#save)
- [getItems](Execution.md#getitems)
- [getItemsData](Execution.md#getitemsdata)
- [getState](Execution.md#getstate)
- [findSavePoint](Execution.md#findsavepoint)
- [restore](Execution.md#restore)
- [restored](Execution.md#restored)
- [resume](Execution.md#resume)
- [report](Execution.md#report)
- [formatDate](Execution.md#formatdate)
- [getNewId](Execution.md#getnewid)
- [getUUID](Execution.md#getuuid)
- [doExecutionEvent](Execution.md#doexecutionevent)
- [doItemEvent](Execution.md#doitemevent)
- [log](Execution.md#log)
- [logS](Execution.md#logs)
- [logE](Execution.md#loge)
- [info](Execution.md#info)
- [error](Execution.md#error)
- [appendData](Execution.md#appenddata)
- [getData](Execution.md#getdata)

## Constructors

### constructor

• **new Execution**(`server`, `name`, `source`, `state?`): [`Execution`](Execution.md)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `server` | `any` | `undefined` | - |
| `name` | `string` | `undefined` | process name |
| `source` | `any` | `undefined` | bpmn source |
| `state` | `any` | `null` | - |

#### Returns

[`Execution`](Execution.md)

#### Overrides

[ServerComponent](ServerComponent.md).[constructor](ServerComponent.md#constructor)

#### Defined in

[engine/Execution.ts:62](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L62)

## Properties

### instance

• **instance**: [`InstanceObject`](InstanceObject.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[instance](../interfaces/IExecution.md#instance)

#### Defined in

[engine/Execution.ts:26](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L26)

___

### tokens

• **tokens**: `Map`\<`any`, `any`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[tokens](../interfaces/IExecution.md#tokens)

#### Defined in

[engine/Execution.ts:27](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L27)

___

### definition

• **definition**: [`IDefinition`](../interfaces/IDefinition.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[definition](../interfaces/IExecution.md#definition)

#### Defined in

[engine/Execution.ts:28](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L28)

___

### process

• **process**: [`Process`](Process.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[process](../interfaces/IExecution.md#process)

#### Defined in

[engine/Execution.ts:29](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L29)

___

### errors

• **errors**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[errors](../interfaces/IExecution.md#errors)

#### Defined in

[engine/Execution.ts:30](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L30)

___

### item

• **item**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[item](../interfaces/IExecution.md#item)

#### Defined in

[engine/Execution.ts:31](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L31)

___

### messageMatchingKey

• **messageMatchingKey**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[messageMatchingKey](../interfaces/IExecution.md#messagematchingkey)

#### Defined in

[engine/Execution.ts:32](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L32)

___

### worker

• **worker**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[worker](../interfaces/IExecution.md#worker)

#### Defined in

[engine/Execution.ts:33](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L33)

___

### userName

• **userName**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[userName](../interfaces/IExecution.md#username)

#### Defined in

[engine/Execution.ts:34](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L34)

___

### promises

• **promises**: `any`[] = `[]`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[promises](../interfaces/IExecution.md#promises)

#### Defined in

[engine/Execution.ts:35](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L35)

___

### servicesProvider

• **servicesProvider**: `any`

#### Defined in

[engine/Execution.ts:36](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L36)

___

### isLocked

• **isLocked**: `boolean` = `false`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[isLocked](../interfaces/IExecution.md#islocked)

#### Defined in

[engine/Execution.ts:37](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L37)

___

### options

• **options**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[options](../interfaces/IExecution.md#options)

#### Defined in

[engine/Execution.ts:38](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L38)

___

### operation

• **operation**: `any`

#### Defined in

[engine/Execution.ts:39](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L39)

___

### uids

• **uids**: `Object` = `{}`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[uids](../interfaces/IExecution.md#uids)

#### Defined in

[engine/Execution.ts:618](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L618)

___

### server

• **server**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[server](../interfaces/IExecution.md#server)

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[server/ServerComponent.ts:9](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L9)

## Accessors

### id

• `get` **id**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[id](../interfaces/IExecution.md#id)

#### Defined in

[engine/Execution.ts:41](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L41)

___

### name

• `get` **name**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[name](../interfaces/IExecution.md#name)

#### Defined in

[engine/Execution.ts:42](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L42)

___

### status

• `get` **status**(): [`EXECUTION_STATUS`](../enums/EXECUTION_STATUS.md)

#### Returns

[`EXECUTION_STATUS`](../enums/EXECUTION_STATUS.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[status](../interfaces/IExecution.md#status)

#### Defined in

[engine/Execution.ts:43](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L43)

___

### execution

• `get` **execution**(): `this`

#### Returns

`this`

#### Defined in

[engine/Execution.ts:44](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L44)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[listener](../interfaces/IExecution.md#listener)

#### Overrides

ServerComponent.listener

#### Defined in

[engine/Execution.ts:52](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L52)

___

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[configuration](../interfaces/IExecution.md#configuration)

#### Inherited from

ServerComponent.configuration

#### Defined in

[server/ServerComponent.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L14)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[logger](../interfaces/IExecution.md#logger)

#### Inherited from

ServerComponent.logger

#### Defined in

[server/ServerComponent.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L15)

___

### cron

• `get` **cron**(): [`Cron`](Cron.md)

#### Returns

[`Cron`](Cron.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[cron](../interfaces/IExecution.md#cron)

#### Inherited from

ServerComponent.cron

#### Defined in

[server/ServerComponent.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L16)

___

### cache

• `get` **cache**(): [`CacheManager`](CacheManager.md)

#### Returns

[`CacheManager`](CacheManager.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[cache](../interfaces/IExecution.md#cache)

#### Inherited from

ServerComponent.cache

#### Defined in

[server/ServerComponent.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L17)

___

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[appDelegate](../interfaces/IExecution.md#appdelegate)

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[server/ServerComponent.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L18)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/IEngine.md)

#### Returns

[`IEngine`](../interfaces/IEngine.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[engine](../interfaces/IExecution.md#engine)

#### Inherited from

ServerComponent.engine

#### Defined in

[server/ServerComponent.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L19)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[dataStore](../interfaces/IExecution.md#datastore)

#### Inherited from

ServerComponent.dataStore

#### Defined in

[server/ServerComponent.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L20)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[definitions](../interfaces/IExecution.md#definitions)

#### Inherited from

ServerComponent.definitions

#### Defined in

[server/ServerComponent.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L21)

## Methods

### tillDone

▸ **tillDone**(): `Promise`\<[`Execution`](Execution.md)\>

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Defined in

[engine/Execution.ts:46](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L46)

___

### getNodeById

▸ **getNodeById**(`id`): [`Node`](Node.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

[`Node`](Node.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getNodeById](../interfaces/IExecution.md#getnodebyid)

#### Defined in

[engine/Execution.ts:76](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L76)

___

### getToken

▸ **getToken**(`id`): [`Token`](Token.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

[`Token`](Token.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getToken](../interfaces/IExecution.md#gettoken)

#### Defined in

[engine/Execution.ts:79](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L79)

___

### tokenEnded

▸ **tokenEnded**(`token`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`Token`](Token.md) |

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[tokenEnded](../interfaces/IExecution.md#tokenended)

#### Defined in

[engine/Execution.ts:82](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L82)

___

### end

▸ **end**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[end](../interfaces/IExecution.md#end)

#### Defined in

[engine/Execution.ts:95](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L95)

___

### terminate

▸ **terminate**(): `void`

causes the execution to stop from running any further

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[terminate](../interfaces/IExecution.md#terminate)

#### Defined in

[engine/Execution.ts:110](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L110)

___

### stop

▸ **stop**(): `void`

causes the execution to stop from running any further

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[stop](../interfaces/IExecution.md#stop)

#### Defined in

[engine/Execution.ts:120](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L120)

___

### execute

▸ **execute**(`startNodeId?`, `inputData?`, `options?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `startNodeId` | `any` | `null` |
| `inputData` | `Object` | `{}` |
| `options` | `Object` | `{}` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[execute](../interfaces/IExecution.md#execute)

#### Defined in

[engine/Execution.ts:127](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L127)

___

### assign

▸ **assign**(`executionId`, `inputData`, `assignment?`, `userName`, `options?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `executionId` | `any` |
| `inputData` | `any` |
| `assignment` | `Object` |
| `userName` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[engine/Execution.ts:187](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L187)

___

### signalItem

▸ **signalItem**(`itemId`, `inputData`, `userName`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

invoke scenarios:
     itemId
     elementId   - but only one is active
     elementId   - for a startEvent in a secondary process

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemId` | `any` |
| `inputData` | `any` |
| `userName` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[signalItem](../interfaces/IExecution.md#signalitem)

#### Defined in

[engine/Execution.ts:224](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L224)

___

### restart

▸ **restart**(`itemId`, `inputData`, `userName`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

restarting an already completed instance at a particular node

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemId` | `any` |
| `inputData` | `any` |
| `userName` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Defined in

[engine/Execution.ts:280](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L280)

___

### signalEvent

▸ **signalEvent**(`executionId`, `inputData`, `userName`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `executionId` | `any` |
| `inputData` | `any` |
| `userName` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[signalEvent](../interfaces/IExecution.md#signalevent)

#### Defined in

[engine/Execution.ts:305](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L305)

___

### signalRepeatTimerEvent

▸ **signalRepeatTimerEvent**(`executionId`, `prevItem`, `inputData`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `executionId` | `any` |
| `prevItem` | `any` |
| `inputData` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[signalRepeatTimerEvent](../interfaces/IExecution.md#signalrepeattimerevent)

#### Defined in

[engine/Execution.ts:390](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L390)

___

### save

▸ **save**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[save](../interfaces/IExecution.md#save)

#### Defined in

[engine/Execution.ts:419](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L419)

___

### getItems

▸ **getItems**(): [`Item`](Item.md)[]

#### Returns

[`Item`](Item.md)[]

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getItems](../interfaces/IExecution.md#getitems)

#### Defined in

[engine/Execution.ts:433](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L433)

___

### getItemsData

▸ **getItemsData**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getItemsData](../interfaces/IExecution.md#getitemsdata)

#### Defined in

[engine/Execution.ts:444](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L444)

___

### getState

▸ **getState**(): [`IInstanceData`](../interfaces/IInstanceData.md)

#### Returns

[`IInstanceData`](../interfaces/IInstanceData.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getState](../interfaces/IExecution.md#getstate)

#### Defined in

[engine/Execution.ts:454](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L454)

___

### findSavePoint

▸ **findSavePoint**(`state`, `itemId`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `any` |
| `itemId` | `any` |

#### Returns

`any`

#### Defined in

[engine/Execution.ts:475](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L475)

___

### restore

▸ **restore**(`server`, `state`, `itemId?`): `Promise`\<[`Execution`](Execution.md)\>

re-enstate the execution from db

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `server` | `any` | `undefined` |
| `state` | [`IInstanceData`](../interfaces/IInstanceData.md) | `undefined` |
| `itemId` | `any` | `null` |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Defined in

[engine/Execution.ts:495](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L495)

___

### restored

▸ **restored**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[restored](../interfaces/IExecution.md#restored)

#### Defined in

[engine/Execution.ts:569](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L569)

___

### resume

▸ **resume**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[resume](../interfaces/IExecution.md#resume)

#### Defined in

[engine/Execution.ts:576](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L576)

___

### report

▸ **report**(): `void`

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[report](../interfaces/IExecution.md#report)

#### Defined in

[engine/Execution.ts:582](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L582)

___

### formatDate

▸ **formatDate**(`date`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `any` |

#### Returns

`any`

#### Defined in

[engine/Execution.ts:610](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L610)

___

### getNewId

▸ **getNewId**(`scope`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `string` |

#### Returns

`number`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getNewId](../interfaces/IExecution.md#getnewid)

#### Defined in

[engine/Execution.ts:620](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L620)

___

### getUUID

▸ **getUUID**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getUUID](../interfaces/IExecution.md#getuuid)

#### Defined in

[engine/Execution.ts:627](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L627)

___

### doExecutionEvent

▸ **doExecutionEvent**(`process`, `event`, `eventDetails?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `process` | `any` |
| `event` | `any` |
| `eventDetails` | `Object` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[doExecutionEvent](../interfaces/IExecution.md#doexecutionevent)

#### Defined in

[engine/Execution.ts:634](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L634)

___

### doItemEvent

▸ **doItemEvent**(`item`, `event`, `eventDetails?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `event` | `any` |
| `eventDetails` | `Object` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[doItemEvent](../interfaces/IExecution.md#doitemevent)

#### Defined in

[engine/Execution.ts:640](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L640)

___

### log

▸ **log**(`...msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any`[] |

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[log](../interfaces/IExecution.md#log)

#### Defined in

[engine/Execution.ts:645](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L645)

___

### logS

▸ **logS**(`...msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any`[] |

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[logS](../interfaces/IExecution.md#logs)

#### Defined in

[engine/Execution.ts:648](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L648)

___

### logE

▸ **logE**(`...msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any`[] |

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[logE](../interfaces/IExecution.md#loge)

#### Defined in

[engine/Execution.ts:651](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L651)

___

### info

▸ **info**(`...msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any`[] |

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[info](../interfaces/IExecution.md#info)

#### Defined in

[engine/Execution.ts:654](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L654)

___

### error

▸ **error**(`msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `any` |

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[error](../interfaces/IExecution.md#error)

#### Defined in

[engine/Execution.ts:657](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L657)

___

### appendData

▸ **appendData**(`inputData`, `item`, `dataPath?`, `assignment?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputData` | `any` |
| `item` | [`Item`](Item.md) |
| `dataPath?` | `any` |
| `assignment?` | `any` |

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[appendData](../interfaces/IExecution.md#appenddata)

#### Defined in

[engine/Execution.ts:662](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L662)

___

### getData

▸ **getData**(`dataPath`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataPath` | `any` |

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getData](../interfaces/IExecution.md#getdata)

#### Defined in

[engine/Execution.ts:667](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Execution.ts#L667)
