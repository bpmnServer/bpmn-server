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

Defined in src/elements/behaviours/Behaviour.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](node.md) |
`definition` | any |

**Returns:** *[LoopBehaviour](loopbehaviour.md)*

## Properties

###  definition

• **definition**: *any*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[definition](scriptbehaviour.md#definition)*

Defined in src/elements/behaviours/Behaviour.ts:36

___

###  node

• **node**: *[Node](node.md)*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[node](scriptbehaviour.md#node)*

Defined in src/elements/behaviours/Behaviour.ts:35

## Accessors

###  collection

• **get collection**(): *any*

Defined in src/elements/behaviours/Loop.ts:9

**Returns:** *any*

## Methods

###  describe

▸ **describe**(): *string[]*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md)*

*Overrides [Behaviour](behaviour.md).[describe](behaviour.md#describe)*

Defined in src/elements/behaviours/Loop.ts:19

**Returns:** *string[]*

___

###  end

▸ **end**(`item`: [Item](item.md)): *void*

*Inherited from [Behaviour](behaviour.md).[end](behaviour.md#end)*

Defined in src/elements/behaviours/Behaviour.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  getItemAttributes

▸ **getItemAttributes**(`item`: [Item](item.md), `attributes`: any[]): *void*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[getItemAttributes](scriptbehaviour.md#getitemattributes)*

Defined in src/elements/behaviours/Behaviour.ts:50

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

Defined in src/elements/behaviours/Behaviour.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Overrides [Behaviour](behaviour.md).[init](behaviour.md#init)*

Defined in src/elements/behaviours/Loop.ts:6

**Returns:** *void*

___

###  isSequential

▸ **isSequential**(): *any*

Defined in src/elements/behaviours/Loop.ts:16

**Returns:** *any*

___

###  restored

▸ **restored**(`item`: any): *void*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[restored](scriptbehaviour.md#restored)*

Defined in src/elements/behaviours/Behaviour.ts:42

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

___

###  resume

▸ **resume**(`item`: [Item](item.md)): *void*

*Inherited from [Behaviour](behaviour.md).[resume](behaviour.md#resume)*

Defined in src/elements/behaviours/Behaviour.ts:48

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  run

▸ **run**(`item`: [Item](item.md)): *void*

*Inherited from [Behaviour](behaviour.md).[run](behaviour.md#run)*

Defined in src/elements/behaviours/Behaviour.ts:46

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  start

▸ **start**(`item`: [Item](item.md)): *void*

*Inherited from [Behaviour](behaviour.md).[start](behaviour.md#start)*

Defined in src/elements/behaviours/Behaviour.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*
