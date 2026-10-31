[bpmn-server](../readme.md) / MessageEventBehaviour

# Class: MessageEventBehaviour

it is part of the following:

 events
 sendTask
 receiveTask

## Hierarchy

- [`Behaviour`](Behaviour.md)

  ↳ **`MessageEventBehaviour`**

## Table of contents

### Constructors

- [constructor](MessageEventBehaviour.md#constructor)

### Properties

- [node](MessageEventBehaviour.md#node)
- [definition](MessageEventBehaviour.md#definition)

### Accessors

- [messageId](MessageEventBehaviour.md#messageid)

### Methods

- [restored](MessageEventBehaviour.md#restored)
- [enter](MessageEventBehaviour.md#enter)
- [run](MessageEventBehaviour.md#run)
- [exit](MessageEventBehaviour.md#exit)
- [resume](MessageEventBehaviour.md#resume)
- [getNodeAttributes](MessageEventBehaviour.md#getnodeattributes)
- [getItemAttributes](MessageEventBehaviour.md#getitemattributes)
- [init](MessageEventBehaviour.md#init)
- [start](MessageEventBehaviour.md#start)
- [end](MessageEventBehaviour.md#end)
- [describe](MessageEventBehaviour.md#describe)

## Constructors

### constructor

• **new MessageEventBehaviour**(`node`, `definition`): [`MessageEventBehaviour`](MessageEventBehaviour.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](Node.md) |
| `definition` | `any` |

#### Returns

[`MessageEventBehaviour`](MessageEventBehaviour.md)

#### Inherited from

[Behaviour](Behaviour.md).[constructor](Behaviour.md#constructor)

#### Defined in

[elements/behaviours/Behaviour.ts:40](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L40)

## Properties

### node

• **node**: [`Node`](Node.md)

#### Inherited from

[Behaviour](Behaviour.md).[node](Behaviour.md#node)

#### Defined in

[elements/behaviours/Behaviour.ts:38](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L38)

___

### definition

• **definition**: `any`

#### Inherited from

[Behaviour](Behaviour.md).[definition](Behaviour.md#definition)

#### Defined in

[elements/behaviours/Behaviour.ts:39](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L39)

## Accessors

### messageId

• `get` **messageId**(): `any`

#### Returns

`any`

#### Defined in

[elements/behaviours/MessageSignal.ts:38](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/MessageSignal.ts#L38)

## Methods

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`void`

#### Inherited from

[Behaviour](Behaviour.md).[restored](Behaviour.md#restored)

#### Defined in

[elements/behaviours/Behaviour.ts:45](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L45)

___

### enter

▸ **enter**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](Behaviour.md).[enter](Behaviour.md#enter)

#### Defined in

[elements/behaviours/Behaviour.ts:48](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L48)

___

### run

▸ **run**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](Behaviour.md).[run](Behaviour.md#run)

#### Defined in

[elements/behaviours/Behaviour.ts:50](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L50)

___

### exit

▸ **exit**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](Behaviour.md).[exit](Behaviour.md#exit)

#### Defined in

[elements/behaviours/Behaviour.ts:52](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L52)

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

[Behaviour](Behaviour.md).[resume](Behaviour.md#resume)

#### Defined in

[elements/behaviours/Behaviour.ts:53](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L53)

___

### getNodeAttributes

▸ **getNodeAttributes**(`attributes`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `attributes` | `any`[] |

#### Returns

`void`

#### Inherited from

[Behaviour](Behaviour.md).[getNodeAttributes](Behaviour.md#getnodeattributes)

#### Defined in

[elements/behaviours/Behaviour.ts:54](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L54)

___

### getItemAttributes

▸ **getItemAttributes**(`item`, `attributes`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |
| `attributes` | `any`[] |

#### Returns

`void`

#### Inherited from

[Behaviour](Behaviour.md).[getItemAttributes](Behaviour.md#getitemattributes)

#### Defined in

[elements/behaviours/Behaviour.ts:55](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/Behaviour.ts#L55)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Overrides

[Behaviour](Behaviour.md).[init](Behaviour.md#init)

#### Defined in

[elements/behaviours/MessageSignal.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/MessageSignal.ts#L17)

___

### start

▸ **start**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Overrides

[Behaviour](Behaviour.md).[start](Behaviour.md#start)

#### Defined in

[elements/behaviours/MessageSignal.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/MessageSignal.ts#L22)

___

### end

▸ **end**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Overrides

[Behaviour](Behaviour.md).[end](Behaviour.md#end)

#### Defined in

[elements/behaviours/MessageSignal.ts:35](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/MessageSignal.ts#L35)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Overrides

[Behaviour](Behaviour.md).[describe](Behaviour.md#describe)

#### Defined in

[elements/behaviours/MessageSignal.ts:42](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/MessageSignal.ts#L42)
