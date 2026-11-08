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

[packages/bpmn-server/src/engine/Execution.ts:62](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L62)

## Properties

### instance

• **instance**: [`InstanceObject`](InstanceObject.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[instance](../interfaces/IExecution.md#instance)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L23)

___

### tokens

• **tokens**: `Map`\<`any`, `any`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[tokens](../interfaces/IExecution.md#tokens)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L24)

___

### definition

• **definition**: [`IDefinition`](../interfaces/IDefinition.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[definition](../interfaces/IExecution.md#definition)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L25)

___

### process

• **process**: [`Process`](Process.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[process](../interfaces/IExecution.md#process)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L26)

___

### errors

• **errors**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[errors](../interfaces/IExecution.md#errors)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:27](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L27)

___

### item

• **item**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[item](../interfaces/IExecution.md#item)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L28)

___

### messageMatchingKey

• **messageMatchingKey**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[messageMatchingKey](../interfaces/IExecution.md#messagematchingkey)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L29)

___

### worker

• **worker**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[worker](../interfaces/IExecution.md#worker)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L30)

___

### userName

• **userName**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[userName](../interfaces/IExecution.md#username)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:31](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L31)

___

### promises

• **promises**: `any`[] = `[]`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[promises](../interfaces/IExecution.md#promises)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L32)

___

### servicesProvider

• **servicesProvider**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:33](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L33)

___

### isLocked

• **isLocked**: `boolean` = `false`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[isLocked](../interfaces/IExecution.md#islocked)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L34)

___

### options

• **options**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[options](../interfaces/IExecution.md#options)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L35)

___

### operation

• **operation**: `any`

What the call running it does: `start`, `signal`, `assign`, `cancel`, …

#### Implementation of

[IExecution](../interfaces/IExecution.md).[operation](../interfaces/IExecution.md#operation)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:36](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L36)

___

### svg

• **svg**: `string`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L37)

___

### action

• **action**: [`NODE_ACTION`](../enums/NODE_ACTION.md) = `NODE_ACTION.stop`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[action](../interfaces/IExecution.md#action)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:44](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L44)

___

### uids

• **uids**: `Object` = `{}`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[uids](../interfaces/IExecution.md#uids)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:748](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L748)

___

### server

• **server**: `any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[server](../interfaces/IExecution.md#server)

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:10](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L10)

## Accessors

### id

• `get` **id**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[id](../interfaces/IExecution.md#id)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:39](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L39)

___

### name

• `get` **name**(): `any`

#### Returns

`any`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[name](../interfaces/IExecution.md#name)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:40](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L40)

___

### status

• `get` **status**(): [`EXECUTION_STATUS`](../enums/EXECUTION_STATUS.md)

#### Returns

[`EXECUTION_STATUS`](../enums/EXECUTION_STATUS.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[status](../interfaces/IExecution.md#status)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:41](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L41)

___

### execution

• `get` **execution**(): `this`

#### Returns

`this`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:42](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L42)

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

[packages/bpmn-server/src/engine/Execution.ts:52](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L52)

___

### keepLogs

• `get` **keepLogs**(): `boolean`

The instance keeps its log lines only when they are saved (its flags.saveLogs, else dataStore.saveLogs, the default).

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:780](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L780)

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

[packages/bpmn-server/src/server/ServerComponent.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L15)

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

[packages/bpmn-server/src/server/ServerComponent.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L16)

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

[packages/bpmn-server/src/server/ServerComponent.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L17)

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

[packages/bpmn-server/src/server/ServerComponent.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L18)

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

[packages/bpmn-server/src/server/ServerComponent.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L19)

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

[packages/bpmn-server/src/server/ServerComponent.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L20)

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

#### Implementation of

[IExecution](../interfaces/IExecution.md).[definitions](../interfaces/IExecution.md#definitions)

#### Inherited from

ServerComponent.definitions

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L24)

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

[packages/bpmn-server/src/server/ServerComponent.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L26)

## Methods

### tillDone

▸ **tillDone**(): `Promise`\<[`Execution`](Execution.md)\>

#### Returns

`Promise`\<[`Execution`](Execution.md)\>

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:46](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L46)

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

[packages/bpmn-server/src/engine/Execution.ts:76](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L76)

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

[packages/bpmn-server/src/engine/Execution.ts:79](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L79)

___

### checkEnd

▸ **checkEnd**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:82](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L82)

___

### end

▸ **end**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[end](../interfaces/IExecution.md#end)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:95](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L95)

___

### terminate

▸ **terminate**(): `void`

causes the execution to stop from running any further

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[terminate](../interfaces/IExecution.md#terminate)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:109](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L109)

___

### stop

▸ **stop**(): `void`

causes the execution to stop from running any further

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[stop](../interfaces/IExecution.md#stop)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:119](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L119)

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

[packages/bpmn-server/src/engine/Execution.ts:126](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L126)

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

[packages/bpmn-server/src/engine/Execution.ts:198](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L198)

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

[packages/bpmn-server/src/engine/Execution.ts:235](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L235)

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

[packages/bpmn-server/src/engine/Execution.ts:299](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L299)

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

[packages/bpmn-server/src/engine/Execution.ts:348](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L348)

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

[packages/bpmn-server/src/engine/Execution.ts:370](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L370)

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

[packages/bpmn-server/src/engine/Execution.ts:395](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L395)

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

[packages/bpmn-server/src/engine/Execution.ts:487](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L487)

___

### save

▸ **save**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[save](../interfaces/IExecution.md#save)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:520](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L520)

___

### getItems

▸ **getItems**(): [`Item`](Item.md)[]

#### Returns

[`Item`](Item.md)[]

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getItems](../interfaces/IExecution.md#getitems)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:536](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L536)

___

### getItemsData

▸ **getItemsData**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getItemsData](../interfaces/IExecution.md#getitemsdata)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:547](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L547)

___

### getState

▸ **getState**(): [`IInstanceData`](../interfaces/IInstanceData.md)

#### Returns

[`IInstanceData`](../interfaces/IInstanceData.md)

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getState](../interfaces/IExecution.md#getstate)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:557](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L557)

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

[packages/bpmn-server/src/engine/Execution.ts:581](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L581)

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

[packages/bpmn-server/src/engine/Execution.ts:601](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L601)

___

### restored

▸ **restored**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[restored](../interfaces/IExecution.md#restored)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:686](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L686)

___

### resume

▸ **resume**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[resume](../interfaces/IExecution.md#resume)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:693](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L693)

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

[packages/bpmn-server/src/engine/Execution.ts:698](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L698)

___

### report

▸ **report**(): `void`

#### Returns

`void`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[report](../interfaces/IExecution.md#report)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:716](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L716)

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

[packages/bpmn-server/src/engine/Execution.ts:740](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L740)

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

[packages/bpmn-server/src/engine/Execution.ts:751](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L751)

___

### getUUID

▸ **getUUID**(): `string`

#### Returns

`string`

#### Implementation of

[IExecution](../interfaces/IExecution.md).[getUUID](../interfaces/IExecution.md#getuuid)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:758](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L758)

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

[packages/bpmn-server/src/engine/Execution.ts:763](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L763)

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

[packages/bpmn-server/src/engine/Execution.ts:768](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L768)

___

### dispatch

▸ **dispatch**(`event`, `eventDetails`): `Promise`\<`any`\>

The server's listeners, then its lifecycle subscribers (server/Listener.ts); a plain emitter only emits.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `any` |
| `eventDetails` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:773](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L773)

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

[packages/bpmn-server/src/engine/Execution.ts:783](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L783)

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

[packages/bpmn-server/src/engine/Execution.ts:786](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L786)

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

[packages/bpmn-server/src/engine/Execution.ts:789](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L789)

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

[packages/bpmn-server/src/engine/Execution.ts:792](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L792)

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

[packages/bpmn-server/src/engine/Execution.ts:795](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L795)

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

[packages/bpmn-server/src/engine/Execution.ts:802](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L802)

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

[packages/bpmn-server/src/engine/Execution.ts:810](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L810)

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

[packages/bpmn-server/src/engine/Execution.ts:815](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L815)

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

[packages/bpmn-server/src/engine/Execution.ts:820](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L820)

___

### processQueue

▸ **processQueue**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IExecution](../interfaces/IExecution.md).[processQueue](../interfaces/IExecution.md#processqueue)

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:825](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L825)
