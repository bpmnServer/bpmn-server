[bpmn-server](../README.md) › [LoopBehaviour](loopbehaviour.md)

# Class: LoopBehaviour

## Hierarchy

* [Behaviour](behaviour.md)

  ↳ **LoopBehaviour**

## Implements

* [IBehaviour](../interfaces/ibehaviour.md)

## Index

### Constructors

* [constructor](loopbehaviour.md#constructor)

### Properties

* [definition](loopbehaviour.md#definition)
* [node](loopbehaviour.md#node)

### Accessors

* [collection](loopbehaviour.md#collection)

### Methods

* [describe](loopbehaviour.md#describe)
* [end](loopbehaviour.md#end)
* [getItemAttributes](loopbehaviour.md#getitemattributes)
* [getNodeAttributes](loopbehaviour.md#getnodeattributes)
* [init](loopbehaviour.md#init)
* [isSequential](loopbehaviour.md#issequential)
* [restored](loopbehaviour.md#restored)
* [resume](loopbehaviour.md#resume)
* [run](loopbehaviour.md#run)
* [start](loopbehaviour.md#start)

## Constructors

###  constructor

\+ **new LoopBehaviour**(`node`: [Node](node.md), `definition`: any): *[LoopBehaviour](loopbehaviour.md)*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[constructor](scriptbehaviour.md#constructor)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](node.md) |
`definition` | any |

**Returns:** *[LoopBehaviour](loopbehaviour.md)*

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

###  collection

• **get collection**(): *any*

Defined in bpmnServer/src/elements/behaviours/Loop.ts:9

**Returns:** *any*

## Methods

###  describe

▸ **describe**(): *string[]*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md)*

*Overrides [Behaviour](behaviour.md).[describe](behaviour.md#describe)*

Defined in bpmnServer/src/elements/behaviours/Loop.ts:19

**Returns:** *string[]*

___

###  end

▸ **end**(`item`: [Item](item.md)): *void*

*Inherited from [Behaviour](behaviour.md).[end](behaviour.md#end)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:50

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

Defined in bpmnServer/src/elements/behaviours/Loop.ts:6

**Returns:** *void*

___

###  isSequential

▸ **isSequential**(): *any*

Defined in bpmnServer/src/elements/behaviours/Loop.ts:16

**Returns:** *any*

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

▸ **start**(`item`: [Item](item.md)): *void*

*Inherited from [Behaviour](behaviour.md).[start](behaviour.md#start)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:48

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*
