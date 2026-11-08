[bpmn-server](../readme.md) / IFlow

# Interface: IFlow

## Hierarchy

- [`IElement`](IElement.md)

  ↳ **`IFlow`**

## Implemented by

- [`Flow`](../classes/Flow.md)

## Table of contents

### Properties

- [id](IFlow.md#id)
- [type](IFlow.md#type)
- [name](IFlow.md#name)
- [lane](IFlow.md#lane)
- [behaviours](IFlow.md#behaviours)

### Methods

- [continue](IFlow.md#continue)
- [describe](IFlow.md#describe)
- [restored](IFlow.md#restored)
- [resume](IFlow.md#resume)
- [hasBehaviour](IFlow.md#hasbehaviour)
- [getBehaviour](IFlow.md#getbehaviour)
- [addBehaviour](IFlow.md#addbehaviour)

## Properties

### id

• **id**: `any`

#### Inherited from

[IElement](IElement.md).[id](IElement.md#id)

#### Defined in

[packages/bpmn-server/src/interfaces/elements.ts:22](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/elements.ts#L22)

___

### type

• **type**: `any`

#### Inherited from

[IElement](IElement.md).[type](IElement.md#type)

#### Defined in

[packages/bpmn-server/src/interfaces/elements.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/elements.ts#L23)

___

### name

• **name**: `any`

#### Inherited from

[IElement](IElement.md).[name](IElement.md#name)

#### Defined in

[packages/bpmn-server/src/interfaces/elements.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/elements.ts#L24)

___

### lane

• **lane**: `any`

#### Inherited from

[IElement](IElement.md).[lane](IElement.md#lane)

#### Defined in

[packages/bpmn-server/src/interfaces/elements.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/elements.ts#L25)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[IElement](IElement.md).[behaviours](IElement.md#behaviours)

#### Defined in

[packages/bpmn-server/src/interfaces/elements.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/elements.ts#L26)

## Methods

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

[packages/bpmn-server/src/interfaces/elements.ts:27](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/elements.ts#L27)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Inherited from

[IElement](IElement.md).[describe](IElement.md#describe)

#### Defined in

[packages/bpmn-server/src/interfaces/elements.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/elements.ts#L28)

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

[packages/bpmn-server/src/interfaces/elements.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/elements.ts#L29)

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

[packages/bpmn-server/src/interfaces/elements.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/elements.ts#L30)

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

[packages/bpmn-server/src/interfaces/elements.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/elements.ts#L35)

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

[packages/bpmn-server/src/interfaces/elements.ts:36](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/elements.ts#L36)

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

#### Inherited from

[IElement](IElement.md).[addBehaviour](IElement.md#addbehaviour)

#### Defined in

[packages/bpmn-server/src/interfaces/elements.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/elements.ts#L37)
