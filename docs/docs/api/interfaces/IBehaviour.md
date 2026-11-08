[bpmn-server](../readme.md) / IBehaviour

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

- [node](IBehaviour.md#node)
- [definition](IBehaviour.md#definition)

### Methods

- [start](IBehaviour.md#start)
- [run](IBehaviour.md#run)
- [end](IBehaviour.md#end)
- [restored](IBehaviour.md#restored)
- [resume](IBehaviour.md#resume)
- [getNodeAttributes](IBehaviour.md#getnodeattributes)
- [getItemAttributes](IBehaviour.md#getitemattributes)
- [describe](IBehaviour.md#describe)
- [init](IBehaviour.md#init)

## Properties

### node

• **node**: [`Node`](../classes/Node.md)

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L29)

___

### definition

• **definition**: `any`

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L30)

## Methods

### start

▸ **start**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:31](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L31)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L32)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:33](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L33)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L34)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L35)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:36](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L36)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L37)

___

### describe

▸ **describe**(): `string`[]

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:38](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L38)

___

### init

▸ **init**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:39](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L39)
