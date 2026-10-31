[bpmn-server](../readme.md) / IModelsDatastore

# Interface: IModelsDatastore

## Implemented by

- [`ModelsDatastore`](../classes/ModelsDatastore.md)
- [`ModelsDatastoreDB`](../classes/ModelsDatastoreDB.md)

## Table of contents

### Methods

- [get](IModelsDatastore.md#get)
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

### get

▸ **get**(`query`): `Promise`\<`object`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<`object`[]\>

#### Defined in

[interfaces/datastore.ts:26](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L26)

___

### getList

▸ **getList**(`query`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[interfaces/datastore.ts:27](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L27)

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

[interfaces/datastore.ts:28](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L28)

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

[interfaces/datastore.ts:29](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L29)

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

[interfaces/datastore.ts:30](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L30)

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

[interfaces/datastore.ts:32](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L32)

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

[interfaces/datastore.ts:33](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L33)

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

[interfaces/datastore.ts:34](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L34)

___

### install

▸ **install**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/datastore.ts:36](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L36)

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

[interfaces/datastore.ts:37](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L37)

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

[interfaces/datastore.ts:39](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L39)

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

[interfaces/datastore.ts:40](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L40)

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

[interfaces/datastore.ts:41](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L41)
