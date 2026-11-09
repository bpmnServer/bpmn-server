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
- [rebuild](IModelsDatastore.md#rebuild)
- [backup](IModelsDatastore.md#backup)
- [install](IModelsDatastore.md#install)
- [import](IModelsDatastore.md#import)
- [saveModel](IModelsDatastore.md#savemodel)
- [deleteModel](IModelsDatastore.md#deletemodel)
- [renameModel](IModelsDatastore.md#renamemodel)
- [history](IModelsDatastore.md#history)
- [historySource](IModelsDatastore.md#historysource)
- [deleteVersion](IModelsDatastore.md#deleteversion)
- [purgeHistory](IModelsDatastore.md#purgehistory)

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

[packages/bpmn-server/src/interfaces/datastore.ts:59](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L59)

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

[packages/bpmn-server/src/interfaces/datastore.ts:60](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L60)

___

### getSource

▸ **getSource**(`name`, `owner?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `owner?` | `any` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:61](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L61)

___

### getSVG

▸ **getSVG**(`name`, `owner?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `owner?` | `any` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:62](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L62)

___

### save

▸ **save**(`name`, `bpmn`, `svg?`, `owner?`, `savedBy?`): `Promise`\<`boolean`\>

`savedBy`: who saves it, kept in the model's history (files-based datastores)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `bpmn` | `any` |
| `svg?` | `any` |
| `owner?` | `any` |
| `savedBy?` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:64](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L64)

___

### load

▸ **load**(`name`, `owner?`): `Promise`\<[`IDefinition`](IDefinition.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `owner?` | `any` |

#### Returns

`Promise`\<[`IDefinition`](IDefinition.md)\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:66](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L66)

___

### loadModel

▸ **loadModel**(`name`, `owner?`): `Promise`\<[`IBpmnModelData`](IBpmnModelData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `owner?` | `any` |

#### Returns

`Promise`\<[`IBpmnModelData`](IBpmnModelData.md)\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:67](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L67)

___

### findEvents

▸ **findEvents**(`query`, `owner?`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `owner?` | `any` |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:68](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L68)

___

### rebuild

▸ **rebuild**(`model?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `model?` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:69](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L69)

___

### backup

▸ **backup**(): `Promise`\<`Record`\<`string`, `any`[]\>\>

Every document the models datastore keeps, by collection name: for a backup.

#### Returns

`Promise`\<`Record`\<`string`, `any`[]\>\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:71](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L71)

___

### install

▸ **install**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:73](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L73)

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

[packages/bpmn-server/src/interfaces/datastore.ts:74](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L74)

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

[packages/bpmn-server/src/interfaces/datastore.ts:75](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L75)

___

### deleteModel

▸ **deleteModel**(`name`, `owner?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `owner?` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:76](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L76)

___

### renameModel

▸ **renameModel**(`name`, `newName`, `owner?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `newName` | `any` |
| `owner?` | `any` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:77](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L77)

___

### history

▸ **history**(`name`): `Promise`\<\{ `version`: `number` ; `savedAt`: `string` ; `savedBy?`: `string` ; `size`: `number`  }[]\>

A model's saved versions, newest first (files-based datastores: ModelHistory).

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<\{ `version`: `number` ; `savedAt`: `string` ; `savedBy?`: `string` ; `size`: `number`  }[]\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:79](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L79)

___

### historySource

▸ **historySource**(`name`, `version`): `Promise`\<`string`\>

A saved version of a model, or null.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `version` | `number` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:81](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L81)

___

### deleteVersion

▸ **deleteVersion**(`name`, `version`): `Promise`\<`boolean`\>

Removes one saved version of a model; false when there is none.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `version` | `number` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:83](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L83)

___

### purgeHistory

▸ **purgeHistory**(`name`): `Promise`\<`number`\>

Removes a model's history; returns how many versions it had.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<`number`\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:85](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L85)
