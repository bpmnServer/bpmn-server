[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/Element](../modules/elements_Element.md) / Element

# Class: Element

[elements/Element](../modules/elements_Element.md).Element

## Hierarchy

- **`Element`**

  ↳ [`Flow`](elements_Flow.Flow.md)

  ↳ [`Node`](elements_Node.Node.md)

## Implements

- [`IElement`](../interfaces/interfaces_elements.IElement.md)

## Table of contents

### Constructors

- [constructor](elements_Element.Element.md#constructor)

### Properties

- [behaviours](elements_Element.Element.md#behaviours)
- [id](elements_Element.Element.md#id)
- [isFlow](elements_Element.Element.md#isflow)
- [lane](elements_Element.Element.md#lane)
- [name](elements_Element.Element.md#name)
- [subType](elements_Element.Element.md#subtype)
- [type](elements_Element.Element.md#type)

### Methods

- [addBehaviour](elements_Element.Element.md#addbehaviour)
- [continue](elements_Element.Element.md#continue)
- [describe](elements_Element.Element.md#describe)
- [getBehaviour](elements_Element.Element.md#getbehaviour)
- [hasBehaviour](elements_Element.Element.md#hasbehaviour)
- [restored](elements_Element.Element.md#restored)
- [resume](elements_Element.Element.md#resume)

## Constructors

### constructor

• **new Element**(): [`Element`](elements_Element.Element.md)

#### Returns

[`Element`](elements_Element.Element.md)

## Properties

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Implementation of

[IElement](../interfaces/interfaces_elements.IElement.md).[behaviours](../interfaces/interfaces_elements.IElement.md#behaviours)

#### Defined in

[src/elements/Element.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L17)

___

### id

• **id**: `any`

#### Implementation of

[IElement](../interfaces/interfaces_elements.IElement.md).[id](../interfaces/interfaces_elements.IElement.md#id)

#### Defined in

[src/elements/Element.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L13)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Defined in

[src/elements/Element.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Implementation of

[IElement](../interfaces/interfaces_elements.IElement.md).[lane](../interfaces/interfaces_elements.IElement.md#lane)

#### Defined in

[src/elements/Element.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L19)

___

### name

• **name**: `any`

#### Implementation of

[IElement](../interfaces/interfaces_elements.IElement.md).[name](../interfaces/interfaces_elements.IElement.md#name)

#### Defined in

[src/elements/Element.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L16)

___

### subType

• **subType**: `any`

#### Defined in

[src/elements/Element.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L15)

___

### type

• **type**: `any`

#### Implementation of

[IElement](../interfaces/interfaces_elements.IElement.md).[type](../interfaces/interfaces_elements.IElement.md#type)

#### Defined in

[src/elements/Element.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L14)

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

#### Implementation of

[IElement](../interfaces/interfaces_elements.IElement.md).[addBehaviour](../interfaces/interfaces_elements.IElement.md#addbehaviour)

#### Defined in

[src/elements/Element.ts:41](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L41)

___

### continue

▸ **continue**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Implementation of

[IElement](../interfaces/interfaces_elements.IElement.md).[continue](../interfaces/interfaces_elements.IElement.md#continue)

#### Defined in

[src/elements/Element.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L20)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Implementation of

[IElement](../interfaces/interfaces_elements.IElement.md).[describe](../interfaces/interfaces_elements.IElement.md#describe)

#### Defined in

[src/elements/Element.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L21)

___

### getBehaviour

▸ **getBehaviour**(`name`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |

#### Returns

`any`

#### Implementation of

[IElement](../interfaces/interfaces_elements.IElement.md).[getBehaviour](../interfaces/interfaces_elements.IElement.md#getbehaviour)

#### Defined in

[src/elements/Element.ts:38](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L38)

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

#### Implementation of

[IElement](../interfaces/interfaces_elements.IElement.md).[hasBehaviour](../interfaces/interfaces_elements.IElement.md#hasbehaviour)

#### Defined in

[src/elements/Element.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L34)

___

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Implementation of

[IElement](../interfaces/interfaces_elements.IElement.md).[restored](../interfaces/interfaces_elements.IElement.md#restored)

#### Defined in

[src/elements/Element.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L24)

___

### resume

▸ **resume**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Implementation of

[IElement](../interfaces/interfaces_elements.IElement.md).[resume](../interfaces/interfaces_elements.IElement.md#resume)

#### Defined in

[src/elements/Element.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L27)
