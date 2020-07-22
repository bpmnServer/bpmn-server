[bpmn-server](../README.md) › [DefaultAppDelegate](defaultappdelegate.md)

# Class: DefaultAppDelegate

## Hierarchy

* **DefaultAppDelegate**

## Implements

* [IAppDelegate](../interfaces/iappdelegate.md)

## Index

### Constructors

* [constructor](defaultappdelegate.md#constructor)

### Properties

* [servicesProvider](defaultappdelegate.md#servicesprovider)

### Accessors

* [moddleOptions](defaultappdelegate.md#moddleoptions)

### Methods

* [executionEvent](defaultappdelegate.md#executionevent)
* [executionStarted](defaultappdelegate.md#executionstarted)
* [issueMessage](defaultappdelegate.md#issuemessage)
* [issueSignal](defaultappdelegate.md#issuesignal)
* [messageThrown](defaultappdelegate.md#messagethrown)
* [scopeEval](defaultappdelegate.md#scopeeval)
* [scopeJS](defaultappdelegate.md#scopejs)
* [serviceCalled](defaultappdelegate.md#servicecalled)
* [signalThrown](defaultappdelegate.md#signalthrown)

## Constructors

###  constructor

\+ **new DefaultAppDelegate**(`logger`: any): *[DefaultAppDelegate](defaultappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:8

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`logger` | any | null |

**Returns:** *[DefaultAppDelegate](defaultappdelegate.md)*

## Properties

###  servicesProvider

• **servicesProvider**: *any*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md).[servicesProvider](../interfaces/iappdelegate.md#servicesprovider)*

Defined in src/engine/DefaultAppDelegate.ts:8

## Accessors

###  moddleOptions

• **get moddleOptions**(): *object*

Defined in src/engine/DefaultAppDelegate.ts:13

**Returns:** *object*

* **name**: *string* = "Node bpmn-engine"

* **prefix**: *string* = "js"

* **types**: *object | object[]* = [{
    "name": "Task",
    "isAbstract": true,
    "extends": [
      "bpmn:Task"
    ],
    "properties": [
      {
        "name": "result",
        "isAttr": true,
        "type": "String"
      }
    ]
  }, {
    "name": "Output",
    "superClass": ["Element"]
  }, {
    "name": "Collectable",
    "isAbstract": true,
    "extends": ["bpmn:MultiInstanceLoopCharacteristics"],
    "properties": [
      {
        "name": "collection",
        "isAttr": true,
        "type": "String"
      },
      {
        "name": "elementVariable",
        "isAttr": true,
        "type": "String"
      }
    ]
  }, {
    "name": "FormSupported",
    "isAbstract": true,
    "extends": [
      "bpmn:StartEvent",
      "bpmn:UserTask"
    ],
    "properties": [
      {
        "name": "formKey",
        "isAttr": true,
        "type": "String"
      }
    ]
  }]

* **uri**: *string* = "http://paed01.github.io/bpmn-engine/schema/2017/08/bpmn"

* ### **xml**: *object*

  * **tagAlias**: *string* = "lowerCase"

## Methods

###  executionEvent

▸ **executionEvent**(`__namedParameters`: object): *Promise‹void›*

Defined in src/engine/DefaultAppDelegate.ts:23

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`event` | any |
`execution` | any |
`item` | any |

**Returns:** *Promise‹void›*

___

###  executionStarted

▸ **executionStarted**(`execution`: [IExecutionContext](../interfaces/iexecutioncontext.md)): *Promise‹void›*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [IExecutionContext](../interfaces/iexecutioncontext.md) |

**Returns:** *Promise‹void›*

___

###  issueMessage

▸ **issueMessage**(`messageId`: any, `data`: any): *Promise‹void›*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:57

is called when an event throws a message that can not be answered by another process

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageId` | any | - |
`data` | any |   |

**Returns:** *Promise‹void›*

___

###  issueSignal

▸ **issueSignal**(`signalId`: any, `data`: any): *Promise‹void›*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:60

**Parameters:**

Name | Type |
------ | ------ |
`signalId` | any |
`data` | any |

**Returns:** *Promise‹void›*

___

###  messageThrown

▸ **messageThrown**(`messageId`: any, `data`: any, `messageMatchingKey`: any, `item`: [Item](item.md)): *Promise‹void›*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:38

 is called when a event throws a message

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageId` | any | - |
`data` | any | - |
`messageMatchingKey` | any | - |
`item` | [Item](item.md) |   |

**Returns:** *Promise‹void›*

___

###  scopeEval

▸ **scopeEval**(`scope`: any, `script`: any): *any*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:78

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

Defined in src/engine/DefaultAppDelegate.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`scope` | any |
`script` | any |

**Returns:** *Promise‹any›*

___

###  serviceCalled

▸ **serviceCalled**(`serviceName`: any, `data`: any, `item`: [Item](item.md)): *Promise‹void›*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:75

**Parameters:**

Name | Type |
------ | ------ |
`serviceName` | any |
`data` | any |
`item` | [Item](item.md) |

**Returns:** *Promise‹void›*

___

###  signalThrown

▸ **signalThrown**(`signalId`: any, `data`: any, `messageMatchingKey`: any, `item`: [Item](item.md)): *Promise‹void›*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in src/engine/DefaultAppDelegate.ts:63

**Parameters:**

Name | Type |
------ | ------ |
`signalId` | any |
`data` | any |
`messageMatchingKey` | any |
`item` | [Item](item.md) |

**Returns:** *Promise‹void›*
