[bpmn-server](../README.md) › [Execution](execution.md)

# Class: Execution

is accessed two ways:
     execute - start process
     signal  - invoke a node (userTask, event, etc.)

## Hierarchy

* **Execution**

## Implements

* [IExecution](../interfaces/iexecution.md)

## Index

### Constructors

* [constructor](execution.md#constructor)

### Properties

* [appDelegate](execution.md#appdelegate)
* [data](execution.md#data)
* [definition](execution.md#definition)
* [endedAt](execution.md#endedat)
* [executionContext](execution.md#executioncontext)
* [id](execution.md#id)
* [listener](execution.md#listener)
* [logger](execution.md#logger)
* [logs](execution.md#logs)
* [name](execution.md#name)
* [parentNodeId](execution.md#parentnodeid)
* [promises](execution.md#promises)
* [saved](execution.md#saved)
* [source](execution.md#source)
* [startedAt](execution.md#startedat)
* [status](execution.md#status)
* [tokens](execution.md#tokens)
* [uids](execution.md#uids)

### Methods

* [applyInput](execution.md#applyinput)
* [doExecutionEvent](execution.md#doexecutionevent)
* [doItemEvent](execution.md#doitemevent)
* [doTokenEvent](execution.md#dotokenevent)
* [end](execution.md#end)
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
* [tokenEnded](execution.md#tokenended)
* [restore](execution.md#static-restore)

## Constructors

###  constructor

\+ **new Execution**(`name`: string, `source`: any, `executionContext`: [ExecutionContext](executioncontext.md)): *[Execution](execution.md)*

Defined in src/engine/Execution.ts:42

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | process name |
`source` | any | bpmn source |
`executionContext` | [ExecutionContext](executioncontext.md) |   |

**Returns:** *[Execution](execution.md)*

## Properties

###  appDelegate

• **appDelegate**: *[IAppDelegate](../interfaces/iappdelegate.md)*

*Implementation of [IExecution](../interfaces/iexecution.md).[appDelegate](../interfaces/iexecution.md#appdelegate)*

Defined in src/engine/Execution.ts:32

___

###  data

• **data**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[data](../interfaces/iexecution.md#data)*

Defined in src/engine/Execution.ts:35

___

###  definition

• **definition**: *[IDefinition](../interfaces/idefinition.md)*

*Implementation of [IExecution](../interfaces/iexecution.md).[definition](../interfaces/iexecution.md#definition)*

Defined in src/engine/Execution.ts:31

___

###  endedAt

• **endedAt**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[endedAt](../interfaces/iexecution.md#endedat)*

Defined in src/engine/Execution.ts:27

___

###  executionContext

• **executionContext**: *any*

Defined in src/engine/Execution.ts:40

___

###  id

• **id**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[id](../interfaces/iexecution.md#id)*

Defined in src/engine/Execution.ts:24

___

###  listener

• **listener**: *EventEmitter*

*Implementation of [IExecution](../interfaces/iexecution.md).[listener](../interfaces/iexecution.md#listener)*

Defined in src/engine/Execution.ts:39

___

###  logger

• **logger**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[logger](../interfaces/iexecution.md#logger)*

Defined in src/engine/Execution.ts:34

___

###  logs

• **logs**: *any[]* = []

*Implementation of [IExecution](../interfaces/iexecution.md).[logs](../interfaces/iexecution.md#logs)*

Defined in src/engine/Execution.ts:36

___

###  name

• **name**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[name](../interfaces/iexecution.md#name)*

Defined in src/engine/Execution.ts:25

___

###  parentNodeId

• **parentNodeId**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[parentNodeId](../interfaces/iexecution.md#parentnodeid)*

Defined in src/engine/Execution.ts:37

___

###  promises

• **promises**: *any[]* = []

Defined in src/engine/Execution.ts:42

___

###  saved

• **saved**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[saved](../interfaces/iexecution.md#saved)*

Defined in src/engine/Execution.ts:28

___

###  source

• **source**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[source](../interfaces/iexecution.md#source)*

Defined in src/engine/Execution.ts:33

___

###  startedAt

• **startedAt**: *any*

*Implementation of [IExecution](../interfaces/iexecution.md).[startedAt](../interfaces/iexecution.md#startedat)*

Defined in src/engine/Execution.ts:26

___

###  status

• **status**: *[EXECUTION_STATUS](../enums/execution_status.md)*

*Implementation of [IExecution](../interfaces/iexecution.md).[status](../interfaces/iexecution.md#status)*

Defined in src/engine/Execution.ts:29

___

###  tokens

• **tokens**: *Map‹any, any›* = new Map()

*Implementation of [IExecution](../interfaces/iexecution.md).[tokens](../interfaces/iexecution.md#tokens)*

Defined in src/engine/Execution.ts:30

___

###  uids

• **uids**: *object*

*Implementation of [IExecution](../interfaces/iexecution.md).[uids](../interfaces/iexecution.md#uids)*

Defined in src/engine/Execution.ts:335

#### Type declaration:

## Methods

###  applyInput

▸ **applyInput**(`inputData`: any, `dataPath`: any): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:372

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`inputData` | any | - |
`dataPath` | any | null |

**Returns:** *void*

___

###  doExecutionEvent

▸ **doExecutionEvent**(`event`: any): *Promise‹void›*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:350

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *Promise‹void›*

___

###  doItemEvent

▸ **doItemEvent**(`item`: any, `event`: any): *Promise‹void›*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:360

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`event` | any |

**Returns:** *Promise‹void›*

___

###  doTokenEvent

▸ **doTokenEvent**(`token`: any, `event`: any): *Promise‹void›*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:355

**Parameters:**

Name | Type |
------ | ------ |
`token` | any |
`event` | any |

**Returns:** *Promise‹void›*

___

###  end

▸ **end**(): *Promise‹void›*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:81

**Returns:** *Promise‹void›*

___

###  execute

▸ **execute**(`startNodeId`: any, `inputData`: object): *Promise‹void›*

Defined in src/engine/Execution.ts:94

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`startNodeId` | any | null |
`inputData` | object | {} |

**Returns:** *Promise‹void›*

___

###  getAndCreateData

▸ **getAndCreateData**(`dataPath`: any, `asArray`: boolean): *any*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:414

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

Defined in src/engine/Execution.ts:401

**Parameters:**

Name | Type |
------ | ------ |
`dataPath` | any |

**Returns:** *any*

___

###  getItems

▸ **getItems**(`query`: any): *[Item](item.md)[]*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:204

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`query` | any | null |

**Returns:** *[Item](item.md)[]*

___

###  getItemsData

▸ **getItemsData**(): *any[]*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:215

**Returns:** *any[]*

___

###  getNewId

▸ **getNewId**(`scope`: string): *number*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:336

**Parameters:**

Name | Type |
------ | ------ |
`scope` | string |

**Returns:** *number*

___

###  getNodeById

▸ **getNodeById**(`id`: any): *[Node](node.md)‹›*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:67

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

**Returns:** *[Node](node.md)‹›*

___

###  getState

▸ **getState**(): *[IInstanceData](../interfaces/iinstancedata.md)*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:225

**Returns:** *[IInstanceData](../interfaces/iinstancedata.md)*

___

###  getToken

▸ **getToken**(`id`: number): *[Token](token.md)*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`id` | number |

**Returns:** *[Token](token.md)*

___

###  getUUID

▸ **getUUID**(): *any*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:343

**Returns:** *any*

___

###  log

▸ **log**(`msg`: any): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:364

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  report

▸ **report**(): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:312

**Returns:** *void*

___

###  restored

▸ **restored**(): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:299

**Returns:** *void*

___

###  resume

▸ **resume**(): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:306

**Returns:** *void*

___

###  signal

▸ **signal**(`executionId`: any, `inputData`: any): *Promise‹void›*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:143

invoke scenarios:
     itemId
     elementId   - but only one is active
     elementId   - for a startEvent in a secondary process

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`executionId` | any | - |
`inputData` | any |   Obselete -- remove later  |

**Returns:** *Promise‹void›*

___

###  stop

▸ **stop**(): *void*

*Implementation of [IExecution](../interfaces/iexecution.md)*

Defined in src/engine/Execution.ts:91

causes the execution to stop from running any further

**Returns:** *void*

___

###  tokenEnded

▸ **tokenEnded**(`token`: [Token](token.md)): *void*

Defined in src/engine/Execution.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`token` | [Token](token.md) |

**Returns:** *void*

___

### `Static` restore

▸ **restore**(`state`: [IInstanceData](../interfaces/iinstancedata.md), `executionContext`: any): *Promise‹[Execution](execution.md)›*

Defined in src/engine/Execution.ts:246

**Parameters:**

Name | Type |
------ | ------ |
`state` | [IInstanceData](../interfaces/iinstancedata.md) |
`executionContext` | any |

**Returns:** *Promise‹[Execution](execution.md)›*
