[bpmn-server](../README.md) › [MessageEventBehaviour](messageeventbehaviour.md)

# Class: MessageEventBehaviour

it is part of the following:

 events
 sendTask
 receiveTask

## Hierarchy

* [Behaviour](behaviour.md)

  ↳ **MessageEventBehaviour**

## Implements

* [IBehaviour](../interfaces/ibehaviour.md)

## Index

### Constructors

* [constructor](messageeventbehaviour.md#constructor)

### Properties

* [definition](messageeventbehaviour.md#definition)
* [node](messageeventbehaviour.md#node)

### Accessors

* [messageId](messageeventbehaviour.md#messageid)

### Methods

* [describe](messageeventbehaviour.md#describe)
* [end](messageeventbehaviour.md#end)
* [getItemAttributes](messageeventbehaviour.md#getitemattributes)
* [getNodeAttributes](messageeventbehaviour.md#getnodeattributes)
* [init](messageeventbehaviour.md#init)
* [restored](messageeventbehaviour.md#restored)
* [resume](messageeventbehaviour.md#resume)
* [run](messageeventbehaviour.md#run)
* [start](messageeventbehaviour.md#start)

## Constructors

###  constructor

\+ **new MessageEventBehaviour**(`node`: [Node](node.md), `definition`: any): *[MessageEventBehaviour](messageeventbehaviour.md)*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[constructor](scriptbehaviour.md#constructor)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](node.md) |
`definition` | any |

**Returns:** *[MessageEventBehaviour](messageeventbehaviour.md)*

## Properties

###  definition

• **definition**: *any*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md).[definition](../interfaces/ibehaviour.md#definition)*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[definition](scriptbehaviour.md#definition)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:39

___

###  node

• **node**: *[Node](node.md)*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md).[node](../interfaces/ibehaviour.md#node)*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[node](scriptbehaviour.md#node)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:38

## Accessors

###  messageId

• **get messageId**(): *any*

Defined in bpmnServer/src/elements/behaviours/MessageSignal.ts:38

**Returns:** *any*

## Methods

###  describe

▸ **describe**(): *string[]*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md)*

*Overrides [Behaviour](behaviour.md).[describe](behaviour.md#describe)*

Defined in bpmnServer/src/elements/behaviours/MessageSignal.ts:42

**Returns:** *string[]*

___

###  end

▸ **end**(`item`: [Item](item.md)): *void*

*Overrides [Behaviour](behaviour.md).[end](behaviour.md#end)*

Defined in bpmnServer/src/elements/behaviours/MessageSignal.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  getItemAttributes

▸ **getItemAttributes**(`item`: [Item](item.md), `attributes`: any[]): *void*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[getItemAttributes](scriptbehaviour.md#getitemattributes)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |
`attributes` | any[] |

**Returns:** *void*

___

###  getNodeAttributes

▸ **getNodeAttributes**(`attributes`: any[]): *void*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md)*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[getNodeAttributes](scriptbehaviour.md#getnodeattributes)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md)*

*Overrides [Behaviour](behaviour.md).[init](behaviour.md#init)*

Defined in bpmnServer/src/elements/behaviours/MessageSignal.ts:17

**Returns:** *void*

___

###  restored

▸ **restored**(`item`: any): *void*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[restored](scriptbehaviour.md#restored)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

___

###  resume

▸ **resume**(`item`: [Item](item.md)): *void*

*Inherited from [Behaviour](behaviour.md).[resume](behaviour.md#resume)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  run

▸ **run**(`item`: [Item](item.md)): *void*

*Inherited from [Behaviour](behaviour.md).[run](behaviour.md#run)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  start

▸ **start**(`item`: [Item](item.md)): *Promise‹void›*

*Overrides [Behaviour](behaviour.md).[start](behaviour.md#start)*

Defined in bpmnServer/src/elements/behaviours/MessageSignal.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹void›*
