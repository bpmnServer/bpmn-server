[bpmn-server](../readme.md) / MessageFlow

# Class: MessageFlow

```xml
<Rule>MessageFlow: can only be sent to active node in waiting
 * or to a start event
</Rule>
```

## Hierarchy

- [`Flow`](Flow.md)

  ↳ **`MessageFlow`**

## Table of contents

### Constructors

- [constructor](MessageFlow.md#constructor)

### Properties

- [id](MessageFlow.md#id)
- [type](MessageFlow.md#type)
- [subType](MessageFlow.md#subtype)
- [name](MessageFlow.md#name)
- [behaviours](MessageFlow.md#behaviours)
- [isFlow](MessageFlow.md#isflow)
- [lane](MessageFlow.md#lane)
- [from](MessageFlow.md#from)
- [to](MessageFlow.md#to)
- [def](MessageFlow.md#def)
- [isMessageFlow](MessageFlow.md#ismessageflow)

### Methods

- [continue](MessageFlow.md#continue)
- [restored](MessageFlow.md#restored)
- [resume](MessageFlow.md#resume)
- [hasBehaviour](MessageFlow.md#hasbehaviour)
- [getBehaviour](MessageFlow.md#getbehaviour)
- [addBehaviour](MessageFlow.md#addbehaviour)
- [describe](MessageFlow.md#describe)
- [run](MessageFlow.md#run)
- [evaluateCondition](MessageFlow.md#evaluatecondition)
- [execute](MessageFlow.md#execute)

## Constructors

### constructor

• **new MessageFlow**(`id`, `type`, `from`, `to`, `def`): [`MessageFlow`](MessageFlow.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `type` | `any` |
| `from` | `any` |
| `to` | `any` |
| `def` | `any` |

#### Returns

[`MessageFlow`](MessageFlow.md)

#### Inherited from

[Flow](Flow.md).[constructor](Flow.md#constructor)

#### Defined in

[elements/Flow.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Flow.ts#L16)

## Properties

### id

• **id**: `any`

#### Inherited from

[Flow](Flow.md).[id](Flow.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[Flow](Flow.md).[type](Flow.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[Flow](Flow.md).[subType](Flow.md#subtype)

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L15)

___

### name

• **name**: `any`

#### Inherited from

[Flow](Flow.md).[name](Flow.md#name)

#### Defined in

[elements/Element.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L16)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Flow](Flow.md).[behaviours](Flow.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Flow](Flow.md).[isFlow](Flow.md#isflow)

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Flow](Flow.md).[lane](Flow.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L19)

___

### from

• **from**: [`Node`](Node.md)

#### Inherited from

[Flow](Flow.md).[from](Flow.md#from)

#### Defined in

[elements/Flow.ts:12](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Flow.ts#L12)

___

### to

• **to**: [`Node`](Node.md)

#### Inherited from

[Flow](Flow.md).[to](Flow.md#to)

#### Defined in

[elements/Flow.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Flow.ts#L13)

___

### def

• **def**: `any`

#### Inherited from

[Flow](Flow.md).[def](Flow.md#def)

#### Defined in

[elements/Flow.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Flow.ts#L14)

___

### isMessageFlow

• **isMessageFlow**: `boolean` = `true`

#### Overrides

[Flow](Flow.md).[isMessageFlow](Flow.md#ismessageflow)

#### Defined in

[elements/Flow.ts:85](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Flow.ts#L85)

## Methods

### continue

▸ **continue**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Inherited from

[Flow](Flow.md).[continue](Flow.md#continue)

#### Defined in

[elements/Element.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L20)

___

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Inherited from

[Flow](Flow.md).[restored](Flow.md#restored)

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

#### Inherited from

[Flow](Flow.md).[resume](Flow.md#resume)

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

#### Inherited from

[Flow](Flow.md).[hasBehaviour](Flow.md#hasbehaviour)

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

#### Inherited from

[Flow](Flow.md).[getBehaviour](Flow.md#getbehaviour)

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

#### Inherited from

[Flow](Flow.md).[addBehaviour](Flow.md#addbehaviour)

#### Defined in

[elements/Element.ts:41](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L41)

___

### describe

▸ **describe**(): `any`[][]

#### Returns

`any`[][]

#### Inherited from

[Flow](Flow.md).[describe](Flow.md#describe)

#### Defined in

[elements/Flow.ts:26](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Flow.ts#L26)

___

### run

▸ **run**(`item`): [`FLOW_ACTION`](../enums/FLOW_ACTION.md)

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

[`FLOW_ACTION`](../enums/FLOW_ACTION.md)

#### Inherited from

[Flow](Flow.md).[run](Flow.md#run)

#### Defined in

[elements/Flow.ts:44](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Flow.ts#L44)

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

[Flow](Flow.md).[evaluateCondition](Flow.md#evaluatecondition)

#### Defined in

[elements/Flow.ts:59](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Flow.ts#L59)

___

### execute

▸ **execute**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Overrides

[Flow](Flow.md).[execute](Flow.md#execute)

#### Defined in

[elements/Flow.ts:87](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Flow.ts#L87)
