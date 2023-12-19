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

[engine/Loop.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-19)

## Properties

### completed

• **completed**: `any`

#### Defined in

[engine/Loop.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-15)

___

### dataPath

• **dataPath**: `any`

#### Defined in

[engine/Loop.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-13)

___

### definition

• **definition**: [`LoopBehaviour`](LoopBehaviour.md)

#### Defined in

[engine/Loop.ts:11](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-11)

___

### id

• **id**: `any`

#### Defined in

[engine/Loop.ts:8](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-8)

___

### items

• **items**: `any`[]

#### Defined in

[engine/Loop.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-14)

___

### node

• **node**: `any`

#### Defined in

[engine/Loop.ts:9](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-9)

___

### ownerToken

• **ownerToken**: `any`

#### Defined in

[engine/Loop.ts:10](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-10)

___

### sequence

• **sequence**: `any`

#### Defined in

[engine/Loop.ts:12](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-12)

## Methods

### getKeyName

▸ **getKeyName**(): `string`

#### Returns

`string`

#### Defined in

[engine/Loop.ts:62](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-62)

___

### getNext

▸ **getNext**(): `any`

#### Returns

`any`

#### Defined in

[engine/Loop.ts:68](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-68)

___

### isDone

▸ **isDone**(): `boolean`

#### Returns

`boolean`

#### Defined in

[engine/Loop.ts:65](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-65)

___

### isSequential

▸ **isSequential**(): `any`

#### Returns

`any`

#### Defined in

[engine/Loop.ts:16](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-16)

___

### isStandard

▸ **isStandard**(): `boolean`

#### Returns

`boolean`

#### Defined in

[engine/Loop.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-17)

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

[engine/Loop.ts:45](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-45)

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

[engine/Loop.ts:142](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-142)

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

[engine/Loop.ts:75](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-75)

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

[engine/Loop.ts:52](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Loop.ts#lines-52)
