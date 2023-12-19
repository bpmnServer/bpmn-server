[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/behaviours/Timer](../modules/elements_behaviours_Timer.md) / TimerBehaviour

# Class: TimerBehaviour

[elements/behaviours/Timer](../modules/elements_behaviours_Timer.md).TimerBehaviour

Behaviour
     ioSpecification
     timer 
     message
     signal

  each behaviour is a class
     it scans def and insert itself to perform actions as required

## Hierarchy

- [`Behaviour`](elements_behaviours_Behaviour.Behaviour.md)

  ↳ **`TimerBehaviour`**

## Table of contents

### Constructors

- [constructor](elements_behaviours_Timer.TimerBehaviour.md#constructor)

### Properties

- [definition](elements_behaviours_Timer.TimerBehaviour.md#definition)
- [duration](elements_behaviours_Timer.TimerBehaviour.md#duration)
- [node](elements_behaviours_Timer.TimerBehaviour.md#node)
- [repeat](elements_behaviours_Timer.TimerBehaviour.md#repeat)
- [timeCycle](elements_behaviours_Timer.TimerBehaviour.md#timecycle)
- [timeDate](elements_behaviours_Timer.TimerBehaviour.md#timedate)

### Methods

- [describe](elements_behaviours_Timer.TimerBehaviour.md#describe)
- [end](elements_behaviours_Timer.TimerBehaviour.md#end)
- [enter](elements_behaviours_Timer.TimerBehaviour.md#enter)
- [exit](elements_behaviours_Timer.TimerBehaviour.md#exit)
- [expires](elements_behaviours_Timer.TimerBehaviour.md#expires)
- [getItemAttributes](elements_behaviours_Timer.TimerBehaviour.md#getitemattributes)
- [getNodeAttributes](elements_behaviours_Timer.TimerBehaviour.md#getnodeattributes)
- [getRepeat](elements_behaviours_Timer.TimerBehaviour.md#getrepeat)
- [init](elements_behaviours_Timer.TimerBehaviour.md#init)
- [restored](elements_behaviours_Timer.TimerBehaviour.md#restored)
- [resume](elements_behaviours_Timer.TimerBehaviour.md#resume)
- [run](elements_behaviours_Timer.TimerBehaviour.md#run)
- [start](elements_behaviours_Timer.TimerBehaviour.md#start)
- [startTimer](elements_behaviours_Timer.TimerBehaviour.md#starttimer)
- [timeDue](elements_behaviours_Timer.TimerBehaviour.md#timedue)

## Constructors

### constructor

• **new TimerBehaviour**(`node`, `definition`): [`TimerBehaviour`](elements_behaviours_Timer.TimerBehaviour.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](elements_Node.Node.md) |
| `definition` | `any` |

#### Returns

[`TimerBehaviour`](elements_behaviours_Timer.TimerBehaviour.md)

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

### duration

• **duration**: `any`

#### Defined in

[src/elements/behaviours/Timer.ts:55](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Timer.ts#L55)

___

### node

• **node**: [`Node`](elements_Node.Node.md)

#### Inherited from

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[node](elements_behaviours_Behaviour.Behaviour.md#node)

#### Defined in

[src/elements/behaviours/Behaviour.ts:38](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Behaviour.ts#L38)

___

### repeat

• **repeat**: `number` = `1`

#### Defined in

[src/elements/behaviours/Timer.ts:56](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Timer.ts#L56)

___

### timeCycle

• **timeCycle**: `any`

#### Defined in

[src/elements/behaviours/Timer.ts:57](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Timer.ts#L57)

___

### timeDate

• **timeDate**: `any`

#### Defined in

[src/elements/behaviours/Timer.ts:58](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Timer.ts#L58)

## Methods

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[describe](elements_behaviours_Behaviour.Behaviour.md#describe)

#### Defined in

[src/elements/behaviours/Timer.ts:82](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Timer.ts#L82)

___

### end

▸ **end**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[end](elements_behaviours_Behaviour.Behaviour.md#end)

#### Defined in

[src/elements/behaviours/Timer.ts:202](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Timer.ts#L202)

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

### expires

▸ **expires**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/elements/behaviours/Timer.ts:166](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Timer.ts#L166)

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

### getRepeat

▸ **getRepeat**(`input`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `any` |

#### Returns

`any`

#### Defined in

[src/elements/behaviours/Timer.ts:129](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Timer.ts#L129)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[init](elements_behaviours_Behaviour.Behaviour.md#init)

#### Defined in

[src/elements/behaviours/Timer.ts:59](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Timer.ts#L59)

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

▸ **resume**(): `void`

#### Returns

`void`

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[resume](elements_behaviours_Behaviour.Behaviour.md#resume)

#### Defined in

[src/elements/behaviours/Timer.ts:206](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Timer.ts#L206)

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

▸ **start**(`item`): [`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)

#### Overrides

[Behaviour](elements_behaviours_Behaviour.Behaviour.md).[start](elements_behaviours_Behaviour.Behaviour.md#start)

#### Defined in

[src/elements/behaviours/Timer.ts:137](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Timer.ts#L137)

___

### startTimer

▸ **startTimer**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`void`

#### Defined in

[src/elements/behaviours/Timer.ts:148](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Timer.ts#L148)

___

### timeDue

▸ **timeDue**(`item`, `timerModifier?`): `any`

return the next time the timer is due
format is time format

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `item` | `any` | `undefined` | - |
| `timerModifier` | `any` | `null` | for testing purposes configuration can alter the timer |

#### Returns

`any`

#### Defined in

[src/elements/behaviours/Timer.ts:99](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/behaviours/Timer.ts#L99)
