[bpmn-server](../README.md) › [Logger](logger.md)

# Class: Logger

## Hierarchy

* **Logger**

## Implements

* [ILogger](../interfaces/ilogger.md)

## Index

### Constructors

* [constructor](logger.md#constructor)

### Properties

* [callback](logger.md#callback)
* [debugMsgs](logger.md#debugmsgs)
* [toConsole](logger.md#toconsole)
* [toFile](logger.md#tofile)

### Methods

* [clear](logger.md#clear)
* [debug](logger.md#debug)
* [error](logger.md#error)
* [get](logger.md#get)
* [log](logger.md#log)
* [msg](logger.md#msg)
* [save](logger.md#save)
* [setOptions](logger.md#setoptions)
* [warn](logger.md#warn)

## Constructors

###  constructor

\+ **new Logger**(`__namedParameters`: object): *[Logger](logger.md)*

Defined in bpmnServer/src/common/Logger.ts:12

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`callback` | any | null |
`toConsole` | boolean | true |
`toFile` | string | "" |

**Returns:** *[Logger](logger.md)*

## Properties

###  callback

• **callback**: *any* = null

Defined in bpmnServer/src/common/Logger.ts:12

Defined in bpmnServer/node_modules/dmn-engine/common.ts:37

___

###  debugMsgs

• **debugMsgs**: *any[]* = []

Defined in bpmnServer/src/common/Logger.ts:9

Defined in bpmnServer/node_modules/dmn-engine/common.ts:34

___

###  toConsole

• **toConsole**: *boolean* = true

Defined in bpmnServer/src/common/Logger.ts:10

Defined in bpmnServer/node_modules/dmn-engine/common.ts:35

___

###  toFile

• **toFile**: *any* = null

Defined in bpmnServer/src/common/Logger.ts:11

Defined in bpmnServer/node_modules/dmn-engine/common.ts:36

## Methods

###  clear

▸ **clear**(): *void*

*Implementation of [ILogger](../interfaces/ilogger.md)*

Defined in bpmnServer/src/common/Logger.ts:31

**Returns:** *void*

___

###  debug

▸ **debug**(`message`: any): *void*

*Implementation of [ILogger](../interfaces/ilogger.md)*

Defined in bpmnServer/src/common/Logger.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

___

###  error

▸ **error**(`err`: any): *void*

*Implementation of [ILogger](../interfaces/ilogger.md)*

Defined in bpmnServer/src/common/Logger.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`err` | any |

**Returns:** *void*

___

###  get

▸ **get**(): *any[]*

*Implementation of [ILogger](../interfaces/ilogger.md)*

Defined in bpmnServer/src/common/Logger.ts:35

**Returns:** *any[]*

___

###  log

▸ **log**(`message`: any): *void*

*Implementation of [ILogger](../interfaces/ilogger.md)*

Defined in bpmnServer/src/common/Logger.ts:46

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

___

###  msg

▸ **msg**(`message`: any, `type`: string): *void*

Defined in bpmnServer/src/common/Logger.ts:23

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`message` | any | - |
`type` | string | "log" |

**Returns:** *void*

___

###  save

▸ **save**(`filename`: any): *Promise‹void›*

*Implementation of [ILogger](../interfaces/ilogger.md)*

Defined in bpmnServer/src/common/Logger.ts:67

**Parameters:**

Name | Type |
------ | ------ |
`filename` | any |

**Returns:** *Promise‹void›*

___

###  setOptions

▸ **setOptions**(`__namedParameters`: object): *void*

Defined in bpmnServer/src/common/Logger.ts:17

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`callback` | any |
`toConsole` | any |
`toFile` | any |

**Returns:** *void*

___

###  warn

▸ **warn**(`message`: any): *void*

*Implementation of [ILogger](../interfaces/ilogger.md)*

Defined in bpmnServer/src/common/Logger.ts:43

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*
