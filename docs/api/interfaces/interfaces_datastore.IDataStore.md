[bpmn-server](../README.md) / [Exports](../modules.md) / [interfaces/datastore](../modules/interfaces_datastore.md) / IDataStore

# Interface: IDataStore

[interfaces/datastore](../modules/interfaces_datastore.md).IDataStore

## Implemented by

- [`DataStore`](../classes/datastore_DataStore.DataStore.md)

## Table of contents

### Properties

- [db](interfaces_datastore.IDataStore.md#db)
- [dbConfiguration](interfaces_datastore.IDataStore.md#dbconfiguration)
- [locker](interfaces_datastore.IDataStore.md#locker)
- [logger](interfaces_datastore.IDataStore.md#logger)

### Methods

- [deleteInstances](interfaces_datastore.IDataStore.md#deleteinstances)
- [findInstance](interfaces_datastore.IDataStore.md#findinstance)
- [findInstances](interfaces_datastore.IDataStore.md#findinstances)
- [findItem](interfaces_datastore.IDataStore.md#finditem)
- [findItems](interfaces_datastore.IDataStore.md#finditems)
- [install](interfaces_datastore.IDataStore.md#install)
- [loadInstance](interfaces_datastore.IDataStore.md#loadinstance)
- [save](interfaces_datastore.IDataStore.md#save)

## Properties

### db

• **db**: `any`

#### Defined in

[src/interfaces/datastore.ts:8](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L8)

___

### dbConfiguration

• **dbConfiguration**: `any`

#### Defined in

[src/interfaces/datastore.ts:7](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L7)

___

### locker

• **locker**: `any`

#### Defined in

[src/interfaces/datastore.ts:10](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L10)

___

### logger

• **logger**: `any`

#### Defined in

[src/interfaces/datastore.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L9)

## Methods

### deleteInstances

▸ **deleteInstances**(`query?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/interfaces/datastore.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L20)

___

### findInstance

▸ **findInstance**(`query`, `options`): `Promise`\<[`IInstanceData`](interfaces_DataObjects.IInstanceData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `options` | `any` |

#### Returns

`Promise`\<[`IInstanceData`](interfaces_DataObjects.IInstanceData.md)\>

#### Defined in

[src/interfaces/datastore.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L17)

___

### findInstances

▸ **findInstances**(`query`, `option`): `Promise`\<[`IInstanceData`](interfaces_DataObjects.IInstanceData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `option` | ``"summary"`` \| ``"full"`` |

#### Returns

`Promise`\<[`IInstanceData`](interfaces_DataObjects.IInstanceData.md)[]\>

#### Defined in

[src/interfaces/datastore.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L18)

___

### findItem

▸ **findItem**(`query`): `Promise`\<[`IItemData`](interfaces_DataObjects.IItemData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<[`IItemData`](interfaces_DataObjects.IItemData.md)\>

#### Defined in

[src/interfaces/datastore.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L16)

___

### findItems

▸ **findItems**(`query`): `Promise`\<[`IItemData`](interfaces_DataObjects.IItemData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<[`IItemData`](interfaces_DataObjects.IItemData.md)[]\>

#### Defined in

[src/interfaces/datastore.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L19)

___

### install

▸ **install**(): `any`

#### Returns

`any`

#### Defined in

[src/interfaces/datastore.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L21)

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

[src/interfaces/datastore.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L12)

___

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

[src/interfaces/datastore.ts:11](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/datastore.ts#L11)
