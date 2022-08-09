[bpmn-server](../README.md) › [BehaviourLoader](behaviourloader.md)

# Class: BehaviourLoader

## Hierarchy

* **BehaviourLoader**

## Index

### Properties

* [behaviours](behaviourloader.md#static-behaviours)

### Methods

* [load](behaviourloader.md#static-load)
* [register](behaviourloader.md#static-register)

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
            name: Behaviour_names.ErrorEventDefinition, funct: function (node, def) {
                return new ErrorEventBehaviour(node, def);
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

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:27

## Methods

### `Static` load

▸ **load**(`node`: [Node](node.md)): *void*

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:102

 1.  node.definition[<name>]
 2.  node.definition.eventDefinitions
         $type == <name>

         example:

<bpmn:timerEventDefinition id="TimerEventDefinition_07xu06a">
<bpmn:timeDuration xsi:type="bpmn:tExpression">PT2S</bpmn:timeDuration>
</bpmn:timerEventDefinition>

 3.  node.definitions.extensionElements
         $type == <name>
         example: 'camunda:formData'
<extensionElements>
<camunda:formData >
<camunda: formField id = "surname" label = "Surname" type = "string" />
<camunda: formField id = "givenName" label = "Given name" type = "string" />
</camunda:formData>
< /extensionElements>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`node` | [Node](node.md) |   |

**Returns:** *void*

___

### `Static` register

▸ **register**(`name`: any, `funct`: any): *void*

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`funct` | any |

**Returns:** *void*
