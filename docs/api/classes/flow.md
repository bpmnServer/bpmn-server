[bpmn-server](../README.md) / Flow

# Class: Flow

## Hierarchy

- [`Element`](Element.md)

  ↳ **`Flow`**

  ↳↳ [`MessageFlow`](MessageFlow.md)

## Implements

- [`IFlow`](../interfaces/IFlow.md)

## Table of contents

### Constructors

- [constructor](Flow.md#constructor)

### Properties

- [behaviours](Flow.md#behaviours)
- [def](Flow.md#def)
- [from](Flow.md#from)
- [id](Flow.md#id)
- [isFlow](Flow.md#isflow)
- [isMessageFlow](Flow.md#ismessageflow)
- [lane](Flow.md#lane)
- [name](Flow.md#name)
- [subType](Flow.md#subtype)
- [to](Flow.md#to)
- [type](Flow.md#type)

### Methods

- [addBehaviour](Flow.md#addbehaviour)
- [continue](Flow.md#continue)
- [describe](Flow.md#describe)
- [evaluateCondition](Flow.md#evaluatecondition)
- [execute](Flow.md#execute)
- [getBehaviour](Flow.md#getbehaviour)
- [hasBehaviour](Flow.md#hasbehaviour)
- [restored](Flow.md#restored)
- [resume](Flow.md#resume)
- [run](Flow.md#run)

## Constructors

### constructor

• **new Flow**(`id`, `type`, `from`, `to`, `def`): [`Flow`](Flow.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `type` | `any` |
| `from` | `any` |
| `to` | `any` |
| `def` | `any` |

#### Returns

[`Flow`](Flow.md)

#### Overrides

[Element](Element.md).[constructor](Element.md#constructor)

#### Defined in

[elements/Flow.ts:16](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Flow.ts#L16)

## Properties

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Implementation of

[IFlow](../interfaces/IFlow.md).[behaviours](../interfaces/IFlow.md#behaviours)

#### Inherited from

[Element](Element.md).[behaviours](Element.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L17)

___

### def

• **def**: `any`

#### Defined in

[elements/Flow.ts:14](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Flow.ts#L14)

___

### from

• **from**: [`Node`](Node.md)

#### Defined in

[elements/Flow.ts:12](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Flow.ts#L12)

___

### id

• **id**: `any`

#### Implementation of

[IFlow](../interfaces/IFlow.md).[id](../interfaces/IFlow.md#id)

#### Inherited from

[Element](Element.md).[id](Element.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L13)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Element](Element.md).[isFlow](Element.md#isflow)

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L18)

___

### isMessageFlow

• **isMessageFlow**: `boolean` = `false`

#### Defined in

[elements/Flow.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Flow.ts#L15)

___

### lane

• **lane**: `any`

#### Implementation of

[IFlow](../interfaces/IFlow.md).[lane](../interfaces/IFlow.md#lane)

#### Inherited from

[Element](Element.md).[lane](Element.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L19)

___

### name

• **name**: `any`

#### Implementation of

[IFlow](../interfaces/IFlow.md).[name](../interfaces/IFlow.md#name)

#### Inherited from

[Element](Element.md).[name](Element.md#name)

#### Defined in

[elements/Element.ts:16](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L16)

___

### subType

• **subType**: `any`

#### Inherited from

[Element](Element.md).[subType](Element.md#subtype)

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L15)

___

### to

• **to**: [`Node`](Node.md)

#### Defined in

[elements/Flow.ts:13](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Flow.ts#L13)

___

### type

• **type**: `any`

#### Implementation of

[IFlow](../interfaces/IFlow.md).[type](../interfaces/IFlow.md#type)

#### Inherited from

[Element](Element.md).[type](Element.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L14)

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

[IFlow](../interfaces/IFlow.md).[addBehaviour](../interfaces/IFlow.md#addbehaviour)

#### Inherited from

[Element](Element.md).[addBehaviour](Element.md#addbehaviour)

#### Defined in

[elements/Element.ts:39](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L39)

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

[IFlow](../interfaces/IFlow.md).[continue](../interfaces/IFlow.md#continue)

#### Inherited from

[Element](Element.md).[continue](Element.md#continue)

#### Defined in

[elements/Element.ts:20](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L20)

___

### describe

▸ **describe**(): `any`[][]

#### Returns

`any`[][]

#### Implementation of

[IFlow](../interfaces/IFlow.md).[describe](../interfaces/IFlow.md#describe)

#### Overrides

[Element](Element.md).[describe](Element.md#describe)

#### Defined in

[elements/Flow.ts:26](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Flow.ts#L26)

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

[elements/Flow.ts:53](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Flow.ts#L53)

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

[elements/Flow.ts:66](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Flow.ts#L66)

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

[IFlow](../interfaces/IFlow.md).[getBehaviour](../interfaces/IFlow.md#getbehaviour)

#### Inherited from

[Element](Element.md).[getBehaviour](Element.md#getbehaviour)

#### Defined in

[elements/Element.ts:36](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L36)

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

[IFlow](../interfaces/IFlow.md).[hasBehaviour](../interfaces/IFlow.md#hasbehaviour)

#### Inherited from

[Element](Element.md).[hasBehaviour](Element.md#hasbehaviour)

#### Defined in

[elements/Element.ts:32](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L32)

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

[IFlow](../interfaces/IFlow.md).[restored](../interfaces/IFlow.md#restored)

#### Inherited from

[Element](Element.md).[restored](Element.md#restored)

#### Defined in

[elements/Element.ts:22](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L22)

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

[IFlow](../interfaces/IFlow.md).[resume](../interfaces/IFlow.md#resume)

#### Inherited from

[Element](Element.md).[resume](Element.md#resume)

#### Defined in

[elements/Element.ts:25](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L25)

___

### run

▸ **run**(`item`): [`FLOW_ACTION`](../enums/FLOW_ACTION.md)

<Rule> if flow has a condition, it must be evaluated and if result is true flow will continue
 otherwise, flow will be discarded.
</Rule>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

[`FLOW_ACTION`](../enums/FLOW_ACTION.md)

#### Defined in

[elements/Flow.ts:43](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Flow.ts#L43)
