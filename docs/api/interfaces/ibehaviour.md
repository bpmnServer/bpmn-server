[bpmn-server](../README.md) › [IBehaviour](ibehaviour.md)

# Interface: IBehaviour

Behaviour
     ioSpecification
     timer
     message
     signal

  each behaviour is a class
     it scans def and insert itself to perform actions as required

## Hierarchy

* **IBehaviour**

## Implemented by

* [Behaviour](../classes/behaviour.md)
* [CamundaFormData](../classes/camundaformdata.md)
* [ErrorEventBehaviour](../classes/erroreventbehaviour.md)
* [IOBehaviour](../classes/iobehaviour.md)
* [LoopBehaviour](../classes/loopbehaviour.md)
* [MessageEventBehaviour](../classes/messageeventbehaviour.md)
* [ScriptBehaviour](../classes/scriptbehaviour.md)
* [SignalEventBehaviour](../classes/signaleventbehaviour.md)
* [TerminateBehaviour](../classes/terminatebehaviour.md)
* [TimerBehaviour](../classes/timerbehaviour.md)

## Index

### Properties

* [definition](ibehaviour.md#definition)
* [node](ibehaviour.md#node)

### Methods

* [describe](ibehaviour.md#describe)
* [end](ibehaviour.md#end)
* [getItemAttributes](ibehaviour.md#getitemattributes)
* [getNodeAttributes](ibehaviour.md#getnodeattributes)
* [init](ibehaviour.md#init)
* [restored](ibehaviour.md#restored)
* [resume](ibehaviour.md#resume)
* [run](ibehaviour.md#run)
* [start](ibehaviour.md#start)

## Properties

###  definition

• **definition**: *any*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:25

___

###  node

• **node**: *[Node](../classes/node.md)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:24

## Methods

###  describe

▸ **describe**(): *string[]*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:33

**Returns:** *string[]*

___

###  end

▸ **end**(`item`: [IItem](iitem.md)): *any*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *any*

___

###  getItemAttributes

▸ **getItemAttributes**(`item`: [IItem](iitem.md), `attributes`: any[]): *any*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:32

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |
`attributes` | any[] |

**Returns:** *any*

___

###  getNodeAttributes

▸ **getNodeAttributes**(`attributes`: any[]): *any*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *any*

___

###  init

▸ **init**(): *any*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:34

**Returns:** *any*

___

###  restored

▸ **restored**(`item`: [IItem](iitem.md)): *any*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *any*

___

###  resume

▸ **resume**(`item`: [IItem](iitem.md)): *any*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *any*

___

###  run

▸ **run**(`item`: [IItem](iitem.md)): *any*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *any*

___

###  start

▸ **start**(`item`: [IItem](iitem.md)): *any*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *any*
