[bpmn-server](../readme.md) / TimerBehaviour

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

- [node](TimerBehaviour.md#node)
- [definition](TimerBehaviour.md#definition)
- [duration](TimerBehaviour.md#duration)
- [repeat](TimerBehaviour.md#repeat)
- [timeCycle](TimerBehaviour.md#timecycle)
- [timeDate](TimerBehaviour.md#timedate)

### Methods

- [restored](TimerBehaviour.md#restored)
- [enter](TimerBehaviour.md#enter)
- [run](TimerBehaviour.md#run)
- [exit](TimerBehaviour.md#exit)
- [getNodeAttributes](TimerBehaviour.md#getnodeattributes)
- [getItemAttributes](TimerBehaviour.md#getitemattributes)
- [init](TimerBehaviour.md#init)
- [describe](TimerBehaviour.md#describe)
- [timeDue](TimerBehaviour.md#timedue)
- [getRepeat](TimerBehaviour.md#getrepeat)
- [start](TimerBehaviour.md#start)
- [startTimer](TimerBehaviour.md#starttimer)
- [expires](TimerBehaviour.md#expires)
- [end](TimerBehaviour.md#end)
- [resume](TimerBehaviour.md#resume)

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

### duration

• **duration**: `any`

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Timer.ts:57](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Timer.ts#L57)

___

### repeat

• **repeat**: `number` = `1`

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Timer.ts:58](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Timer.ts#L58)

___

### timeCycle

• **timeCycle**: `any`

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Timer.ts:59](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Timer.ts#L59)

___

### timeDate

• **timeDate**: `any`

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Timer.ts:60](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Timer.ts#L60)

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

[packages/bpmn-server/src/elements/behaviours/Timer.ts:61](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Timer.ts#L61)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Overrides

[Behaviour](Behaviour.md).[describe](Behaviour.md#describe)

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Timer.ts:84](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Timer.ts#L84)

___

### timeDue

▸ **timeDue**(`item`, `timerModifier?`): `Promise`\<`any`\>

return the next time the timer is due
format is time format

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `item` | `any` | `undefined` | - |
| `timerModifier` | `any` | `null` | for testing purposes configuration can alter the timer |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Timer.ts:101](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Timer.ts#L101)

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

[packages/bpmn-server/src/elements/behaviours/Timer.ts:141](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Timer.ts#L141)

___

### start

▸ **start**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Overrides

[Behaviour](Behaviour.md).[start](Behaviour.md#start)

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Timer.ts:149](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Timer.ts#L149)

___

### startTimer

▸ **startTimer**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Timer.ts:160](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Timer.ts#L160)

___

### expires

▸ **expires**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Timer.ts:197](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Timer.ts#L197)

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

[packages/bpmn-server/src/elements/behaviours/Timer.ts:251](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Timer.ts#L251)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Overrides

[Behaviour](Behaviour.md).[resume](Behaviour.md#resume)

#### Defined in

[packages/bpmn-server/src/elements/behaviours/Timer.ts:255](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Timer.ts#L255)
