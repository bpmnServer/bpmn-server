[bpmn-server](../API.md) / IModelsDatastore

# Interface: IModelsDatastore

## Implemented by

- [`ModelsDatastore`](../classes/ModelsDatastore.md)
- [`ModelsDatastoreDB`](../classes/ModelsDatastoreDB.md)

## Table of contents

### Methods

- [getList](IModelsDatastore.md#getlist)
- [getSource](IModelsDatastore.md#getsource)
- [getSVG](IModelsDatastore.md#getsvg)
- [save](IModelsDatastore.md#save)
- [load](IModelsDatastore.md#load)
- [loadModel](IModelsDatastore.md#loadmodel)
- [findEvents](IModelsDatastore.md#findevents)
- [install](IModelsDatastore.md#install)
- [import](IModelsDatastore.md#import)
- [saveModel](IModelsDatastore.md#savemodel)
- [deleteModel](IModelsDatastore.md#deletemodel)
- [renameModel](IModelsDatastore.md#renamemodel)

## Methods

### getList

▸ **getList**(`query`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[interfaces/datastore.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/interfaces/datastore.ts#L25)

___

### getSource

▸ **getSource**(`name`, `owner`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `owner` | `any` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[interfaces/datastore.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/interfaces/datastore.ts#L26)

___

### getSVG

▸ **getSVG**(`name`, `owner`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `owner` | `any` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[interfaces/datastore.ts:27](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/interfaces/datastore.ts#L27)

___

### save

▸ **save**(`name`, `bpmn`, `svg?`, `owner?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `bpmn` | `any` |
| `svg?` | `any` |
| `owner?` | `any` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[interfaces/datastore.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/interfaces/datastore.ts#L28)

___

### load

▸ **load**(`name`, `owner`): `Promise`\<[`IDefinition`](IDefinition.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `owner` | `any` |

#### Returns

`Promise`\<[`IDefinition`](IDefinition.md)\>

#### Defined in

[interfaces/datastore.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/interfaces/datastore.ts#L30)

___

### loadModel

▸ **loadModel**(`name`, `owner`): `Promise`\<[`IBpmnModelData`](IBpmnModelData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `owner` | `any` |

#### Returns

`Promise`\<[`IBpmnModelData`](IBpmnModelData.md)\>

#### Defined in

[interfaces/datastore.ts:31](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/interfaces/datastore.ts#L31)

___

### findEvents

▸ **findEvents**(`query`, `owner`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `owner` | `any` |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[interfaces/datastore.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/interfaces/datastore.ts#L32)

___

### install

▸ **install**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/datastore.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/interfaces/datastore.ts#L34)

___

### import

▸ **import**(`data`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/datastore.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/interfaces/datastore.ts#L35)

___

### saveModel

▸ **saveModel**(`model`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `model` | [`IBpmnModelData`](IBpmnModelData.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[interfaces/datastore.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/interfaces/datastore.ts#L37)

___

### deleteModel

▸ **deleteModel**(`name`, `owner`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `owner` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[interfaces/datastore.ts:38](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/interfaces/datastore.ts#L38)

___

### renameModel

▸ **renameModel**(`name`, `newName`, `owner`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `newName` | `any` |
| `owner` | `any` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[interfaces/datastore.ts:39](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/interfaces/datastore.ts#L39)
