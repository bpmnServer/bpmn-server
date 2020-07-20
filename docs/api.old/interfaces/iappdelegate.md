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

* [executionEvent](iappdelegate.md#executionevent)
* [executionStarted](iappdelegate.md#executionstarted)
* [issueMessage](iappdelegate.md#issuemessage)
* [issueSignal](iappdelegate.md#issuesignal)
* [messageThrown](iappdelegate.md#messagethrown)
* [scopeEval](iappdelegate.md#scopeeval)
* [scopeJS](iappdelegate.md#scopejs)
* [serviceCalled](iappdelegate.md#servicecalled)
* [signalThrown](iappdelegate.md#signalthrown)

## Methods

###  executionEvent

▸ **executionEvent**(`__namedParameters`: object): *any*

Defined in src/interfaces/common.ts:66

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`event` | any |
`execution` | any |
`item` | any |

**Returns:** *any*

___

###  executionStarted

▸ **executionStarted**(`execution`: [IExecutionContext](iexecutioncontext.md)): *any*

Defined in src/interfaces/common.ts:65

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [IExecutionContext](iexecutioncontext.md) |

**Returns:** *any*

___

###  issueMessage

▸ **issueMessage**(`messageId`: any, `data`: any): *any*

Defined in src/interfaces/common.ts:76

is called when an event throws a message that can not be answered by another process

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageId` | any | - |
`data` | any |   |

**Returns:** *any*

___

###  issueSignal

▸ **issueSignal**(`messageId`: any, `data`: any): *any*

Defined in src/interfaces/common.ts:77

**Parameters:**

Name | Type |
------ | ------ |
`messageId` | any |
`data` | any |

**Returns:** *any*

___

###  messageThrown

▸ **messageThrown**(`signalId`: any, `data`: any, `messageMatchingKey`: any, `item`: [IItem](iitem.md)): *any*

Defined in src/interfaces/common.ts:67

**Parameters:**

Name | Type |
------ | ------ |
`signalId` | any |
`data` | any |
`messageMatchingKey` | any |
`item` | [IItem](iitem.md) |

**Returns:** *any*

___

###  scopeEval

▸ **scopeEval**(`scope`: any, `script`: any): *any*

Defined in src/interfaces/common.ts:85

**Parameters:**

Name | Type |
------ | ------ |
`scope` | any |
`script` | any |

**Returns:** *any*

___

###  scopeJS

▸ **scopeJS**(`scope`: any, `script`: any): *any*

Defined in src/interfaces/common.ts:86

**Parameters:**

Name | Type |
------ | ------ |
`scope` | any |
`script` | any |

**Returns:** *any*

___

###  serviceCalled

▸ **serviceCalled**(`serviceName`: any, `data`: any, `item`: [IItem](iitem.md)): *any*

Defined in src/interfaces/common.ts:83

is called only if the serviceTask has no implementation; otherwise the specified implementation will be called.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`serviceName` | any | - |
`data` | any | - |
`item` | [IItem](iitem.md) |   |

**Returns:** *any*

___

###  signalThrown

▸ **signalThrown**(`signalId`: any, `data`: any, `messageMatchingKey`: any, `item`: [IItem](iitem.md)): *any*

Defined in src/interfaces/common.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`signalId` | any |
`data` | any |
`messageMatchingKey` | any |
`item` | [IItem](iitem.md) |

**Returns:** *any*
