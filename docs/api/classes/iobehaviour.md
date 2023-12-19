[bpmn-server](../README.md) / IOBehaviour

# Class: IOBehaviour

Behaviour
     ioSpecification
     timer 
     message
     signal

  each behaviour is a class
     it scans def and insert itself to perform actions as required

## Hierarchy

- [`Behaviour`](Behaviour.md)

  ↳ **`IOBehaviour`**

## Table of contents

### Constructors

- [constructor](IOBehaviour.md#constructor)

### Properties

- [definition](IOBehaviour.md#definition)
- [node](IOBehaviour.md#node)
- [parameters](IOBehaviour.md#parameters)

### Methods

- [describe](IOBehaviour.md#describe)
- [end](IOBehaviour.md#end)
- [enter](IOBehaviour.md#enter)
- [exit](IOBehaviour.md#exit)
- [getItemAttributes](IOBehaviour.md#getitemattributes)
- [getNodeAttributes](IOBehaviour.md#getnodeattributes)
- [init](IOBehaviour.md#init)
- [process](IOBehaviour.md#process)
- [restored](IOBehaviour.md#restored)
- [resume](IOBehaviour.md#resume)
- [run](IOBehaviour.md#run)
- [start](IOBehaviour.md#start)

## Constructors

### constructor

• **new IOBehaviour**(`node`, `definition`): [`IOBehaviour`](IOBehaviour.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](Node.md) |
| `definition` | `any` |

#### Returns

[`IOBehaviour`](IOBehaviour.md)

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

___

### parameters

• **parameters**: `IOParameter`[]

#### Defined in

[elements/behaviours/IOBehaviour.ts:87](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/IOBehaviour.ts#lines-87)

## Methods

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Overrides

[Behaviour](Behaviour.md).[describe](Behaviour.md#describe)

#### Defined in

[elements/behaviours/IOBehaviour.ts:165](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/IOBehaviour.ts#lines-165)

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

#### Overrides

[Behaviour](Behaviour.md).[enter](Behaviour.md#enter)

#### Defined in

[elements/behaviours/IOBehaviour.ts:103](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/IOBehaviour.ts#lines-103)

___

### exit

▸ **exit**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Overrides

[Behaviour](Behaviour.md).[exit](Behaviour.md#exit)

#### Defined in

[elements/behaviours/IOBehaviour.ts:144](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/IOBehaviour.ts#lines-144)

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

[elements/behaviours/IOBehaviour.ts:89](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/IOBehaviour.ts#lines-89)

___

### process

▸ **process**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Defined in

[elements/behaviours/IOBehaviour.ts:133](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/IOBehaviour.ts#lines-133)

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
