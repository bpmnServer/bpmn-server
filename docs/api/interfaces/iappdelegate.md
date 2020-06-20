[bpmn-server](../README.md) › [IAppDelegate](iappdelegate.md)

# Interface: IAppDelegate

Application Delegate Object to respond to various events and services:

 1.  receive all events from workflow
 2.  receive service calls
 3.  receive message and signal calls
 4.  execute scripts

## Hierarchy

* **IAppDelegate**

## Implemented by

* [DefaultAppDelegate](../classes/defaultappdelegate.md)

## Index

### Methods

* [executionStarted](iappdelegate.md#executionstarted)
* [messageIssued](iappdelegate.md#messageissued)
* [scopeEval](iappdelegate.md#scopeeval)
* [scopeJS](iappdelegate.md#scopejs)
* [serviceCalled](iappdelegate.md#servicecalled)
* [signalIssued](iappdelegate.md#signalissued)

## Methods

###  executionStarted

▸ **executionStarted**(`execution`: [IExecutionContext](iexecutioncontext.md)): *any*

Defined in src/interfaces/common.ts:67

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [IExecutionContext](iexecutioncontext.md) |

**Returns:** *any*

___

###  messageIssued

▸ **messageIssued**(`item`: [IItem](iitem.md)): *any*

Defined in src/interfaces/common.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *any*

___

###  scopeEval

▸ **scopeEval**(`scope`: any, `script`: any): *any*

Defined in src/interfaces/common.ts:78

**Parameters:**

Name | Type |
------ | ------ |
`scope` | any |
`script` | any |

**Returns:** *any*

___

###  scopeJS

▸ **scopeJS**(`scope`: any, `script`: any): *any*

Defined in src/interfaces/common.ts:79

**Parameters:**

Name | Type |
------ | ------ |
`scope` | any |
`script` | any |

**Returns:** *any*

___

###  serviceCalled

▸ **serviceCalled**(`item`: [IItem](iitem.md)): *any*

Defined in src/interfaces/common.ts:76

is called only if the serviceTask has no implementation; otherwise the specified implementation will be called.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | [IItem](iitem.md) |   |

**Returns:** *any*

___

###  signalIssued

▸ **signalIssued**(`item`: [IItem](iitem.md)): *any*

Defined in src/interfaces/common.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *any*
