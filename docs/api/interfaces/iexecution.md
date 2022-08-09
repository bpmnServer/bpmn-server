[bpmn-server](../README.md) › [IExecution](iexecution.md)

# Interface: IExecution

## Hierarchy

* [IServerComponent](iservercomponent.md)

  ↳ **IExecution**

## Implemented by

* [Execution](../classes/execution.md)

## Index

### Properties

* [appDelegate](iexecution.md#appdelegate)
* [cache](iexecution.md#cache)
* [configuration](iexecution.md#configuration)
* [cron](iexecution.md#cron)
* [currentUser](iexecution.md#currentuser)
* [dataStore](iexecution.md#datastore)
* [definition](iexecution.md#definition)
* [definitions](iexecution.md#definitions)
* [engine](iexecution.md#engine)
* [errors](iexecution.md#errors)
* [id](iexecution.md#id)
* [input](iexecution.md#input)
* [instance](iexecution.md#instance)
* [item](iexecution.md#item)
* [listener](iexecution.md#listener)
* [logger](iexecution.md#logger)
* [messageMatchingKey](iexecution.md#messagematchingkey)
* [name](iexecution.md#name)
* [output](iexecution.md#output)
* [process](iexecution.md#process)
* [promises](iexecution.md#promises)
* [server](iexecution.md#server)
* [status](iexecution.md#status)
* [tokens](iexecution.md#tokens)
* [uids](iexecution.md#uids)
* [worker](iexecution.md#worker)

### Methods

* [applyInput](iexecution.md#applyinput)
* [doExecutionEvent](iexecution.md#doexecutionevent)
* [doItemEvent](iexecution.md#doitemevent)
* [end](iexecution.md#end)
* [error](iexecution.md#error)
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
* [terminate](iexecution.md#terminate)
* [tokenEnded](iexecution.md#tokenended)

## Properties

###  appDelegate

• **appDelegate**: *[IAppDelegate](iappdelegate.md)*

*Overrides [IServerComponent](iservercomponent.md).[appDelegate](iservercomponent.md#appdelegate)*

Defined in bpmnServer/src/interfaces/engine.ts:68

___

###  cache

• **cache**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[cache](iservercomponent.md#cache)*

Defined in bpmnServer/src/interfaces/server.ts:27

___

###  configuration

• **configuration**: *[IConfiguration](iconfiguration.md)*

*Inherited from [IServerComponent](iservercomponent.md).[configuration](iservercomponent.md#configuration)*

Defined in bpmnServer/src/interfaces/server.ts:24

___

###  cron

• **cron**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[cron](iservercomponent.md#cron)*

Defined in bpmnServer/src/interfaces/server.ts:26

___

###  currentUser

• **currentUser**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:80

___

###  dataStore

• **dataStore**: *[IDataStore](idatastore.md)*

*Inherited from [IServerComponent](iservercomponent.md).[dataStore](iservercomponent.md#datastore)*

Defined in bpmnServer/src/interfaces/server.ts:30

___

###  definition

• **definition**: *[IDefinition](idefinition.md)*

Defined in bpmnServer/src/interfaces/engine.ts:67

___

###  definitions

• **definitions**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[definitions](iservercomponent.md#definitions)*

Defined in bpmnServer/src/interfaces/server.ts:31

___

###  engine

• **engine**: *any*

*Inherited from [IServerComponent](iservercomponent.md).[engine](iservercomponent.md#engine)*

Defined in bpmnServer/src/interfaces/server.ts:29

___

###  errors

• **errors**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:74

___

###  id

• **id**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:82

___

###  input

• **input**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:76

___

###  instance

• **instance**: *[IInstanceData](iinstancedata.md)*

Defined in bpmnServer/src/interfaces/engine.ts:64

___

###  item

• **item**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:75

___

###  listener

• **listener**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:72

___

###  logger

• **logger**: *[ILogger](ilogger.md)*

*Overrides [IServerComponent](iservercomponent.md).[logger](iservercomponent.md#logger)*

Defined in bpmnServer/src/interfaces/engine.ts:69

___

###  messageMatchingKey

• **messageMatchingKey**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:78

___

###  name

• **name**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:84

___

###  output

• **output**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:77

___

###  process

• **process**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:70

___

###  promises

• **promises**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:71

___

###  server

• **server**: *[IBPMNServer](ibpmnserver.md)*

*Inherited from [IServerComponent](iservercomponent.md).[server](iservercomponent.md#server)*

Defined in bpmnServer/src/interfaces/server.ts:23

___

###  status

• **status**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:83

___

###  tokens

• **tokens**: *Map‹any, [IToken](itoken.md)›*

Defined in bpmnServer/src/interfaces/engine.ts:66

___

###  uids

• **uids**: *object*

Defined in bpmnServer/src/interfaces/engine.ts:114

#### Type declaration:

___

###  worker

• **worker**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:79

## Methods

###  applyInput

▸ **applyInput**(`inputData`: any, `dataPath?`: any): *void*

Defined in bpmnServer/src/interfaces/engine.ts:121

**Parameters:**

Name | Type |
------ | ------ |
`inputData` | any |
`dataPath?` | any |

**Returns:** *void*

___

###  doExecutionEvent

▸ **doExecutionEvent**(`process`: any, `event`: any): *Promise‹any›*

Defined in bpmnServer/src/interfaces/engine.ts:117

**Parameters:**

Name | Type |
------ | ------ |
`process` | any |
`event` | any |

**Returns:** *Promise‹any›*

___

###  doItemEvent

▸ **doItemEvent**(`item`: any, `event`: any): *Promise‹any›*

Defined in bpmnServer/src/interfaces/engine.ts:118

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`event` | any |

**Returns:** *Promise‹any›*

___

###  end

▸ **end**(): *Promise‹void›*

Defined in bpmnServer/src/interfaces/engine.ts:90

**Returns:** *Promise‹void›*

___

###  error

▸ **error**(`msg`: any): *void*

Defined in bpmnServer/src/interfaces/engine.ts:120

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  execute

▸ **execute**(`startNodeId?`: any, `inputData?`: object): *Promise‹void›*

Defined in bpmnServer/src/interfaces/engine.ts:97

**Parameters:**

Name | Type |
------ | ------ |
`startNodeId?` | any |
`inputData?` | object |

**Returns:** *Promise‹void›*

___

###  getAndCreateData

▸ **getAndCreateData**(`dataPath`: any, `asArray?`: boolean): *any*

Defined in bpmnServer/src/interfaces/engine.ts:123

**Parameters:**

Name | Type |
------ | ------ |
`dataPath` | any |
`asArray?` | boolean |

**Returns:** *any*

___

###  getData

▸ **getData**(`dataPath`: any): *any*

Defined in bpmnServer/src/interfaces/engine.ts:122

**Parameters:**

Name | Type |
------ | ------ |
`dataPath` | any |

**Returns:** *any*

___

###  getItems

▸ **getItems**(`query?`: any): *[IItem](iitem.md)[]*

Defined in bpmnServer/src/interfaces/engine.ts:109

**Parameters:**

Name | Type |
------ | ------ |
`query?` | any |

**Returns:** *[IItem](iitem.md)[]*

___

###  getItemsData

▸ **getItemsData**(): *[IItemData](iitemdata.md)[]*

Defined in bpmnServer/src/interfaces/engine.ts:89

**Returns:** *[IItemData](iitemdata.md)[]*

___

###  getNewId

▸ **getNewId**(`scope`: string): *number*

Defined in bpmnServer/src/interfaces/engine.ts:115

**Parameters:**

Name | Type |
------ | ------ |
`scope` | string |

**Returns:** *number*

___

###  getNodeById

▸ **getNodeById**(`id`: any): *[Node](../classes/node.md)*

Defined in bpmnServer/src/interfaces/engine.ts:86

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

**Returns:** *[Node](../classes/node.md)*

___

###  getState

▸ **getState**(): *[IInstanceData](iinstancedata.md)*

Defined in bpmnServer/src/interfaces/engine.ts:110

**Returns:** *[IInstanceData](iinstancedata.md)*

___

###  getToken

▸ **getToken**(`id`: number): *[IToken](itoken.md)*

Defined in bpmnServer/src/interfaces/engine.ts:87

**Parameters:**

Name | Type |
------ | ------ |
`id` | number |

**Returns:** *[IToken](itoken.md)*

___

###  getUUID

▸ **getUUID**(): *any*

Defined in bpmnServer/src/interfaces/engine.ts:116

**Returns:** *any*

___

###  log

▸ **log**(`msg`: any): *void*

Defined in bpmnServer/src/interfaces/engine.ts:119

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  report

▸ **report**(): *void*

Defined in bpmnServer/src/interfaces/engine.ts:113

**Returns:** *void*

___

###  restored

▸ **restored**(): *void*

Defined in bpmnServer/src/interfaces/engine.ts:111

**Returns:** *void*

___

###  resume

▸ **resume**(): *void*

Defined in bpmnServer/src/interfaces/engine.ts:112

**Returns:** *void*

___

###  signal

▸ **signal**(`executionId`: any, `inputData`: any): *Promise‹void›*

Defined in bpmnServer/src/interfaces/engine.ts:108

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

Defined in bpmnServer/src/interfaces/engine.ts:95

causes the execution to stop from running any further

**Returns:** *void*

___

###  terminate

▸ **terminate**(): *void*

Defined in bpmnServer/src/interfaces/engine.ts:96

**Returns:** *void*

___

###  tokenEnded

▸ **tokenEnded**(`token`: [IToken](itoken.md)): *void*

Defined in bpmnServer/src/interfaces/engine.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`token` | [IToken](itoken.md) |

**Returns:** *void*
