[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/Flow](../modules/elements_Flow.md) / MessageFlow

# Class: MessageFlow

[elements/Flow](../modules/elements_Flow.md).MessageFlow

<Rule>MessageFlow: can only be sent to active node in waiting
 * or to a start event
</Rule>

## Hierarchy

- [`Flow`](elements_Flow.Flow.md)

  ↳ **`MessageFlow`**

## Table of contents

### Constructors

- [constructor](elements_Flow.MessageFlow.md#constructor)

### Properties

- [behaviours](elements_Flow.MessageFlow.md#behaviours)
- [def](elements_Flow.MessageFlow.md#def)
- [from](elements_Flow.MessageFlow.md#from)
- [id](elements_Flow.MessageFlow.md#id)
- [isFlow](elements_Flow.MessageFlow.md#isflow)
- [isMessageFlow](elements_Flow.MessageFlow.md#ismessageflow)
- [lane](elements_Flow.MessageFlow.md#lane)
- [name](elements_Flow.MessageFlow.md#name)
- [subType](elements_Flow.MessageFlow.md#subtype)
- [to](elements_Flow.MessageFlow.md#to)
- [type](elements_Flow.MessageFlow.md#type)

### Methods

- [addBehaviour](elements_Flow.MessageFlow.md#addbehaviour)
- [continue](elements_Flow.MessageFlow.md#continue)
- [describe](elements_Flow.MessageFlow.md#describe)
- [evaluateCondition](elements_Flow.MessageFlow.md#evaluatecondition)
- [execute](elements_Flow.MessageFlow.md#execute)
- [getBehaviour](elements_Flow.MessageFlow.md#getbehaviour)
- [hasBehaviour](elements_Flow.MessageFlow.md#hasbehaviour)
- [restored](elements_Flow.MessageFlow.md#restored)
- [resume](elements_Flow.MessageFlow.md#resume)
- [run](elements_Flow.MessageFlow.md#run)

## Constructors

### constructor

• **new MessageFlow**(`id`, `type`, `from`, `to`, `def`): [`MessageFlow`](elements_Flow.MessageFlow.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `type` | `any` |
| `from` | `any` |
| `to` | `any` |
| `def` | `any` |

#### Returns

[`MessageFlow`](elements_Flow.MessageFlow.md)

#### Inherited from

[Flow](elements_Flow.Flow.md).[constructor](elements_Flow.Flow.md#constructor)

#### Defined in

[src/elements/Flow.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L16)

## Properties

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Flow](elements_Flow.Flow.md).[behaviours](elements_Flow.Flow.md#behaviours)

#### Defined in

[src/elements/Element.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L17)

___

### def

• **def**: `any`

#### Inherited from

[Flow](elements_Flow.Flow.md).[def](elements_Flow.Flow.md#def)

#### Defined in

[src/elements/Flow.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L14)

___

### from

• **from**: [`Node`](elements_Node.Node.md)

#### Inherited from

[Flow](elements_Flow.Flow.md).[from](elements_Flow.Flow.md#from)

#### Defined in

[src/elements/Flow.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L12)

___

### id

• **id**: `any`

#### Inherited from

[Flow](elements_Flow.Flow.md).[id](elements_Flow.Flow.md#id)

#### Defined in

[src/elements/Element.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L13)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Flow](elements_Flow.Flow.md).[isFlow](elements_Flow.Flow.md#isflow)

#### Defined in

[src/elements/Element.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L18)

___

### isMessageFlow

• **isMessageFlow**: `boolean` = `true`

#### Overrides

[Flow](elements_Flow.Flow.md).[isMessageFlow](elements_Flow.Flow.md#ismessageflow)

#### Defined in

[src/elements/Flow.ts:78](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L78)

___

### lane

• **lane**: `any`

#### Inherited from

[Flow](elements_Flow.Flow.md).[lane](elements_Flow.Flow.md#lane)

#### Defined in

[src/elements/Element.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[Flow](elements_Flow.Flow.md).[name](elements_Flow.Flow.md#name)

#### Defined in

[src/elements/Element.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L16)

___

### subType

• **subType**: `any`

#### Inherited from

[Flow](elements_Flow.Flow.md).[subType](elements_Flow.Flow.md#subtype)

#### Defined in

[src/elements/Element.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L15)

___

### to

• **to**: [`Node`](elements_Node.Node.md)

#### Inherited from

[Flow](elements_Flow.Flow.md).[to](elements_Flow.Flow.md#to)

#### Defined in

[src/elements/Flow.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[Flow](elements_Flow.Flow.md).[type](elements_Flow.Flow.md#type)

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

#### Inherited from

[Flow](elements_Flow.Flow.md).[addBehaviour](elements_Flow.Flow.md#addbehaviour)

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

#### Inherited from

[Flow](elements_Flow.Flow.md).[continue](elements_Flow.Flow.md#continue)

#### Defined in

[src/elements/Element.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L20)

___

### describe

▸ **describe**(): `any`[][]

#### Returns

`any`[][]

#### Inherited from

[Flow](elements_Flow.Flow.md).[describe](elements_Flow.Flow.md#describe)

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

#### Inherited from

[Flow](elements_Flow.Flow.md).[evaluateCondition](elements_Flow.Flow.md#evaluatecondition)

#### Defined in

[src/elements/Flow.ts:53](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L53)

___

### execute

▸ **execute**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<`void`\>

#### Overrides

[Flow](elements_Flow.Flow.md).[execute](elements_Flow.Flow.md#execute)

#### Defined in

[src/elements/Flow.ts:80](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L80)

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

[Flow](elements_Flow.Flow.md).[getBehaviour](elements_Flow.Flow.md#getbehaviour)

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

#### Inherited from

[Flow](elements_Flow.Flow.md).[hasBehaviour](elements_Flow.Flow.md#hasbehaviour)

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

#### Inherited from

[Flow](elements_Flow.Flow.md).[restored](elements_Flow.Flow.md#restored)

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

#### Inherited from

[Flow](elements_Flow.Flow.md).[resume](elements_Flow.Flow.md#resume)

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

#### Inherited from

[Flow](elements_Flow.Flow.md).[run](elements_Flow.Flow.md#run)

#### Defined in

[src/elements/Flow.ts:43](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Flow.ts#L43)
