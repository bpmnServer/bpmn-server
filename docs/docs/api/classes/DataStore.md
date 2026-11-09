[bpmn-server](../readme.md) / DataStore

# Class: DataStore

super class for various objects that are part of the server

## Hierarchy

- [`ServerComponent`](ServerComponent.md)

  ↳ **`DataStore`**

## Implements

- [`IDataStore`](../interfaces/IDataStore.md)

## Table of contents

### Constructors

- [constructor](DataStore.md#constructor)

### Properties

- [dbConfiguration](DataStore.md#dbconfiguration)
- [db](DataStore.md#db)
- [ownsDb](DataStore.md#ownsdb)
- [execution](DataStore.md#execution)
- [isModified](DataStore.md#ismodified)
- [isRunning](DataStore.md#isrunning)
- [inSaving](DataStore.md#insaving)
- [promises](DataStore.md#promises)
- [locker](DataStore.md#locker)
- [enableSavePoints](DataStore.md#enablesavepoints)
- [saveLogs](DataStore.md#savelogs)
- [saveSource](DataStore.md#savesource)
- [seq](DataStore.md#seq)
- [server](DataStore.md#server)

### Accessors

- [configuration](DataStore.md#configuration)
- [logger](DataStore.md#logger)
- [cron](DataStore.md#cron)
- [cache](DataStore.md#cache)
- [appDelegate](DataStore.md#appdelegate)
- [engine](DataStore.md#engine)
- [dataStore](DataStore.md#datastore)
- [lockManager](DataStore.md#lockmanager)
- [definitions](DataStore.md#definitions)
- [listener](DataStore.md#listener)
- [scriptHandler](DataStore.md#scripthandler)

### Methods

- [save](DataStore.md#save)
- [loadInstance](DataStore.md#loadinstance)
- [getItemsFromInstances](DataStore.md#getitemsfrominstances)
- [saveInstance](DataStore.md#saveinstance)
- [findItem](DataStore.md#finditem)
- [findInstance](DataStore.md#findinstance)
- [convertObj](DataStore.md#convertobj)
- [convertColl](DataStore.md#convertcoll)
- [findInstances](DataStore.md#findinstances)
- [findItems](DataStore.md#finditems)
- [backup](DataStore.md#backup)
- [countInstances](DataStore.md#countinstances)
- [updateInstanceSource](DataStore.md#updateinstancesource)
- [tagInstance](DataStore.md#taginstance)
- [close](DataStore.md#close)
- [deleteInstances](DataStore.md#deleteinstances)
- [install](DataStore.md#install)
- [archive](DataStore.md#archive)
- [find](DataStore.md#find)

## Constructors

### constructor

• **new DataStore**(`server`): [`DataStore`](DataStore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`IBPMNServer`](../interfaces/IBPMNServer.md) |

#### Returns

[`DataStore`](DataStore.md)

#### Overrides

[ServerComponent](ServerComponent.md).[constructor](ServerComponent.md#constructor)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:39](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L39)

## Properties

### dbConfiguration

• **dbConfiguration**: `any`

**`Deprecated`**

MongoDB's settings, for code written against the MongoDB data store; engine code does not read it.

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[dbConfiguration](../interfaces/IDataStore.md#dbconfiguration)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L23)

___

### db

• **db**: `any`

The storage adapter: the server's shared `documentStore`, else this data store's own MongoDB connection.

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[db](../interfaces/IDataStore.md#db)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L25)

___

### ownsDb

• `Private` `Readonly` **ownsDb**: `boolean`

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L26)

___

### execution

• **execution**: [`Execution`](Execution.md)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L28)

___

### isModified

• **isModified**: `boolean` = `false`

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L29)

___

### isRunning

• **isRunning**: `boolean` = `false`

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L30)

___

### inSaving

• **inSaving**: `boolean` = `false`

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:31](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L31)

___

### promises

• **promises**: `any`[] = `[]`

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L32)

___

### locker

• **locker**: [`ILockManager`](../interfaces/ILockManager.md)

The data store's own lock adapter; the engine uses the server's (`server.locker`), which is this one unless the configuration supplies another.

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[locker](../interfaces/IDataStore.md#locker)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:33](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L33)

___

### enableSavePoints

• **enableSavePoints**: `boolean` = `false`

A save point at each save (engine.restart goes back to one); an instance's flags.savePoints overrides it.

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L35)

___

### saveLogs

• **saveLogs**: `boolean` = `true`

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:36](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L36)

___

### saveSource

• **saveSource**: `boolean` = `true`

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L37)

___

### seq

▪ `Static` **seq**: `number` = `0`

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:121](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L121)

___

### server

• **server**: `any`

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:10](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L10)

## Accessors

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.configuration

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L15)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[logger](../interfaces/IDataStore.md#logger)

#### Inherited from

ServerComponent.logger

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L16)

___

### cron

• `get` **cron**(): [`Cron`](Cron.md)

#### Returns

[`Cron`](Cron.md)

#### Inherited from

ServerComponent.cron

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L17)

___

### cache

• `get` **cache**(): [`ICacheManager`](../interfaces/ICacheManager.md)

#### Returns

[`ICacheManager`](../interfaces/ICacheManager.md)

#### Inherited from

ServerComponent.cache

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L18)

___

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L19)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/IEngine.md)

#### Returns

[`IEngine`](../interfaces/IEngine.md)

#### Inherited from

ServerComponent.engine

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L20)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.dataStore

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L21)

___

### lockManager

• `get` **lockManager**(): `any`

The lock port: the configuration's, else the data store's.

#### Returns

`any`

#### Inherited from

ServerComponent.lockManager

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L23)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.definitions

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L24)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.listener

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L25)

___

### scriptHandler

• `get` **scriptHandler**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.scriptHandler

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L26)

## Methods

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

[IDataStore](../interfaces/IDataStore.md).[save](../interfaces/IDataStore.md#save)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:67](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L67)

___

### loadInstance

▸ **loadInstance**(`instanceId`, `options?`): `Promise`\<\{ `instance`: [`IInstanceData`](../interfaces/IInstanceData.md) = instanceData; `items`: `any`[]  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<\{ `instance`: [`IInstanceData`](../interfaces/IInstanceData.md) = instanceData; `items`: `any`[]  }\>

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[loadInstance](../interfaces/IDataStore.md#loadinstance)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:70](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L70)

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

[packages/bpmn-server/src/datastore/DataStore.ts:88](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L88)

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

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[saveInstance](../interfaces/IDataStore.md#saveinstance)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:122](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L122)

___

### findItem

▸ **findItem**(`query`): `Promise`\<[`IItemData`](../interfaces/IItemData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<[`IItemData`](../interfaces/IItemData.md)\>

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[findItem](../interfaces/IDataStore.md#finditem)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:181](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L181)

___

### findInstance

▸ **findInstance**(`query`, `options`): `Promise`\<[`IInstanceData`](../interfaces/IInstanceData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `options` | `any` |

#### Returns

`Promise`\<[`IInstanceData`](../interfaces/IInstanceData.md)\>

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[findInstance](../interfaces/IDataStore.md#findinstance)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:191](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L191)

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

[packages/bpmn-server/src/datastore/DataStore.ts:206](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L206)

___

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

[packages/bpmn-server/src/datastore/DataStore.ts:210](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L210)

___

### findInstances

▸ **findInstances**(`query`, `option?`): `Promise`\<[`IInstanceData`](../interfaces/IInstanceData.md)[]\>

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `query` | `any` | `undefined` |  |
| `option` | `any` | `'summary'` | 'summary' minimal data - 'full' - {projection,sort} |

#### Returns

`Promise`\<[`IInstanceData`](../interfaces/IInstanceData.md)[]\>

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[findInstances](../interfaces/IDataStore.md#findinstances)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:229](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L229)

___

### findItems

▸ **findItems**(`query`): `Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

scenario:

```
itemId			{ items { id : value } }
itemKey			{ items {key: value } }
instance, task	{ instance: { id: instanceId }, items: { elementId: value }}
message			{ items: { messageId: nameofmessage, key: value } {}
status			{ items: {status: 'wait' } }
custom: { query: query, projection: projection }
```
New approach:
just like MongoDB
```
itemId			{ items { id : value } }
itemKey			{ items {key: value } }
instance, task	{  id: instanceId , items.elementId: value }
message			{ items.messageId: nameofmessage, key: value } {}
status			{ items.status: 'wait' } }
custom: { query: query, projection: projection }
```

Problem with Mongodb:	`projection $elematch returns only the first record`

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[findItems](../interfaces/IDataStore.md#finditems)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:270](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L270)

___

### backup

▸ **backup**(): `Promise`\<`Record`\<`string`, `any`[]\>\>

Every document of the instances, archive and locks collections, by collection name: for a backup.

#### Returns

`Promise`\<`Record`\<`string`, `any`[]\>\>

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[backup](../interfaces/IDataStore.md#backup)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:284](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L284)

___

### countInstances

▸ **countInstances**(`query`): `Promise`\<`number`\>

How many instances match `query` (MongoDB's query language, as [findInstances](DataStore.md#findinstances)).

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<`number`\>

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[countInstances](../interfaces/IDataStore.md#countinstances)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:293](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L293)

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

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[updateInstanceSource](../interfaces/IDataStore.md#updateinstancesource)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:300](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L300)

___

### tagInstance

▸ **tagInstance**(`instanceId`, `tag`): `Promise`\<`void`\>

Marks a saved instance with a tag of the caller's: a field of its own, which the engine's saves leave as it is.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |
| `tag` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[tagInstance](../interfaces/IDataStore.md#taginstance)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:305](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L305)

___

### close

▸ **close**(): `Promise`\<`void`\>

Releases the store's connections.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[close](../interfaces/IDataStore.md#close)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:309](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L309)

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

[IDataStore](../interfaces/IDataStore.md).[deleteInstances](../interfaces/IDataStore.md#deleteinstances)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:313](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L313)

___

### install

▸ **install**(): `Promise`\<`void`\>

first time installation of DB

creates a new collection and add an index

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[install](../interfaces/IDataStore.md#install)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:327](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L327)

___

### archive

▸ **archive**(`query`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[archive](../interfaces/IDataStore.md#archive)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:334](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L334)

___

### find

▸ **find**(`«destructured»`): `Promise`\<[`FindResult`](../interfaces/FindResult.md)\<`any`\>\>

MongoDB Pagination class for finding instances in a collection.
This module provides a function to retrieve paginated results from a MongoDB collection.	
It allows filtering, sorting, and projecting fields in the results.
The results can be paginated using a cursor for efficient data retrieval.
all the parameters are optional and are passed to the findInstances method.
* `sort` fields can be specified as an object with field names as keys and 1 (ascending) or -1 (descending) as values.
*   Sort by `_id` in descending order by default.
*   Sort field can be a nested field, e.g., `data.caseId`
	*  Sort field can be a numeric or date field.
* `filter` is an object that specifies the criteria for filtering the results.
* `after` is a string that specifies the cursor for pagination, allowing you to retrieve results after a specific document.	
* * `limit` is a number that specifies the maximum number of documents to return in the result set.
* * `projection` is an object that specifies which fields to include or exclude in the returned documents.

 *

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`FindParams`](../interfaces/FindParams.md) |

#### Returns

`Promise`\<[`FindResult`](../interfaces/FindResult.md)\<`any`\>\>

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[find](../interfaces/IDataStore.md#find)

#### Defined in

[packages/bpmn-server/src/datastore/DataStore.ts:365](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DataStore.ts#L365)
