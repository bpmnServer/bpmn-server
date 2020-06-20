[bpmn-server](../README.md) › [BehaviourLoader](behaviourloader.md)

# Class: BehaviourLoader

## Hierarchy

* **BehaviourLoader**

## Index

### Properties

* [behaviours](behaviourloader.md#static-behaviours)

### Methods

* [load](behaviourloader.md#static-load)

### Object literals

* [Behaviours](behaviourloader.md#static-behaviours)

## Properties

### `Static` behaviours

▪ **behaviours**: *object | object[]* = [
        {
            name: Behaviour_names.TimerEventDefinition, funct: function (node, def) {
                return new TimerBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.LoopCharacteristics, funct: function (node, def) {
                return new LoopBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.CamundaFormData, funct: function (node, def) {
                return new CamundaFormData(node, def);
            }
        },
        {
            name: Behaviour_names.IOSpecification, funct: function (node, def) {
                return new IOBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.MessageEventDefinition, funct: function (node, def) {
                return new MessageEventBehaviour(node, def);
            }
        },
        {
            name: 'camunda:script', funct: function (node, def) {
                return new ScriptBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.TerminateEventDefinition, funct: function (node, def) {
                return new TerminateBehaviour(node, def);
            }
        }
    ]

Defined in src/elements/behaviours/BehaviourLoader.ts:34

## Methods

### `Static` load

▸ **load**(`node`: [Node](node.md)): *void*

Defined in src/elements/behaviours/BehaviourLoader.ts:71

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](node.md) |

**Returns:** *void*

## Object literals

### `Static` Behaviours

### ▪ **Behaviours**: *object*

Defined in src/elements/behaviours/BehaviourLoader.ts:24

###  camunda_formData

▸ **camunda_formData**(`node`: any, `def`: any): *[CamundaFormData](camundaformdata.md)‹›*

Defined in src/elements/behaviours/BehaviourLoader.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |
`def` | any |

**Returns:** *[CamundaFormData](camundaformdata.md)‹›*

###  ioSpecification

▸ **ioSpecification**(`node`: any, `def`: any): *[IOBehaviour](iobehaviour.md)‹›*

Defined in src/elements/behaviours/BehaviourLoader.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |
`def` | any |

**Returns:** *[IOBehaviour](iobehaviour.md)‹›*

###  loopCharacteristics

▸ **loopCharacteristics**(`node`: any, `def`: any): *[LoopBehaviour](loopbehaviour.md)‹›*

Defined in src/elements/behaviours/BehaviourLoader.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |
`def` | any |

**Returns:** *[LoopBehaviour](loopbehaviour.md)‹›*

###  messageEventDefinition

▸ **messageEventDefinition**(`node`: any, `def`: any): *[MessageEventBehaviour](messageeventbehaviour.md)‹›*

Defined in src/elements/behaviours/BehaviourLoader.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |
`def` | any |

**Returns:** *[MessageEventBehaviour](messageeventbehaviour.md)‹›*

###  signalEventDefinition

▸ **signalEventDefinition**(`node`: any, `def`: any): *[SignalEventBehaviour](signaleventbehaviour.md)‹›*

Defined in src/elements/behaviours/BehaviourLoader.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |
`def` | any |

**Returns:** *[SignalEventBehaviour](signaleventbehaviour.md)‹›*

###  terminateEventDefinition

▸ **terminateEventDefinition**(`node`: any, `def`: any): *[TerminateBehaviour](terminatebehaviour.md)‹›*

Defined in src/elements/behaviours/BehaviourLoader.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |
`def` | any |

**Returns:** *[TerminateBehaviour](terminatebehaviour.md)‹›*

###  timerEventDefinition

▸ **timerEventDefinition**(`node`: any, `def`: any): *[TimerBehaviour](timerbehaviour.md)‹›*

Defined in src/elements/behaviours/BehaviourLoader.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |
`def` | any |

**Returns:** *[TimerBehaviour](timerbehaviour.md)‹›*
