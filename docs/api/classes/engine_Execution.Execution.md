[bpmn-server](../README.md) / [Exports](../modules.md) / [engine/Execution](../modules/engine_Execution.md) / Execution

# Class: Execution

[engine/Execution](../modules/engine_Execution.md).Execution

is accessed two ways:
     execute - start process
     signal  - invoke a node (userTask, event, etc.)

## Hierarchy

- [`ServerComponent`](server_ServerComponent.ServerComponent.md)

  ↳ **`Execution`**

## Implements

- [`IExecution`](../interfaces/interfaces_engine.IExecution.md)

## Table of contents

### Constructors

- [constructor](engine_Execution.Execution.md#constructor)

### Properties

- [definition](engine_Execution.Execution.md#definition)
- [errors](engine_Execution.Execution.md#errors)
- [instance](engine_Execution.Execution.md#instance)
- [isLocked](engine_Execution.Execution.md#islocked)
- [item](engine_Execution.Execution.md#item)
- [messageMatchingKey](engine_Execution.Execution.md#messagematchingkey)
- [operation](engine_Execution.Execution.md#operation)
- [options](engine_Execution.Execution.md#options)
- [process](engine_Execution.Execution.md#process)
- [promises](engine_Execution.Execution.md#promises)
- [server](engine_Execution.Execution.md#server)
- [servicesProvider](engine_Execution.Execution.md#servicesprovider)
- [tokens](engine_Execution.Execution.md#tokens)
- [uids](engine_Execution.Execution.md#uids)
- [userName](engine_Execution.Execution.md#username)
- [worker](engine_Execution.Execution.md#worker)

### Accessors

- [appDelegate](engine_Execution.Execution.md#appdelegate)
- [cache](engine_Execution.Execution.md#cache)
- [configuration](engine_Execution.Execution.md#configuration)
- [cron](engine_Execution.Execution.md#cron)
- [dataStore](engine_Execution.Execution.md#datastore)
- [definitions](engine_Execution.Execution.md#definitions)
- [engine](engine_Execution.Execution.md#engine)
- [execution](engine_Execution.Execution.md#execution)
- [id](engine_Execution.Execution.md#id)
- [listener](engine_Execution.Execution.md#listener)
- [logger](engine_Execution.Execution.md#logger)
- [name](engine_Execution.Execution.md#name)
- [status](engine_Execution.Execution.md#status)

### Methods

- [addHistory](engine_Execution.Execution.md#addhistory)
- [appendData](engine_Execution.Execution.md#appenddata)
- [assign](engine_Execution.Execution.md#assign)
- [doExecutionEvent](engine_Execution.Execution.md#doexecutionevent)
- [doItemEvent](engine_Execution.Execution.md#doitemevent)
- [end](engine_Execution.Execution.md#end)
- [error](engine_Execution.Execution.md#error)
- [execute](engine_Execution.Execution.md#execute)
- [getAndCreateData](engine_Execution.Execution.md#getandcreatedata)
- [getData](engine_Execution.Execution.md#getdata)
- [getItems](engine_Execution.Execution.md#getitems)
- [getItemsData](engine_Execution.Execution.md#getitemsdata)
- [getNewId](engine_Execution.Execution.md#getnewid)
- [getNodeById](engine_Execution.Execution.md#getnodebyid)
- [getState](engine_Execution.Execution.md#getstate)
- [getToken](engine_Execution.Execution.md#gettoken)
- [getUUID](engine_Execution.Execution.md#getuuid)
- [info](engine_Execution.Execution.md#info)
- [log](engine_Execution.Execution.md#log)
- [report](engine_Execution.Execution.md#report)
- [restored](engine_Execution.Execution.md#restored)
- [resume](engine_Execution.Execution.md#resume)
- [save](engine_Execution.Execution.md#save)
- [signalEvent](engine_Execution.Execution.md#signalevent)
- [signalItem](engine_Execution.Execution.md#signalitem)
- [signalRepeatTimerEvent](engine_Execution.Execution.md#signalrepeattimerevent)
- [stop](engine_Execution.Execution.md#stop)
- [terminate](engine_Execution.Execution.md#terminate)
- [tillDone](engine_Execution.Execution.md#tilldone)
- [tokenEnded](engine_Execution.Execution.md#tokenended)
- [restore](engine_Execution.Execution.md#restore)

## Constructors

### constructor

• **new Execution**(`server`, `name`, `source`, `state?`): [`Execution`](engine_Execution.Execution.md)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `server` | `any` | `undefined` | - |
| `name` | `string` | `undefined` | process name |
| `source` | `any` | `undefined` | bpmn source |
| `state` | `any` | `null` | - |

#### Returns

[`Execution`](engine_Execution.Execution.md)

#### Overrides

[ServerComponent](server_ServerComponent.ServerComponent.md).[constructor](server_ServerComponent.ServerComponent.md#constructor)

#### Defined in

[src/engine/Execution.ts:62](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L62)

## Properties

### definition

• **definition**: [`IDefinition`](../interfaces/interfaces_elements.IDefinition.md)

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[definition](../interfaces/interfaces_engine.IExecution.md#definition)

#### Defined in

[src/engine/Execution.ts:28](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L28)

___

### errors

• **errors**: `any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[errors](../interfaces/interfaces_engine.IExecution.md#errors)

#### Defined in

[src/engine/Execution.ts:30](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L30)

___

### instance

• **instance**: [`InstanceObject`](engine_Model.InstanceObject.md)

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[instance](../interfaces/interfaces_engine.IExecution.md#instance)

#### Defined in

[src/engine/Execution.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L26)

___

### isLocked

• **isLocked**: `boolean` = `false`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[isLocked](../interfaces/interfaces_engine.IExecution.md#islocked)

#### Defined in

[src/engine/Execution.ts:37](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L37)

___

### item

• **item**: `any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[item](../interfaces/interfaces_engine.IExecution.md#item)

#### Defined in

[src/engine/Execution.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L31)

___

### messageMatchingKey

• **messageMatchingKey**: `any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[messageMatchingKey](../interfaces/interfaces_engine.IExecution.md#messagematchingkey)

#### Defined in

[src/engine/Execution.ts:32](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L32)

___

### operation

• **operation**: `any`

#### Defined in

[src/engine/Execution.ts:39](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L39)

___

### options

• **options**: `any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[options](../interfaces/interfaces_engine.IExecution.md#options)

#### Defined in

[src/engine/Execution.ts:38](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L38)

___

### process

• **process**: [`Process`](elements_Process.Process.md)

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[process](../interfaces/interfaces_engine.IExecution.md#process)

#### Defined in

[src/engine/Execution.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L29)

___

### promises

• **promises**: `any`[] = `[]`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[promises](../interfaces/interfaces_engine.IExecution.md#promises)

#### Defined in

[src/engine/Execution.ts:35](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L35)

___

### server

• **server**: `any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[server](../interfaces/interfaces_engine.IExecution.md#server)

#### Inherited from

[ServerComponent](server_ServerComponent.ServerComponent.md).[server](server_ServerComponent.ServerComponent.md#server)

#### Defined in

[src/server/ServerComponent.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L9)

___

### servicesProvider

• **servicesProvider**: `any`

#### Defined in

[src/engine/Execution.ts:36](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L36)

___

### tokens

• **tokens**: `Map`\<`any`, `any`\>

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[tokens](../interfaces/interfaces_engine.IExecution.md#tokens)

#### Defined in

[src/engine/Execution.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L27)

___

### uids

• **uids**: `Object` = `{}`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[uids](../interfaces/interfaces_engine.IExecution.md#uids)

#### Defined in

[src/engine/Execution.ts:526](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L526)

___

### userName

• **userName**: `any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[userName](../interfaces/interfaces_engine.IExecution.md#username)

#### Defined in

[src/engine/Execution.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L34)

___

### worker

• **worker**: `any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[worker](../interfaces/interfaces_engine.IExecution.md#worker)

#### Defined in

[src/engine/Execution.ts:33](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L33)

## Accessors

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[appDelegate](../interfaces/interfaces_engine.IExecution.md#appdelegate)

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[src/server/ServerComponent.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L18)

___

### cache

• `get` **cache**(): [`CacheManager`](server_CacheManager.CacheManager.md)

#### Returns

[`CacheManager`](server_CacheManager.CacheManager.md)

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[cache](../interfaces/interfaces_engine.IExecution.md#cache)

#### Inherited from

ServerComponent.cache

#### Defined in

[src/server/ServerComponent.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L17)

___

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[configuration](../interfaces/interfaces_engine.IExecution.md#configuration)

#### Inherited from

ServerComponent.configuration

#### Defined in

[src/server/ServerComponent.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L14)

___

### cron

• `get` **cron**(): [`Cron`](server_Cron.Cron.md)

#### Returns

[`Cron`](server_Cron.Cron.md)

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[cron](../interfaces/interfaces_engine.IExecution.md#cron)

#### Inherited from

ServerComponent.cron

#### Defined in

[src/server/ServerComponent.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L16)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[dataStore](../interfaces/interfaces_engine.IExecution.md#datastore)

#### Inherited from

ServerComponent.dataStore

#### Defined in

[src/server/ServerComponent.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L20)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[definitions](../interfaces/interfaces_engine.IExecution.md#definitions)

#### Inherited from

ServerComponent.definitions

#### Defined in

[src/server/ServerComponent.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L21)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/interfaces_server.IEngine.md)

#### Returns

[`IEngine`](../interfaces/interfaces_server.IEngine.md)

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[engine](../interfaces/interfaces_engine.IExecution.md#engine)

#### Inherited from

ServerComponent.engine

#### Defined in

[src/server/ServerComponent.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L19)

___

### execution

• `get` **execution**(): `this`

#### Returns

`this`

#### Defined in

[src/engine/Execution.ts:44](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L44)

___

### id

• `get` **id**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[id](../interfaces/interfaces_engine.IExecution.md#id)

#### Defined in

[src/engine/Execution.ts:41](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L41)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[listener](../interfaces/interfaces_engine.IExecution.md#listener)

#### Overrides

ServerComponent.listener

#### Defined in

[src/engine/Execution.ts:52](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L52)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[logger](../interfaces/interfaces_engine.IExecution.md#logger)

#### Inherited from

ServerComponent.logger

#### Defined in

[src/server/ServerComponent.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L15)

___

### name

• `get` **name**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[name](../interfaces/interfaces_engine.IExecution.md#name)

#### Defined in

[src/engine/Execution.ts:42](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L42)

___

### status

• `get` **status**(): [`EXECUTION_STATUS`](../enums/interfaces_Enums.EXECUTION_STATUS.md)

#### Returns

[`EXECUTION_STATUS`](../enums/interfaces_Enums.EXECUTION_STATUS.md)

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[status](../interfaces/interfaces_engine.IExecution.md#status)

#### Defined in

[src/engine/Execution.ts:43](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L43)

## Methods

### addHistory

▸ **addHistory**(`inputData`, `assignment`, `item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputData` | `any` |
| `assignment` | `any` |
| `item` | `any` |

#### Returns

`void`

#### Defined in

[src/engine/Execution.ts:605](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L605)

___

### appendData

▸ **appendData**(`inputData`, `item`, `dataPath?`, `assignment?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `inputData` | `any` | `undefined` |
| `item` | `any` | `undefined` |
| `dataPath` | `any` | `null` |
| `assignment` | `any` | `null` |

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[appendData](../interfaces/interfaces_engine.IExecution.md#appenddata)

#### Defined in

[src/engine/Execution.ts:568](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L568)

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

[src/engine/Execution.ts:181](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L181)

___

### doExecutionEvent

▸ **doExecutionEvent**(`process`, `event`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `process` | `any` |
| `event` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[doExecutionEvent](../interfaces/interfaces_engine.IExecution.md#doexecutionevent)

#### Defined in

[src/engine/Execution.ts:542](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L542)

___

### doItemEvent

▸ **doItemEvent**(`item`, `event`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `event` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[doItemEvent](../interfaces/interfaces_engine.IExecution.md#doitemevent)

#### Defined in

[src/engine/Execution.ts:548](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L548)

___

### end

▸ **end**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[end](../interfaces/interfaces_engine.IExecution.md#end)

#### Defined in

[src/engine/Execution.ts:90](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L90)

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

[IExecution](../interfaces/interfaces_engine.IExecution.md).[error](../interfaces/interfaces_engine.IExecution.md#error)

#### Defined in

[src/engine/Execution.ts:559](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L559)

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

[IExecution](../interfaces/interfaces_engine.IExecution.md).[execute](../interfaces/interfaces_engine.IExecution.md#execute)

#### Defined in

[src/engine/Execution.ts:121](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L121)

___

### getAndCreateData

▸ **getAndCreateData**(`dataPath`, `asArray?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `dataPath` | `any` | `undefined` |
| `asArray` | `boolean` | `false` |

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[getAndCreateData](../interfaces/interfaces_engine.IExecution.md#getandcreatedata)

#### Defined in

[src/engine/Execution.ts:636](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L636)

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

[IExecution](../interfaces/interfaces_engine.IExecution.md).[getData](../interfaces/interfaces_engine.IExecution.md#getdata)

#### Defined in

[src/engine/Execution.ts:623](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L623)

___

### getItems

▸ **getItems**(): [`Item`](engine_Item.Item.md)[]

#### Returns

[`Item`](engine_Item.Item.md)[]

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[getItems](../interfaces/interfaces_engine.IExecution.md#getitems)

#### Defined in

[src/engine/Execution.ts:378](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L378)

___

### getItemsData

▸ **getItemsData**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[getItemsData](../interfaces/interfaces_engine.IExecution.md#getitemsdata)

#### Defined in

[src/engine/Execution.ts:389](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L389)

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

[IExecution](../interfaces/interfaces_engine.IExecution.md).[getNewId](../interfaces/interfaces_engine.IExecution.md#getnewid)

#### Defined in

[src/engine/Execution.ts:528](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L528)

___

### getNodeById

▸ **getNodeById**(`id`): [`Node`](elements_Node.Node.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

[`Node`](elements_Node.Node.md)

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[getNodeById](../interfaces/interfaces_engine.IExecution.md#getnodebyid)

#### Defined in

[src/engine/Execution.ts:76](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L76)

___

### getState

▸ **getState**(): [`IInstanceData`](../interfaces/interfaces_DataObjects.IInstanceData.md)

#### Returns

[`IInstanceData`](../interfaces/interfaces_DataObjects.IInstanceData.md)

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[getState](../interfaces/interfaces_engine.IExecution.md#getstate)

#### Defined in

[src/engine/Execution.ts:399](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L399)

___

### getToken

▸ **getToken**(`id`): [`Token`](engine_Token.Token.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

[`Token`](engine_Token.Token.md)

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[getToken](../interfaces/interfaces_engine.IExecution.md#gettoken)

#### Defined in

[src/engine/Execution.ts:79](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L79)

___

### getUUID

▸ **getUUID**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[getUUID](../interfaces/interfaces_engine.IExecution.md#getuuid)

#### Defined in

[src/engine/Execution.ts:535](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L535)

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

[IExecution](../interfaces/interfaces_engine.IExecution.md).[info](../interfaces/interfaces_engine.IExecution.md#info)

#### Defined in

[src/engine/Execution.ts:556](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L556)

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

[IExecution](../interfaces/interfaces_engine.IExecution.md).[log](../interfaces/interfaces_engine.IExecution.md#log)

#### Defined in

[src/engine/Execution.ts:553](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L553)

___

### report

▸ **report**(): `void`

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[report](../interfaces/interfaces_engine.IExecution.md#report)

#### Defined in

[src/engine/Execution.ts:498](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L498)

___

### restored

▸ **restored**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[restored](../interfaces/interfaces_engine.IExecution.md#restored)

#### Defined in

[src/engine/Execution.ts:485](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L485)

___

### resume

▸ **resume**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[resume](../interfaces/interfaces_engine.IExecution.md#resume)

#### Defined in

[src/engine/Execution.ts:492](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L492)

___

### save

▸ **save**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[save](../interfaces/interfaces_engine.IExecution.md#save)

#### Defined in

[src/engine/Execution.ts:365](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L365)

___

### signalEvent

▸ **signalEvent**(`executionId`, `inputData`, `options?`): `Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `executionId` | `any` |
| `inputData` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[signalEvent](../interfaces/interfaces_engine.IExecution.md#signalevent)

#### Defined in

[src/engine/Execution.ts:260](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L260)

___

### signalItem

▸ **signalItem**(`itemId`, `inputData`, `userName`, `options?`): `Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

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

`Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[signalItem](../interfaces/interfaces_engine.IExecution.md#signalitem)

#### Defined in

[src/engine/Execution.ts:218](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L218)

___

### signalRepeatTimerEvent

▸ **signalRepeatTimerEvent**(`executionId`, `prevItem`, `inputData`, `options?`): `Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `executionId` | `any` |
| `prevItem` | `any` |
| `inputData` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[signalRepeatTimerEvent](../interfaces/interfaces_engine.IExecution.md#signalrepeattimerevent)

#### Defined in

[src/engine/Execution.ts:335](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L335)

___

### stop

▸ **stop**(): `void`

causes the execution to stop from running any further

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[stop](../interfaces/interfaces_engine.IExecution.md#stop)

#### Defined in

[src/engine/Execution.ts:114](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L114)

___

### terminate

▸ **terminate**(): `void`

causes the execution to stop from running any further

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[terminate](../interfaces/interfaces_engine.IExecution.md#terminate)

#### Defined in

[src/engine/Execution.ts:104](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L104)

___

### tillDone

▸ **tillDone**(): `Promise`\<[`Execution`](engine_Execution.Execution.md)\>

#### Returns

`Promise`\<[`Execution`](engine_Execution.Execution.md)\>

#### Defined in

[src/engine/Execution.ts:46](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L46)

___

### tokenEnded

▸ **tokenEnded**(`token`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`Token`](engine_Token.Token.md) |

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/interfaces_engine.IExecution.md).[tokenEnded](../interfaces/interfaces_engine.IExecution.md#tokenended)

#### Defined in

[src/engine/Execution.ts:82](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L82)

___

### restore

▸ **restore**(`server`, `state`): `Promise`\<[`Execution`](engine_Execution.Execution.md)\>

re-enstate the execution from db

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `state` | [`IInstanceData`](../interfaces/interfaces_DataObjects.IInstanceData.md) |

#### Returns

`Promise`\<[`Execution`](engine_Execution.Execution.md)\>

#### Defined in

[src/engine/Execution.ts:425](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Execution.ts#L425)
