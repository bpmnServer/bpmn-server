[bpmn-server](../readme.md) / Element

# Class: Element

## Hierarchy

- **`Element`**

  ↳ [`Node`](Node.md)

  ↳ [`Flow`](Flow.md)

## Implements

- [`IElement`](../interfaces/IElement.md)

## Table of contents

### Constructors

- [constructor](Element.md#constructor)

### Properties

- [id](Element.md#id)
- [type](Element.md#type)
- [subType](Element.md#subtype)
- [name](Element.md#name)
- [behaviours](Element.md#behaviours)
- [isFlow](Element.md#isflow)
- [lane](Element.md#lane)

### Methods

- [continue](Element.md#continue)
- [describe](Element.md#describe)
- [restored](Element.md#restored)
- [resume](Element.md#resume)
- [hasBehaviour](Element.md#hasbehaviour)
- [getBehaviour](Element.md#getbehaviour)
- [addBehaviour](Element.md#addbehaviour)

## Constructors

### constructor

• **new Element**(): [`Element`](Element.md)

#### Returns

[`Element`](Element.md)

## Properties

### id

• **id**: `any`

#### Implementation of

[IElement](../interfaces/IElement.md).[id](../interfaces/IElement.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Implementation of

[IElement](../interfaces/IElement.md).[type](../interfaces/IElement.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L15)

___

### name

• **name**: `any`

#### Implementation of

[IElement](../interfaces/IElement.md).[name](../interfaces/IElement.md#name)

#### Defined in

[elements/Element.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L16)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Implementation of

[IElement](../interfaces/IElement.md).[behaviours](../interfaces/IElement.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Implementation of

[IElement](../interfaces/IElement.md).[lane](../interfaces/IElement.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L19)

## Methods

### continue

▸ **continue**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Implementation of

[IElement](../interfaces/IElement.md).[continue](../interfaces/IElement.md#continue)

#### Defined in

[elements/Element.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L20)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Implementation of

[IElement](../interfaces/IElement.md).[describe](../interfaces/IElement.md#describe)

#### Defined in

[elements/Element.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L21)

___

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Implementation of

[IElement](../interfaces/IElement.md).[restored](../interfaces/IElement.md#restored)

#### Defined in

[elements/Element.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L24)

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

[IElement](../interfaces/IElement.md).[resume](../interfaces/IElement.md#resume)

#### Defined in

[elements/Element.ts:27](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L27)

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

[IElement](../interfaces/IElement.md).[hasBehaviour](../interfaces/IElement.md#hasbehaviour)

#### Defined in

[elements/Element.ts:34](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L34)

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

[IElement](../interfaces/IElement.md).[getBehaviour](../interfaces/IElement.md#getbehaviour)

#### Defined in

[elements/Element.ts:38](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L38)

___

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

[IElement](../interfaces/IElement.md).[addBehaviour](../interfaces/IElement.md#addbehaviour)

#### Defined in

[elements/Element.ts:41](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L41)
