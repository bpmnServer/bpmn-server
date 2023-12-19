[bpmn-server](../README.md) / IModelsDatastore

# Interface: IModelsDatastore

## Implemented by

- [`ModelsDatastore`](../classes/ModelsDatastore.md)
- [`ModelsDatastoreDB`](../classes/ModelsDatastoreDB.md)

## Table of contents

### Methods

- [deleteModel](IModelsDatastore.md#deletemodel)
- [findEvents](IModelsDatastore.md#findevents)
- [getList](IModelsDatastore.md#getlist)
- [getSVG](IModelsDatastore.md#getsvg)
- [getSource](IModelsDatastore.md#getsource)
- [import](IModelsDatastore.md#import)
- [install](IModelsDatastore.md#install)
- [load](IModelsDatastore.md#load)
- [loadModel](IModelsDatastore.md#loadmodel)
- [renameModel](IModelsDatastore.md#renamemodel)
- [save](IModelsDatastore.md#save)
- [saveModel](IModelsDatastore.md#savemodel)

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

[interfaces/datastore.ts:38](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-38)

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

[interfaces/datastore.ts:32](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-32)

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

[interfaces/datastore.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-25)

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

[interfaces/datastore.ts:27](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-27)

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

[interfaces/datastore.ts:26](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-26)

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

[interfaces/datastore.ts:35](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-35)

___

### install

▸ **install**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/datastore.ts:34](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-34)

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

[interfaces/datastore.ts:30](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-30)

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

[interfaces/datastore.ts:31](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-31)

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

[interfaces/datastore.ts:39](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-39)

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

[interfaces/datastore.ts:28](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-28)

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

[interfaces/datastore.ts:37](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-37)
