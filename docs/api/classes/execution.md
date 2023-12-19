[bpmn-server](../README.md) / Execution

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

- [definition](Execution.md#definition)
- [errors](Execution.md#errors)
- [instance](Execution.md#instance)
- [isLocked](Execution.md#islocked)
- [item](Execution.md#item)
- [messageMatchingKey](Execution.md#messagematchingkey)
- [operation](Execution.md#operation)
- [options](Execution.md#options)
- [process](Execution.md#process)
- [promises](Execution.md#promises)
- [server](Execution.md#server)
- [servicesProvider](Execution.md#servicesprovider)
- [tokens](Execution.md#tokens)
- [uids](Execution.md#uids)
- [userName](Execution.md#username)
- [worker](Execution.md#worker)

### Accessors

- [appDelegate](Execution.md#appdelegate)
- [cache](Execution.md#cache)
- [configuration](Execution.md#configuration)
- [cron](Execution.md#cron)
- [dataStore](Execution.md#datastore)
- [definitions](Execution.md#definitions)
- [engine](Execution.md#engine)
- [execution](Execution.md#execution)
- [id](Execution.md#id)
- [listener](Execution.md#listener)
- [logger](Execution.md#logger)
- [name](Execution.md#name)
- [status](Execution.md#status)

### Methods

- [addHistory](Execution.md#addhistory)
- [appendData](Execution.md#appenddata)
- [assign](Execution.md#assign)
- [doExecutionEvent](Execution.md#doexecutionevent)
- [doItemEvent](Execution.md#doitemevent)
- [end](Execution.md#end)
- [error](Execution.md#error)
- [execute](Execution.md#execute)
- [getAndCreateData](Execution.md#getandcreatedata)
- [getData](Execution.md#getdata)
- [getItems](Execution.md#getitems)
- [getItemsData](Execution.md#getitemsdata)
- [getNewId](Execution.md#getnewid)
- [getNodeById](Execution.md#getnodebyid)
- [getState](Execution.md#getstate)
- [getToken](Execution.md#gettoken)
- [getUUID](Execution.md#getuuid)
- [info](Execution.md#info)
- [log](Execution.md#log)
- [report](Execution.md#report)
- [restored](Execution.md#restored)
- [resume](Execution.md#resume)
- [save](Execution.md#save)
- [signalEvent](Execution.md#signalevent)
- [signalItem](Execution.md#signalitem)
- [signalRepeatTimerEvent](Execution.md#signalrepeattimerevent)
- [stop](Execution.md#stop)
- [terminate](Execution.md#terminate)
- [tillDone](Execution.md#tilldone)
- [tokenEnded](Execution.md#tokenended)
- [restore](Execution.md#restore)

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

[engine/Execution.ts:62](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-62)

## Properties

### definition

• **definition**: [`IDefinition`](../interfaces/IDefinition.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[definition](../interfaces/IExecution.md#definition)

#### Defined in

[engine/Execution.ts:28](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-28)

___

### errors

• **errors**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[errors](../interfaces/IExecution.md#errors)

#### Defined in

[engine/Execution.ts:30](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-30)

___

### instance

• **instance**: [`InstanceObject`](InstanceObject.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[instance](../interfaces/IExecution.md#instance)

#### Defined in

[engine/Execution.ts:26](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-26)

___

### isLocked

• **isLocked**: `boolean` = `false`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[isLocked](../interfaces/IExecution.md#islocked)

#### Defined in

[engine/Execution.ts:37](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-37)

___

### item

• **item**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[item](../interfaces/IExecution.md#item)

#### Defined in

[engine/Execution.ts:31](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-31)

___

### messageMatchingKey

• **messageMatchingKey**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[messageMatchingKey](../interfaces/IExecution.md#messagematchingkey)

#### Defined in

[engine/Execution.ts:32](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-32)

___

### operation

• **operation**: `any`

#### Defined in

[engine/Execution.ts:39](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-39)

___

### options

• **options**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[options](../interfaces/IExecution.md#options)

#### Defined in

[engine/Execution.ts:38](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-38)

___

### process

• **process**: [`Process`](Process.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[process](../interfaces/IExecution.md#process)

#### Defined in

[engine/Execution.ts:29](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-29)

___

### promises

• **promises**: `any`[] = `[]`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[promises](../interfaces/IExecution.md#promises)

#### Defined in

[engine/Execution.ts:35](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-35)

___

### server

• **server**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[server](../interfaces/IExecution.md#server)

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[server/ServerComponent.ts:9](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-9)

___

### servicesProvider

• **servicesProvider**: `any`

#### Defined in

[engine/Execution.ts:36](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-36)

___

### tokens

• **tokens**: `Map`\<`any`, `any`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[tokens](../interfaces/IExecution.md#tokens)

#### Defined in

[engine/Execution.ts:27](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-27)

___

### uids

• **uids**: `Object` = `{}`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[uids](../interfaces/IExecution.md#uids)

#### Defined in

[engine/Execution.ts:526](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-526)

___

### userName

• **userName**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[userName](../interfaces/IExecution.md#username)

#### Defined in

[engine/Execution.ts:34](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-34)

___

### worker

• **worker**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[worker](../interfaces/IExecution.md#worker)

#### Defined in

[engine/Execution.ts:33](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-33)

## Accessors

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[appDelegate](../interfaces/IExecution.md#appdelegate)

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[server/ServerComponent.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-18)

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

[server/ServerComponent.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-17)

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

[server/ServerComponent.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-14)

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

[server/ServerComponent.ts:16](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-16)

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

[server/ServerComponent.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-20)

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

[server/ServerComponent.ts:21](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-21)

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

[server/ServerComponent.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-19)

___

### execution

• `get` **execution**(): `this`

#### Returns

`this`

#### Defined in

[engine/Execution.ts:44](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-44)

___

### id

• `get` **id**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[id](../interfaces/IExecution.md#id)

#### Defined in

[engine/Execution.ts:41](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-41)

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

[engine/Execution.ts:52](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-52)

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

[server/ServerComponent.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-15)

___

### name

• `get` **name**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[name](../interfaces/IExecution.md#name)

#### Defined in

[engine/Execution.ts:42](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-42)

___

### status

• `get` **status**(): [`EXECUTION_STATUS`](../enums/EXECUTION_STATUS.md)

#### Returns

[`EXECUTION_STATUS`](../enums/EXECUTION_STATUS.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[status](../interfaces/IExecution.md#status)

#### Defined in

[engine/Execution.ts:43](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-43)

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

[engine/Execution.ts:605](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-605)

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

[IExecution](../interfaces/IExecution.md).[appendData](../interfaces/IExecution.md#appenddata)

#### Defined in

[engine/Execution.ts:568](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-568)

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

[engine/Execution.ts:181](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-181)

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

[IExecution](../interfaces/IExecution.md).[doExecutionEvent](../interfaces/IExecution.md#doexecutionevent)

#### Defined in

[engine/Execution.ts:542](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-542)

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

[IExecution](../interfaces/IExecution.md).[doItemEvent](../interfaces/IExecution.md#doitemevent)

#### Defined in

[engine/Execution.ts:548](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-548)

___

### end

▸ **end**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[end](../interfaces/IExecution.md#end)

#### Defined in

[engine/Execution.ts:90](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-90)

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

[engine/Execution.ts:559](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-559)

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

[engine/Execution.ts:121](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-121)

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

[IExecution](../interfaces/IExecution.md).[getAndCreateData](../interfaces/IExecution.md#getandcreatedata)

#### Defined in

[engine/Execution.ts:636](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-636)

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

[engine/Execution.ts:623](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-623)

___

### getItems

▸ **getItems**(): [`Item`](Item.md)[]

#### Returns

[`Item`](Item.md)[]

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getItems](../interfaces/IExecution.md#getitems)

#### Defined in

[engine/Execution.ts:378](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-378)

___

### getItemsData

▸ **getItemsData**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getItemsData](../interfaces/IExecution.md#getitemsdata)

#### Defined in

[engine/Execution.ts:389](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-389)

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

[engine/Execution.ts:528](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-528)

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

[engine/Execution.ts:76](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-76)

___

### getState

▸ **getState**(): [`IInstanceData`](../interfaces/IInstanceData.md)

#### Returns

[`IInstanceData`](../interfaces/IInstanceData.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getState](../interfaces/IExecution.md#getstate)

#### Defined in

[engine/Execution.ts:399](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-399)

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

[engine/Execution.ts:79](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-79)

___

### getUUID

▸ **getUUID**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getUUID](../interfaces/IExecution.md#getuuid)

#### Defined in

[engine/Execution.ts:535](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-535)

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

[engine/Execution.ts:556](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-556)

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

[engine/Execution.ts:553](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-553)

___

### report

▸ **report**(): `void`

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[report](../interfaces/IExecution.md#report)

#### Defined in

[engine/Execution.ts:498](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-498)

___

### restored

▸ **restored**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[restored](../interfaces/IExecution.md#restored)

#### Defined in

[engine/Execution.ts:485](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-485)

___

### resume

▸ **resume**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[resume](../interfaces/IExecution.md#resume)

#### Defined in

[engine/Execution.ts:492](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-492)

___

### save

▸ **save**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[save](../interfaces/IExecution.md#save)

#### Defined in

[engine/Execution.ts:365](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-365)

___

### signalEvent

▸ **signalEvent**(`executionId`, `inputData`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `executionId` | `any` |
| `inputData` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[signalEvent](../interfaces/IExecution.md#signalevent)

#### Defined in

[engine/Execution.ts:260](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-260)

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

[engine/Execution.ts:218](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-218)

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

[engine/Execution.ts:335](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-335)

___

### stop

▸ **stop**(): `void`

causes the execution to stop from running any further

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[stop](../interfaces/IExecution.md#stop)

#### Defined in

[engine/Execution.ts:114](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-114)

___

### terminate

▸ **terminate**(): `void`

causes the execution to stop from running any further

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[terminate](../interfaces/IExecution.md#terminate)

#### Defined in

[engine/Execution.ts:104](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-104)

___

### tillDone

▸ **tillDone**(): `Promise`\<[`Execution`](Execution.md)\>

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Defined in

[engine/Execution.ts:46](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-46)

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

[engine/Execution.ts:82](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-82)

___

### restore

▸ **restore**(`server`, `state`): `Promise`\<[`Execution`](Execution.md)\>

re-enstate the execution from db

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `state` | [`IInstanceData`](../interfaces/IInstanceData.md) |

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Defined in

[engine/Execution.ts:425](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Execution.ts#lines-425)
