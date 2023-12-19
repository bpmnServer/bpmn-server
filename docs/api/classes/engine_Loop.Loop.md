[bpmn-server](../README.md) / [Exports](../modules.md) / [engine/Loop](../modules/engine_Loop.md) / Loop

# Class: Loop

[engine/Loop](../modules/engine_Loop.md).Loop

## Table of contents

### Constructors

- [constructor](engine_Loop.Loop.md#constructor)

### Properties

- [completed](engine_Loop.Loop.md#completed)
- [dataPath](engine_Loop.Loop.md#datapath)
- [definition](engine_Loop.Loop.md#definition)
- [id](engine_Loop.Loop.md#id)
- [items](engine_Loop.Loop.md#items)
- [node](engine_Loop.Loop.md#node)
- [ownerToken](engine_Loop.Loop.md#ownertoken)
- [sequence](engine_Loop.Loop.md#sequence)

### Methods

- [getKeyName](engine_Loop.Loop.md#getkeyname)
- [getNext](engine_Loop.Loop.md#getnext)
- [isDone](engine_Loop.Loop.md#isdone)
- [isSequential](engine_Loop.Loop.md#issequential)
- [isStandard](engine_Loop.Loop.md#isstandard)
- [save](engine_Loop.Loop.md#save)
- [checkNext](engine_Loop.Loop.md#checknext)
- [checkStart](engine_Loop.Loop.md#checkstart)
- [load](engine_Loop.Loop.md#load)

## Constructors

### constructor

• **new Loop**(`node`, `token`, `dataObject?`): [`Loop`](engine_Loop.Loop.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](elements_Node.Node.md) |
| `token` | [`Token`](engine_Token.Token.md) |
| `dataObject?` | `any` |

#### Returns

[`Loop`](engine_Loop.Loop.md)

#### Defined in

[src/engine/Loop.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L19)

## Properties

### completed

• **completed**: `any`

#### Defined in

[src/engine/Loop.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L15)

___

### dataPath

• **dataPath**: `any`

#### Defined in

[src/engine/Loop.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L13)

___

### definition

• **definition**: [`LoopBehaviour`](elements_behaviours_Loop.LoopBehaviour.md)

#### Defined in

[src/engine/Loop.ts:11](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L11)

___

### id

• **id**: `any`

#### Defined in

[src/engine/Loop.ts:8](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L8)

___

### items

• **items**: `any`[]

#### Defined in

[src/engine/Loop.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L14)

___

### node

• **node**: `any`

#### Defined in

[src/engine/Loop.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L9)

___

### ownerToken

• **ownerToken**: `any`

#### Defined in

[src/engine/Loop.ts:10](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L10)

___

### sequence

• **sequence**: `any`

#### Defined in

[src/engine/Loop.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L12)

## Methods

### getKeyName

▸ **getKeyName**(): `string`

#### Returns

`string`

#### Defined in

[src/engine/Loop.ts:62](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L62)

___

### getNext

▸ **getNext**(): `any`

#### Returns

`any`

#### Defined in

[src/engine/Loop.ts:68](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L68)

___

### isDone

▸ **isDone**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/engine/Loop.ts:65](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L65)

___

### isSequential

▸ **isSequential**(): `any`

#### Returns

`any`

#### Defined in

[src/engine/Loop.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L16)

___

### isStandard

▸ **isStandard**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/engine/Loop.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L17)

___

### save

▸ **save**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `completed` | `any` |
| `dataPath` | `any` |
| `id` | `any` |
| `nodeId` | `any` |
| `ownerTokenId` | `any` |
| `sequence` | `any` |

#### Defined in

[src/engine/Loop.ts:45](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L45)

___

### checkNext

▸ **checkNext**(`token`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`Token`](engine_Token.Token.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/engine/Loop.ts:142](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L142)

___

### checkStart

▸ **checkStart**(`token`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `any` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/engine/Loop.ts:75](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L75)

___

### load

▸ **load**(`execution`, `dataObject`): [`Loop`](engine_Loop.Loop.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | `any` |
| `dataObject` | `any` |

#### Returns

[`Loop`](engine_Loop.Loop.md)

#### Defined in

[src/engine/Loop.ts:52](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Loop.ts#L52)
