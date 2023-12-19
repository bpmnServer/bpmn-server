[bpmn-server](../README.md) / Element

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

- [behaviours](Element.md#behaviours)
- [id](Element.md#id)
- [isFlow](Element.md#isflow)
- [lane](Element.md#lane)
- [name](Element.md#name)
- [subType](Element.md#subtype)
- [type](Element.md#type)

### Methods

- [addBehaviour](Element.md#addbehaviour)
- [continue](Element.md#continue)
- [describe](Element.md#describe)
- [getBehaviour](Element.md#getbehaviour)
- [hasBehaviour](Element.md#hasbehaviour)
- [restored](Element.md#restored)
- [resume](Element.md#resume)

## Constructors

### constructor

• **new Element**(): [`Element`](Element.md)

#### Returns

[`Element`](Element.md)

## Properties

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Implementation of

[IElement](../interfaces/IElement.md).[behaviours](../interfaces/IElement.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-17)

___

### id

• **id**: `any`

#### Implementation of

[IElement](../interfaces/IElement.md).[id](../interfaces/IElement.md#id)

#### Defined in

[elements/Element.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-13)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Defined in

[elements/Element.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-18)

___

### lane

• **lane**: `any`

#### Implementation of

[IElement](../interfaces/IElement.md).[lane](../interfaces/IElement.md#lane)

#### Defined in

[elements/Element.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-19)

___

### name

• **name**: `any`

#### Implementation of

[IElement](../interfaces/IElement.md).[name](../interfaces/IElement.md#name)

#### Defined in

[elements/Element.ts:16](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-16)

___

### subType

• **subType**: `any`

#### Defined in

[elements/Element.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-15)

___

### type

• **type**: `any`

#### Implementation of

[IElement](../interfaces/IElement.md).[type](../interfaces/IElement.md#type)

#### Defined in

[elements/Element.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-14)

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

[IElement](../interfaces/IElement.md).[addBehaviour](../interfaces/IElement.md#addbehaviour)

#### Defined in

[elements/Element.ts:41](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-41)

___

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

[elements/Element.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-20)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Implementation of

[IElement](../interfaces/IElement.md).[describe](../interfaces/IElement.md#describe)

#### Defined in

[elements/Element.ts:21](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-21)

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

[elements/Element.ts:38](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-38)

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

[elements/Element.ts:34](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-34)

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

[elements/Element.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-24)

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

[elements/Element.ts:27](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-27)
