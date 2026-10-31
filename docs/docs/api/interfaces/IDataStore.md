[bpmn-server](../readme.md) / IDataStore

# Interface: IDataStore

## Implemented by

- [`DataStore`](../classes/DataStore.md)

## Table of contents

### Properties

- [dbConfiguration](IDataStore.md#dbconfiguration)
- [db](IDataStore.md#db)
- [logger](IDataStore.md#logger)
- [locker](IDataStore.md#locker)

### Methods

- [save](IDataStore.md#save)
- [loadInstance](IDataStore.md#loadinstance)
- [findItem](IDataStore.md#finditem)
- [findInstance](IDataStore.md#findinstance)
- [findInstances](IDataStore.md#findinstances)
- [findItems](IDataStore.md#finditems)
- [deleteInstances](IDataStore.md#deleteinstances)
- [install](IDataStore.md#install)
- [archive](IDataStore.md#archive)

## Properties

### dbConfiguration

• **dbConfiguration**: `any`

#### Defined in

[interfaces/datastore.ts:7](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L7)

___

### db

• **db**: `any`

#### Defined in

[interfaces/datastore.ts:8](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L8)

___

### logger

• **logger**: `any`

#### Defined in

[interfaces/datastore.ts:9](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L9)

___

### locker

• **locker**: `any`

#### Defined in

[interfaces/datastore.ts:10](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L10)

## Methods

### save

▸ **save**(`instance`, `options`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `any` |
| `options` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[interfaces/datastore.ts:11](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L11)

___

### loadInstance

▸ **loadInstance**(`instanceId`, `options`): `Promise`\<\{ `instance`: `any` ; `items`: `any`[]  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |
| `options` | `any` |

#### Returns

`Promise`\<\{ `instance`: `any` ; `items`: `any`[]  }\>

#### Defined in

[interfaces/datastore.ts:12](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L12)

___

### findItem

▸ **findItem**(`query`): `Promise`\<[`IItemData`](IItemData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<[`IItemData`](IItemData.md)\>

#### Defined in

[interfaces/datastore.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L16)

___

### findInstance

▸ **findInstance**(`query`, `options`): `Promise`\<[`IInstanceData`](IInstanceData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `options` | `any` |

#### Returns

`Promise`\<[`IInstanceData`](IInstanceData.md)\>

#### Defined in

[interfaces/datastore.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L17)

___

### findInstances

▸ **findInstances**(`query`, `option`): `Promise`\<[`IInstanceData`](IInstanceData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `option` | `any` |

#### Returns

`Promise`\<[`IInstanceData`](IInstanceData.md)[]\>

#### Defined in

[interfaces/datastore.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L18)

___

### findItems

▸ **findItems**(`query`): `Promise`\<[`IItemData`](IItemData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<[`IItemData`](IItemData.md)[]\>

#### Defined in

[interfaces/datastore.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L19)

___

### deleteInstances

▸ **deleteInstances**(`query?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[interfaces/datastore.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L20)

___

### install

▸ **install**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/datastore.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L21)

___

### archive

▸ **archive**(`query`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/datastore.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/datastore.ts#L22)
