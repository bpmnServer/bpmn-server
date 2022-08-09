[bpmn-server](../README.md) › [Process](process.md)

# Class: Process

## Hierarchy

* **Process**

## Index

### Constructors

* [constructor](process.md#constructor)

### Properties

* [childrenNodes](process.md#childrennodes)
* [def](process.md#def)
* [eventSubProcesses](process.md#eventsubprocesses)
* [id](process.md#id)
* [isExecutable](process.md#isexecutable)
* [name](process.md#name)
* [parent](process.md#parent)
* [subProcessEvents](process.md#subprocessevents)

### Methods

* [end](process.md#end)
* [getEventSubProcessStart](process.md#geteventsubprocessstart)
* [getStartNode](process.md#getstartnode)
* [getStartNodes](process.md#getstartnodes)
* [init](process.md#init)
* [start](process.md#start)

## Constructors

###  constructor

\+ **new Process**(`definition`: any, `parent`: any): *[Process](process.md)*

Defined in bpmnServer/src/elements/Process.ts:19

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`definition` | any | - |
`parent` | any | null |

**Returns:** *[Process](process.md)*

## Properties

###  childrenNodes

• **childrenNodes**: *[Node](node.md)[]*

Defined in bpmnServer/src/elements/Process.ts:17

___

###  def

• **def**: *[Definition](definition.md)*

Defined in bpmnServer/src/elements/Process.ts:15

___

###  eventSubProcesses

• **eventSubProcesses**: *any[]*

Defined in bpmnServer/src/elements/Process.ts:18

___

###  id

• **id**: *any*

Defined in bpmnServer/src/elements/Process.ts:12

___

###  isExecutable

• **isExecutable**: *any*

Defined in bpmnServer/src/elements/Process.ts:14

___

###  name

• **name**: *any*

Defined in bpmnServer/src/elements/Process.ts:13

___

###  parent

• **parent**: *[Process](process.md)*

Defined in bpmnServer/src/elements/Process.ts:16

___

###  subProcessEvents

• **subProcessEvents**: *any[]*

Defined in bpmnServer/src/elements/Process.ts:19

## Methods

###  end

▸ **end**(): *Promise‹void›*

Defined in bpmnServer/src/elements/Process.ts:54

Notify process that it ended

**Returns:** *Promise‹void›*

___

###  getEventSubProcessStart

▸ **getEventSubProcessStart**(): *[Node](node.md)[]*

Defined in bpmnServer/src/elements/Process.ts:83

**Returns:** *[Node](node.md)[]*

___

###  getStartNode

▸ **getStartNode**(`userInvokable`: boolean): *any*

Defined in bpmnServer/src/elements/Process.ts:63

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`userInvokable` | boolean | false |

**Returns:** *any*

___

###  getStartNodes

▸ **getStartNodes**(`userInvokable`: boolean): *any[]*

Defined in bpmnServer/src/elements/Process.ts:66

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`userInvokable` | boolean | false |

**Returns:** *any[]*

___

###  init

▸ **init**(`children`: any, `eventSubProcesses`: any): *void*

Defined in bpmnServer/src/elements/Process.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`children` | any |
`eventSubProcesses` | any |

**Returns:** *void*

___

###  start

▸ **start**(`execution`: [Execution](execution.md), `parentToken`: any): *Promise‹void›*

Defined in bpmnServer/src/elements/Process.ts:35

Notify process that it started

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [Execution](execution.md) |
`parentToken` | any |

**Returns:** *Promise‹void›*
