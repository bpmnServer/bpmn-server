[bpmn-server](../README.md) › [ScriptBehaviour](scriptbehaviour.md)

# Class: ScriptBehaviour

## Hierarchy

* [Behaviour](behaviour.md)

  ↳ **ScriptBehaviour**

## Implements

* [IBehaviour](../interfaces/ibehaviour.md)

## Index

### Constructors

* [constructor](scriptbehaviour.md#constructor)

### Properties

* [definition](scriptbehaviour.md#definition)
* [event](scriptbehaviour.md#event)
* [node](scriptbehaviour.md#node)
* [script](scriptbehaviour.md#script)

### Methods

* [describe](scriptbehaviour.md#describe)
* [end](scriptbehaviour.md#end)
* [executeScript](scriptbehaviour.md#executescript)
* [getItemAttributes](scriptbehaviour.md#getitemattributes)
* [getNodeAttributes](scriptbehaviour.md#getnodeattributes)
* [init](scriptbehaviour.md#init)
* [restored](scriptbehaviour.md#restored)
* [resume](scriptbehaviour.md#resume)
* [run](scriptbehaviour.md#run)
* [start](scriptbehaviour.md#start)

## Constructors

###  constructor

\+ **new ScriptBehaviour**(`node`: [Node](node.md), `definition`: any): *[ScriptBehaviour](scriptbehaviour.md)*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[constructor](scriptbehaviour.md#constructor)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](node.md) |
`definition` | any |

**Returns:** *[ScriptBehaviour](scriptbehaviour.md)*

## Properties

###  definition

• **definition**: *any*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md).[definition](../interfaces/ibehaviour.md#definition)*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[definition](scriptbehaviour.md#definition)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:39

___

###  event

• **event**: *any*

Defined in bpmnServer/src/elements/behaviours/Script.ts:12

___

###  node

• **node**: *[Node](node.md)*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md).[node](../interfaces/ibehaviour.md#node)*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[node](scriptbehaviour.md#node)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:38

___

###  script

• **script**: *any*

Defined in bpmnServer/src/elements/behaviours/Script.ts:13

## Methods

###  describe

▸ **describe**(): *any[]*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md)*

*Overrides [Behaviour](behaviour.md).[describe](behaviour.md#describe)*

Defined in bpmnServer/src/elements/behaviours/Script.ts:42

**Returns:** *any[]*

___

###  end

▸ **end**(`item`: [Item](item.md)): *void*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md)*

*Overrides [Behaviour](behaviour.md).[end](behaviour.md#end)*

Defined in bpmnServer/src/elements/behaviours/Script.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  executeScript

▸ **executeScript**(`item`: any): *void*

Defined in bpmnServer/src/elements/behaviours/Script.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

___

###  getItemAttributes

▸ **getItemAttributes**(`item`: [Item](item.md), `attributes`: any[]): *void*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md)*

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

Defined in bpmnServer/src/elements/behaviours/Script.ts:14

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

*Implementation of [IBehaviour](../interfaces/ibehaviour.md)*

*Overrides [Behaviour](behaviour.md).[resume](behaviour.md#resume)*

Defined in bpmnServer/src/elements/behaviours/Script.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  run

▸ **run**(`item`: [Item](item.md)): *void*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md)*

*Overrides [Behaviour](behaviour.md).[run](behaviour.md#run)*

Defined in bpmnServer/src/elements/behaviours/Script.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  start

▸ **start**(`item`: [Item](item.md)): *void*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md)*

*Overrides [Behaviour](behaviour.md).[start](behaviour.md#start)*

Defined in bpmnServer/src/elements/behaviours/Script.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*
