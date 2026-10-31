[bpmn-server](../readme.md) / IElement

# Interface: IElement

## Hierarchy

- **`IElement`**

  ↳ [`INode`](INode.md)

  ↳ [`IFlow`](IFlow.md)

## Implemented by

- [`Element`](../classes/Element.md)

## Table of contents

### Properties

- [id](IElement.md#id)
- [type](IElement.md#type)
- [name](IElement.md#name)
- [lane](IElement.md#lane)
- [behaviours](IElement.md#behaviours)

### Methods

- [continue](IElement.md#continue)
- [describe](IElement.md#describe)
- [restored](IElement.md#restored)
- [resume](IElement.md#resume)
- [hasBehaviour](IElement.md#hasbehaviour)
- [getBehaviour](IElement.md#getbehaviour)
- [addBehaviour](IElement.md#addbehaviour)

## Properties

### id

• **id**: `any`

#### Defined in

[interfaces/elements.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L21)

___

### type

• **type**: `any`

#### Defined in

[interfaces/elements.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L22)

___

### name

• **name**: `any`

#### Defined in

[interfaces/elements.ts:23](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L23)

___

### lane

• **lane**: `any`

#### Defined in

[interfaces/elements.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L24)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Defined in

[interfaces/elements.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L25)

## Methods

### continue

▸ **continue**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`void`

#### Defined in

[interfaces/elements.ts:26](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L26)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Defined in

[interfaces/elements.ts:27](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L27)

___

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`void`

#### Defined in

[interfaces/elements.ts:28](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L28)

___

### resume

▸ **resume**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`void`

#### Defined in

[interfaces/elements.ts:29](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L29)

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

[interfaces/elements.ts:34](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L34)

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

[interfaces/elements.ts:35](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L35)

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

#### Defined in

[interfaces/elements.ts:36](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L36)
