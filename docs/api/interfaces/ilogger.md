[bpmn-server](../README.md) › [ILogger](ilogger.md)

# Interface: ILogger

A logging tool to take various message for monitoring and debugging

it can also keep the message in memory till saved later through saveToFile
msgs can be cleared by the clean method

## Hierarchy

* **ILogger**

## Implemented by

* [Logger](../classes/logger.md)

## Index

### Methods

* [clear](ilogger.md#clear)
* [debug](ilogger.md#debug)
* [error](ilogger.md#error)
* [get](ilogger.md#get)
* [log](ilogger.md#log)
* [save](ilogger.md#save)
* [setOptions](ilogger.md#setoptions)
* [warn](ilogger.md#warn)

## Methods

###  clear

▸ **clear**(): *void*

Defined in bpmnServer/src/interfaces/common.ts:48

**Returns:** *void*

___

###  debug

▸ **debug**(`message`: any): *void*

Defined in bpmnServer/src/interfaces/common.ts:50

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

___

###  error

▸ **error**(`err`: any): *void*

Defined in bpmnServer/src/interfaces/common.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`err` | any |

**Returns:** *void*

___

###  get

▸ **get**(): *any[]*

Defined in bpmnServer/src/interfaces/common.ts:49

**Returns:** *any[]*

___

###  log

▸ **log**(`message`: any): *void*

Defined in bpmnServer/src/interfaces/common.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

___

###  save

▸ **save**(`filename`: any): *Promise‹void›*

Defined in bpmnServer/src/interfaces/common.ts:54

**Parameters:**

Name | Type |
------ | ------ |
`filename` | any |

**Returns:** *Promise‹void›*

___

###  setOptions

▸ **setOptions**(`__namedParameters`: object): *void*

Defined in bpmnServer/src/interfaces/common.ts:43

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Description |
------ | ------ | ------ |
`callback` | any | - |
`toConsole` | any | boolean  writes to the output console |
`toFile` | any | string writes to file   |

**Returns:** *void*

___

###  warn

▸ **warn**(`message`: any): *void*

Defined in bpmnServer/src/interfaces/common.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*
