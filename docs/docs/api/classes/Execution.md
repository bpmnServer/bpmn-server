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
- [svg](Execution.md#svg)
- [action](Execution.md#action)
- [uids](Execution.md#uids)
- [statusBefore](Execution.md#statusbefore)
- [server](Execution.md#server)

### Accessors

- [id](Execution.md#id)
- [name](Execution.md#name)
- [status](Execution.md#status)
- [execution](Execution.md#execution)
- [listener](Execution.md#listener)
- [keepLogs](Execution.md#keeplogs)
- [configuration](Execution.md#configuration)
- [logger](Execution.md#logger)
- [cron](Execution.md#cron)
- [cache](Execution.md#cache)
- [appDelegate](Execution.md#appdelegate)
- [engine](Execution.md#engine)
- [dataStore](Execution.md#datastore)
- [lockManager](Execution.md#lockmanager)
- [definitions](Execution.md#definitions)
- [scriptHandler](Execution.md#scripthandler)

### Methods

- [tillDone](Execution.md#tilldone)
- [getNodeById](Execution.md#getnodebyid)
- [getToken](Execution.md#gettoken)
- [checkEnd](Execution.md#checkend)
- [end](Execution.md#end)
- [terminate](Execution.md#terminate)
- [stop](Execution.md#stop)
- [execute](Execution.md#execute)
- [assign](Execution.md#assign)
- [assignItem](Execution.md#assignitem)
- [signalItem](Execution.md#signalitem)
- [signalItem2](Execution.md#signalitem2)
- [retry](Execution.md#retry)
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
- [reportToken](Execution.md#reporttoken)
- [report](Execution.md#report)
- [formatDate](Execution.md#formatdate)
- [getNewId](Execution.md#getnewid)
- [getUUID](Execution.md#getuuid)
- [doExecutionEvent](Execution.md#doexecutionevent)
- [doItemEvent](Execution.md#doitemevent)
- [dispatch](Execution.md#dispatch)
- [operationBegins](Execution.md#operationbegins)
- [logOutcome](Execution.md#logoutcome)
- [receivedRow](Execution.md#receivedrow)
- [record](Execution.md#record)
- [log](Execution.md#log)
- [logS](Execution.md#logs)
- [logE](Execution.md#loge)
- [info](Execution.md#info)
- [decision](Execution.md#decision)
- [error](Execution.md#error)
- [appendData](Execution.md#appenddata)
- [getData](Execution.md#getdata)
- [processQueue](Execution.md#processqueue)

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

[packages/bpmn-server/src/engine/Execution.ts:72](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L72)

## Properties

### instance

• **instance**: [`InstanceObject`](InstanceObject.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[instance](../interfaces/IExecution.md#instance)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:33](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L33)

___

### tokens

• **tokens**: `Map`\<`any`, `any`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[tokens](../interfaces/IExecution.md#tokens)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:34](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L34)

___

### definition

• **definition**: [`IDefinition`](../interfaces/IDefinition.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[definition](../interfaces/IExecution.md#definition)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:35](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L35)

___

### process

• **process**: [`Process`](Process.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[process](../interfaces/IExecution.md#process)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:36](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L36)

___

### errors

• **errors**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[errors](../interfaces/IExecution.md#errors)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:37](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L37)

___

### item

• **item**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[item](../interfaces/IExecution.md#item)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:38](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L38)

___

### messageMatchingKey

• **messageMatchingKey**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[messageMatchingKey](../interfaces/IExecution.md#messagematchingkey)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:39](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L39)

___

### worker

• **worker**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[worker](../interfaces/IExecution.md#worker)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:40](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L40)

___

### userName

• **userName**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[userName](../interfaces/IExecution.md#username)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:41](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L41)

___

### promises

• **promises**: `any`[] = `[]`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[promises](../interfaces/IExecution.md#promises)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:42](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L42)

___

### servicesProvider

• **servicesProvider**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:43](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L43)

___

### isLocked

• **isLocked**: `boolean` = `false`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[isLocked](../interfaces/IExecution.md#islocked)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:44](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L44)

___

### options

• **options**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[options](../interfaces/IExecution.md#options)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:45](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L45)

___

### operation

• **operation**: `any`

What the call running it does: `start`, `signal`, `assign`, `cancel`, …

#### Implementation of

[IExecution](../interfaces/IExecution.md).[operation](../interfaces/IExecution.md#operation)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:46](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L46)

___

### svg

• **svg**: `string`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:47](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L47)

___

### action

• **action**: [`NODE_ACTION`](../enums/NODE_ACTION.md) = `NODE_ACTION.stop`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[action](../interfaces/IExecution.md#action)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:54](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L54)

___

### uids

• **uids**: `Object` = `{}`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[uids](../interfaces/IExecution.md#uids)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:788](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L788)

___

### statusBefore

• `Private` **statusBefore**: `Map`\<`string`, `string`\>

The items' status when an operation began: what it changed is its outcome (logOutcome).

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:829](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L829)

___

### server

• **server**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[server](../interfaces/IExecution.md#server)

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:10](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/ServerComponent.ts#L10)

## Accessors

### id

• `get` **id**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[id](../interfaces/IExecution.md#id)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:49](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L49)

___

### name

• `get` **name**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[name](../interfaces/IExecution.md#name)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:50](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L50)

___

### status

• `get` **status**(): [`EXECUTION_STATUS`](../enums/EXECUTION_STATUS.md)

#### Returns

[`EXECUTION_STATUS`](../enums/EXECUTION_STATUS.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[status](../interfaces/IExecution.md#status)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:51](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L51)

___

### execution

• `get` **execution**(): `this`

#### Returns

`this`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:52](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L52)

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

[packages/bpmn-server/src/engine/Execution.ts:62](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L62)

___

### keepLogs

• `get` **keepLogs**(): `boolean`

The instance keeps its log lines only when they are saved (its flags.saveLogs, else dataStore.saveLogs, the default).

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:825](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L825)

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

[packages/bpmn-server/src/server/ServerComponent.ts:15](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/ServerComponent.ts#L15)

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

[packages/bpmn-server/src/server/ServerComponent.ts:16](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/ServerComponent.ts#L16)

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

[packages/bpmn-server/src/server/ServerComponent.ts:17](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/ServerComponent.ts#L17)

___

### cache

• `get` **cache**(): [`ICacheManager`](../interfaces/ICacheManager.md)

#### Returns

[`ICacheManager`](../interfaces/ICacheManager.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[cache](../interfaces/IExecution.md#cache)

#### Inherited from

ServerComponent.cache

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/ServerComponent.ts#L18)

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

[packages/bpmn-server/src/server/ServerComponent.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/ServerComponent.ts#L19)

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

[packages/bpmn-server/src/server/ServerComponent.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/ServerComponent.ts#L20)

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

[packages/bpmn-server/src/server/ServerComponent.ts:21](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/ServerComponent.ts#L21)

___

### lockManager

• `get` **lockManager**(): `any`

The lock port: the configuration's, else the data store's.

#### Returns

`any`

#### Inherited from

ServerComponent.lockManager

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:23](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/ServerComponent.ts#L23)

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

[packages/bpmn-server/src/server/ServerComponent.ts:24](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/ServerComponent.ts#L24)

___

### scriptHandler

• `get` **scriptHandler**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[scriptHandler](../interfaces/IExecution.md#scripthandler)

#### Inherited from

ServerComponent.scriptHandler

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:26](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/ServerComponent.ts#L26)

## Methods

### tillDone

▸ **tillDone**(): `Promise`\<[`Execution`](Execution.md)\>

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:56](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L56)

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

[packages/bpmn-server/src/engine/Execution.ts:86](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L86)

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

[packages/bpmn-server/src/engine/Execution.ts:89](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L89)

___

### checkEnd

▸ **checkEnd**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:92](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L92)

___

### end

▸ **end**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[end](../interfaces/IExecution.md#end)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:105](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L105)

___

### terminate

▸ **terminate**(): `void`

causes the execution to stop from running any further

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[terminate](../interfaces/IExecution.md#terminate)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:119](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L119)

___

### stop

▸ **stop**(): `void`

causes the execution to stop from running any further

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[stop](../interfaces/IExecution.md#stop)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:129](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L129)

___

### execute

▸ **execute**(`startNodeId?`, `inputData?`, `options?`, `userName?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `startNodeId` | `any` | `null` |
| `inputData` | `Object` | `{}` |
| `options` | `Object` | `{}` |
| `userName` | `any` | `null` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[execute](../interfaces/IExecution.md#execute)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:136](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L136)

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

[packages/bpmn-server/src/engine/Execution.ts:210](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L210)

___

### assignItem

▸ **assignItem**(`item`, `changes`, `why?`, `by?`): `Promise`\<`void`\>

Who works on a task, changed: the one step for every change, a person's (assign, a claim) or an add-on's as the
task starts (an assignment policy). Sets the fields given, records what decided it (`item.assignment`, when `why`
is given), and fires `assign`, its details: `before` (who worked on it), `assignment` (the fields given), `why`,
`previous` (what had decided it), `changed` (whether who works on it changed), `by` (the person; none for an
add-on's as the task starts).

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |
| `changes` | `Record`\<`string`, `any`\> |
| `why?` | `Record`\<`string`, `any`\> |
| `by?` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:248](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L248)

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

[packages/bpmn-server/src/engine/Execution.ts:267](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L267)

___

### signalItem2

▸ **signalItem2**(`itemId`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemId` | `any` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:333](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L333)

___

### retry

▸ **retry**(`itemId`, `userName?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

Runs a failed item's work again (an item whose status is `error`), and on from it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemId` | `any` |
| `userName?` | `string` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:382](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L382)

___

### restart

▸ **restart**(`itemId`, `inputData`, `userName`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

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

[packages/bpmn-server/src/engine/Execution.ts:404](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L404)

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

[packages/bpmn-server/src/engine/Execution.ts:429](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L429)

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

[packages/bpmn-server/src/engine/Execution.ts:521](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L521)

___

### save

▸ **save**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[save](../interfaces/IExecution.md#save)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:554](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L554)

___

### getItems

▸ **getItems**(): [`Item`](Item.md)[]

#### Returns

[`Item`](Item.md)[]

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getItems](../interfaces/IExecution.md#getitems)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:571](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L571)

___

### getItemsData

▸ **getItemsData**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getItemsData](../interfaces/IExecution.md#getitemsdata)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:587](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L587)

___

### getState

▸ **getState**(): [`IInstanceData`](../interfaces/IInstanceData.md)

#### Returns

[`IInstanceData`](../interfaces/IInstanceData.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getState](../interfaces/IExecution.md#getstate)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:597](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L597)

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

[packages/bpmn-server/src/engine/Execution.ts:621](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L621)

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

[packages/bpmn-server/src/engine/Execution.ts:641](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L641)

___

### restored

▸ **restored**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[restored](../interfaces/IExecution.md#restored)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:726](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L726)

___

### resume

▸ **resume**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[resume](../interfaces/IExecution.md#resume)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:733](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L733)

___

### reportToken

▸ **reportToken**(`token`, `level`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`Token`](Token.md) |
| `level` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:738](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L738)

___

### report

▸ **report**(): `void`

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[report](../interfaces/IExecution.md#report)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:756](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L756)

___

### formatDate

▸ **formatDate**(`date`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `any` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:780](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L780)

___

### getNewId

▸ **getNewId**(`scope`): `number`

The next id of a scope; items are numbered from 1 (their seq), tokens and loops from 0.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `string` |

#### Returns

`number`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getNewId](../interfaces/IExecution.md#getnewid)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:791](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L791)

___

### getUUID

▸ **getUUID**(): `string`

#### Returns

`string`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getUUID](../interfaces/IExecution.md#getuuid)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:798](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L798)

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

[packages/bpmn-server/src/engine/Execution.ts:803](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L803)

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

[packages/bpmn-server/src/engine/Execution.ts:808](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L808)

___

### dispatch

▸ **dispatch**(`event`, `eventDetails`, `item`): `Promise`\<`any`\>

The server's listeners, then its lifecycle subscribers (server/Listener.ts); a plain emitter only emits. They are
handed the event's context (docs/design/context-object.md): its item's, fixed for it, or the process's.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `any` |
| `eventDetails` | `any` |
| `item` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:816](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L816)

___

### operationBegins

▸ **operationBegins**(`entry`): `void`

Logs the entry that opens an operation ({"type":"execution",...}), and notes the items' status as it begins.

#### Parameters

| Name | Type |
| :------ | :------ |
| `entry` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:831](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L831)

___

### logOutcome

▸ **logOutcome**(): `void`

The outcome of what ran since the operation began, or since the last save: the instance's status, the items whose
status changed, and the items that wait. {"type":"outcome",...}: the Rationale and the Test tab read it as it is.

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:839](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L839)

___

### receivedRow

▸ **receivedRow**(`options`, `elementId`, `elementName`, `seq`, `verb`): `void`

The receiver's row of a thrown message or signal (options.thrown: { kind, name, key, from }): from whom it came.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `any` |
| `elementId` | `string` |
| `elementName` | `string` |
| `seq` | `number` |
| `verb` | `string` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:848](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L848)

___

### record

▸ **record**(`entry`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entry` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:856](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L856)

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

[packages/bpmn-server/src/engine/Execution.ts:859](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L859)

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

[packages/bpmn-server/src/engine/Execution.ts:862](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L862)

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

[packages/bpmn-server/src/engine/Execution.ts:865](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L865)

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

[packages/bpmn-server/src/engine/Execution.ts:868](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L868)

___

### decision

▸ **decision**(`...msg`): `void`

Why the engine took a path: kept in the instance's log, as a 'decision' entry. A decision object is written as a block
(seq and element, action, why); the entry also keeps its seq, element and action.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any`[] |

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[decision](../interfaces/IExecution.md#decision)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:875](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L875)

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

[packages/bpmn-server/src/engine/Execution.ts:883](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L883)

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

[packages/bpmn-server/src/engine/Execution.ts:888](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L888)

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

[packages/bpmn-server/src/engine/Execution.ts:893](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L893)

___

### processQueue

▸ **processQueue**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[processQueue](../interfaces/IExecution.md#processqueue)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:898](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L898)
