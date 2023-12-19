[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/behaviours/MessageSignal](../modules/elements_behaviours_MessageSignal.md) / MessageEventBehaviour

# Class: MessageEventBehaviour

[elements/behaviours/MessageSignal](../modules/elements_behaviours_MessageSignal.md).MessageEventBehaviour

it is part of the following:

 events
 sendTask
 receiveTask

## Hierarchy

- [`Behaviour`](elements_behaviours_Behaviour.Behaviour.md)

  ↳ **`MessageEventBehaviour`**

## Table of contents

### Constructors

- [constructor](elements_behaviours_MessageSignal.MessageEventBehaviour.md#constructor)

### Properties

- [definition](elements_behaviours_MessageSignal.MessageEventBehaviour.md#definition)
- [node](elements_behaviours_MessageSignal.MessageEventBehaviour.md#node)

### Accessors

- [messageId](elements_behaviours_MessageSignal.MessageEventBehaviour.md#messageid)

### Methods

- [describe](elements_behaviours_MessageSignal.MessageEventBehaviour.md#describe)
- [end](elements_behaviours_MessageSignal.MessageEventBehaviour.md#end)
- [enter](elements_behaviours_MessageSignal.MessageEventBehaviour.md#enter)
- [exit](elements_behaviours_MessageSignal.MessageEventBehaviour.md#exit)
- [getItemAttributes](elements_behaviours_MessageSignal.MessageEventBehaviour.md#getitemattributes)
- [getNodeAttributes](elements_behaviours_MessageSignal.MessageEventBehaviour.md#getnodeattributes)
- [init](elements_behaviours_MessageSignal.MessageEventBehaviour.md#init)
- [restored](elements_behaviours_MessageSignal.MessageEventBehaviour.md#restored)
- [resume](elements_behaviours_MessageSignal.MessageEventBehaviour.md#resume)
- [run](elements_behaviours_MessageSignal.MessageEventBehaviour.md#run)
- [start](elements_behaviours_MessageSignal.MessageEventBehaviour.md#start)

## Constructors

### constructor

• **new MessageEventBehaviour**(`node`, `definition`): [`MessageEventBehaviour`](elements_behaviours_MessageSignal.MessageEventBehaviour.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](elements_Node.Node.md) |
| `definition` | `any` |

#### Returns

[`MessageEventBehaviour`](elements_behaviours_MessageSignal.MessageEventBehaviour.md)

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[constructor](elements_behaviours_Behaviour.Behaviour.md#constructor)

#### Defined in

[src/elements/behaviours/Behaviour.ts:40](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L40)

## Properties

### definition

• **definition**: `any`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[definition](elements_behaviours_Behaviour.Behaviour.md#definition)

#### Defined in

[src/elements/behaviours/Behaviour.ts:39](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L39)

___

### node

• **node**: [`Node`](elements_Node.Node.md)

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[node](elements_behaviours_Behaviour.Behaviour.md#node)

#### Defined in

[src/elements/behaviours/Behaviour.ts:38](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L38)

## Accessors

### messageId

• `get` **messageId**(): `any`

#### Returns

`any`

#### Defined in

[src/elements/behaviours/MessageSignal.ts:38](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/MessageSignal.ts#L38)

## Methods

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[describe](elements_behaviours_Behaviour.Behaviour.md#describe)

#### Defined in

[src/elements/behaviours/MessageSignal.ts:42](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/MessageSignal.ts#L42)

___

### end

▸ **end**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[end](elements_behaviours_Behaviour.Behaviour.md#end)

#### Defined in

[src/elements/behaviours/MessageSignal.ts:35](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/MessageSignal.ts#L35)

___

### enter

▸ **enter**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[enter](elements_behaviours_Behaviour.Behaviour.md#enter)

#### Defined in

[src/elements/behaviours/Behaviour.ts:48](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L48)

___

### exit

▸ **exit**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[exit](elements_behaviours_Behaviour.Behaviour.md#exit)

#### Defined in

[src/elements/behaviours/Behaviour.ts:52](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L52)

___

### getItemAttributes

▸ **getItemAttributes**(`item`, `attributes`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |
| `attributes` | `any`[] |

#### Returns

`void`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[getItemAttributes](elements_behaviours_Behaviour.Behaviour.md#getitemattributes)

#### Defined in

[src/elements/behaviours/Behaviour.ts:55](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L55)

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

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[getNodeAttributes](elements_behaviours_Behaviour.Behaviour.md#getnodeattributes)

#### Defined in

[src/elements/behaviours/Behaviour.ts:54](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L54)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[init](elements_behaviours_Behaviour.Behaviour.md#init)

#### Defined in

[src/elements/behaviours/MessageSignal.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/MessageSignal.ts#L17)

___

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`void`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[restored](elements_behaviours_Behaviour.Behaviour.md#restored)

#### Defined in

[src/elements/behaviours/Behaviour.ts:45](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L45)

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

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[resume](elements_behaviours_Behaviour.Behaviour.md#resume)

#### Defined in

[src/elements/behaviours/Behaviour.ts:53](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L53)

___

### run

▸ **run**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[run](elements_behaviours_Behaviour.Behaviour.md#run)

#### Defined in

[src/elements/behaviours/Behaviour.ts:50](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L50)

___

### start

▸ **start**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<`void`\>

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[start](elements_behaviours_Behaviour.Behaviour.md#start)

#### Defined in

[src/elements/behaviours/MessageSignal.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/MessageSignal.ts#L22)
