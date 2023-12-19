[bpmn-server](../README.md) / [Exports](../modules.md) / [interfaces/datastore](../modules/interfaces_datastore.md) / IModelsDatastore

# Interface: IModelsDatastore

[interfaces/datastore](../modules/interfaces_datastore.md).IModelsDatastore

## Implemented by

- [`ModelsDatastore`](../classes/datastore_ModelsDatastore.ModelsDatastore.md)
- [`ModelsDatastoreDB`](../classes/datastore_ModelsDatastoreDB.ModelsDatastoreDB.md)

## Table of contents

### Methods

- [deleteModel](interfaces_datastore.IModelsDatastore.md#deletemodel)
- [findEvents](interfaces_datastore.IModelsDatastore.md#findevents)
- [getList](interfaces_datastore.IModelsDatastore.md#getlist)
- [getSVG](interfaces_datastore.IModelsDatastore.md#getsvg)
- [getSource](interfaces_datastore.IModelsDatastore.md#getsource)
- [import](interfaces_datastore.IModelsDatastore.md#import)
- [install](interfaces_datastore.IModelsDatastore.md#install)
- [load](interfaces_datastore.IModelsDatastore.md#load)
- [loadModel](interfaces_datastore.IModelsDatastore.md#loadmodel)
- [renameModel](interfaces_datastore.IModelsDatastore.md#renamemodel)
- [save](interfaces_datastore.IModelsDatastore.md#save)
- [saveModel](interfaces_datastore.IModelsDatastore.md#savemodel)

## Methods

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

[src/interfaces/datastore.ts:38](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L38)

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

[src/interfaces/datastore.ts:32](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L32)

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

[src/interfaces/datastore.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L25)

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

[src/interfaces/datastore.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L27)

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

[src/interfaces/datastore.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L26)

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

[src/interfaces/datastore.ts:35](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L35)

___

### install

▸ **install**(): `any`

#### Returns

`any`

#### Defined in

[src/interfaces/datastore.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L34)

___

### load

▸ **load**(`name`, `owner`): `Promise`\<[`IDefinition`](interfaces_elements.IDefinition.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `owner` | `any` |

#### Returns

`Promise`\<[`IDefinition`](interfaces_elements.IDefinition.md)\>

#### Defined in

[src/interfaces/datastore.ts:30](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L30)

___

### loadModel

▸ **loadModel**(`name`, `owner`): `Promise`\<[`IBpmnModelData`](interfaces_DataObjects.IBpmnModelData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `owner` | `any` |

#### Returns

`Promise`\<[`IBpmnModelData`](interfaces_DataObjects.IBpmnModelData.md)\>

#### Defined in

[src/interfaces/datastore.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L31)

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

[src/interfaces/datastore.ts:39](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L39)

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

[src/interfaces/datastore.ts:28](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L28)

___

### saveModel

▸ **saveModel**(`model`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `model` | [`IBpmnModelData`](interfaces_DataObjects.IBpmnModelData.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/interfaces/datastore.ts:37](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L37)
