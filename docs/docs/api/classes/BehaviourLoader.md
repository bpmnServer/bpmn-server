[bpmn-server](../readme.md) / BehaviourLoader

# Class: BehaviourLoader

## Table of contents

### Constructors

- [constructor](BehaviourLoader.md#constructor)

### Properties

- [behaviours](BehaviourLoader.md#behaviours)

### Methods

- [register](BehaviourLoader.md#register)
- [load](BehaviourLoader.md#load)

## Constructors

### constructor

• **new BehaviourLoader**(): [`BehaviourLoader`](BehaviourLoader.md)

#### Returns

[`BehaviourLoader`](BehaviourLoader.md)

## Properties

### behaviours

▪ `Static` **behaviours**: (\{ `name`: `string` = Behaviour\_names.CamundaFormData; `funct`: (`node`: `any`, `def`: `any`) => [`CamundaFormData`](CamundaFormData.md)  } \| \{ `name`: `string` = Behaviour\_names.SignalEventDefinition; `funct`: (`node`: `any`, `def`: `any`) => [`SignalEventBehaviour`](SignalEventBehaviour.md)  } \| \{ `name`: `string` = Behaviour\_names.CamundaScript2; `funct`: (`node`: `any`, `def`: `any`) => [`ScriptBehaviour`](ScriptBehaviour.md)  } \| \{ `name`: `string` = Behaviour\_names.TerminateEventDefinition; `funct`: (`node`: `any`, `def`: `any`) => [`TerminateBehaviour`](TerminateBehaviour.md)  })[]

#### Defined in

[elements/behaviours/BehaviourLoader.ts:36](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/BehaviourLoader.ts#L36)

## Methods

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

[elements/behaviours/BehaviourLoader.ts:114](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/BehaviourLoader.ts#L114)

___

### load

▸ **load**(`node`): `void`

#### 1. Load behaviours from node definition

`node.definition[<name>]`

#### 2. Load behaviours from node definition.eventDefinitions

```ts
node.definition.eventDefinitions
         $type == <name>
```
example:

```xml  
       <bpmn:timerEventDefinition id="TimerEventDefinition_07xu06a">
          <bpmn:timeDuration xsi:type="bpmn:tExpression">PT2S</bpmn:timeDuration>
       </bpmn:timerEventDefinition>
 ```
 #### 3. Load behaviours from node definition.extensionElements

```ts
node.definitions.extensionElements
         $type == <name>
```
example:

```xml
'camunda:formData'
   <extensionElements>
       <camunda:formData >
           <camunda: formField id = "surname" label = "Surname" type = "string" />
               <camunda: formField id = "givenName" label = "Given name" type = "string" />
       </camunda:formData>
   < /extensionElements>
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](Node.md) |

#### Returns

`void`

#### Defined in

[elements/behaviours/BehaviourLoader.ts:156](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/BehaviourLoader.ts#L156)
