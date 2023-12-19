[bpmn-server](../README.md) / Behaviour

# Class: Behaviour

Behaviour
     ioSpecification
     timer 
     message
     signal

  each behaviour is a class
     it scans def and insert itself to perform actions as required

## Hierarchy

- **`Behaviour`**

  ↳ [`CamundaFormData`](CamundaFormData.md)

  ↳ [`IOBehaviour`](IOBehaviour.md)

  ↳ [`MessageEventBehaviour`](MessageEventBehaviour.md)

  ↳ [`SignalEventBehaviour`](SignalEventBehaviour.md)

  ↳ [`TerminateBehaviour`](TerminateBehaviour.md)

  ↳ [`TimerBehaviour`](TimerBehaviour.md)

  ↳ [`LoopBehaviour`](LoopBehaviour.md)

  ↳ [`ScriptBehaviour`](ScriptBehaviour.md)

## Implements

- [`IBehaviour`](../interfaces/IBehaviour.md)

## Table of contents

### Constructors

- [constructor](Behaviour.md#constructor)

### Properties

- [definition](Behaviour.md#definition)
- [node](Behaviour.md#node)

### Methods

- [describe](Behaviour.md#describe)
- [end](Behaviour.md#end)
- [enter](Behaviour.md#enter)
- [exit](Behaviour.md#exit)
- [getItemAttributes](Behaviour.md#getitemattributes)
- [getNodeAttributes](Behaviour.md#getnodeattributes)
- [init](Behaviour.md#init)
- [restored](Behaviour.md#restored)
- [resume](Behaviour.md#resume)
- [run](Behaviour.md#run)
- [start](Behaviour.md#start)

## Constructors

### constructor

• **new Behaviour**(`node`, `definition`): [`Behaviour`](Behaviour.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](Node.md) |
| `definition` | `any` |

#### Returns

[`Behaviour`](Behaviour.md)

#### Defined in

[elements/behaviours/Behaviour.ts:40](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-40)

## Properties

### definition

• **definition**: `any`

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[definition](../interfaces/IBehaviour.md#definition)

#### Defined in

[elements/behaviours/Behaviour.ts:39](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-39)

___

### node

• **node**: [`Node`](Node.md)

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[node](../interfaces/IBehaviour.md#node)

#### Defined in

[elements/behaviours/Behaviour.ts:38](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-38)

## Methods

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[describe](../interfaces/IBehaviour.md#describe)

#### Defined in

[elements/behaviours/Behaviour.ts:46](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-46)

___

### end

▸ **end**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[end](../interfaces/IBehaviour.md#end)

#### Defined in

[elements/behaviours/Behaviour.ts:51](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-51)

___

### enter

▸ **enter**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Defined in

[elements/behaviours/Behaviour.ts:48](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-48)

___

### exit

▸ **exit**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Defined in

[elements/behaviours/Behaviour.ts:52](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-52)

___

### getItemAttributes

▸ **getItemAttributes**(`item`, `attributes`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |
| `attributes` | `any`[] |

#### Returns

`void`

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[getItemAttributes](../interfaces/IBehaviour.md#getitemattributes)

#### Defined in

[elements/behaviours/Behaviour.ts:55](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-55)

___

### getNodeAttributes

▸ **getNodeAttributes**(`attributes`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `attributes` | `any`[] |

#### Returns

`void`

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[getNodeAttributes](../interfaces/IBehaviour.md#getnodeattributes)

#### Defined in

[elements/behaviours/Behaviour.ts:54](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-54)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[init](../interfaces/IBehaviour.md#init)

#### Defined in

[elements/behaviours/Behaviour.ts:47](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-47)

___

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`void`

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[restored](../interfaces/IBehaviour.md#restored)

#### Defined in

[elements/behaviours/Behaviour.ts:45](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-45)

___

### resume

▸ **resume**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[resume](../interfaces/IBehaviour.md#resume)

#### Defined in

[elements/behaviours/Behaviour.ts:53](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-53)

___

### run

▸ **run**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[run](../interfaces/IBehaviour.md#run)

#### Defined in

[elements/behaviours/Behaviour.ts:50](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-50)

___

### start

▸ **start**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[start](../interfaces/IBehaviour.md#start)

#### Defined in

[elements/behaviours/Behaviour.ts:49](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-49)
