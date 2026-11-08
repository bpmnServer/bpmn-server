[bpmn-server](../readme.md) / IOBehaviour

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

- [node](IOBehaviour.md#node)
- [definition](IOBehaviour.md#definition)
- [parameters](IOBehaviour.md#parameters)

### Methods

- [restored](IOBehaviour.md#restored)
- [start](IOBehaviour.md#start)
- [run](IOBehaviour.md#run)
- [end](IOBehaviour.md#end)
- [resume](IOBehaviour.md#resume)
- [getNodeAttributes](IOBehaviour.md#getnodeattributes)
- [getItemAttributes](IOBehaviour.md#getitemattributes)
- [init](IOBehaviour.md#init)
- [enter](IOBehaviour.md#enter)
- [process](IOBehaviour.md#process)
- [exit](IOBehaviour.md#exit)
- [describe](IOBehaviour.md#describe)

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

### parameters

• **parameters**: `IOParameter`[]

#### Defined in

[packages/bpmn-server/src/elements/behaviours/IOBehaviour.ts:150](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/IOBehaviour.ts#L150)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:54](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L54)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:56](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L56)

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

[packages/bpmn-server/src/elements/behaviours/Behaviour.ts:58](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/Behaviour.ts#L58)

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

[packages/bpmn-server/src/elements/behaviours/IOBehaviour.ts:152](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/IOBehaviour.ts#L152)

___

### enter

▸ **enter**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Overrides

[Behaviour](Behaviour.md).[enter](Behaviour.md#enter)

#### Defined in

[packages/bpmn-server/src/elements/behaviours/IOBehaviour.ts:166](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/IOBehaviour.ts#L166)

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

[packages/bpmn-server/src/elements/behaviours/IOBehaviour.ts:199](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/IOBehaviour.ts#L199)

___

### exit

▸ **exit**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Overrides

[Behaviour](Behaviour.md).[exit](Behaviour.md#exit)

#### Defined in

[packages/bpmn-server/src/elements/behaviours/IOBehaviour.ts:210](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/IOBehaviour.ts#L210)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Overrides

[Behaviour](Behaviour.md).[describe](Behaviour.md#describe)

#### Defined in

[packages/bpmn-server/src/elements/behaviours/IOBehaviour.ts:231](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/IOBehaviour.ts#L231)
