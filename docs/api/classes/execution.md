[bpmn-server](../README.md) › [Execution](execution.md)

# Class: Execution

is accessed two ways:
     execute - start process
     signal  - invoke a node (userTask, event, etc.)

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **Execution**

## Implements

* [IExecution](../interfaces/iexecution.md)

## Index

### Constructors

* [constructor](execution.md#constructor)

### Properties

* [currentUser](execution.md#currentuser)
* [definition](execution.md#definition)
* [errors](execution.md#errors)
* [input](execution.md#input)
* [instance](execution.md#instance)
* [item](execution.md#item)
* [messageMatchingKey](execution.md#messagematchingkey)
* [output](execution.md#output)
* [process](execution.md#process)
* [promises](execution.md#promises)
* [server](execution.md#server)
* [tokens](execution.md#tokens)
* [uids](execution.md#uids)
* [worker](execution.md#worker)

### Accessors

* [acl](execution.md#acl)
* [appDelegate](execution.md#appdelegate)
* [cache](execution.md#cache)
* [configuration](execution.md#configuration)
* [cron](execution.md#cron)
* [dataStore](execution.md#datastore)
* [definitions](execution.md#definitions)
* [engine](execution.md#engine)
* [execution](execution.md#execution)
* [iam](execution.md#iam)
* [id](execution.md#id)
* [listener](execution.md#listener)
* [logger](execution.md#logger)
* [name](execution.md#name)
* [status](execution.md#status)

### Methods

* [applyInput](execution.md#applyinput)
* [doExecutionEvent](execution.md#doexecutionevent)
* [doItemEvent](execution.md#doitemevent)
* [end](execution.md#end)
* [error](execution.md#error)
* [execute](execution.md#execute)
* [getAndCreateData](execution.md#getandcreatedata)
* [getData](execution.md#getdata)
* [getItems](execution.md#getitems)
* [getItemsData](execution.md#getitemsdata)
* [getNewId](execution.md#getnewid)
* [getNodeById](execution.md#getnodebyid)
* [getState](execution.md#getstate)
* [getToken](execution.md#gettoken)
* [getUUID](execution.md#getuuid)
* [log](execution.md#log)
* [report](execution.md#report)
* [restored](execution.md#restored)
* [resume](execution.md#resume)
* [signal](execution.md#signal)
* [stop](execution.md#stop)
* [terminate](execution.md#terminate)
* [tillDone](execution.md#tilldone)
* [tokenEnded](execution.md#tokenended)
* [restore](execution.md#static-restore)

## Constructors

###  constructor

\+ **new Execution**(`server`: any, `name`: string, `source`: any, `state`: any): *[Execution](execution.md)*

*Overrides [ServerComponent](servercomponent.md).[constructor](servercomponent.md#constructor)*

Defined in bpmnServer/src/engine/Execution.ts:73

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`server` | any | - | - |
`name` | string | - | process name |
`source` | any | - | bpmn source  |
`state` | any | null | - |

**Returns:** *[Execution](execution.md)*

## Properties

###  currentUser

• **currentUser**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[currentUser](../interfaces/iexecution.md#currentuser)*

Defined in bpmnServer/src/engine/Execution.ts:57

___

###  definition

• **definition**: *[IDefinition](../interfaces/idefinition.md)*

*Implementation of [IExecution](../interfaces/iexecution.md).[definition](../interfaces/iexecution.md#definition)*

Defined in bpmnServer/src/engine/Execution.ts:48

___

###  errors

• **errors**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[errors](../interfaces/iexecution.md#errors)*

Defined in bpmnServer/src/engine/Execution.ts:51

___

###  input

• **input**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[input](../interfaces/iexecution.md#input)*

Defined in bpmnServer/src/engine/Execution.ts:53

___

###  instance

• **instance**: *[InstanceObject](instanceobject.md)*

*Implementation of [IExecution](../interfaces/iexecution.md).[instance](../interfaces/iexecution.md#instance)*

Defined in bpmnServer/src/engine/Execution.ts:27

___

###  item

• **item**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[item](../interfaces/iexecution.md#item)*

Defined in bpmnServer/src/engine/Execution.ts:52

___

###  messageMatchingKey

• **messageMatchingKey**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[messageMatchingKey](../interfaces/iexecution.md#messagematchingkey)*

Defined in bpmnServer/src/engine/Execution.ts:55

___

###  output

• **output**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[output](../interfaces/iexecution.md#output)*

Defined in bpmnServer/src/engine/Execution.ts:54

___

###  process

• **process**: *[Process](process.md)*

*Implementation of [IExecution](../interfaces/iexecution.md).[process](../interfaces/iexecution.md#process)*

Defined in bpmnServer/src/engine/Execution.ts:49

___

###  promises

• **promises**: *any[]* = []

*Implementation of [IExecution](../interfaces/iexecution.md).[promises](../interfaces/iexecution.md#promises)*

Defined in bpmnServer/src/engine/Execution.ts:58

___

###  server

• **server**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[server](../interfaces/iexecution.md#server)*

*Inherited from [ServerComponent](servercomponent.md).[server](servercomponent.md#server)*

Defined in bpmnServer/src/server/ServerComponent.ts:9

___

###  tokens

• **tokens**: *Map‹any, any›* = new Map()

*Implementation of [IExecution](../interfaces/iexecution.md).[tokens](../interfaces/iexecution.md#tokens)*

Defined in bpmnServer/src/engine/Execution.ts:47

___

###  uids

• **uids**: *object*

*Implementation of [IExecution](../interfaces/iexecution.md).[uids](../interfaces/iexecution.md#uids)*

Defined in bpmnServer/src/engine/Execution.ts:425

#### Type declaration:

___

###  worker

• **worker**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[worker](../interfaces/iexecution.md#worker)*

Defined in bpmnServer/src/engine/Execution.ts:56

## Accessors

###  acl

• **get acl**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[acl](servercomponent.md#acl)*

Defined in bpmnServer/src/server/ServerComponent.ts:23

**Returns:** *any*

___

###  appDelegate

• **get appDelegate**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[appDelegate](servercomponent.md#appdelegate)*

Defined in bpmnServer/src/server/ServerComponent.ts:18

**Returns:** *any*

___

###  cache

• **get cache**(): *[CacheManager](cachemanager.md)*

*Inherited from [ServerComponent](servercomponent.md).[cache](servercomponent.md#cache)*

Defined in bpmnServer/src/server/ServerComponent.ts:17

**Returns:** *[CacheManager](cachemanager.md)*

___

###  configuration

• **get configuration**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[configuration](servercomponent.md#configuration)*

Defined in bpmnServer/src/server/ServerComponent.ts:14

**Returns:** *any*

___

###  cron

• **get cron**(): *[Cron](cron.md)*

*Inherited from [ServerComponent](servercomponent.md).[cron](servercomponent.md#cron)*

Defined in bpmnServer/src/server/ServerComponent.ts:16

**Returns:** *[Cron](cron.md)*

___

###  dataStore

• **get dataStore**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[dataStore](servercomponent.md#datastore)*

Defined in bpmnServer/src/server/ServerComponent.ts:20

**Returns:** *any*

___

###  definitions

• **get definitions**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[definitions](servercomponent.md#definitions)*

Defined in bpmnServer/src/server/ServerComponent.ts:21

**Returns:** *any*

___

###  engine

• **get engine**(): *[IEngine](../interfaces/iengine.md)*

*Inherited from [ServerComponent](servercomponent.md).[engine](servercomponent.md#engine)*

Defined in bpmnServer/src/server/ServerComponent.ts:19

**Returns:** *[IEngine](../interfaces/iengine.md)*

___

###  execution

• **get execution**(): *this*

Defined in bpmnServer/src/engine/Execution.ts:63

**Returns:** *this*

___

###  iam

• **get iam**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[iam](servercomponent.md#iam)*

Defined in bpmnServer/src/server/ServerComponent.ts:24

**Returns:** *any*

___

###  id

• **get id**(): *any*

Defined in bpmnServer/src/engine/Execution.ts:60

**Returns:** *any*

___

###  listener

• **get listener**(): *any*

*Overrides [ServerComponent](servercomponent.md).[listener](servercomponent.md#listener)*

Defined in bpmnServer/src/engine/Execution.ts:71

**Returns:** *any*

___

###  logger

• **get logger**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[logger](servercomponent.md#logger)*

Defined in bpmnServer/src/server/ServerComponent.ts:15

**Returns:** *any*

___

###  name

• **get name**(): *any*

Defined in bpmnServer/src/engine/Execution.ts:61

**Returns:** *any*

___

###  status

• **get status**(): *[EXECUTION_STATUS](../enums/execution_status.md)*

Defined in bpmnServer/src/engine/Execution.ts:62

**Returns:** *[EXECUTION_STATUS](../enums/execution_status.md)*

## Methods

###  applyInput

▸ **applyInput**(`inputData`: any, `dataPath`: any): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:464

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`inputData` | any | - |
`dataPath` | any | null |

**Returns:** *void*

___

###  doExecutionEvent

▸ **doExecutionEvent**(`process`: any, `event`: any): *Promise‹void›*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:441

**Parameters:**

Name | Type |
------ | ------ |
`process` | any |
`event` | any |

**Returns:** *Promise‹void›*

___

###  doItemEvent

▸ **doItemEvent**(`item`: any, `event`: any): *Promise‹void›*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:447

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`event` | any |

**Returns:** *Promise‹void›*

___

###  end

▸ **end**(): *Promise‹void›*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:111

**Returns:** *Promise‹void›*

___

###  error

▸ **error**(`msg`: any): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:456

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  execute

▸ **execute**(`startNodeId`: any, `inputData`: object, `options`: object): *Promise‹void›*

Defined in bpmnServer/src/engine/Execution.ts:141

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`startNodeId` | any | null |
`inputData` | object | {} |
`options` | object | {} |

**Returns:** *Promise‹void›*

___

###  getAndCreateData

▸ **getAndCreateData**(`dataPath`: any, `asArray`: boolean): *any*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:506

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dataPath` | any | - |
`asArray` | boolean | false |

**Returns:** *any*

___

###  getData

▸ **getData**(`dataPath`: any): *any*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:493

**Parameters:**

Name | Type |
------ | ------ |
`dataPath` | any |

**Returns:** *any*

___

###  getItems

▸ **getItems**(`query`: any): *[Item](item.md)[]*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:279

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`query` | any | null |

**Returns:** *[Item](item.md)[]*

___

###  getItemsData

▸ **getItemsData**(): *any[]*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:290

**Returns:** *any[]*

___

###  getNewId

▸ **getNewId**(`scope`: string): *number*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:427

**Parameters:**

Name | Type |
------ | ------ |
`scope` | string |

**Returns:** *number*

___

###  getNodeById

▸ **getNodeById**(`id`: any): *[Node](node.md)‹›*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:97

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

**Returns:** *[Node](node.md)‹›*

___

###  getState

▸ **getState**(): *[IInstanceData](../interfaces/iinstancedata.md)*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:300

**Returns:** *[IInstanceData](../interfaces/iinstancedata.md)*

___

###  getToken

▸ **getToken**(`id`: number): *[Token](token.md)*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:100

**Parameters:**

Name | Type |
------ | ------ |
`id` | number |

**Returns:** *[Token](token.md)*

___

###  getUUID

▸ **getUUID**(): *any*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:434

**Returns:** *any*

___

###  log

▸ **log**(`msg`: any): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:452

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  report

▸ **report**(): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:400

**Returns:** *void*

___

###  restored

▸ **restored**(): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:387

**Returns:** *void*

___

###  resume

▸ **resume**(): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:394

**Returns:** *void*

___

###  signal

▸ **signal**(`executionId`: any, `inputData`: any): *Promise‹void›*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:202

invoke scenarios:
     itemId
     elementId   - but only one is active
     elementId   - for a startEvent in a secondary process

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`executionId` | any | - |
`inputData` | any |    |

**Returns:** *Promise‹void›*

___

###  stop

▸ **stop**(): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:134

causes the execution to stop from running any further

**Returns:** *void*

___

###  terminate

▸ **terminate**(): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:124

causes the execution to stop from running any further

**Returns:** *void*

___

###  tillDone

▸ **tillDone**(): *Promise‹this›*

Defined in bpmnServer/src/engine/Execution.ts:65

**Returns:** *Promise‹this›*

___

###  tokenEnded

▸ **tokenEnded**(`token`: [Token](token.md)): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Execution.ts:103

**Parameters:**

Name | Type |
------ | ------ |
`token` | [Token](token.md) |

**Returns:** *void*

___

### `Static` restore

▸ **restore**(`server`: any, `state`: [IInstanceData](../interfaces/iinstancedata.md)): *Promise‹[Execution](execution.md)›*

Defined in bpmnServer/src/engine/Execution.ts:326

 re-enstate the execution from db

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`server` | any | - |
`state` | [IInstanceData](../interfaces/iinstancedata.md) |    |

**Returns:** *Promise‹[Execution](execution.md)›*
