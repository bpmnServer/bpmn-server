[bpmn-server](../README.md) / IFlow

# Interface: IFlow

## Hierarchy

- [`IElement`](IElement.md)

  ↳ **`IFlow`**

## Implemented by

- [`Flow`](../classes/Flow.md)

## Table of contents

### Properties

- [behaviours](IFlow.md#behaviours)
- [id](IFlow.md#id)
- [lane](IFlow.md#lane)
- [name](IFlow.md#name)
- [type](IFlow.md#type)

### Methods

- [addBehaviour](IFlow.md#addbehaviour)
- [continue](IFlow.md#continue)
- [describe](IFlow.md#describe)
- [getBehaviour](IFlow.md#getbehaviour)
- [hasBehaviour](IFlow.md#hasbehaviour)
- [restored](IFlow.md#restored)
- [resume](IFlow.md#resume)

## Properties

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[IElement](IElement.md).[behaviours](IElement.md#behaviours)

#### Defined in

[interfaces/elements.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-25)

___

### id

• **id**: `any`

#### Inherited from

[IElement](IElement.md).[id](IElement.md#id)

#### Defined in

[interfaces/elements.ts:21](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-21)

___

### lane

• **lane**: `any`

#### Inherited from

[IElement](IElement.md).[lane](IElement.md#lane)

#### Defined in

[interfaces/elements.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-24)

___

### name

• **name**: `any`

#### Inherited from

[IElement](IElement.md).[name](IElement.md#name)

#### Defined in

[interfaces/elements.ts:23](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-23)

___

### type

• **type**: `any`

#### Inherited from

[IElement](IElement.md).[type](IElement.md#type)

#### Defined in

[interfaces/elements.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-22)

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

[IElement](IElement.md).[addBehaviour](IElement.md#addbehaviour)

#### Defined in

[interfaces/elements.ts:36](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-36)

___

### continue

▸ **continue**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`void`

#### Inherited from

[IElement](IElement.md).[continue](IElement.md#continue)

#### Defined in

[interfaces/elements.ts:26](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-26)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Inherited from

[IElement](IElement.md).[describe](IElement.md#describe)

#### Defined in

[interfaces/elements.ts:27](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-27)

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

[IElement](IElement.md).[getBehaviour](IElement.md#getbehaviour)

#### Defined in

[interfaces/elements.ts:35](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-35)

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

[IElement](IElement.md).[hasBehaviour](IElement.md#hasbehaviour)

#### Defined in

[interfaces/elements.ts:34](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-34)

___

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`void`

#### Inherited from

[IElement](IElement.md).[restored](IElement.md#restored)

#### Defined in

[interfaces/elements.ts:28](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-28)

___

### resume

▸ **resume**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`void`

#### Inherited from

[IElement](IElement.md).[resume](IElement.md#resume)

#### Defined in

[interfaces/elements.ts:29](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/elements.ts#lines-29)