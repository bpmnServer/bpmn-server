[bpmn-server](../README.md) / [Exports](../modules.md) / [datastore/ModelsDatastoreDB](../modules/datastore_ModelsDatastoreDB.md) / ModelsDatastoreDB

# Class: ModelsDatastoreDB

[datastore/ModelsDatastoreDB](../modules/datastore_ModelsDatastoreDB.md).ModelsDatastoreDB

super class for various objects that are part of the server

## Hierarchy

- [`ServerComponent`](server_ServerComponent.ServerComponent.md)

  ↳ **`ModelsDatastoreDB`**

  ↳↳ [`ModelsDatastore`](datastore_ModelsDatastore.ModelsDatastore.md)

## Implements

- [`IModelsDatastore`](../interfaces/interfaces_datastore.IModelsDatastore.md)

## Table of contents

### Constructors

- [constructor](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#constructor)

### Properties

- [db](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#db)
- [dbConfiguration](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#dbconfiguration)
- [server](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#server)

### Accessors

- [appDelegate](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#appdelegate)
- [cache](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#cache)
- [configuration](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#configuration)
- [cron](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#cron)
- [dataStore](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#datastore)
- [definitions](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#definitions)
- [engine](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#engine)
- [listener](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#listener)
- [logger](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#logger)

### Methods

- [deleteModel](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#deletemodel)
- [export](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#export)
- [findEvents](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#findevents)
- [getList](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#getlist)
- [getProjection](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#getprojection)
- [getSVG](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#getsvg)
- [getSource](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#getsource)
- [import](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#import)
- [install](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#install)
- [load](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#load)
- [loadModel](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#loadmodel)
- [rebuild](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#rebuild)
- [renameModel](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#renamemodel)
- [save](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#save)
- [saveModel](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#savemodel)
- [updateTimer](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#updatetimer)

## Constructors

### constructor

• **new ModelsDatastoreDB**(`server`): [`ModelsDatastoreDB`](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`BPMNServer`](server_BPMNServer.BPMNServer.md) |

#### Returns

[`ModelsDatastoreDB`](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md)

#### Overrides

[ServerComponent](server_ServerComponent.ServerComponent.md).[constructor](server_ServerComponent.ServerComponent.md#constructor)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L27)

## Properties

### db

• **db**: `any`

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L25)

___

### dbConfiguration

• **dbConfiguration**: `any`

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L24)

___

### server

• **server**: `any`

#### Inherited from

[ServerComponent](server_ServerComponent.ServerComponent.md).[server](server_ServerComponent.ServerComponent.md#server)

#### Defined in

[src/server/ServerComponent.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L9)

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

#### Inherited from

ServerComponent.logger

#### Defined in

[src/server/ServerComponent.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L15)

## Methods

### deleteModel

▸ **deleteModel**(`name`, `owner?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[deleteModel](../interfaces/interfaces_datastore.IModelsDatastore.md#deletemodel)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:210](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L210)

___

### export

▸ **export**(`name`, `folderPath`, `owner?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `folderPath` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:233](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L233)

___

### findEvents

▸ **findEvents**(`query`, `owner?`): `Promise`\<[`IEventData`](../interfaces/interfaces_DataObjects.IEventData.md)[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `query` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<[`IEventData`](../interfaces/interfaces_DataObjects.IEventData.md)[]\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[findEvents](../interfaces/interfaces_datastore.IModelsDatastore.md#findevents)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:97](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L97)

___

### getList

▸ **getList**(`query?`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `Object` |

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[getList](../interfaces/interfaces_datastore.IModelsDatastore.md#getlist)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L34)

___

### getProjection

▸ **getProjection**(`query`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Object`

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:131](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L131)

___

### getSVG

▸ **getSVG**(`name`, `owner?`): `Promise`\<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[getSVG](../interfaces/interfaces_datastore.IModelsDatastore.md#getsvg)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:59](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L59)

___

### getSource

▸ **getSource**(`name`, `owner?`): `Promise`\<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[getSource](../interfaces/interfaces_datastore.IModelsDatastore.md#getsource)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:54](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L54)

___

### import

▸ **import**(`data`, `owner?`): `Promise`\<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[import](../interfaces/interfaces_datastore.IModelsDatastore.md#import)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:160](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L160)

___

### install

▸ **install**(): `Promise`\<`any`\>

first time installation of DB

creates a new collection and add an index

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[install](../interfaces/interfaces_datastore.IModelsDatastore.md#install)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:157](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L157)

___

### load

▸ **load**(`name`, `owner?`): `Promise`\<[`Definition`](elements_Definition.Definition.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<[`Definition`](elements_Definition.Definition.md)\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[load](../interfaces/interfaces_datastore.IModelsDatastore.md#load)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:47](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L47)

___

### loadModel

▸ **loadModel**(`name`, `owner?`): `Promise`\<[`BpmnModelData`](datastore_ModelsData.BpmnModelData.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<[`BpmnModelData`](datastore_ModelsData.BpmnModelData.md)\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[loadModel](../interfaces/interfaces_datastore.IModelsDatastore.md#loadmodel)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:68](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L68)

___

### rebuild

▸ **rebuild**(`model?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `model` | `any` | `null` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:251](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L251)

___

### renameModel

▸ **renameModel**(`name`, `newName`, `owner?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `newName` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[renameModel](../interfaces/interfaces_datastore.IModelsDatastore.md#renamemodel)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:215](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L215)

___

### save

▸ **save**(`name`, `source`, `svg`, `owner?`): `Promise`\<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `source` | `any` | `undefined` |
| `svg` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[save](../interfaces/interfaces_datastore.IModelsDatastore.md#save)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:78](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L78)

___

### saveModel

▸ **saveModel**(`model`, `owner?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `model` | [`IBpmnModelData`](../interfaces/interfaces_DataObjects.IBpmnModelData.md) | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[saveModel](../interfaces/interfaces_datastore.IModelsDatastore.md#savemodel)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:190](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L190)

___

### updateTimer

▸ **updateTimer**(`name`, `owner?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:164](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L164)
