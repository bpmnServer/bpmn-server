[bpmn-server](../README.md) / CamundaFormData

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

- [definition](CamundaFormData.md#definition)
- [fields](CamundaFormData.md#fields)
- [node](CamundaFormData.md#node)

### Methods

- [describe](CamundaFormData.md#describe)
- [end](CamundaFormData.md#end)
- [enter](CamundaFormData.md#enter)
- [exit](CamundaFormData.md#exit)
- [getFields](CamundaFormData.md#getfields)
- [getItemAttributes](CamundaFormData.md#getitemattributes)
- [getNodeAttributes](CamundaFormData.md#getnodeattributes)
- [init](CamundaFormData.md#init)
- [restored](CamundaFormData.md#restored)
- [resume](CamundaFormData.md#resume)
- [run](CamundaFormData.md#run)
- [start](CamundaFormData.md#start)

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

[elements/behaviours/Behaviour.ts:40](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-40)

## Properties

### definition

• **definition**: `any`

#### Inherited from

[Behaviour](Behaviour.md).[definition](Behaviour.md#definition)

#### Defined in

[elements/behaviours/Behaviour.ts:39](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-39)

___

### fields

• **fields**: `any`

#### Defined in

[elements/behaviours/Form.ts:10](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Form.ts#lines-10)

___

### node

• **node**: [`Node`](Node.md)

#### Inherited from

[Behaviour](Behaviour.md).[node](Behaviour.md#node)

#### Defined in

[elements/behaviours/Behaviour.ts:38](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-38)

## Methods

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Overrides

[Behaviour](Behaviour.md).[describe](Behaviour.md#describe)

#### Defined in

[elements/behaviours/Form.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Form.ts#lines-18)

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

[elements/behaviours/Behaviour.ts:51](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-51)

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

### getFields

▸ **getFields**(): `any`

#### Returns

`any`

#### Defined in

[elements/behaviours/Form.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Form.ts#lines-17)

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

[elements/behaviours/Form.ts:11](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Form.ts#lines-11)

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

[elements/behaviours/Behaviour.ts:49](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-49)
