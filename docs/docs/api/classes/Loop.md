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
- [endAsked](Loop.md#endasked)

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

[packages/bpmn-server/src/engine/Loop.ts:25](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L25)

## Properties

### id

• **id**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:14](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L14)

___

### node

• **node**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:15](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L15)

___

### ownerToken

• **ownerToken**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:16](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L16)

___

### definition

• **definition**: [`LoopBehaviour`](LoopBehaviour.md)

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:17](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L17)

___

### sequence

• **sequence**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L18)

___

### dataPath

• **dataPath**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L19)

___

### \_items

• **\_items**: `any`[]

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L20)

___

### completed

• **completed**: `number` = `1`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:21](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L21)

___

### endFlag

• **endFlag**: `boolean` = `false`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:59](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L59)

___

### endAsked

• **endAsked**: `boolean` = `false`

end() was called: a parallel or sequential loop ends at this round's end, as its completion condition ends it

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:61](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L61)

## Methods

### isSequential

▸ **isSequential**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L22)

___

### isStandard

▸ **isStandard**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:23](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L23)

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
| `endAsked` | `boolean` |
| `completed` | `number` |
| `sequence` | `any` |

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:51](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L51)

___

### end

▸ **end**(): `void`

Ends the loop: a standard loop at its next round; a parallel or sequential one when the current round ends (a
script or listener of that round calls it), the rounds still running cancelled and the loop going on.

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:66](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L66)

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

[packages/bpmn-server/src/engine/Loop.ts:71](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L71)

___

### getKeyName

▸ **getKeyName**(): `string`

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:82](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L82)

___

### getItems

▸ **getItems**(): `Promise`\<`any`[]\>

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:85](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L85)

___

### isDone

▸ **isDone**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:96](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L96)

___

### getNext

▸ **getNext**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/engine/Loop.ts:100](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L100)

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

[packages/bpmn-server/src/engine/Loop.ts:108](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L108)

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

[packages/bpmn-server/src/engine/Loop.ts:112](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L112)

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

[packages/bpmn-server/src/engine/Loop.ts:121](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L121)

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

[packages/bpmn-server/src/engine/Loop.ts:149](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L149)

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

[packages/bpmn-server/src/engine/Loop.ts:236](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L236)

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

[packages/bpmn-server/src/engine/Loop.ts:292](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Loop.ts#L292)
