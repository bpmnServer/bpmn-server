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

[engine/Loop.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L20)

## Properties

### id

• **id**: `any`

#### Defined in

[engine/Loop.ts:9](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L9)

___

### node

• **node**: `any`

#### Defined in

[engine/Loop.ts:10](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L10)

___

### ownerToken

• **ownerToken**: `any`

#### Defined in

[engine/Loop.ts:11](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L11)

___

### definition

• **definition**: [`LoopBehaviour`](LoopBehaviour.md)

#### Defined in

[engine/Loop.ts:12](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L12)

___

### sequence

• **sequence**: `any`

#### Defined in

[engine/Loop.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L13)

___

### dataPath

• **dataPath**: `any`

#### Defined in

[engine/Loop.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L14)

___

### items

• **items**: `any`[]

#### Defined in

[engine/Loop.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L15)

___

### completed

• **completed**: `any`

#### Defined in

[engine/Loop.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L16)

## Methods

### isSequential

▸ **isSequential**(): `any`

#### Returns

`any`

#### Defined in

[engine/Loop.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L17)

___

### isStandard

▸ **isStandard**(): `boolean`

#### Returns

`boolean`

#### Defined in

[engine/Loop.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L18)

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
| `completed` | `any` |
| `sequence` | `any` |

#### Defined in

[engine/Loop.ts:51](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L51)

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

[engine/Loop.ts:58](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L58)

___

### getKeyName

▸ **getKeyName**(): `string`

#### Returns

`string`

#### Defined in

[engine/Loop.ts:69](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L69)

___

### isDone

▸ **isDone**(): `boolean`

#### Returns

`boolean`

#### Defined in

[engine/Loop.ts:72](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L72)

___

### getNext

▸ **getNext**(): `any`

#### Returns

`any`

#### Defined in

[engine/Loop.ts:75](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L75)

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

[engine/Loop.ts:81](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L81)

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

[engine/Loop.ts:163](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L163)

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

[engine/Loop.ts:185](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Loop.ts#L185)
