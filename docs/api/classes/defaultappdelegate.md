[bpmn-server](../README.md) › [DefaultAppDelegate](defaultappdelegate.md)

# Class: DefaultAppDelegate

## Hierarchy

* **DefaultAppDelegate**

## Implements

* [IAppDelegate](../interfaces/iappdelegate.md)

## Index

### Constructors

* [constructor](defaultappdelegate.md#constructor)

### Methods

* [executionStarted](defaultappdelegate.md#executionstarted)
* [messageIssued](defaultappdelegate.md#messageissued)
* [scopeEval](defaultappdelegate.md#scopeeval)
* [scopeJS](defaultappdelegate.md#scopejs)
* [serviceCalled](defaultappdelegate.md#servicecalled)
* [signalIssued](defaultappdelegate.md#signalissued)

## Constructors

###  constructor

\+ **new DefaultAppDelegate**(`logger`: any): *[DefaultAppDelegate](defaultappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:5

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`logger` | any | null |

**Returns:** *[DefaultAppDelegate](defaultappdelegate.md)*

## Methods

###  executionStarted

▸ **executionStarted**(`execution`: [IExecutionContext](../interfaces/iexecutioncontext.md)): *void*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:8

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [IExecutionContext](../interfaces/iexecutioncontext.md) |

**Returns:** *void*

___

###  messageIssued

▸ **messageIssued**(`item`: [Item](item.md)): *void*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:10

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  scopeEval

▸ **scopeEval**(`scope`: any, `script`: any): *any*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`scope` | any |
`script` | any |

**Returns:** *any*

___

###  scopeJS

▸ **scopeJS**(`scope`: any, `script`: any): *Promise‹any›*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`scope` | any |
`script` | any |

**Returns:** *Promise‹any›*

___

###  serviceCalled

▸ **serviceCalled**(`item`: [Item](item.md)): *void*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  signalIssued

▸ **signalIssued**(`item`: [Item](item.md)): *void*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*
