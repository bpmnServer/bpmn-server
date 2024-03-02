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
- [items](Loop.md#items)
- [completed](Loop.md#completed)

### Methods

- [isSequential](Loop.md#issequential)
- [isStandard](Loop.md#isstandard)
- [save](Loop.md#save)
- [load](Loop.md#load)
- [getKeyName](Loop.md#getkeyname)
- [isDone](Loop.md#isdone)
- [getNext](Loop.md#getnext)
- [checkStart](Loop.md#checkstart)
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

[engine/Loop.ts:19](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L19)

## Properties

### id

• **id**: `any`

#### Defined in

[engine/Loop.ts:8](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L8)

___

### node

• **node**: `any`

#### Defined in

[engine/Loop.ts:9](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L9)

___

### ownerToken

• **ownerToken**: `any`

#### Defined in

[engine/Loop.ts:10](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L10)

___

### definition

• **definition**: [`LoopBehaviour`](LoopBehaviour.md)

#### Defined in

[engine/Loop.ts:11](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L11)

___

### sequence

• **sequence**: `any`

#### Defined in

[engine/Loop.ts:12](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L12)

___

### dataPath

• **dataPath**: `any`

#### Defined in

[engine/Loop.ts:13](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L13)

___

### items

• **items**: `any`[]

#### Defined in

[engine/Loop.ts:14](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L14)

___

### completed

• **completed**: `any`

#### Defined in

[engine/Loop.ts:15](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L15)

## Methods

### isSequential

▸ **isSequential**(): `any`

#### Returns

`any`

#### Defined in

[engine/Loop.ts:16](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L16)

___

### isStandard

▸ **isStandard**(): `boolean`

#### Returns

`boolean`

#### Defined in

[engine/Loop.ts:17](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L17)

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
| `completed` | `any` |
| `sequence` | `any` |

#### Defined in

[engine/Loop.ts:45](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L45)

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

[engine/Loop.ts:52](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L52)

___

### getKeyName

▸ **getKeyName**(): `string`

#### Returns

`string`

#### Defined in

[engine/Loop.ts:62](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L62)

___

### isDone

▸ **isDone**(): `boolean`

#### Returns

`boolean`

#### Defined in

[engine/Loop.ts:65](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L65)

___

### getNext

▸ **getNext**(): `any`

#### Returns

`any`

#### Defined in

[engine/Loop.ts:68](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L68)

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

[engine/Loop.ts:75](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L75)

___

### checkNext

▸ **checkNext**(`token`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`Token`](Token.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[engine/Loop.ts:142](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/engine/Loop.ts#L142)
