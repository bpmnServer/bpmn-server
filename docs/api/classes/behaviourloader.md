[bpmn-server](../README.md) / BehaviourLoader

# Class: BehaviourLoader

## Table of contents

### Constructors

- [constructor](BehaviourLoader.md#constructor)

### Properties

- [behaviours](BehaviourLoader.md#behaviours)

### Methods

- [load](BehaviourLoader.md#load)
- [register](BehaviourLoader.md#register)

## Constructors

### constructor

• **new BehaviourLoader**(): [`BehaviourLoader`](BehaviourLoader.md)

#### Returns

[`BehaviourLoader`](BehaviourLoader.md)

## Properties

### behaviours

▪ `Static` **behaviours**: (\{ `funct`: (`node`: `any`, `def`: `any`) => [`IOBehaviour`](IOBehaviour.md) ; `name`: `string` = Behaviour\_names.CamundaIO } \| \{ `funct`: (`node`: `any`, `def`: `any`) => [`ScriptBehaviour`](ScriptBehaviour.md) ; `name`: `string` = Behaviour\_names.CamundaScript2 } \| \{ `funct`: (`node`: `any`, `def`: `any`) => [`TerminateBehaviour`](TerminateBehaviour.md) ; `name`: `string` = Behaviour\_names.TerminateEventDefinition })[]

#### Defined in

[elements/behaviours/BehaviourLoader.ts:36](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/BehaviourLoader.ts#L36)

## Methods

### load

▸ **load**(`node`): `void`

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](Node.md) |

#### Returns

`void`

#### Defined in

[elements/behaviours/BehaviourLoader.ts:142](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/BehaviourLoader.ts#L142)

___

### register

▸ **register**(`name`, `funct`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `funct` | `any` |

#### Returns

`void`

#### Defined in

[elements/behaviours/BehaviourLoader.ts:114](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/BehaviourLoader.ts#L114)
