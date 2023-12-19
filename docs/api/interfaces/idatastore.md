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

[interfaces/datastore.ts:8](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-8)

___

### dbConfiguration

• **dbConfiguration**: `any`

#### Defined in

[interfaces/datastore.ts:7](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-7)

___

### locker

• **locker**: `any`

#### Defined in

[interfaces/datastore.ts:10](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-10)

___

### logger

• **logger**: `any`

#### Defined in

[interfaces/datastore.ts:9](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-9)

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

[interfaces/datastore.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-20)

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

[interfaces/datastore.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-17)

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

[interfaces/datastore.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-18)

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

[interfaces/datastore.ts:16](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-16)

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

[interfaces/datastore.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-19)

___

### install

▸ **install**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/datastore.ts:21](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-21)

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

[interfaces/datastore.ts:12](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-12)

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

[interfaces/datastore.ts:11](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/datastore.ts#lines-11)
