[bpmn-server](../README.md) / DataStore

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

- [db](DataStore.md#db)
- [dbConfiguration](DataStore.md#dbconfiguration)
- [execution](DataStore.md#execution)
- [inSaving](DataStore.md#insaving)
- [isModified](DataStore.md#ismodified)
- [isRunning](DataStore.md#isrunning)
- [locker](DataStore.md#locker)
- [promises](DataStore.md#promises)
- [server](DataStore.md#server)
- [seq](DataStore.md#seq)

### Accessors

- [appDelegate](DataStore.md#appdelegate)
- [cache](DataStore.md#cache)
- [configuration](DataStore.md#configuration)
- [cron](DataStore.md#cron)
- [dataStore](DataStore.md#datastore)
- [definitions](DataStore.md#definitions)
- [engine](DataStore.md#engine)
- [listener](DataStore.md#listener)
- [logger](DataStore.md#logger)

### Methods

- [convertColl](DataStore.md#convertcoll)
- [convertObj](DataStore.md#convertobj)
- [deleteInstances](DataStore.md#deleteinstances)
- [findInstance](DataStore.md#findinstance)
- [findInstances](DataStore.md#findinstances)
- [findItem](DataStore.md#finditem)
- [findItems](DataStore.md#finditems)
- [install](DataStore.md#install)
- [loadInstance](DataStore.md#loadinstance)
- [save](DataStore.md#save)

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

[datastore/DataStore.ts:33](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-33)

## Properties

### db

• **db**: `any`

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[db](../interfaces/IDataStore.md#db)

#### Defined in

[datastore/DataStore.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-24)

___

### dbConfiguration

• **dbConfiguration**: `any`

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[dbConfiguration](../interfaces/IDataStore.md#dbconfiguration)

#### Defined in

[datastore/DataStore.ts:23](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-23)

___

### execution

• **execution**: [`Execution`](Execution.md)

#### Defined in

[datastore/DataStore.ts:26](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-26)

___

### inSaving

• **inSaving**: `boolean` = `false`

#### Defined in

[datastore/DataStore.ts:29](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-29)

___

### isModified

• **isModified**: `boolean` = `false`

#### Defined in

[datastore/DataStore.ts:27](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-27)

___

### isRunning

• **isRunning**: `boolean` = `false`

#### Defined in

[datastore/DataStore.ts:28](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-28)

___

### locker

• **locker**: `any`

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[locker](../interfaces/IDataStore.md#locker)

#### Defined in

[datastore/DataStore.ts:31](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-31)

___

### promises

• **promises**: `any`[] = `[]`

#### Defined in

[datastore/DataStore.ts:30](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-30)

___

### server

• **server**: `any`

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[server/ServerComponent.ts:9](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-9)

___

### seq

▪ `Static` **seq**: `number` = `0`

#### Defined in

[datastore/DataStore.ts:89](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-89)

## Accessors

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[server/ServerComponent.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-18)

___

### cache

• `get` **cache**(): [`CacheManager`](CacheManager.md)

#### Returns

[`CacheManager`](CacheManager.md)

#### Inherited from

ServerComponent.cache

#### Defined in

[server/ServerComponent.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-17)

___

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.configuration

#### Defined in

[server/ServerComponent.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-14)

___

### cron

• `get` **cron**(): [`Cron`](Cron.md)

#### Returns

[`Cron`](Cron.md)

#### Inherited from

ServerComponent.cron

#### Defined in

[server/ServerComponent.ts:16](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-16)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.dataStore

#### Defined in

[server/ServerComponent.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-20)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.definitions

#### Defined in

[server/ServerComponent.ts:21](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-21)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/IEngine.md)

#### Returns

[`IEngine`](../interfaces/IEngine.md)

#### Inherited from

ServerComponent.engine

#### Defined in

[server/ServerComponent.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-19)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.listener

#### Defined in

[server/ServerComponent.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-22)

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

[server/ServerComponent.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-15)

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

[datastore/DataStore.ts:167](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-167)

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

[datastore/DataStore.ts:163](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-163)

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

[datastore/DataStore.ts:225](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-225)

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

[datastore/DataStore.ts:142](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-142)

___

### findInstances

▸ **findInstances**(`query`, `option?`): `Promise`\<[`IInstanceData`](../interfaces/IInstanceData.md)[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `query` | `any` | `undefined` |
| `option` | `any` | `'summary'` |

#### Returns

`Promise`\<[`IInstanceData`](../interfaces/IInstanceData.md)[]\>

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[findInstances](../interfaces/IDataStore.md#findinstances)

#### Defined in

[datastore/DataStore.ts:177](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-177)

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

[datastore/DataStore.ts:132](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-132)

___

### findItems

▸ **findItems**(`query`): `Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

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

`Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

#### Implementation of

[IDataStore](../interfaces/IDataStore.md).[findItems](../interfaces/IDataStore.md#finditems)

#### Defined in

[datastore/DataStore.ts:211](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-211)

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

[datastore/DataStore.ts:238](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-238)

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

[datastore/DataStore.ts:49](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-49)

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

[IDataStore](../interfaces/IDataStore.md).[save](../interfaces/IDataStore.md#save)

#### Defined in

[datastore/DataStore.ts:46](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/DataStore.ts#lines-46)
