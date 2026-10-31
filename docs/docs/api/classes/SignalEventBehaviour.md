[bpmn-server](../readme.md) / SignalEventBehaviour

# Class: SignalEventBehaviour

Behaviour
     ioSpecification
     timer 
     message
     signal

  each behaviour is a class
     it scans def and insert itself to perform actions as required

## Hierarchy

- [`Behaviour`](Behaviour.md)

  ↳ **`SignalEventBehaviour`**

## Table of contents

### Constructors

- [constructor](SignalEventBehaviour.md#constructor)

### Properties

- [node](SignalEventBehaviour.md#node)
- [definition](SignalEventBehaviour.md#definition)

### Accessors

- [signalId](SignalEventBehaviour.md#signalid)

### Methods

- [restored](SignalEventBehaviour.md#restored)
- [enter](SignalEventBehaviour.md#enter)
- [run](SignalEventBehaviour.md#run)
- [exit](SignalEventBehaviour.md#exit)
- [resume](SignalEventBehaviour.md#resume)
- [getNodeAttributes](SignalEventBehaviour.md#getnodeattributes)
- [getItemAttributes](SignalEventBehaviour.md#getitemattributes)
- [init](SignalEventBehaviour.md#init)
- [start](SignalEventBehaviour.md#start)
- [end](SignalEventBehaviour.md#end)
- [describe](SignalEventBehaviour.md#describe)

## Constructors

### constructor

• **new SignalEventBehaviour**(`node`, `definition`): [`SignalEventBehaviour`](SignalEventBehaviour.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](Node.md) |
| `definition` | `any` |

#### Returns

[`SignalEventBehaviour`](SignalEventBehaviour.md)

#### Inherited from

[Behaviour](Behaviour.md).[constructor](Behaviour.md#constructor)

#### Defined in

[elements/behaviours/Behaviour.ts:40](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L40)

## Properties

### node

• **node**: [`Node`](Node.md)

#### Inherited from

[Behaviour](Behaviour.md).[node](Behaviour.md#node)

#### Defined in

[elements/behaviours/Behaviour.ts:38](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L38)

___

### definition

• **definition**: `any`

#### Inherited from

[Behaviour](Behaviour.md).[definition](Behaviour.md#definition)

#### Defined in

[elements/behaviours/Behaviour.ts:39](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L39)

## Accessors

### signalId

• `get` **signalId**(): `any`

#### Returns

`any`

#### Defined in

[elements/behaviours/MessageSignal.ts:76](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/MessageSignal.ts#L76)

## Methods

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`void`

#### Inherited from

[Behaviour](Behaviour.md).[restored](Behaviour.md#restored)

#### Defined in

[elements/behaviours/Behaviour.ts:45](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L45)

___

### enter

▸ **enter**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](Behaviour.md).[enter](Behaviour.md#enter)

#### Defined in

[elements/behaviours/Behaviour.ts:48](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L48)

___

### run

▸ **run**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](Behaviour.md).[run](Behaviour.md#run)

#### Defined in

[elements/behaviours/Behaviour.ts:50](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L50)

___

### exit

▸ **exit**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](Behaviour.md).[exit](Behaviour.md#exit)

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

#### Inherited from

[Behaviour](Behaviour.md).[resume](Behaviour.md#resume)

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

#### Inherited from

[Behaviour](Behaviour.md).[getNodeAttributes](Behaviour.md#getnodeattributes)

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

#### Inherited from

[Behaviour](Behaviour.md).[getItemAttributes](Behaviour.md#getitemattributes)

#### Defined in

[elements/behaviours/Behaviour.ts:55](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L55)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Overrides

[Behaviour](Behaviour.md).[init](Behaviour.md#init)

#### Defined in

[elements/behaviours/MessageSignal.ts:50](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/MessageSignal.ts#L50)

___

### start

▸ **start**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Overrides

[Behaviour](Behaviour.md).[start](Behaviour.md#start)

#### Defined in

[elements/behaviours/MessageSignal.ts:54](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/MessageSignal.ts#L54)

___

### end

▸ **end**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Overrides

[Behaviour](Behaviour.md).[end](Behaviour.md#end)

#### Defined in

[elements/behaviours/MessageSignal.ts:68](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/MessageSignal.ts#L68)

___

### describe

▸ **describe**(): `string`[]

#### Returns

`string`[]

#### Overrides

[Behaviour](Behaviour.md).[describe](Behaviour.md#describe)

#### Defined in

[elements/behaviours/MessageSignal.ts:70](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/MessageSignal.ts#L70)
