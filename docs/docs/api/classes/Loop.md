[bpmn-server](../readme.md) / Loop

# Class: Loop

## Table of contents

### Constructors

- [constructor](Loop.md#constructor)

### Properties

- [id](Loop.md#id)
- [node](Loop.md#node)
- [ownerToken](Loop.md#ownertoken)
- [definition](Loop.md#definition)
- [sequence](Loop.md#sequence)
- [dataPath](Loop.md#datapath)
- [\_items](Loop.md#_items)
- [completed](Loop.md#completed)
- [endFlag](Loop.md#endflag)

### Methods

- [isSequential](Loop.md#issequential)
- [isStandard](Loop.md#isstandard)
- [save](Loop.md#save)
- [end](Loop.md#end)
- [load](Loop.md#load)
- [getKeyName](Loop.md#getkeyname)
- [getItems](Loop.md#getitems)
- [isDone](Loop.md#isdone)
- [getNext](Loop.md#getnext)
- [roundKey](Loop.md#roundkey)
- [roundData](Loop.md#rounddata)
- [completes](Loop.md#completes)
- [checkStart](Loop.md#checkstart)
- [cancel](Loop.md#cancel)
- [checkNext](Loop.md#checknext)

## Constructors

### constructor

• **new Loop**(`node`, `token`, `dataObject?`): [`Loop`](Loop.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](Node.md) |
| `token` | [`Token`](Token.md) |
| `dataObject?` | `any` |

#### Returns

[`Loop`](Loop.md)

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L25)

## Properties

### id

• **id**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L14)

___

### node

• **node**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L15)

___

### ownerToken

• **ownerToken**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L16)

___

### definition

• **definition**: [`LoopBehaviour`](LoopBehaviour.md)

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L17)

___

### sequence

• **sequence**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L18)

___

### dataPath

• **dataPath**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L19)

___

### \_items

• **\_items**: `any`[]

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L20)

___

### completed

• **completed**: `number` = `1`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L21)

___

### endFlag

• **endFlag**: `boolean` = `false`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:58](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L58)

## Methods

### isSequential

▸ **isSequential**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:22](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L22)

___

### isStandard

▸ **isStandard**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L23)

___

### save

▸ **save**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `nodeId` | `any` |
| `ownerTokenId` | `any` |
| `dataPath` | `any` |
| `items` | `any`[] |
| `endFlag` | `boolean` |
| `completed` | `number` |
| `sequence` | `any` |

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:50](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L50)

___

### end

▸ **end**(): `void`

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:59](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L59)

___

### load

▸ **load**(`execution`, `dataObject`): [`Loop`](Loop.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | `any` |
| `dataObject` | `any` |

#### Returns

[`Loop`](Loop.md)

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:62](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L62)

___

### getKeyName

▸ **getKeyName**(): `string`

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:73](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L73)

___

### getItems

▸ **getItems**(): `Promise`\<`any`[]\>

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:76](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L76)

___

### isDone

▸ **isDone**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:87](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L87)

___

### getNext

▸ **getNext**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:91](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L91)

___

### roundKey

▸ **roundKey**(`entry`, `index`): `any`

A round's key in the loop's data: its element, or its index when the element is an object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `entry` | `any` |
| `index` | `number` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:99](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L99)

___

### roundData

▸ **roundData**(`entry`, `index`): \{ `loopCounter`: `number` = index } \| \{ `loopCounter?`: `undefined` = index }

A round's own data: its element under the loop's elementVariable, and its index (loopCounter).

#### Parameters

| Name | Type |
| :------ | :------ |
| `entry` | `any` |
| `index` | `number` |

#### Returns

\{ `loopCounter`: `number` = index } \| \{ `loopCounter?`: `undefined` = index }

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:103](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L103)

___

### completes

▸ **completes**(`token`): `Promise`\<`boolean`\>

After a round: the completion condition, given Camunda's counts (nrOfInstances, nrOfCompletedInstances,
nrOfActiveInstances) and `rounds`, each round's data; true: no more rounds. The values are written into
the expression, so any script handler (the sandbox too) sees them.

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`Token`](Token.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:112](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L112)

___

### checkStart

▸ **checkStart**(`token`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `any` | is called before Node execute and before an item is created |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:140](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L140)

___

### cancel

▸ **cancel**(`fromItem`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fromItem` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:227](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L227)

___

### checkNext

▸ **checkNext**(`token`): `Promise`\<`boolean`\>

is called just before moving to next item in the flow

 checks if there is more items to be executed in the loop
 if more items are needed:
     execute
     return false
 returns true only if no loop for the token

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`Token`](Token.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:278](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Loop.ts#L278)
