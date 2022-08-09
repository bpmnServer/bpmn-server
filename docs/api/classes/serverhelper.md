[bpmn-server](../README.md) › [ServerHelper](serverhelper.md)

# Class: ServerHelper

## Hierarchy

* **ServerHelper**

## Index

### Constructors

* [constructor](serverhelper.md#constructor)

### Properties

* [bpmnServer](serverhelper.md#bpmnserver)
* [configuration](serverhelper.md#configuration)
* [engine](serverhelper.md#engine)
* [instance](serverhelper.md#instance)
* [instanceId](serverhelper.md#instanceid)
* [items](serverhelper.md#items)

### Methods

* [checkItem](serverhelper.md#checkitem)
* [completedItems](serverhelper.md#completeditems)
* [delay](serverhelper.md#delay)
* [dumpInfo](serverhelper.md#dumpinfo)
* [execute](serverhelper.md#execute)
* [findItems](serverhelper.md#finditems)
* [getItems](serverhelper.md#getitems)
* [getLogger](serverhelper.md#getlogger)
* [invoke](serverhelper.md#invoke)
* [isComplete](serverhelper.md#iscomplete)
* [log](serverhelper.md#log)
* [resetData](serverhelper.md#resetdata)
* [saveLog](serverhelper.md#savelog)
* [waitingItems](serverhelper.md#waitingitems)

## Constructors

###  constructor

\+ **new ServerHelper**(`configuration`: any): *[ServerHelper](serverhelper.md)*

Defined in bpmnServer/src/helpers/ServerHelper.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`configuration` | any |

**Returns:** *[ServerHelper](serverhelper.md)*

## Properties

###  bpmnServer

• **bpmnServer**: *any*

Defined in bpmnServer/src/helpers/ServerHelper.ts:24

___

###  configuration

• **configuration**: *any*

Defined in bpmnServer/src/helpers/ServerHelper.ts:25

___

###  engine

• **engine**: *any*

Defined in bpmnServer/src/helpers/ServerHelper.ts:28

___

###  instance

• **instance**: *any*

Defined in bpmnServer/src/helpers/ServerHelper.ts:26

___

###  instanceId

• **instanceId**: *any*

Defined in bpmnServer/src/helpers/ServerHelper.ts:29

___

###  items

• **items**: *any*

Defined in bpmnServer/src/helpers/ServerHelper.ts:27

## Methods

###  checkItem

▸ **checkItem**(`query`: any, `step`: any): *Promise‹boolean›*

Defined in bpmnServer/src/helpers/ServerHelper.ts:116

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |
`step` | any |

**Returns:** *Promise‹boolean›*

___

###  completedItems

▸ **completedItems**(): *any[]*

Defined in bpmnServer/src/helpers/ServerHelper.ts:76

**Returns:** *any[]*

___

###  delay

▸ **delay**(`time`: any, `result`: any): *Promise‹unknown›*

Defined in bpmnServer/src/helpers/ServerHelper.ts:134

**Parameters:**

Name | Type |
------ | ------ |
`time` | any |
`result` | any |

**Returns:** *Promise‹unknown›*

___

###  dumpInfo

▸ **dumpInfo**(`execution`: any): *Promise‹boolean›*

Defined in bpmnServer/src/helpers/ServerHelper.ts:93

**Parameters:**

Name | Type |
------ | ------ |
`execution` | any |

**Returns:** *Promise‹boolean›*

___

###  execute

▸ **execute**(`definitionName`: any, `data`: object): *Promise‹this›*

Defined in bpmnServer/src/helpers/ServerHelper.ts:40

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`definitionName` | any | - |
`data` | object | {} |

**Returns:** *Promise‹this›*

___

###  findItems

▸ **findItems**(`query`: any): *Promise‹any›*

Defined in bpmnServer/src/helpers/ServerHelper.ts:128

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

___

###  getItems

▸ **getItems**(`status`: any): *any[]*

Defined in bpmnServer/src/helpers/ServerHelper.ts:79

**Parameters:**

Name | Type |
------ | ------ |
`status` | any |

**Returns:** *any[]*

___

###  getLogger

▸ **getLogger**(): *any*

Defined in bpmnServer/src/helpers/ServerHelper.ts:36

**Returns:** *any*

___

###  invoke

▸ **invoke**(`nodeName`: any, `data`: any): *Promise‹this›*

Defined in bpmnServer/src/helpers/ServerHelper.ts:55

**Parameters:**

Name | Type |
------ | ------ |
`nodeName` | any |
`data` | any |

**Returns:** *Promise‹this›*

___

###  isComplete

▸ **isComplete**(): *Promise‹boolean›*

Defined in bpmnServer/src/helpers/ServerHelper.ts:105

**Returns:** *Promise‹boolean›*

___

###  log

▸ **log**(`msg`: any): *void*

Defined in bpmnServer/src/helpers/ServerHelper.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  resetData

▸ **resetData**(): *Promise‹boolean›*

Defined in bpmnServer/src/helpers/ServerHelper.ts:88

**Returns:** *Promise‹boolean›*

___

###  saveLog

▸ **saveLog**(`name`: any): *void*

Defined in bpmnServer/src/helpers/ServerHelper.ts:143

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *void*

___

###  waitingItems

▸ **waitingItems**(): *any[]*

Defined in bpmnServer/src/helpers/ServerHelper.ts:73

**Returns:** *any[]*
