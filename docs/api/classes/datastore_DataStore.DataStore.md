[bpmn-server](../README.md) / [Exports](../modules.md) / [datastore/DataStore](../modules/datastore_DataStore.md) / DataStore

# Class: DataStore

[datastore/DataStore](../modules/datastore_DataStore.md).DataStore

super class for various objects that are part of the server

## Hierarchy

- [`ServerComponent`](server_ServerComponent.ServerComponent.md)

  ↳ **`DataStore`**

## Implements

- [`IDataStore`](../interfaces/interfaces_datastore.IDataStore.md)

## Table of contents

### Constructors

- [constructor](datastore_DataStore.DataStore.md#constructor)

### Properties

- [db](datastore_DataStore.DataStore.md#db)
- [dbConfiguration](datastore_DataStore.DataStore.md#dbconfiguration)
- [execution](datastore_DataStore.DataStore.md#execution)
- [inSaving](datastore_DataStore.DataStore.md#insaving)
- [isModified](datastore_DataStore.DataStore.md#ismodified)
- [isRunning](datastore_DataStore.DataStore.md#isrunning)
- [locker](datastore_DataStore.DataStore.md#locker)
- [promises](datastore_DataStore.DataStore.md#promises)
- [server](datastore_DataStore.DataStore.md#server)
- [seq](datastore_DataStore.DataStore.md#seq)

### Accessors

- [appDelegate](datastore_DataStore.DataStore.md#appdelegate)
- [cache](datastore_DataStore.DataStore.md#cache)
- [configuration](datastore_DataStore.DataStore.md#configuration)
- [cron](datastore_DataStore.DataStore.md#cron)
- [dataStore](datastore_DataStore.DataStore.md#datastore)
- [definitions](datastore_DataStore.DataStore.md#definitions)
- [engine](datastore_DataStore.DataStore.md#engine)
- [listener](datastore_DataStore.DataStore.md#listener)
- [logger](datastore_DataStore.DataStore.md#logger)

### Methods

- [convertColl](datastore_DataStore.DataStore.md#convertcoll)
- [convertObj](datastore_DataStore.DataStore.md#convertobj)
- [deleteInstances](datastore_DataStore.DataStore.md#deleteinstances)
- [findInstance](datastore_DataStore.DataStore.md#findinstance)
- [findInstances](datastore_DataStore.DataStore.md#findinstances)
- [findItem](datastore_DataStore.DataStore.md#finditem)
- [findItems](datastore_DataStore.DataStore.md#finditems)
- [getItemsFromInstances](datastore_DataStore.DataStore.md#getitemsfrominstances)
- [install](datastore_DataStore.DataStore.md#install)
- [loadInstance](datastore_DataStore.DataStore.md#loadinstance)
- [save](datastore_DataStore.DataStore.md#save)
- [saveInstance](datastore_DataStore.DataStore.md#saveinstance)

## Constructors

### constructor

• **new DataStore**(`server`): [`DataStore`](datastore_DataStore.DataStore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`IBPMNServer`](../interfaces/interfaces_server.IBPMNServer.md) |

#### Returns

[`DataStore`](datastore_DataStore.DataStore.md)

#### Overrides

[ServerComponent](server_ServerComponent.ServerComponent.md).[constructor](server_ServerComponent.ServerComponent.md#constructor)

#### Defined in

[src/datastore/DataStore.ts:33](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L33)

## Properties

### db

• **db**: `any`

#### Implementation of

[IDataStore](../interfaces/interfaces_datastore.IDataStore.md).[db](../interfaces/interfaces_datastore.IDataStore.md#db)

#### Defined in

[src/datastore/DataStore.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L24)

___

### dbConfiguration

• **dbConfiguration**: `any`

#### Implementation of

[IDataStore](../interfaces/interfaces_datastore.IDataStore.md).[dbConfiguration](../interfaces/interfaces_datastore.IDataStore.md#dbconfiguration)

#### Defined in

[src/datastore/DataStore.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L23)

___

### execution

• **execution**: [`Execution`](engine_Execution.Execution.md)

#### Defined in

[src/datastore/DataStore.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L26)

___

### inSaving

• **inSaving**: `boolean` = `false`

#### Defined in

[src/datastore/DataStore.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L29)

___

### isModified

• **isModified**: `boolean` = `false`

#### Defined in

[src/datastore/DataStore.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L27)

___

### isRunning

• **isRunning**: `boolean` = `false`

#### Defined in

[src/datastore/DataStore.ts:28](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L28)

___

### locker

• **locker**: `any`

#### Implementation of

[IDataStore](../interfaces/interfaces_datastore.IDataStore.md).[locker](../interfaces/interfaces_datastore.IDataStore.md#locker)

#### Defined in

[src/datastore/DataStore.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L31)

___

### promises

• **promises**: `any`[] = `[]`

#### Defined in

[src/datastore/DataStore.ts:30](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L30)

___

### server

• **server**: `any`

#### Inherited from

[ServerComponent](server_ServerComponent.ServerComponent.md).[server](server_ServerComponent.ServerComponent.md#server)

#### Defined in

[src/server/ServerComponent.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L9)

___

### seq

▪ `Static` **seq**: `number` = `0`

#### Defined in

[src/datastore/DataStore.ts:89](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L89)

## Accessors

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[src/server/ServerComponent.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L18)

___

### cache

• `get` **cache**(): [`CacheManager`](server_CacheManager.CacheManager.md)

#### Returns

[`CacheManager`](server_CacheManager.CacheManager.md)

#### Inherited from

ServerComponent.cache

#### Defined in

[src/server/ServerComponent.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L17)

___

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.configuration

#### Defined in

[src/server/ServerComponent.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L14)

___

### cron

• `get` **cron**(): [`Cron`](server_Cron.Cron.md)

#### Returns

[`Cron`](server_Cron.Cron.md)

#### Inherited from

ServerComponent.cron

#### Defined in

[src/server/ServerComponent.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L16)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.dataStore

#### Defined in

[src/server/ServerComponent.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L20)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.definitions

#### Defined in

[src/server/ServerComponent.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L21)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/interfaces_server.IEngine.md)

#### Returns

[`IEngine`](../interfaces/interfaces_server.IEngine.md)

#### Inherited from

ServerComponent.engine

#### Defined in

[src/server/ServerComponent.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L19)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.listener

#### Defined in

[src/server/ServerComponent.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L22)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Implementation of

[IDataStore](../interfaces/interfaces_datastore.IDataStore.md).[logger](../interfaces/interfaces_datastore.IDataStore.md#logger)

#### Inherited from

ServerComponent.logger

#### Defined in

[src/server/ServerComponent.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L15)

## Methods

### convertColl

▸ **convertColl**(`coll`, `cls`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coll` | `any` |
| `cls` | `any` |

#### Returns

`void`

#### Defined in

[src/datastore/DataStore.ts:167](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L167)

___

### convertObj

▸ **convertObj**(`obj`, `cls`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |
| `cls` | `any` |

#### Returns

`any`

#### Defined in

[src/datastore/DataStore.ts:163](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L163)

___

### deleteInstances

▸ **deleteInstances**(`query`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IDataStore](../interfaces/interfaces_datastore.IDataStore.md).[deleteInstances](../interfaces/interfaces_datastore.IDataStore.md#deleteinstances)

#### Defined in

[src/datastore/DataStore.ts:225](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L225)

___

### findInstance

▸ **findInstance**(`query`, `options`): `Promise`\<[`IInstanceData`](../interfaces/interfaces_DataObjects.IInstanceData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `options` | `any` |

#### Returns

`Promise`\<[`IInstanceData`](../interfaces/interfaces_DataObjects.IInstanceData.md)\>

#### Implementation of

[IDataStore](../interfaces/interfaces_datastore.IDataStore.md).[findInstance](../interfaces/interfaces_datastore.IDataStore.md#findinstance)

#### Defined in

[src/datastore/DataStore.ts:142](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L142)

___

### findInstances

▸ **findInstances**(`query`, `option?`): `Promise`\<[`IInstanceData`](../interfaces/interfaces_DataObjects.IInstanceData.md)[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `query` | `any` | `undefined` |
| `option` | `any` | `'summary'` |

#### Returns

`Promise`\<[`IInstanceData`](../interfaces/interfaces_DataObjects.IInstanceData.md)[]\>

#### Implementation of

[IDataStore](../interfaces/interfaces_datastore.IDataStore.md).[findInstances](../interfaces/interfaces_datastore.IDataStore.md#findinstances)

#### Defined in

[src/datastore/DataStore.ts:177](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L177)

___

### findItem

▸ **findItem**(`query`): `Promise`\<[`IItemData`](../interfaces/interfaces_DataObjects.IItemData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<[`IItemData`](../interfaces/interfaces_DataObjects.IItemData.md)\>

#### Implementation of

[IDataStore](../interfaces/interfaces_datastore.IDataStore.md).[findItem](../interfaces/interfaces_datastore.IDataStore.md#finditem)

#### Defined in

[src/datastore/DataStore.ts:132](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L132)

___

### findItems

▸ **findItems**(`query`): `Promise`\<[`IItemData`](../interfaces/interfaces_DataObjects.IItemData.md)[]\>

scenario:
itemId			{ items { id : value } }
itemKey			{ items {key: value } }
instance, task	{ instance: { id: instanceId }, items: { elementId: value }}
message			{ items: { messageId: nameofmessage, key: value } {}
status			{ items: {status: 'wait' } }
custom: { query: query, projection: projection }

New approach:
just like MongoDB
itemId			{ items { id : value } }
itemKey			{ items {key: value } }
instance, task	{  id: instanceId , items.elementId: value }
message			{ items.messageId: nameofmessage, key: value } {}
status			{ items.status: 'wait' } }
custom: { query: query, projection: projection }

Problem with Mongodb:	projection $elematch returns only the first record

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<[`IItemData`](../interfaces/interfaces_DataObjects.IItemData.md)[]\>

#### Implementation of

[IDataStore](../interfaces/interfaces_datastore.IDataStore.md).[findItems](../interfaces/interfaces_datastore.IDataStore.md#finditems)

#### Defined in

[src/datastore/DataStore.ts:211](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L211)

___

### getItemsFromInstances

▸ **getItemsFromInstances**(`instances`, `condition?`, `trans?`): `any`[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `instances` | `any` | `undefined` |
| `condition` | `any` | `null` |
| `trans` | `any` | `null` |

#### Returns

`any`[]

#### Defined in

[src/datastore/DataStore.ts:67](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L67)

___

### install

▸ **install**(): `Promise`\<`void`\>

first time installation of DB

creates a new collection and add an index

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IDataStore](../interfaces/interfaces_datastore.IDataStore.md).[install](../interfaces/interfaces_datastore.IDataStore.md#install)

#### Defined in

[src/datastore/DataStore.ts:238](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L238)

___

### loadInstance

▸ **loadInstance**(`instanceId`, `options?`): `Promise`\<\{ `instance`: [`IInstanceData`](../interfaces/interfaces_DataObjects.IInstanceData.md) = instanceData; `items`: `any`[]  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<\{ `instance`: [`IInstanceData`](../interfaces/interfaces_DataObjects.IInstanceData.md) = instanceData; `items`: `any`[]  }\>

#### Implementation of

[IDataStore](../interfaces/interfaces_datastore.IDataStore.md).[loadInstance](../interfaces/interfaces_datastore.IDataStore.md#loadinstance)

#### Defined in

[src/datastore/DataStore.ts:49](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L49)

___

### save

▸ **save**(`instance`, `options?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IDataStore](../interfaces/interfaces_datastore.IDataStore.md).[save](../interfaces/interfaces_datastore.IDataStore.md#save)

#### Defined in

[src/datastore/DataStore.ts:46](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L46)

___

### saveInstance

▸ **saveInstance**(`instance`, `options?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/datastore/DataStore.ts:90](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/DataStore.ts#L90)
