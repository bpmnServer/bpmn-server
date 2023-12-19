[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/behaviours/BehaviourLoader](../modules/elements_behaviours_BehaviourLoader.md) / BehaviourLoader

# Class: BehaviourLoader

[elements/behaviours/BehaviourLoader](../modules/elements_behaviours_BehaviourLoader.md).BehaviourLoader

## Table of contents

### Constructors

- [constructor](elements_behaviours_BehaviourLoader.BehaviourLoader.md#constructor)

### Properties

- [behaviours](elements_behaviours_BehaviourLoader.BehaviourLoader.md#behaviours)

### Methods

- [load](elements_behaviours_BehaviourLoader.BehaviourLoader.md#load)
- [register](elements_behaviours_BehaviourLoader.BehaviourLoader.md#register)

## Constructors

### constructor

• **new BehaviourLoader**(): [`BehaviourLoader`](elements_behaviours_BehaviourLoader.BehaviourLoader.md)

#### Returns

[`BehaviourLoader`](elements_behaviours_BehaviourLoader.BehaviourLoader.md)

## Properties

### behaviours

▪ `Static` **behaviours**: (\{ `funct`: (`node`: `any`, `def`: `any`) => [`CamundaFormData`](elements_behaviours_Form.CamundaFormData.md) ; `name`: `string` = Behaviour\_names.CamundaFormData } \| \{ `funct`: (`node`: `any`, `def`: `any`) => [`SignalEventBehaviour`](elements_behaviours_MessageSignal.SignalEventBehaviour.md) ; `name`: `string` = Behaviour\_names.SignalEventDefinition } \| \{ `funct`: (`node`: `any`, `def`: `any`) => [`CompensateEventBehaviour`](elements_behaviours_TransEvents.CompensateEventBehaviour.md) ; `name`: `string` = Behaviour\_names.CompensateEventDefinition } \| \{ `funct`: (`node`: `any`, `def`: `any`) => [`CancelEventBehaviour`](elements_behaviours_TransEvents.CancelEventBehaviour.md) ; `name`: `string` = Behaviour\_names.CancelEventDefinition } \| \{ `funct`: (`node`: `any`, `def`: `any`) => [`ScriptBehaviour`](elements_behaviours_Script.ScriptBehaviour.md) ; `name`: `string` = Behaviour\_names.CamundaScript2 } \| \{ `funct`: (`node`: `any`, `def`: `any`) => [`TerminateBehaviour`](elements_behaviours_Terminate.TerminateBehaviour.md) ; `name`: `string` = Behaviour\_names.TerminateEventDefinition })[]

#### Defined in

[src/elements/behaviours/BehaviourLoader.ts:36](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/BehaviourLoader.ts#L36)

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
| `node` | [`Node`](elements_Node.Node.md) |

#### Returns

`void`

#### Defined in

[src/elements/behaviours/BehaviourLoader.ts:142](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/BehaviourLoader.ts#L142)

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

[src/elements/behaviours/BehaviourLoader.ts:114](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/BehaviourLoader.ts#L114)
