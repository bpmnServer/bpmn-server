[bpmn-server](../README.md) / [Exports](../modules.md) / [interfaces/elements](../modules/interfaces_elements.md) / IFlow

# Interface: IFlow

[interfaces/elements](../modules/interfaces_elements.md).IFlow

## Hierarchy

- [`IElement`](interfaces_elements.IElement.md)

  ↳ **`IFlow`**

## Implemented by

- [`Flow`](../classes/elements_Flow.Flow.md)

## Table of contents

### Properties

- [behaviours](interfaces_elements.IFlow.md#behaviours)
- [id](interfaces_elements.IFlow.md#id)
- [lane](interfaces_elements.IFlow.md#lane)
- [name](interfaces_elements.IFlow.md#name)
- [type](interfaces_elements.IFlow.md#type)

### Methods

- [addBehaviour](interfaces_elements.IFlow.md#addbehaviour)
- [continue](interfaces_elements.IFlow.md#continue)
- [describe](interfaces_elements.IFlow.md#describe)
- [getBehaviour](interfaces_elements.IFlow.md#getbehaviour)
- [hasBehaviour](interfaces_elements.IFlow.md#hasbehaviour)
- [restored](interfaces_elements.IFlow.md#restored)
- [resume](interfaces_elements.IFlow.md#resume)

## Properties

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[IElement](interfaces_elements.IElement.md).[behaviours](interfaces_elements.IElement.md#behaviours)

#### Defined in

[src/interfaces/elements.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L25)

___

### id

• **id**: `any`

#### Inherited from

[IElement](interfaces_elements.IElement.md).[id](interfaces_elements.IElement.md#id)

#### Defined in

[src/interfaces/elements.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L21)

___

### lane

• **lane**: `any`

#### Inherited from

[IElement](interfaces_elements.IElement.md).[lane](interfaces_elements.IElement.md#lane)

#### Defined in

[src/interfaces/elements.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L24)

___

### name

• **name**: `any`

#### Inherited from

[IElement](interfaces_elements.IElement.md).[name](interfaces_elements.IElement.md#name)

#### Defined in

[src/interfaces/elements.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L23)

___

### type

• **type**: `any`

#### Inherited from

[IElement](interfaces_elements.IElement.md).[type](interfaces_elements.IElement.md#type)

#### Defined in

[src/interfaces/elements.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L22)

## Methods

### addBehaviour

▸ **addBehaviour**(`nane`, `behavriour`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nane` | `any` |
| `behavriour` | `any` |

#### Returns

`void`

#### Inherited from

[IElement](interfaces_elements.IElement.md).[addBehaviour](interfaces_elements.IElement.md#addbehaviour)

#### Defined in

[src/interfaces/elements.ts:36](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L36)

___

### continue

▸ **continue**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`void`

#### Inherited from

[IElement](interfaces_elements.IElement.md).[continue](interfaces_elements.IElement.md#continue)

#### Defined in

[src/interfaces/elements.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L26)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Inherited from

[IElement](interfaces_elements.IElement.md).[describe](interfaces_elements.IElement.md#describe)

#### Defined in

[src/interfaces/elements.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L27)

___

### getBehaviour

▸ **getBehaviour**(`name`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |

#### Returns

`any`

#### Inherited from

[IElement](interfaces_elements.IElement.md).[getBehaviour](interfaces_elements.IElement.md#getbehaviour)

#### Defined in

[src/interfaces/elements.ts:35](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L35)

___

### hasBehaviour

▸ **hasBehaviour**(`name`): `boolean`

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |

#### Returns

`boolean`

#### Inherited from

[IElement](interfaces_elements.IElement.md).[hasBehaviour](interfaces_elements.IElement.md#hasbehaviour)

#### Defined in

[src/interfaces/elements.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L34)

___

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`void`

#### Inherited from

[IElement](interfaces_elements.IElement.md).[restored](interfaces_elements.IElement.md#restored)

#### Defined in

[src/interfaces/elements.ts:28](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L28)

___

### resume

▸ **resume**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`void`

#### Inherited from

[IElement](interfaces_elements.IElement.md).[resume](interfaces_elements.IElement.md#resume)

#### Defined in

[src/interfaces/elements.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L29)
