[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/behaviours/TransEvents](../modules/elements_behaviours_TransEvents.md) / CompensateEventBehaviour

# Class: CompensateEventBehaviour

[elements/behaviours/TransEvents](../modules/elements_behaviours_TransEvents.md).CompensateEventBehaviour

Behaviour
     ioSpecification
     timer 
     message
     signal

  each behaviour is a class
     it scans def and insert itself to perform actions as required

## Hierarchy

- [`Behaviour`](elements_behaviours_Behaviour.Behaviour.md)

  ↳ **`CompensateEventBehaviour`**

## Table of contents

### Constructors

- [constructor](elements_behaviours_TransEvents.CompensateEventBehaviour.md#constructor)

### Properties

- [definition](elements_behaviours_TransEvents.CompensateEventBehaviour.md#definition)
- [node](elements_behaviours_TransEvents.CompensateEventBehaviour.md#node)

### Accessors

- [TransactionId](elements_behaviours_TransEvents.CompensateEventBehaviour.md#transactionid)

### Methods

- [describe](elements_behaviours_TransEvents.CompensateEventBehaviour.md#describe)
- [end](elements_behaviours_TransEvents.CompensateEventBehaviour.md#end)
- [enter](elements_behaviours_TransEvents.CompensateEventBehaviour.md#enter)
- [exit](elements_behaviours_TransEvents.CompensateEventBehaviour.md#exit)
- [getItemAttributes](elements_behaviours_TransEvents.CompensateEventBehaviour.md#getitemattributes)
- [getNodeAttributes](elements_behaviours_TransEvents.CompensateEventBehaviour.md#getnodeattributes)
- [init](elements_behaviours_TransEvents.CompensateEventBehaviour.md#init)
- [restored](elements_behaviours_TransEvents.CompensateEventBehaviour.md#restored)
- [resume](elements_behaviours_TransEvents.CompensateEventBehaviour.md#resume)
- [run](elements_behaviours_TransEvents.CompensateEventBehaviour.md#run)
- [start](elements_behaviours_TransEvents.CompensateEventBehaviour.md#start)

## Constructors

### constructor

• **new CompensateEventBehaviour**(`node`, `definition`): [`CompensateEventBehaviour`](elements_behaviours_TransEvents.CompensateEventBehaviour.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](elements_Node.Node.md) |
| `definition` | `any` |

#### Returns

[`CompensateEventBehaviour`](elements_behaviours_TransEvents.CompensateEventBehaviour.md)

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

### TransactionId

• `get` **TransactionId**(): `any`

#### Returns

`any`

#### Defined in

[src/elements/behaviours/TransEvents.ts:66](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/TransEvents.ts#L66)

## Methods

### describe

▸ **describe**(): `string`[]

#### Returns

`string`[]

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[describe](elements_behaviours_Behaviour.Behaviour.md#describe)

#### Defined in

[src/elements/behaviours/TransEvents.ts:70](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/TransEvents.ts#L70)

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

[src/elements/behaviours/TransEvents.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/TransEvents.ts#L34)

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

▸ **start**(`item`): `Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[start](elements_behaviours_Behaviour.Behaviour.md#start)

#### Defined in

[src/elements/behaviours/TransEvents.ts:38](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/TransEvents.ts#L38)
