[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/behaviours/Behaviour](../modules/elements_behaviours_Behaviour.md) / IBehaviour

# Interface: IBehaviour

[elements/behaviours/Behaviour](../modules/elements_behaviours_Behaviour.md).IBehaviour

Behaviour
     ioSpecification
     timer 
     message
     signal

  each behaviour is a class
     it scans def and insert itself to perform actions as required

## Implemented by

- [`Behaviour`](../classes/elements_behaviours_Behaviour.Behaviour.md)

## Table of contents

### Properties

- [definition](elements_behaviours_Behaviour.IBehaviour.md#definition)
- [node](elements_behaviours_Behaviour.IBehaviour.md#node)

### Methods

- [describe](elements_behaviours_Behaviour.IBehaviour.md#describe)
- [end](elements_behaviours_Behaviour.IBehaviour.md#end)
- [getItemAttributes](elements_behaviours_Behaviour.IBehaviour.md#getitemattributes)
- [getNodeAttributes](elements_behaviours_Behaviour.IBehaviour.md#getnodeattributes)
- [init](elements_behaviours_Behaviour.IBehaviour.md#init)
- [restored](elements_behaviours_Behaviour.IBehaviour.md#restored)
- [resume](elements_behaviours_Behaviour.IBehaviour.md#resume)
- [run](elements_behaviours_Behaviour.IBehaviour.md#run)
- [start](elements_behaviours_Behaviour.IBehaviour.md#start)

## Properties

### definition

• **definition**: `any`

#### Defined in

[src/elements/behaviours/Behaviour.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L25)

___

### node

• **node**: [`Node`](../classes/elements_Node.Node.md)

#### Defined in

[src/elements/behaviours/Behaviour.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L24)

## Methods

### describe

▸ **describe**(): `string`[]

#### Returns

`string`[]

#### Defined in

[src/elements/behaviours/Behaviour.ts:33](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L33)

___

### end

▸ **end**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`any`

#### Defined in

[src/elements/behaviours/Behaviour.ts:28](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L28)

___

### getItemAttributes

▸ **getItemAttributes**(`item`, `attributes`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |
| `attributes` | `any`[] |

#### Returns

`any`

#### Defined in

[src/elements/behaviours/Behaviour.ts:32](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L32)

___

### getNodeAttributes

▸ **getNodeAttributes**(`attributes`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `attributes` | `any`[] |

#### Returns

`any`

#### Defined in

[src/elements/behaviours/Behaviour.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L31)

___

### init

▸ **init**(): `any`

#### Returns

`any`

#### Defined in

[src/elements/behaviours/Behaviour.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L34)

___

### restored

▸ **restored**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`any`

#### Defined in

[src/elements/behaviours/Behaviour.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L29)

___

### resume

▸ **resume**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`any`

#### Defined in

[src/elements/behaviours/Behaviour.ts:30](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L30)

___

### run

▸ **run**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`any`

#### Defined in

[src/elements/behaviours/Behaviour.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L27)

___

### start

▸ **start**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`any`

#### Defined in

[src/elements/behaviours/Behaviour.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L26)
