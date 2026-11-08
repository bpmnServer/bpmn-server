[bpmn-server](../readme.md) / Flow

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

- [id](Flow.md#id)
- [type](Flow.md#type)
- [subType](Flow.md#subtype)
- [name](Flow.md#name)
- [behaviours](Flow.md#behaviours)
- [isFlow](Flow.md#isflow)
- [lane](Flow.md#lane)
- [from](Flow.md#from)
- [to](Flow.md#to)
- [def](Flow.md#def)
- [isMessageFlow](Flow.md#ismessageflow)

### Methods

- [continue](Flow.md#continue)
- [restored](Flow.md#restored)
- [resume](Flow.md#resume)
- [hasBehaviour](Flow.md#hasbehaviour)
- [getBehaviour](Flow.md#getbehaviour)
- [addBehaviour](Flow.md#addbehaviour)
- [describe](Flow.md#describe)
- [run](Flow.md#run)
- [end](Flow.md#end)
- [evaluateCondition](Flow.md#evaluatecondition)
- [execute](Flow.md#execute)

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

[packages/bpmn-server/src/elements/Flow.ts:33](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Flow.ts#L33)

## Properties

### id

• **id**: `any`

#### Implementation of

[IFlow](../interfaces/IFlow.md).[id](../interfaces/IFlow.md#id)

#### Inherited from

[Element](Element.md).[id](Element.md#id)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Implementation of

[IFlow](../interfaces/IFlow.md).[type](../interfaces/IFlow.md#type)

#### Inherited from

[Element](Element.md).[type](Element.md#type)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[Element](Element.md).[subType](Element.md#subtype)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L15)

___

### name

• **name**: `any`

#### Implementation of

[IFlow](../interfaces/IFlow.md).[name](../interfaces/IFlow.md#name)

#### Inherited from

[Element](Element.md).[name](Element.md#name)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L16)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Implementation of

[IFlow](../interfaces/IFlow.md).[behaviours](../interfaces/IFlow.md#behaviours)

#### Inherited from

[Element](Element.md).[behaviours](Element.md#behaviours)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Element](Element.md).[isFlow](Element.md#isflow)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Implementation of

[IFlow](../interfaces/IFlow.md).[lane](../interfaces/IFlow.md#lane)

#### Inherited from

[Element](Element.md).[lane](Element.md#lane)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L19)

___

### from

• **from**: [`Node`](Node.md)

#### Defined in

[packages/bpmn-server/src/elements/Flow.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Flow.ts#L29)

___

### to

• **to**: [`Node`](Node.md)

#### Defined in

[packages/bpmn-server/src/elements/Flow.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Flow.ts#L30)

___

### def

• **def**: `any`

#### Defined in

[packages/bpmn-server/src/elements/Flow.ts:31](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Flow.ts#L31)

___

### isMessageFlow

• **isMessageFlow**: `boolean` = `false`

#### Defined in

[packages/bpmn-server/src/elements/Flow.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Flow.ts#L32)

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

[IFlow](../interfaces/IFlow.md).[continue](../interfaces/IFlow.md#continue)

#### Inherited from

[Element](Element.md).[continue](Element.md#continue)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L20)

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

[packages/bpmn-server/src/elements/Element.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L24)

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

[packages/bpmn-server/src/elements/Element.ts:27](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L27)

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

[packages/bpmn-server/src/elements/Element.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L34)

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

[packages/bpmn-server/src/elements/Element.ts:38](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L38)

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

[IFlow](../interfaces/IFlow.md).[addBehaviour](../interfaces/IFlow.md#addbehaviour)

#### Inherited from

[Element](Element.md).[addBehaviour](Element.md#addbehaviour)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:41](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L41)

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

[packages/bpmn-server/src/elements/Flow.ts:43](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Flow.ts#L43)

___

### run

▸ **run**(`item`): `Promise`\<[`FLOW_ACTION`](../enums/FLOW_ACTION.md)\>

```xml
<Rule> if flow has a condition, it must be evaluated and if result is true flow will continue
 otherwise, flow will be discarded.
</Rule> 
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<[`FLOW_ACTION`](../enums/FLOW_ACTION.md)\>

#### Defined in

[packages/bpmn-server/src/elements/Flow.ts:61](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Flow.ts#L61)

___

### end

▸ **end**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/Flow.ts:87](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Flow.ts#L87)

___

### evaluateCondition

▸ **evaluateCondition**(`item`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/elements/Flow.ts:90](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Flow.ts#L90)

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

[packages/bpmn-server/src/elements/Flow.ts:106](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Flow.ts#L106)
