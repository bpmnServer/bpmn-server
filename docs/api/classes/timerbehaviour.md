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

[elements/behaviours/Behaviour.ts:40](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-40)

## Properties

### definition

• **definition**: `any`

#### Inherited from

[Behaviour](Behaviour.md).[definition](Behaviour.md#definition)

#### Defined in

[elements/behaviours/Behaviour.ts:39](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-39)

___

### duration

• **duration**: `any`

#### Defined in

[elements/behaviours/Timer.ts:55](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Timer.ts#lines-55)

___

### node

• **node**: [`Node`](Node.md)

#### Inherited from

[Behaviour](Behaviour.md).[node](Behaviour.md#node)

#### Defined in

[elements/behaviours/Behaviour.ts:38](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Behaviour.ts#lines-38)

___

### repeat

• **repeat**: `number` = `1`

#### Defined in

[elements/behaviours/Timer.ts:56](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Timer.ts#lines-56)

___

### timeCycle

• **timeCycle**: `any`

#### Defined in

[elements/behaviours/Timer.ts:57](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Timer.ts#lines-57)

___

### timeDate

• **timeDate**: `any`

#### Defined in

[elements/behaviours/Timer.ts:58](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Timer.ts#lines-58)

## Methods

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Overrides

[Behaviour](Behaviour.md).[describe](Behaviour.md#describe)

#### Defined in

[elements/behaviours/Timer.ts:82](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Timer.ts#lines-82)

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

[elements/behaviours/Timer.ts:202](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Timer.ts#lines-202)

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

### expires

▸ **expires**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[elements/behaviours/Timer.ts:166](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Timer.ts#lines-166)

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

### getRepeat

▸ **getRepeat**(`input`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `any` |

#### Returns

`any`

#### Defined in

[elements/behaviours/Timer.ts:129](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Timer.ts#lines-129)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Overrides

[Behaviour](Behaviour.md).[init](Behaviour.md#init)

#### Defined in

[elements/behaviours/Timer.ts:59](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Timer.ts#lines-59)

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

▸ **resume**(): `void`

#### Returns

`void`

#### Overrides

[Behaviour](Behaviour.md).[resume](Behaviour.md#resume)

#### Defined in

[elements/behaviours/Timer.ts:206](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Timer.ts#lines-206)

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

[elements/behaviours/Timer.ts:137](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Timer.ts#lines-137)

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

[elements/behaviours/Timer.ts:148](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Timer.ts#lines-148)

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

[elements/behaviours/Timer.ts:99](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/behaviours/Timer.ts#lines-99)
