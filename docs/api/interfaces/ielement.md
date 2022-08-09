[bpmn-server](../README.md) › [IElement](ielement.md)

# Interface: IElement

## Hierarchy

* **IElement**

  ↳ [IFlow](iflow.md)

  ↳ [INode](inode.md)

## Implemented by

* [BoundaryEvent](../classes/boundaryevent.md)
* [BusinessRuleTask](../classes/businessruletask.md)
* [CallActivity](../classes/callactivity.md)
* [CatchEvent](../classes/catchevent.md)
* [Element](../classes/element.md)
* [EndEvent](../classes/endevent.md)
* [Event](../classes/event.md)
* [EventBasedGateway](../classes/eventbasedgateway.md)
* [Flow](../classes/flow.md)
* [Gateway](../classes/gateway.md)
* [MessageFlow](../classes/messageflow.md)
* [Node](../classes/node.md)
* [ReceiveTask](../classes/receivetask.md)
* [ScriptTask](../classes/scripttask.md)
* [SendTask](../classes/sendtask.md)
* [ServiceTask](../classes/servicetask.md)
* [StartEvent](../classes/startevent.md)
* [SubProcess](../classes/subprocess.md)
* [ThrowEvent](../classes/throwevent.md)
* [UserTask](../classes/usertask.md)
* [XORGateway](../classes/xorgateway.md)

## Index

### Properties

* [behaviours](ielement.md#behaviours)
* [id](ielement.md#id)
* [name](ielement.md#name)
* [type](ielement.md#type)

### Methods

* [addBehaviour](ielement.md#addbehaviour)
* [continue](ielement.md#continue)
* [describe](ielement.md#describe)
* [getBehaviour](ielement.md#getbehaviour)
* [hasBehaviour](ielement.md#hasbehaviour)
* [restored](ielement.md#restored)
* [resume](ielement.md#resume)

## Properties

###  behaviours

• **behaviours**: *Map‹any, any›*

Defined in bpmnServer/src/interfaces/elements.ts:24

___

###  id

• **id**: *any*

Defined in bpmnServer/src/interfaces/elements.ts:21

___

###  name

• **name**: *any*

Defined in bpmnServer/src/interfaces/elements.ts:23

___

###  type

• **type**: *any*

Defined in bpmnServer/src/interfaces/elements.ts:22

## Methods

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

Defined in bpmnServer/src/interfaces/elements.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

___

###  continue

▸ **continue**(`item`: [IItem](iitem.md)): *void*

Defined in bpmnServer/src/interfaces/elements.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *void*

___

###  describe

▸ **describe**(): *string[][]*

Defined in bpmnServer/src/interfaces/elements.ts:26

**Returns:** *string[][]*

___

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

Defined in bpmnServer/src/interfaces/elements.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

___

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

Defined in bpmnServer/src/interfaces/elements.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

___

###  restored

▸ **restored**(`item`: [IItem](iitem.md)): *void*

Defined in bpmnServer/src/interfaces/elements.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *void*

___

###  resume

▸ **resume**(`item`: [IItem](iitem.md)): *void*

Defined in bpmnServer/src/interfaces/elements.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *void*
