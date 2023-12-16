[bpmn-server](../README.md) / IDataStore

# Interface: IDataStore

## Implemented by

- [`DataStore`](../classes/DataStore.md)

## Table of contents

### Properties

- [db](IDataStore.md#db)
- [dbConfiguration](IDataStore.md#dbconfiguration)
- [locker](IDataStore.md#locker)
- [logger](IDataStore.md#logger)

### Methods

- [deleteInstances](IDataStore.md#deleteinstances)
- [findInstance](IDataStore.md#findinstance)
- [findInstances](IDataStore.md#findinstances)
- [findItem](IDataStore.md#finditem)
- [findItems](IDataStore.md#finditems)
- [install](IDataStore.md#install)
- [loadInstance](IDataStore.md#loadinstance)
- [save](IDataStore.md#save)

## Properties

### db

• **db**: `any`

#### Defined in

[interfaces/datastore.ts:8](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/datastore.ts#L8)

___

### dbConfiguration

• **dbConfiguration**: `any`

#### Defined in

[interfaces/datastore.ts:7](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/datastore.ts#L7)

___

### locker

• **locker**: `any`

#### Defined in

[interfaces/datastore.ts:10](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/datastore.ts#L10)

___

### logger

• **logger**: `any`

#### Defined in

[interfaces/datastore.ts:9](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/datastore.ts#L9)

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

[interfaces/datastore.ts:20](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/datastore.ts#L20)

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

[interfaces/datastore.ts:17](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/datastore.ts#L17)

___

### findInstances

▸ **findInstances**(`query`, `option`): `Promise`\<[`IInstanceData`](IInstanceData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `option` | ``"full"`` \| ``"summary"`` |

#### Returns

`Promise`\<[`IInstanceData`](IInstanceData.md)[]\>

#### Defined in

[interfaces/datastore.ts:18](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/datastore.ts#L18)

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

[interfaces/datastore.ts:16](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/datastore.ts#L16)

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

[interfaces/datastore.ts:19](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/datastore.ts#L19)

___

### install

▸ **install**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/datastore.ts:21](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/datastore.ts#L21)

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

[interfaces/datastore.ts:12](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/datastore.ts#L12)

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

[interfaces/datastore.ts:11](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/datastore.ts#L11)
