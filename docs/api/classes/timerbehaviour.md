[bpmn-server](../README.md) › [TimerBehaviour](timerbehaviour.md)

# Class: TimerBehaviour

## Hierarchy

* [Behaviour](behaviour.md)

  ↳ **TimerBehaviour**

## Implements

* [IBehaviour](../interfaces/ibehaviour.md)

## Index

### Constructors

* [constructor](timerbehaviour.md#constructor)

### Properties

* [definition](timerbehaviour.md#definition)
* [duration](timerbehaviour.md#duration)
* [node](timerbehaviour.md#node)
* [timeCycle](timerbehaviour.md#timecycle)

### Methods

* [describe](timerbehaviour.md#describe)
* [end](timerbehaviour.md#end)
* [expires](timerbehaviour.md#expires)
* [getItemAttributes](timerbehaviour.md#getitemattributes)
* [getNodeAttributes](timerbehaviour.md#getnodeattributes)
* [init](timerbehaviour.md#init)
* [restored](timerbehaviour.md#restored)
* [resume](timerbehaviour.md#resume)
* [run](timerbehaviour.md#run)
* [start](timerbehaviour.md#start)
* [startTimer](timerbehaviour.md#starttimer)
* [timeDue](timerbehaviour.md#timedue)

## Constructors

###  constructor

\+ **new TimerBehaviour**(`node`: [Node](node.md), `definition`: any): *[TimerBehaviour](timerbehaviour.md)*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[constructor](scriptbehaviour.md#constructor)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](node.md) |
`definition` | any |

**Returns:** *[TimerBehaviour](timerbehaviour.md)*

## Properties

###  definition

• **definition**: *any*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md).[definition](../interfaces/ibehaviour.md#definition)*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[definition](scriptbehaviour.md#definition)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:39

___

###  duration

• **duration**: *any*

Defined in bpmnServer/src/elements/behaviours/Timer.ts:41

___

###  node

• **node**: *[Node](node.md)*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md).[node](../interfaces/ibehaviour.md#node)*

*Inherited from [ScriptBehaviour](scriptbehaviour.md).[node](scriptbehaviour.md#node)*

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:38

___

###  timeCycle

• **timeCycle**: *any*

Defined in bpmnServer/src/elements/behaviours/Timer.ts:42

## Methods

###  describe

▸ **describe**(): *string[]*

*Implementation of [IBehaviour](../interfaces/ibehaviour.md)*

*Overrides [Behaviour](behaviour.md).[describe](behaviour.md#describe)*

Defined in bpmnServer/src/elements/behaviours/Timer.ts:63

**Returns:** *string[]*

___

###  end

▸ **end**(`item`: [Item](item.md)): *void*

*Overrides [Behaviour](behaviour.md).[end](behaviour.md#end)*

Defined in bpmnServer/src/elements/behaviours/Timer.ts:130

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  expires

▸ **expires**(): *void*

Defined in bpmnServer/src/elements/behaviours/Timer.ts:120

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

Defined in bpmnServer/src/elements/behaviours/Timer.ts:43

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

▸ **resume**(): *void*

*Overrides [Behaviour](behaviour.md).[resume](behaviour.md#resume)*

Defined in bpmnServer/src/elements/behaviours/Timer.ts:134

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

▸ **start**(`item`: [Item](item.md)): *[NODE_ACTION](../enums/node_action.md)*

*Overrides [Behaviour](behaviour.md).[start](behaviour.md#start)*

Defined in bpmnServer/src/elements/behaviours/Timer.ts:90

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *[NODE_ACTION](../enums/node_action.md)*

___

###  startTimer

▸ **startTimer**(`item`: any): *void*

Defined in bpmnServer/src/elements/behaviours/Timer.ts:102

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

___

###  timeDue

▸ **timeDue**(`timerModifier`: any): *number*

Defined in bpmnServer/src/elements/behaviours/Timer.ts:71

return the next time the timer is due
format is time format

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`timerModifier` | any | null | for testing purposes configuration can alter the timer  |

**Returns:** *number*
