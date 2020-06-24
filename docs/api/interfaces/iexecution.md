[bpmn-server](../README.md) › [IExecution](iexecution.md)

# Interface: IExecution

## Hierarchy

* **IExecution**

## Implemented by

* [Execution](../classes/execution.md)

## Index

### Properties

* [appDelegate](iexecution.md#appdelegate)
* [data](iexecution.md#data)
* [definition](iexecution.md#definition)
* [endedAt](iexecution.md#endedat)
* [executionContext](iexecution.md#executioncontext)
* [id](iexecution.md#id)
* [listener](iexecution.md#listener)
* [logger](iexecution.md#logger)
* [logs](iexecution.md#logs)
* [name](iexecution.md#name)
* [parentItemId](iexecution.md#parentitemid)
* [promises](iexecution.md#promises)
* [saved](iexecution.md#saved)
* [source](iexecution.md#source)
* [startedAt](iexecution.md#startedat)
* [status](iexecution.md#status)
* [tokens](iexecution.md#tokens)
* [uids](iexecution.md#uids)

### Methods

* [applyInput](iexecution.md#applyinput)
* [doExecutionEvent](iexecution.md#doexecutionevent)
* [doItemEvent](iexecution.md#doitemevent)
* [doTokenEvent](iexecution.md#dotokenevent)
* [end](iexecution.md#end)
* [execute](iexecution.md#execute)
* [getAndCreateData](iexecution.md#getandcreatedata)
* [getData](iexecution.md#getdata)
* [getItems](iexecution.md#getitems)
* [getItemsData](iexecution.md#getitemsdata)
* [getNewId](iexecution.md#getnewid)
* [getNodeById](iexecution.md#getnodebyid)
* [getState](iexecution.md#getstate)
* [getToken](iexecution.md#gettoken)
* [getUUID](iexecution.md#getuuid)
* [log](iexecution.md#log)
* [report](iexecution.md#report)
* [restored](iexecution.md#restored)
* [resume](iexecution.md#resume)
* [signal](iexecution.md#signal)
* [stop](iexecution.md#stop)
* [tokenEnded](iexecution.md#tokenended)

## Properties

###  appDelegate

• **appDelegate**: *[IAppDelegate](iappdelegate.md)*

Defined in src/interfaces/engine.ts:61

___

###  data

• **data**: *any*

Defined in src/interfaces/engine.ts:64

___

###  definition

• **definition**: *[IDefinition](idefinition.md)*

Defined in src/interfaces/engine.ts:60

___

###  endedAt

• **endedAt**: *any*

Defined in src/interfaces/engine.ts:56

___

###  executionContext

• **executionContext**: *[IExecutionContext](iexecutioncontext.md)*

Defined in src/interfaces/engine.ts:68

___

###  id

• **id**: *any*

Defined in src/interfaces/engine.ts:53

___

###  listener

• **listener**: *EventEmitter*

Defined in src/interfaces/engine.ts:67

___

###  logger

• **logger**: *[ILogger](ilogger.md)*

Defined in src/interfaces/engine.ts:63

___

###  logs

• **logs**: *any[]*

Defined in src/interfaces/engine.ts:65

___

###  name

• **name**: *any*

Defined in src/interfaces/engine.ts:54

___

###  parentItemId

• **parentItemId**: *any*

Defined in src/interfaces/engine.ts:66

___

###  promises

• **promises**: *any*

Defined in src/interfaces/engine.ts:69

___

###  saved

• **saved**: *any*

Defined in src/interfaces/engine.ts:57

___

###  source

• **source**: *any*

Defined in src/interfaces/engine.ts:62

___

###  startedAt

• **startedAt**: *any*

Defined in src/interfaces/engine.ts:55

___

###  status

• **status**: *[EXECUTION_STATUS](../enums/execution_status.md)*

Defined in src/interfaces/engine.ts:58

___

###  tokens

• **tokens**: *Map‹any, [IToken](itoken.md)›*

Defined in src/interfaces/engine.ts:59

___

###  uids

• **uids**: *object*

Defined in src/interfaces/engine.ts:98

#### Type declaration:

## Methods

###  applyInput

▸ **applyInput**(`inputData`: any, `dataPath?`: any): *void*

Defined in src/interfaces/engine.ts:105

**Parameters:**

Name | Type |
------ | ------ |
`inputData` | any |
`dataPath?` | any |

**Returns:** *void*

___

###  doExecutionEvent

▸ **doExecutionEvent**(`event`: any): *Promise‹void›*

Defined in src/interfaces/engine.ts:101

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *Promise‹void›*

___

###  doItemEvent

▸ **doItemEvent**(`item`: any, `event`: any): *Promise‹void›*

Defined in src/interfaces/engine.ts:103

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`event` | any |

**Returns:** *Promise‹void›*

___

###  doTokenEvent

▸ **doTokenEvent**(`token`: any, `event`: any): *Promise‹void›*

Defined in src/interfaces/engine.ts:102

**Parameters:**

Name | Type |
------ | ------ |
`token` | any |
`event` | any |

**Returns:** *Promise‹void›*

___

###  end

▸ **end**(): *Promise‹void›*

Defined in src/interfaces/engine.ts:75

**Returns:** *Promise‹void›*

___

###  execute

▸ **execute**(`startNodeId?`: any, `inputData?`: object): *Promise‹void›*

Defined in src/interfaces/engine.ts:81

**Parameters:**

Name | Type |
------ | ------ |
`startNodeId?` | any |
`inputData?` | object |

**Returns:** *Promise‹void›*

___

###  getAndCreateData

▸ **getAndCreateData**(`dataPath`: any, `asArray?`: boolean): *any*

Defined in src/interfaces/engine.ts:107

**Parameters:**

Name | Type |
------ | ------ |
`dataPath` | any |
`asArray?` | boolean |

**Returns:** *any*

___

###  getData

▸ **getData**(`dataPath`: any): *any*

Defined in src/interfaces/engine.ts:106

**Parameters:**

Name | Type |
------ | ------ |
`dataPath` | any |

**Returns:** *any*

___

###  getItems

▸ **getItems**(`query?`: any): *[IItem](iitem.md)[]*

Defined in src/interfaces/engine.ts:93

**Parameters:**

Name | Type |
------ | ------ |
`query?` | any |

**Returns:** *[IItem](iitem.md)[]*

___

###  getItemsData

▸ **getItemsData**(): *[IItemData](iitemdata.md)[]*

Defined in src/interfaces/engine.ts:74

**Returns:** *[IItemData](iitemdata.md)[]*

___

###  getNewId

▸ **getNewId**(`scope`: string): *number*

Defined in src/interfaces/engine.ts:99

**Parameters:**

Name | Type |
------ | ------ |
`scope` | string |

**Returns:** *number*

___

###  getNodeById

▸ **getNodeById**(`id`: any): *[Node](../classes/node.md)*

Defined in src/interfaces/engine.ts:71

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

**Returns:** *[Node](../classes/node.md)*

___

###  getState

▸ **getState**(): *[IInstanceData](iinstancedata.md)*

Defined in src/interfaces/engine.ts:94

**Returns:** *[IInstanceData](iinstancedata.md)*

___

###  getToken

▸ **getToken**(`id`: number): *[IToken](itoken.md)*

Defined in src/interfaces/engine.ts:72

**Parameters:**

Name | Type |
------ | ------ |
`id` | number |

**Returns:** *[IToken](itoken.md)*

___

###  getUUID

▸ **getUUID**(): *any*

Defined in src/interfaces/engine.ts:100

**Returns:** *any*

___

###  log

▸ **log**(`msg`: any): *void*

Defined in src/interfaces/engine.ts:104

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  report

▸ **report**(): *void*

Defined in src/interfaces/engine.ts:97

**Returns:** *void*

___

###  restored

▸ **restored**(): *void*

Defined in src/interfaces/engine.ts:95

**Returns:** *void*

___

###  resume

▸ **resume**(): *void*

Defined in src/interfaces/engine.ts:96

**Returns:** *void*

___

###  signal

▸ **signal**(`executionId`: any, `inputData`: any): *Promise‹void›*

Defined in src/interfaces/engine.ts:92

invoke scenarios:
     itemId
     elementId   - but only one is active
     elementId   - for a startEvent in a secondary process

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`executionId` | any | - |
`inputData` | any |   |

**Returns:** *Promise‹void›*

___

###  stop

▸ **stop**(): *void*

Defined in src/interfaces/engine.ts:80

causes the execution to stop from running any further

**Returns:** *void*

___

###  tokenEnded

▸ **tokenEnded**(`token`: [IToken](itoken.md)): *void*

Defined in src/interfaces/engine.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`token` | [IToken](itoken.md) |

**Returns:** *void*
