[bpmn-server](../README.md) / LoopBehaviour

# Class: LoopBehaviour

1.   sequential:
      <bpmn2:multiInstanceLoopCharacteristics isSequential="true" />
2.   parallel
      <bpmn2:multiInstanceLoopCharacteristics  />
3.   repeater
      <bpmn2:standardLoopCharacteristics />

## Hierarchy

- [`Behaviour`](Behaviour.md)

  ↳ **`LoopBehaviour`**

## Table of contents

### Constructors

- [constructor](LoopBehaviour.md#constructor)

### Properties

- [definition](LoopBehaviour.md#definition)
- [node](LoopBehaviour.md#node)

### Accessors

- [collection](LoopBehaviour.md#collection)

### Methods

- [describe](LoopBehaviour.md#describe)
- [end](LoopBehaviour.md#end)
- [enter](LoopBehaviour.md#enter)
- [exit](LoopBehaviour.md#exit)
- [getItemAttributes](LoopBehaviour.md#getitemattributes)
- [getNodeAttributes](LoopBehaviour.md#getnodeattributes)
- [init](LoopBehaviour.md#init)
- [isSequential](LoopBehaviour.md#issequential)
- [isStandard](LoopBehaviour.md#isstandard)
- [restored](LoopBehaviour.md#restored)
- [resume](LoopBehaviour.md#resume)
- [run](LoopBehaviour.md#run)
- [start](LoopBehaviour.md#start)

## Constructors

### constructor

• **new LoopBehaviour**(`node`, `definition`): [`LoopBehaviour`](LoopBehaviour.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](Node.md) |
| `definition` | `any` |

#### Returns

[`LoopBehaviour`](LoopBehaviour.md)

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

### collection

• `get` **collection**(): `any`

#### Returns

`any`

#### Defined in

[elements/behaviours/Loop.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Loop.ts#lines-20)

## Methods

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Overrides

[Behaviour](Behaviour.md).[describe](Behaviour.md#describe)

#### Defined in

[elements/behaviours/Loop.ts:39](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Loop.ts#lines-39)

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

[elements/behaviours/Loop.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Loop.ts#lines-17)

___

### isSequential

▸ **isSequential**(): `any`

#### Returns

`any`

#### Defined in

[elements/behaviours/Loop.ts:33](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Loop.ts#lines-33)

___

### isStandard

▸ **isStandard**(): `boolean`

#### Returns

`boolean`

#### Defined in

[elements/behaviours/Loop.ts:29](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Loop.ts#lines-29)

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
