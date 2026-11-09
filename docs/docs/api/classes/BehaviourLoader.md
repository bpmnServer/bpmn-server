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

[packages/bpmn-server/src/elements/behaviours/BehaviourLoader.ts:43](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/BehaviourLoader.ts#L43)

## Methods

### register

▸ **register**(`name`, `funct`): `void`

Adds a behaviour for a BPMN element, extension or event definition, by its name (`funct(node, def)`
makes it). The registry is the library's, for every server in the process, as a moddle extension
is: it extends what BPMN the engine understands, not one server's configuration. Register once,
at start, before servers load definitions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `funct` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/behaviours/BehaviourLoader.ts:132](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/BehaviourLoader.ts#L132)

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

[packages/bpmn-server/src/elements/behaviours/BehaviourLoader.ts:174](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/BehaviourLoader.ts#L174)
