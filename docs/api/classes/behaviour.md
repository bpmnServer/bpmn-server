[bpmn-server](../README.md) › [Behaviour](behaviour.md)

# Class: Behaviour

## Hierarchy

* **Behaviour**

  ↳ [ScriptBehaviour](scriptbehaviour.md)

  ↳ [CamundaFormData](camundaformdata.md)

  ↳ [IOBehaviour](iobehaviour.md)

  ↳ [MessageEventBehaviour](messageeventbehaviour.md)

  ↳ [SignalEventBehaviour](signaleventbehaviour.md)

  ↳ [TerminateBehaviour](terminatebehaviour.md)

  ↳ [TimerBehaviour](timerbehaviour.md)

  ↳ [LoopBehaviour](loopbehaviour.md)

## Implements

* [IBehaviour](../interfaces/ibehaviour.md)

## Index

### Constructors

* [constructor](behaviour.md#constructor)

### Properties

* [definition](behaviour.md#definition)
* [node](behaviour.md#node)

### Methods

* [describe](behaviour.md#describe)
* [end](behaviour.md#end)
* [getItemAttributes](behaviour.md#getitemattributes)
* [getNodeAttributes](behaviour.md#getnodeattributes)
* [init](behaviour.md#init)
* [restored](behaviour.md#restored)
* [resume](behaviour.md#resume)
* [run](behaviour.md#run)
* [start](behaviour.md#start)

## Constructors

###  constructor

\+ **new Behaviour**(`node`: [Node](node.md), `definition`: any): *[Behaviour](behaviour.md)*

Defined in src/elements/behaviours/Behaviour.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](node.md) |
`definition` | any |

**Returns:** *[Behaviour](behaviour.md)*

## Properties

###  definition

• **definition**: *any*

Defined in src/elements/behaviours/Behaviour.ts:36

___

###  node

• **node**: *[Node](node.md)*

Defined in src/elements/behaviours/Behaviour.ts:35

## Methods

###  describe

▸ **describe**(): *any[]*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md)*

Defined in src/elements/behaviours/Behaviour.ts:43

**Returns:** *any[]*

___

###  end

▸ **end**(`item`: [Item](item.md)): *void*

Defined in src/elements/behaviours/Behaviour.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  getItemAttributes

▸ **getItemAttributes**(`item`: [Item](item.md), `attributes`: any[]): *void*

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

Defined in src/elements/behaviours/Behaviour.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *void*

___

###  init

▸ **init**(): *void*

Defined in src/elements/behaviours/Behaviour.ts:44

**Returns:** *void*

___

###  restored

▸ **restored**(`item`: any): *void*

Defined in src/elements/behaviours/Behaviour.ts:42

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

___

###  resume

▸ **resume**(`item`: [Item](item.md)): *void*

Defined in src/elements/behaviours/Behaviour.ts:48

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  run

▸ **run**(`item`: [Item](item.md)): *void*

Defined in src/elements/behaviours/Behaviour.ts:46

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  start

▸ **start**(`item`: [Item](item.md)): *void*

Defined in src/elements/behaviours/Behaviour.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*
