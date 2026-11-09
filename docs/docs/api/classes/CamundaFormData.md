[bpmn-server](../readme.md) / CamundaFormData

# Class: CamundaFormData

Behaviour
     ioSpecification
     timer 
     message
     signal

  each behaviour is a class
     it scans def and insert itself to perform actions as required

## Hierarchy

- [`Behaviour`](Behaviour.md)

  ↳ **`CamundaFormData`**

## Table of contents

### Constructors

- [constructor](CamundaFormData.md#constructor)

### Properties

- [node](CamundaFormData.md#node)
- [definition](CamundaFormData.md#definition)
- [fields](CamundaFormData.md#fields)

### Methods

- [restored](CamundaFormData.md#restored)
- [enter](CamundaFormData.md#enter)
- [start](CamundaFormData.md#start)
- [run](CamundaFormData.md#run)
- [end](CamundaFormData.md#end)
- [exit](CamundaFormData.md#exit)
- [resume](CamundaFormData.md#resume)
- [getNodeAttributes](CamundaFormData.md#getnodeattributes)
- [getItemAttributes](CamundaFormData.md#getitemattributes)
- [init](CamundaFormData.md#init)
- [getFields](CamundaFormData.md#getfields)
- [describe](CamundaFormData.md#describe)

## Constructors

### constructor

• **new CamundaFormData**(`node`, `definition`): [`CamundaFormData`](CamundaFormData.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](Node.md) |
| `definition` | `any` |

#### Returns

[`CamundaFormData`](CamundaFormData.md)

#### Inherited from

[Behaviour](Behaviour.md).[constructor](Behaviour.md#constructor)

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:45](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L45)

## Properties

### node

• **node**: [`Node`](Node.md)

#### Inherited from

[Behaviour](Behaviour.md).[node](Behaviour.md#node)

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:43](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L43)

___

### definition

• **definition**: `any`

#### Inherited from

[Behaviour](Behaviour.md).[definition](Behaviour.md#definition)

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:44](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L44)

___

### fields

• **fields**: `any`

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Form.ts:10](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Form.ts#L10)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:50](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L50)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:53](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L53)

___

### start

▸ **start**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](Behaviour.md).[start](Behaviour.md#start)

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:54](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L54)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:55](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L55)

___

### end

▸ **end**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](Behaviour.md).[end](Behaviour.md#end)

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:56](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L56)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:57](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L57)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:58](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L58)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:59](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L59)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:60](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L60)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Overrides

[Behaviour](Behaviour.md).[init](Behaviour.md#init)

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Form.ts:11](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Form.ts#L11)

___

### getFields

▸ **getFields**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Form.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Form.ts#L18)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Overrides

[Behaviour](Behaviour.md).[describe](Behaviour.md#describe)

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Form.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Form.ts#L19)
