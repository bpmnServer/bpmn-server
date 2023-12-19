[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/behaviours/Script](../modules/elements_behaviours_Script.md) / ScriptBehaviour

# Class: ScriptBehaviour

[elements/behaviours/Script](../modules/elements_behaviours_Script.md).ScriptBehaviour

Behaviour
     ioSpecification
     timer 
     message
     signal

  each behaviour is a class
     it scans def and insert itself to perform actions as required

## Hierarchy

- [`Behaviour`](elements_behaviours_Behaviour.Behaviour.md)

  ↳ **`ScriptBehaviour`**

## Table of contents

### Constructors

- [constructor](elements_behaviours_Script.ScriptBehaviour.md#constructor)

### Properties

- [definition](elements_behaviours_Script.ScriptBehaviour.md#definition)
- [node](elements_behaviours_Script.ScriptBehaviour.md#node)
- [scripts](elements_behaviours_Script.ScriptBehaviour.md#scripts)

### Methods

- [describe](elements_behaviours_Script.ScriptBehaviour.md#describe)
- [end](elements_behaviours_Script.ScriptBehaviour.md#end)
- [enter](elements_behaviours_Script.ScriptBehaviour.md#enter)
- [exit](elements_behaviours_Script.ScriptBehaviour.md#exit)
- [getItemAttributes](elements_behaviours_Script.ScriptBehaviour.md#getitemattributes)
- [getNodeAttributes](elements_behaviours_Script.ScriptBehaviour.md#getnodeattributes)
- [init](elements_behaviours_Script.ScriptBehaviour.md#init)
- [restored](elements_behaviours_Script.ScriptBehaviour.md#restored)
- [resume](elements_behaviours_Script.ScriptBehaviour.md#resume)
- [run](elements_behaviours_Script.ScriptBehaviour.md#run)
- [start](elements_behaviours_Script.ScriptBehaviour.md#start)

## Constructors

### constructor

• **new ScriptBehaviour**(`node`, `definition`): [`ScriptBehaviour`](elements_behaviours_Script.ScriptBehaviour.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](elements_Node.Node.md) |
| `definition` | `any` |

#### Returns

[`ScriptBehaviour`](elements_behaviours_Script.ScriptBehaviour.md)

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

___

### scripts

• **scripts**: `string`[]

#### Defined in

[src/elements/behaviours/Script.ts:30](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Script.ts#L30)

## Methods

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[describe](elements_behaviours_Behaviour.Behaviour.md#describe)

#### Defined in

[src/elements/behaviours/Script.ts:63](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Script.ts#L63)

___

### end

▸ **end**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[end](elements_behaviours_Behaviour.Behaviour.md#end)

#### Defined in

[src/elements/behaviours/Behaviour.ts:51](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L51)

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

[src/elements/behaviours/Script.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Script.ts#L31)

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

▸ **start**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[start](elements_behaviours_Behaviour.Behaviour.md#start)

#### Defined in

[src/elements/behaviours/Behaviour.ts:49](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L49)
