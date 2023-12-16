[bpmn-server](../README.md) / IBehaviour

# Interface: IBehaviour

Behaviour
     ioSpecification
     timer 
     message
     signal

  each behaviour is a class
     it scans def and insert itself to perform actions as required

## Implemented by

- [`Behaviour`](../classes/Behaviour.md)

## Table of contents

### Properties

- [definition](IBehaviour.md#definition)
- [node](IBehaviour.md#node)

### Methods

- [describe](IBehaviour.md#describe)
- [end](IBehaviour.md#end)
- [getItemAttributes](IBehaviour.md#getitemattributes)
- [getNodeAttributes](IBehaviour.md#getnodeattributes)
- [init](IBehaviour.md#init)
- [restored](IBehaviour.md#restored)
- [resume](IBehaviour.md#resume)
- [run](IBehaviour.md#run)
- [start](IBehaviour.md#start)

## Properties

### definition

• **definition**: `any`

#### Defined in

[elements/behaviours/Behaviour.ts:25](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L25)

___

### node

• **node**: [`Node`](../classes/Node.md)

#### Defined in

[elements/behaviours/Behaviour.ts:24](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L24)

## Methods

### describe

▸ **describe**(): `string`[]

#### Returns

`string`[]

#### Defined in

[elements/behaviours/Behaviour.ts:33](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L33)

___

### end

▸ **end**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`any`

#### Defined in

[elements/behaviours/Behaviour.ts:28](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L28)

___

### getItemAttributes

▸ **getItemAttributes**(`item`, `attributes`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |
| `attributes` | `any`[] |

#### Returns

`any`

#### Defined in

[elements/behaviours/Behaviour.ts:32](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L32)

___

### getNodeAttributes

▸ **getNodeAttributes**(`attributes`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `attributes` | `any`[] |

#### Returns

`any`

#### Defined in

[elements/behaviours/Behaviour.ts:31](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L31)

___

### init

▸ **init**(): `any`

#### Returns

`any`

#### Defined in

[elements/behaviours/Behaviour.ts:34](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L34)

___

### restored

▸ **restored**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`any`

#### Defined in

[elements/behaviours/Behaviour.ts:29](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L29)

___

### resume

▸ **resume**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`any`

#### Defined in

[elements/behaviours/Behaviour.ts:30](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L30)

___

### run

▸ **run**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`any`

#### Defined in

[elements/behaviours/Behaviour.ts:27](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L27)

___

### start

▸ **start**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`any`

#### Defined in

[elements/behaviours/Behaviour.ts:26](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L26)
