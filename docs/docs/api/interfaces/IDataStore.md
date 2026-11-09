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
- [saveInstance](IDataStore.md#saveinstance)
- [updateInstanceSource](IDataStore.md#updateinstancesource)
- [tagInstance](IDataStore.md#taginstance)
- [close](IDataStore.md#close)
- [loadInstance](IDataStore.md#loadinstance)
- [findItem](IDataStore.md#finditem)
- [findInstance](IDataStore.md#findinstance)
- [findInstances](IDataStore.md#findinstances)
- [findItems](IDataStore.md#finditems)
- [countInstances](IDataStore.md#countinstances)
- [backup](IDataStore.md#backup)
- [deleteInstances](IDataStore.md#deleteinstances)
- [install](IDataStore.md#install)
- [archive](IDataStore.md#archive)
- [find](IDataStore.md#find)

## Properties

### dbConfiguration

• `Optional` **dbConfiguration**: `any`

**`Deprecated`**

MongoDB's settings, for code written against the MongoDB data store; engine code does not read it.

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L26)

___

### db

• `Optional` **db**: `any`

**`Deprecated`**

The data store's storage adapter; engine code uses the operations below.

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L28)

___

### logger

• **logger**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L29)

___

### locker

• **locker**: [`ILockManager`](ILockManager.md)

The data store's own lock adapter; the engine uses the server's (`server.locker`), which is this one unless the configuration supplies another.

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:31](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L31)

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

[packages/bpmn-server/src/interfaces/datastore.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L32)

___

### saveInstance

▸ **saveInstance**(`instance`, `options?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `any` |
| `options?` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:33](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L33)

___

### updateInstanceSource

▸ **updateInstanceSource**(`instanceId`, `source`): `Promise`\<`void`\>

Replaces a saved instance's definition source (upgrading it to a newer model); the caller holds the instance's lock.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |
| `source` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L35)

___

### tagInstance

▸ **tagInstance**(`instanceId`, `tag`): `Promise`\<`void`\>

Marks a saved instance with a tag of the caller's, which the engine's saves leave as it is.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |
| `tag` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L37)

___

### close

▸ **close**(): `Promise`\<`void`\>

Releases the store's connections.

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:39](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L39)

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

[packages/bpmn-server/src/interfaces/datastore.ts:40](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L40)

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

[packages/bpmn-server/src/interfaces/datastore.ts:44](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L44)

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

[packages/bpmn-server/src/interfaces/datastore.ts:45](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L45)

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

[packages/bpmn-server/src/interfaces/datastore.ts:46](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L46)

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

[packages/bpmn-server/src/interfaces/datastore.ts:47](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L47)

___

### countInstances

▸ **countInstances**(`query`): `Promise`\<`number`\>

How many instances match `query`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<`number`\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:49](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L49)

___

### backup

▸ **backup**(): `Promise`\<`Record`\<`string`, `any`[]\>\>

Every document the data store keeps, by collection name: for a backup.

#### Returns

`Promise`\<`Record`\<`string`, `any`[]\>\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:51](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L51)

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

[packages/bpmn-server/src/interfaces/datastore.ts:52](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L52)

___

### install

▸ **install**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:53](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L53)

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

[packages/bpmn-server/src/interfaces/datastore.ts:54](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L54)

___

### find

▸ **find**(`FindParams`): `Promise`\<[`FindResult`](FindResult.md)\<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `FindParams` | `any` |

#### Returns

`Promise`\<[`FindResult`](FindResult.md)\<`any`\>\>

#### Defined in

[packages/bpmn-server/src/interfaces/datastore.ts:55](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/datastore.ts#L55)
