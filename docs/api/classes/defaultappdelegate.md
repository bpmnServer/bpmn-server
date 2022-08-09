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

* [server](defaultappdelegate.md#server)
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
* [sendEmail](defaultappdelegate.md#sendemail)
* [serviceCalled](defaultappdelegate.md#servicecalled)
* [signalThrown](defaultappdelegate.md#signalthrown)

## Constructors

###  constructor

\+ **new DefaultAppDelegate**(`server`: any): *[DefaultAppDelegate](defaultappdelegate.md)*

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[DefaultAppDelegate](defaultappdelegate.md)*

## Properties

###  server

• **server**: *any*

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:8

___

###  servicesProvider

• **servicesProvider**: *any*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md).[servicesProvider](../interfaces/iappdelegate.md#servicesprovider)*

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:14

## Accessors

###  moddleOptions

• **get moddleOptions**(): *object*

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:19

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

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:29

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

▸ **executionStarted**(`execution`: [IExecution](../interfaces/iexecution.md)): *Promise‹void›*

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [IExecution](../interfaces/iexecution.md) |

**Returns:** *Promise‹void›*

___

###  issueMessage

▸ **issueMessage**(`messageId`: any, `data`: any): *Promise‹void›*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:63

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

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`signalId` | any |
`data` | any |

**Returns:** *Promise‹void›*

___

###  messageThrown

▸ **messageThrown**(`messageId`: any, `data`: any, `messageMatchingKey`: any, `item`: [Item](item.md)): *Promise‹void›*

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:44

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

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:85

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

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:95

**Parameters:**

Name | Type |
------ | ------ |
`scope` | any |
`script` | any |

**Returns:** *Promise‹any›*

___

###  sendEmail

▸ **sendEmail**(`to`: any, `msg`: any, `body`: any): *void*

*Implementation of [IAppDelegate](../interfaces/iappdelegate.md)*

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:10

**Parameters:**

Name | Type |
------ | ------ |
`to` | any |
`msg` | any |
`body` | any |

**Returns:** *void*

___

###  serviceCalled

▸ **serviceCalled**(`serviceName`: any, `data`: any, `item`: [Item](item.md)): *Promise‹void›*

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:81

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

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`signalId` | any |
`data` | any |
`messageMatchingKey` | any |
`item` | [Item](item.md) |

**Returns:** *Promise‹void›*
