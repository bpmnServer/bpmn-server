[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/Flow](../modules/elements_Flow.md) / Flow

# Class: Flow

[elements/Flow](../modules/elements_Flow.md).Flow

## Hierarchy

- [`Element`](elements_Element.Element.md)

  ↳ **`Flow`**

  ↳↳ [`MessageFlow`](elements_Flow.MessageFlow.md)

## Implements

- [`IFlow`](../interfaces/interfaces_elements.IFlow.md)

## Table of contents

### Constructors

- [constructor](elements_Flow.Flow.md#constructor)

### Properties

- [behaviours](elements_Flow.Flow.md#behaviours)
- [def](elements_Flow.Flow.md#def)
- [from](elements_Flow.Flow.md#from)
- [id](elements_Flow.Flow.md#id)
- [isFlow](elements_Flow.Flow.md#isflow)
- [isMessageFlow](elements_Flow.Flow.md#ismessageflow)
- [lane](elements_Flow.Flow.md#lane)
- [name](elements_Flow.Flow.md#name)
- [subType](elements_Flow.Flow.md#subtype)
- [to](elements_Flow.Flow.md#to)
- [type](elements_Flow.Flow.md#type)

### Methods

- [addBehaviour](elements_Flow.Flow.md#addbehaviour)
- [continue](elements_Flow.Flow.md#continue)
- [describe](elements_Flow.Flow.md#describe)
- [evaluateCondition](elements_Flow.Flow.md#evaluatecondition)
- [execute](elements_Flow.Flow.md#execute)
- [getBehaviour](elements_Flow.Flow.md#getbehaviour)
- [hasBehaviour](elements_Flow.Flow.md#hasbehaviour)
- [restored](elements_Flow.Flow.md#restored)
- [resume](elements_Flow.Flow.md#resume)
- [run](elements_Flow.Flow.md#run)

## Constructors

### constructor

• **new Flow**(`id`, `type`, `from`, `to`, `def`): [`Flow`](elements_Flow.Flow.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `type` | `any` |
| `from` | `any` |
| `to` | `any` |
| `def` | `any` |

#### Returns

[`Flow`](elements_Flow.Flow.md)

#### Overrides

[Element](elements_Element.Element.md).[constructor](elements_Element.Element.md#constructor)

#### Defined in

[src/elements/Flow.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L16)

## Properties

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Implementation of

[IFlow](../interfaces/interfaces_elements.IFlow.md).[behaviours](../interfaces/interfaces_elements.IFlow.md#behaviours)

#### Inherited from

[Element](elements_Element.Element.md).[behaviours](elements_Element.Element.md#behaviours)

#### Defined in

[src/elements/Element.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L17)

___

### def

• **def**: `any`

#### Defined in

[src/elements/Flow.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L14)

___

### from

• **from**: [`Node`](elements_Node.Node.md)

#### Defined in

[src/elements/Flow.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L12)

___

### id

• **id**: `any`

#### Implementation of

[IFlow](../interfaces/interfaces_elements.IFlow.md).[id](../interfaces/interfaces_elements.IFlow.md#id)

#### Inherited from

[Element](elements_Element.Element.md).[id](elements_Element.Element.md#id)

#### Defined in

[src/elements/Element.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L13)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Element](elements_Element.Element.md).[isFlow](elements_Element.Element.md#isflow)

#### Defined in

[src/elements/Element.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L18)

___

### isMessageFlow

• **isMessageFlow**: `boolean` = `false`

#### Defined in

[src/elements/Flow.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L15)

___

### lane

• **lane**: `any`

#### Implementation of

[IFlow](../interfaces/interfaces_elements.IFlow.md).[lane](../interfaces/interfaces_elements.IFlow.md#lane)

#### Inherited from

[Element](elements_Element.Element.md).[lane](elements_Element.Element.md#lane)

#### Defined in

[src/elements/Element.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L19)

___

### name

• **name**: `any`

#### Implementation of

[IFlow](../interfaces/interfaces_elements.IFlow.md).[name](../interfaces/interfaces_elements.IFlow.md#name)

#### Inherited from

[Element](elements_Element.Element.md).[name](elements_Element.Element.md#name)

#### Defined in

[src/elements/Element.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L16)

___

### subType

• **subType**: `any`

#### Inherited from

[Element](elements_Element.Element.md).[subType](elements_Element.Element.md#subtype)

#### Defined in

[src/elements/Element.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L15)

___

### to

• **to**: [`Node`](elements_Node.Node.md)

#### Defined in

[src/elements/Flow.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L13)

___

### type

• **type**: `any`

#### Implementation of

[IFlow](../interfaces/interfaces_elements.IFlow.md).[type](../interfaces/interfaces_elements.IFlow.md#type)

#### Inherited from

[Element](elements_Element.Element.md).[type](elements_Element.Element.md#type)

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

[IFlow](../interfaces/interfaces_elements.IFlow.md).[addBehaviour](../interfaces/interfaces_elements.IFlow.md#addbehaviour)

#### Inherited from

[Element](elements_Element.Element.md).[addBehaviour](elements_Element.Element.md#addbehaviour)

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

[IFlow](../interfaces/interfaces_elements.IFlow.md).[continue](../interfaces/interfaces_elements.IFlow.md#continue)

#### Inherited from

[Element](elements_Element.Element.md).[continue](elements_Element.Element.md#continue)

#### Defined in

[src/elements/Element.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L20)

___

### describe

▸ **describe**(): `any`[][]

#### Returns

`any`[][]

#### Implementation of

[IFlow](../interfaces/interfaces_elements.IFlow.md).[describe](../interfaces/interfaces_elements.IFlow.md#describe)

#### Overrides

[Element](elements_Element.Element.md).[describe](elements_Element.Element.md#describe)

#### Defined in

[src/elements/Flow.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L26)

___

### evaluateCondition

▸ **evaluateCondition**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`any`

#### Defined in

[src/elements/Flow.ts:53](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L53)

___

### execute

▸ **execute**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/elements/Flow.ts:66](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L66)

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

[IFlow](../interfaces/interfaces_elements.IFlow.md).[getBehaviour](../interfaces/interfaces_elements.IFlow.md#getbehaviour)

#### Inherited from

[Element](elements_Element.Element.md).[getBehaviour](elements_Element.Element.md#getbehaviour)

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

[IFlow](../interfaces/interfaces_elements.IFlow.md).[hasBehaviour](../interfaces/interfaces_elements.IFlow.md#hasbehaviour)

#### Inherited from

[Element](elements_Element.Element.md).[hasBehaviour](elements_Element.Element.md#hasbehaviour)

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

[IFlow](../interfaces/interfaces_elements.IFlow.md).[restored](../interfaces/interfaces_elements.IFlow.md#restored)

#### Inherited from

[Element](elements_Element.Element.md).[restored](elements_Element.Element.md#restored)

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

[IFlow](../interfaces/interfaces_elements.IFlow.md).[resume](../interfaces/interfaces_elements.IFlow.md#resume)

#### Inherited from

[Element](elements_Element.Element.md).[resume](elements_Element.Element.md#resume)

#### Defined in

[src/elements/Element.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L27)

___

### run

▸ **run**(`item`): [`FLOW_ACTION`](../enums/interfaces_Enums.FLOW_ACTION.md)

<Rule> if flow has a condition, it must be evaluated and if result is true flow will continue
 otherwise, flow will be discarded.
</Rule>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

[`FLOW_ACTION`](../enums/interfaces_Enums.FLOW_ACTION.md)

#### Defined in

[src/elements/Flow.ts:43](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L43)
