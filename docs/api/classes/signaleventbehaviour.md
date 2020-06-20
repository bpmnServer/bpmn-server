[bpmn-server](../README.md) › [SignalEventBehaviour](signaleventbehaviour.md)

# Class: SignalEventBehaviour

## Hierarchy

* [Behaviour](behaviour.md)

  ↳ **SignalEventBehaviour**

## Implements

* [IBehaviour](../interfaces/ibehaviour.md)

## Index

### Constructors

* [constructor](signaleventbehaviour.md#constructor)

### Properties

* [definition](signaleventbehaviour.md#definition)
* [node](signaleventbehaviour.md#node)

### Methods

* [describe](signaleventbehaviour.md#describe)
* [end](signaleventbehaviour.md#end)
* [getItemAttributes](signaleventbehaviour.md#getitemattributes)
* [getNodeAttributes](signaleventbehaviour.md#getnodeattributes)
* [init](signaleventbehaviour.md#init)
* [restored](signaleventbehaviour.md#restored)
* [resume](signaleventbehaviour.md#resume)
* [run](signaleventbehaviour.md#run)
* [start](signaleventbehaviour.md#start)

## Constructors

###  constructor

\+ **new SignalEventBehaviour**(`node`: [Node](node.md), `definition`: any): *[SignalEventBehaviour](signaleventbehaviour.md)*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[constructor](scriptbehaviour.md#constructor)*

Defined in src/elements/behaviours/Behaviour.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](node.md) |
`definition` | any |

**Returns:** *[SignalEventBehaviour](signaleventbehaviour.md)*

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

## Methods

###  describe

▸ **describe**(): *string[]*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md)*

*Overrides [Behaviour](behaviour.md).[describe](behaviour.md#describe)*

Defined in src/elements/behaviours/MessageSignal.ts:19

**Returns:** *string[]*

___

###  end

▸ **end**(`item`: [Item](item.md)): *void*

*Overrides [Behaviour](behaviour.md).[end](behaviour.md#end)*

Defined in src/elements/behaviours/MessageSignal.ts:17

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

*Inherited from [Behaviour](behaviour.md).[init](behaviour.md#init)*

Defined in src/elements/behaviours/Behaviour.ts:44

**Returns:** *void*

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

*Overrides [Behaviour](behaviour.md).[start](behaviour.md#start)*

Defined in src/elements/behaviours/MessageSignal.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*
