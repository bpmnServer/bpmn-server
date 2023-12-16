[bpmn-server](../README.md) / TimerBehaviour

# Class: TimerBehaviour

Behaviour
     ioSpecification
     timer 
     message
     signal

  each behaviour is a class
     it scans def and insert itself to perform actions as required

## Hierarchy

- [`Behaviour`](Behaviour.md)

  ↳ **`TimerBehaviour`**

## Table of contents

### Constructors

- [constructor](TimerBehaviour.md#constructor)

### Properties

- [definition](TimerBehaviour.md#definition)
- [duration](TimerBehaviour.md#duration)
- [node](TimerBehaviour.md#node)
- [repeat](TimerBehaviour.md#repeat)
- [timeCycle](TimerBehaviour.md#timecycle)
- [timeDate](TimerBehaviour.md#timedate)

### Methods

- [describe](TimerBehaviour.md#describe)
- [end](TimerBehaviour.md#end)
- [enter](TimerBehaviour.md#enter)
- [exit](TimerBehaviour.md#exit)
- [expires](TimerBehaviour.md#expires)
- [getItemAttributes](TimerBehaviour.md#getitemattributes)
- [getNodeAttributes](TimerBehaviour.md#getnodeattributes)
- [getRepeat](TimerBehaviour.md#getrepeat)
- [init](TimerBehaviour.md#init)
- [restored](TimerBehaviour.md#restored)
- [resume](TimerBehaviour.md#resume)
- [run](TimerBehaviour.md#run)
- [start](TimerBehaviour.md#start)
- [startTimer](TimerBehaviour.md#starttimer)
- [timeDue](TimerBehaviour.md#timedue)

## Constructors

### constructor

• **new TimerBehaviour**(`node`, `definition`): [`TimerBehaviour`](TimerBehaviour.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](Node.md) |
| `definition` | `any` |

#### Returns

[`TimerBehaviour`](TimerBehaviour.md)

#### Inherited from

[Behaviour](Behaviour.md).[constructor](Behaviour.md#constructor)

#### Defined in

[elements/behaviours/Behaviour.ts:40](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L40)

## Properties

### definition

• **definition**: `any`

#### Inherited from

[Behaviour](Behaviour.md).[definition](Behaviour.md#definition)

#### Defined in

[elements/behaviours/Behaviour.ts:39](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L39)

___

### duration

• **duration**: `any`

#### Defined in

[elements/behaviours/Timer.ts:55](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Timer.ts#L55)

___

### node

• **node**: [`Node`](Node.md)

#### Inherited from

[Behaviour](Behaviour.md).[node](Behaviour.md#node)

#### Defined in

[elements/behaviours/Behaviour.ts:38](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L38)

___

### repeat

• **repeat**: `number` = `1`

#### Defined in

[elements/behaviours/Timer.ts:56](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Timer.ts#L56)

___

### timeCycle

• **timeCycle**: `any`

#### Defined in

[elements/behaviours/Timer.ts:57](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Timer.ts#L57)

___

### timeDate

• **timeDate**: `any`

#### Defined in

[elements/behaviours/Timer.ts:58](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Timer.ts#L58)

## Methods

### describe

▸ **describe**(): `string`[]

#### Returns

`string`[]

#### Overrides

[Behaviour](Behaviour.md).[describe](Behaviour.md#describe)

#### Defined in

[elements/behaviours/Timer.ts:82](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Timer.ts#L82)

___

### end

▸ **end**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Overrides

[Behaviour](Behaviour.md).[end](Behaviour.md#end)

#### Defined in

[elements/behaviours/Timer.ts:193](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Timer.ts#L193)

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

[elements/behaviours/Behaviour.ts:48](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L48)

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

[elements/behaviours/Behaviour.ts:52](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L52)

___

### expires

▸ **expires**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[elements/behaviours/Timer.ts:157](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Timer.ts#L157)

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

[elements/behaviours/Behaviour.ts:55](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L55)

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

[elements/behaviours/Behaviour.ts:54](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L54)

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

[elements/behaviours/Timer.ts:120](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Timer.ts#L120)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Overrides

[Behaviour](Behaviour.md).[init](Behaviour.md#init)

#### Defined in

[elements/behaviours/Timer.ts:59](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Timer.ts#L59)

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

[elements/behaviours/Behaviour.ts:45](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L45)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Overrides

[Behaviour](Behaviour.md).[resume](Behaviour.md#resume)

#### Defined in

[elements/behaviours/Timer.ts:197](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Timer.ts#L197)

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

[elements/behaviours/Behaviour.ts:50](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Behaviour.ts#L50)

___

### start

▸ **start**(`item`): [`NODE_ACTION`](../enums/NODE_ACTION.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

[`NODE_ACTION`](../enums/NODE_ACTION.md)

#### Overrides

[Behaviour](Behaviour.md).[start](Behaviour.md#start)

#### Defined in

[elements/behaviours/Timer.ts:128](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Timer.ts#L128)

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

[elements/behaviours/Timer.ts:139](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Timer.ts#L139)

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

[elements/behaviours/Timer.ts:90](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/Timer.ts#L90)
