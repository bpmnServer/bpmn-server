[bpmn-server](../README.md) / MessageEventBehaviour

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

- [definition](MessageEventBehaviour.md#definition)
- [node](MessageEventBehaviour.md#node)

### Accessors

- [messageId](MessageEventBehaviour.md#messageid)

### Methods

- [describe](MessageEventBehaviour.md#describe)
- [end](MessageEventBehaviour.md#end)
- [enter](MessageEventBehaviour.md#enter)
- [exit](MessageEventBehaviour.md#exit)
- [getItemAttributes](MessageEventBehaviour.md#getitemattributes)
- [getNodeAttributes](MessageEventBehaviour.md#getnodeattributes)
- [init](MessageEventBehaviour.md#init)
- [restored](MessageEventBehaviour.md#restored)
- [resume](MessageEventBehaviour.md#resume)
- [run](MessageEventBehaviour.md#run)
- [start](MessageEventBehaviour.md#start)

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

[elements/behaviours/Behaviour.ts:40](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-40)

## Properties

### definition

• **definition**: `any`

#### Inherited from

[Behaviour](Behaviour.md).[definition](Behaviour.md#definition)

#### Defined in

[elements/behaviours/Behaviour.ts:39](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-39)

___

### node

• **node**: [`Node`](Node.md)

#### Inherited from

[Behaviour](Behaviour.md).[node](Behaviour.md#node)

#### Defined in

[elements/behaviours/Behaviour.ts:38](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-38)

## Accessors

### messageId

• `get` **messageId**(): `any`

#### Returns

`any`

#### Defined in

[elements/behaviours/MessageSignal.ts:38](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/MessageSignal.ts#lines-38)

## Methods

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Overrides

[Behaviour](Behaviour.md).[describe](Behaviour.md#describe)

#### Defined in

[elements/behaviours/MessageSignal.ts:42](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/MessageSignal.ts#lines-42)

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

[elements/behaviours/MessageSignal.ts:35](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/MessageSignal.ts#lines-35)

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

[elements/behaviours/Behaviour.ts:48](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-48)

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

[elements/behaviours/Behaviour.ts:52](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-52)

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

[elements/behaviours/Behaviour.ts:55](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-55)

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

[elements/behaviours/Behaviour.ts:54](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-54)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Overrides

[Behaviour](Behaviour.md).[init](Behaviour.md#init)

#### Defined in

[elements/behaviours/MessageSignal.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/MessageSignal.ts#lines-17)

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

[Behaviour](Behaviour.md).[restored](Behaviour.md#restored)

#### Defined in

[elements/behaviours/Behaviour.ts:45](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-45)

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

[elements/behaviours/Behaviour.ts:53](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-53)

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

[elements/behaviours/Behaviour.ts:50](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-50)

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

[elements/behaviours/MessageSignal.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/MessageSignal.ts#lines-22)
