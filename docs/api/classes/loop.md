[bpmn-server](../README.md) / Loop

# Class: Loop

## Table of contents

### Constructors

- [constructor](Loop.md#constructor)

### Properties

- [completed](Loop.md#completed)
- [dataPath](Loop.md#datapath)
- [definition](Loop.md#definition)
- [id](Loop.md#id)
- [items](Loop.md#items)
- [node](Loop.md#node)
- [ownerToken](Loop.md#ownertoken)
- [sequence](Loop.md#sequence)

### Methods

- [getKeyName](Loop.md#getkeyname)
- [getNext](Loop.md#getnext)
- [isDone](Loop.md#isdone)
- [isSequential](Loop.md#issequential)
- [isStandard](Loop.md#isstandard)
- [save](Loop.md#save)
- [checkNext](Loop.md#checknext)
- [checkStart](Loop.md#checkstart)
- [load](Loop.md#load)

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

[engine/Loop.ts:19](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L19)

## Properties

### completed

• **completed**: `any`

#### Defined in

[engine/Loop.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L15)

___

### dataPath

• **dataPath**: `any`

#### Defined in

[engine/Loop.ts:13](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L13)

___

### definition

• **definition**: [`LoopBehaviour`](LoopBehaviour.md)

#### Defined in

[engine/Loop.ts:11](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L11)

___

### id

• **id**: `any`

#### Defined in

[engine/Loop.ts:8](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L8)

___

### items

• **items**: `any`[]

#### Defined in

[engine/Loop.ts:14](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L14)

___

### node

• **node**: `any`

#### Defined in

[engine/Loop.ts:9](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L9)

___

### ownerToken

• **ownerToken**: `any`

#### Defined in

[engine/Loop.ts:10](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L10)

___

### sequence

• **sequence**: `any`

#### Defined in

[engine/Loop.ts:12](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L12)

## Methods

### getKeyName

▸ **getKeyName**(): `string`

#### Returns

`string`

#### Defined in

[engine/Loop.ts:62](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L62)

___

### getNext

▸ **getNext**(): `any`

#### Returns

`any`

#### Defined in

[engine/Loop.ts:68](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L68)

___

### isDone

▸ **isDone**(): `boolean`

#### Returns

`boolean`

#### Defined in

[engine/Loop.ts:65](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L65)

___

### isSequential

▸ **isSequential**(): `any`

#### Returns

`any`

#### Defined in

[engine/Loop.ts:16](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L16)

___

### isStandard

▸ **isStandard**(): `boolean`

#### Returns

`boolean`

#### Defined in

[engine/Loop.ts:17](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L17)

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

[engine/Loop.ts:45](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L45)

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

[engine/Loop.ts:142](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L142)

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

[engine/Loop.ts:75](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L75)

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

[engine/Loop.ts:52](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/engine/Loop.ts#L52)
