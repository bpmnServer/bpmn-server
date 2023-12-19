[bpmn-server](../README.md) / [Exports](../modules.md) / [interfaces/elements](../modules/interfaces_elements.md) / IElement

# Interface: IElement

[interfaces/elements](../modules/interfaces_elements.md).IElement

## Hierarchy

- **`IElement`**

  ↳ [`INode`](interfaces_elements.INode.md)

  ↳ [`IFlow`](interfaces_elements.IFlow.md)

## Implemented by

- [`Element`](../classes/elements_Element.Element.md)

## Table of contents

### Properties

- [behaviours](interfaces_elements.IElement.md#behaviours)
- [id](interfaces_elements.IElement.md#id)
- [lane](interfaces_elements.IElement.md#lane)
- [name](interfaces_elements.IElement.md#name)
- [type](interfaces_elements.IElement.md#type)

### Methods

- [addBehaviour](interfaces_elements.IElement.md#addbehaviour)
- [continue](interfaces_elements.IElement.md#continue)
- [describe](interfaces_elements.IElement.md#describe)
- [getBehaviour](interfaces_elements.IElement.md#getbehaviour)
- [hasBehaviour](interfaces_elements.IElement.md#hasbehaviour)
- [restored](interfaces_elements.IElement.md#restored)
- [resume](interfaces_elements.IElement.md#resume)

## Properties

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Defined in

[src/interfaces/elements.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L25)

___

### id

• **id**: `any`

#### Defined in

[src/interfaces/elements.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L21)

___

### lane

• **lane**: `any`

#### Defined in

[src/interfaces/elements.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L24)

___

### name

• **name**: `any`

#### Defined in

[src/interfaces/elements.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L23)

___

### type

• **type**: `any`

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

#### Defined in

[src/interfaces/elements.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L26)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

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

#### Defined in

[src/interfaces/elements.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L29)
