[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/behaviours/IOBehaviour](../modules/elements_behaviours_IOBehaviour.md) / IOBehaviour

# Class: IOBehaviour

[elements/behaviours/IOBehaviour](../modules/elements_behaviours_IOBehaviour.md).IOBehaviour

Behaviour
     ioSpecification
     timer 
     message
     signal

  each behaviour is a class
     it scans def and insert itself to perform actions as required

## Hierarchy

- [`Behaviour`](elements_behaviours_Behaviour.Behaviour.md)

  ↳ **`IOBehaviour`**

## Table of contents

### Constructors

- [constructor](elements_behaviours_IOBehaviour.IOBehaviour.md#constructor)

### Properties

- [definition](elements_behaviours_IOBehaviour.IOBehaviour.md#definition)
- [node](elements_behaviours_IOBehaviour.IOBehaviour.md#node)
- [parameters](elements_behaviours_IOBehaviour.IOBehaviour.md#parameters)

### Methods

- [describe](elements_behaviours_IOBehaviour.IOBehaviour.md#describe)
- [end](elements_behaviours_IOBehaviour.IOBehaviour.md#end)
- [enter](elements_behaviours_IOBehaviour.IOBehaviour.md#enter)
- [exit](elements_behaviours_IOBehaviour.IOBehaviour.md#exit)
- [getItemAttributes](elements_behaviours_IOBehaviour.IOBehaviour.md#getitemattributes)
- [getNodeAttributes](elements_behaviours_IOBehaviour.IOBehaviour.md#getnodeattributes)
- [init](elements_behaviours_IOBehaviour.IOBehaviour.md#init)
- [process](elements_behaviours_IOBehaviour.IOBehaviour.md#process)
- [restored](elements_behaviours_IOBehaviour.IOBehaviour.md#restored)
- [resume](elements_behaviours_IOBehaviour.IOBehaviour.md#resume)
- [run](elements_behaviours_IOBehaviour.IOBehaviour.md#run)
- [start](elements_behaviours_IOBehaviour.IOBehaviour.md#start)

## Constructors

### constructor

• **new IOBehaviour**(`node`, `definition`): [`IOBehaviour`](elements_behaviours_IOBehaviour.IOBehaviour.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](elements_Node.Node.md) |
| `definition` | `any` |

#### Returns

[`IOBehaviour`](elements_behaviours_IOBehaviour.IOBehaviour.md)

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[constructor](elements_behaviours_Behaviour.Behaviour.md#constructor)

#### Defined in

[src/elements/behaviours/Behaviour.ts:40](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L40)

## Properties

### definition

• **definition**: `any`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[definition](elements_behaviours_Behaviour.Behaviour.md#definition)

#### Defined in

[src/elements/behaviours/Behaviour.ts:39](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L39)

___

### node

• **node**: [`Node`](elements_Node.Node.md)

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[node](elements_behaviours_Behaviour.Behaviour.md#node)

#### Defined in

[src/elements/behaviours/Behaviour.ts:38](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L38)

___

### parameters

• **parameters**: `IOParameter`[]

#### Defined in

[src/elements/behaviours/IOBehaviour.ts:87](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/IOBehaviour.ts#L87)

## Methods

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[describe](elements_behaviours_Behaviour.Behaviour.md#describe)

#### Defined in

[src/elements/behaviours/IOBehaviour.ts:165](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/IOBehaviour.ts#L165)

___

### end

▸ **end**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[end](elements_behaviours_Behaviour.Behaviour.md#end)

#### Defined in

[src/elements/behaviours/Behaviour.ts:51](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L51)

___

### enter

▸ **enter**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[enter](elements_behaviours_Behaviour.Behaviour.md#enter)

#### Defined in

[src/elements/behaviours/IOBehaviour.ts:103](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/IOBehaviour.ts#L103)

___

### exit

▸ **exit**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[exit](elements_behaviours_Behaviour.Behaviour.md#exit)

#### Defined in

[src/elements/behaviours/IOBehaviour.ts:144](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/IOBehaviour.ts#L144)

___

### getItemAttributes

▸ **getItemAttributes**(`item`, `attributes`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |
| `attributes` | `any`[] |

#### Returns

`void`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[getItemAttributes](elements_behaviours_Behaviour.Behaviour.md#getitemattributes)

#### Defined in

[src/elements/behaviours/Behaviour.ts:55](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L55)

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

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[getNodeAttributes](elements_behaviours_Behaviour.Behaviour.md#getnodeattributes)

#### Defined in

[src/elements/behaviours/Behaviour.ts:54](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L54)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[init](elements_behaviours_Behaviour.Behaviour.md#init)

#### Defined in

[src/elements/behaviours/IOBehaviour.ts:89](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/IOBehaviour.ts#L89)

___

### process

▸ **process**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Defined in

[src/elements/behaviours/IOBehaviour.ts:133](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/IOBehaviour.ts#L133)

___

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`void`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[restored](elements_behaviours_Behaviour.Behaviour.md#restored)

#### Defined in

[src/elements/behaviours/Behaviour.ts:45](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L45)

___

### resume

▸ **resume**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[resume](elements_behaviours_Behaviour.Behaviour.md#resume)

#### Defined in

[src/elements/behaviours/Behaviour.ts:53](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L53)

___

### run

▸ **run**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[run](elements_behaviours_Behaviour.Behaviour.md#run)

#### Defined in

[src/elements/behaviours/Behaviour.ts:50](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L50)

___

### start

▸ **start**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[start](elements_behaviours_Behaviour.Behaviour.md#start)

#### Defined in

[src/elements/behaviours/Behaviour.ts:49](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L49)
