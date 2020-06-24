[bpmn-server](../README.md) › [BehaviourLoader](behaviourloader.md)

# Class: BehaviourLoader

## Hierarchy

* **BehaviourLoader**

## Index

### Properties

* [behaviours](behaviourloader.md#static-behaviours)

### Methods

* [load](behaviourloader.md#static-load)

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
            name: Behaviour_names.SignalEventDefinition, funct: function (node, def) {
                return new SignalEventBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.CamundaScript, funct: function (node, def) {
                return new ScriptBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.TerminateEventDefinition, funct: function (node, def) {
                return new TerminateBehaviour(node, def);
            }
        }
    ]

Defined in src/elements/behaviours/BehaviourLoader.ts:35

## Methods

### `Static` load

▸ **load**(`node`: [Node](node.md)): *void*

Defined in src/elements/behaviours/BehaviourLoader.ts:77

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](node.md) |

**Returns:** *void*
