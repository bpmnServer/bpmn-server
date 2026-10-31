[bpmn-server](../readme.md) / Behaviour

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

- [node](Behaviour.md#node)
- [definition](Behaviour.md#definition)

### Methods

- [restored](Behaviour.md#restored)
- [describe](Behaviour.md#describe)
- [init](Behaviour.md#init)
- [enter](Behaviour.md#enter)
- [start](Behaviour.md#start)
- [run](Behaviour.md#run)
- [end](Behaviour.md#end)
- [exit](Behaviour.md#exit)
- [resume](Behaviour.md#resume)
- [getNodeAttributes](Behaviour.md#getnodeattributes)
- [getItemAttributes](Behaviour.md#getitemattributes)

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

[elements/behaviours/Behaviour.ts:40](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L40)

## Properties

### node

• **node**: [`Node`](Node.md)

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[node](../interfaces/IBehaviour.md#node)

#### Defined in

[elements/behaviours/Behaviour.ts:38](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L38)

___

### definition

• **definition**: `any`

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[definition](../interfaces/IBehaviour.md#definition)

#### Defined in

[elements/behaviours/Behaviour.ts:39](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L39)

## Methods

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

[elements/behaviours/Behaviour.ts:45](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L45)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[describe](../interfaces/IBehaviour.md#describe)

#### Defined in

[elements/behaviours/Behaviour.ts:46](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L46)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Implementation of

[IBehaviour](../interfaces/IBehaviour.md).[init](../interfaces/IBehaviour.md#init)

#### Defined in

[elements/behaviours/Behaviour.ts:47](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L47)

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

[elements/behaviours/Behaviour.ts:48](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L48)

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

[elements/behaviours/Behaviour.ts:49](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L49)

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

[elements/behaviours/Behaviour.ts:50](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L50)

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

[elements/behaviours/Behaviour.ts:51](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L51)

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

[elements/behaviours/Behaviour.ts:52](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L52)

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

[elements/behaviours/Behaviour.ts:53](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L53)

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

[elements/behaviours/Behaviour.ts:54](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L54)

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

[elements/behaviours/Behaviour.ts:55](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L55)
