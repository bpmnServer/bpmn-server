[bpmn-server](../README.md) › [CamundaFormData](camundaformdata.md)

# Class: CamundaFormData

## Hierarchy

* [Behaviour](behaviour.md)

  ↳ **CamundaFormData**

## Implements

* [IBehaviour](../interfaces/ibehaviour.md)

## Index

### Constructors

* [constructor](camundaformdata.md#constructor)

### Properties

* [definition](camundaformdata.md#definition)
* [fields](camundaformdata.md#fields)
* [node](camundaformdata.md#node)

### Methods

* [describe](camundaformdata.md#describe)
* [end](camundaformdata.md#end)
* [getFields](camundaformdata.md#getfields)
* [getItemAttributes](camundaformdata.md#getitemattributes)
* [getNodeAttributes](camundaformdata.md#getnodeattributes)
* [init](camundaformdata.md#init)
* [restored](camundaformdata.md#restored)
* [resume](camundaformdata.md#resume)
* [run](camundaformdata.md#run)
* [start](camundaformdata.md#start)

## Constructors

###  constructor

\+ **new CamundaFormData**(`node`: [Node](node.md), `definition`: any): *[CamundaFormData](camundaformdata.md)*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[constructor](scriptbehaviour.md#constructor)*

Defined in src/elements/behaviours/Behaviour.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](node.md) |
`definition` | any |

**Returns:** *[CamundaFormData](camundaformdata.md)*

## Properties

###  definition

• **definition**: *any*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[definition](scriptbehaviour.md#definition)*

Defined in src/elements/behaviours/Behaviour.ts:36

___

###  fields

• **fields**: *any*

Defined in src/elements/behaviours/Form.ts:10

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

Defined in src/elements/behaviours/Form.ts:18

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

###  getFields

▸ **getFields**(): *any*

Defined in src/elements/behaviours/Form.ts:17

**Returns:** *any*

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

Defined in src/elements/behaviours/Form.ts:11

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

*Inherited from [Behaviour](behaviour.md).[start](behaviour.md#start)*

Defined in src/elements/behaviours/Behaviour.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*
