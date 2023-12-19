[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/behaviours/Escalation](../modules/elements_behaviours_Escalation.md) / EscalationEventBehaviour

# Class: EscalationEventBehaviour

[elements/behaviours/Escalation](../modules/elements_behaviours_Escalation.md).EscalationEventBehaviour

Behaviour
     ioSpecification
     timer 
     message
     signal

  each behaviour is a class
     it scans def and insert itself to perform actions as required

## Hierarchy

- [`Behaviour`](elements_behaviours_Behaviour.Behaviour.md)

  ↳ **`EscalationEventBehaviour`**

## Table of contents

### Constructors

- [constructor](elements_behaviours_Escalation.EscalationEventBehaviour.md#constructor)

### Properties

- [definition](elements_behaviours_Escalation.EscalationEventBehaviour.md#definition)
- [node](elements_behaviours_Escalation.EscalationEventBehaviour.md#node)

### Accessors

- [escalationId](elements_behaviours_Escalation.EscalationEventBehaviour.md#escalationid)

### Methods

- [describe](elements_behaviours_Escalation.EscalationEventBehaviour.md#describe)
- [end](elements_behaviours_Escalation.EscalationEventBehaviour.md#end)
- [enter](elements_behaviours_Escalation.EscalationEventBehaviour.md#enter)
- [exit](elements_behaviours_Escalation.EscalationEventBehaviour.md#exit)
- [getItemAttributes](elements_behaviours_Escalation.EscalationEventBehaviour.md#getitemattributes)
- [getNodeAttributes](elements_behaviours_Escalation.EscalationEventBehaviour.md#getnodeattributes)
- [init](elements_behaviours_Escalation.EscalationEventBehaviour.md#init)
- [restored](elements_behaviours_Escalation.EscalationEventBehaviour.md#restored)
- [resume](elements_behaviours_Escalation.EscalationEventBehaviour.md#resume)
- [run](elements_behaviours_Escalation.EscalationEventBehaviour.md#run)
- [start](elements_behaviours_Escalation.EscalationEventBehaviour.md#start)

## Constructors

### constructor

• **new EscalationEventBehaviour**(`node`, `definition`): [`EscalationEventBehaviour`](elements_behaviours_Escalation.EscalationEventBehaviour.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](elements_Node.Node.md) |
| `definition` | `any` |

#### Returns

[`EscalationEventBehaviour`](elements_behaviours_Escalation.EscalationEventBehaviour.md)

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

### escalationId

• `get` **escalationId**(): `any`

#### Returns

`any`

#### Defined in

[src/elements/behaviours/Escalation.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Escalation.ts#L29)

## Methods

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[describe](elements_behaviours_Behaviour.Behaviour.md#describe)

#### Defined in

[src/elements/behaviours/Escalation.ts:33](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Escalation.ts#L33)

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

[src/elements/behaviours/Escalation.ts:10](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Escalation.ts#L10)

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

▸ **start**(`item`): `Promise`\<[`continue`](../enums/interfaces_Enums.NODE_ACTION.md#continue) \| [`wait`](../enums/interfaces_Enums.NODE_ACTION.md#wait)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<[`continue`](../enums/interfaces_Enums.NODE_ACTION.md#continue) \| [`wait`](../enums/interfaces_Enums.NODE_ACTION.md#wait)\>

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[start](elements_behaviours_Behaviour.Behaviour.md#start)

#### Defined in

[src/elements/behaviours/Escalation.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Escalation.ts#L14)
