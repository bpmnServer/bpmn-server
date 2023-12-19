[bpmn-server](../README.md) / [Exports](../modules.md) / [datastore/ModelsDatastore](../modules/datastore_ModelsDatastore.md) / ModelsDatastore

# Class: ModelsDatastore

[datastore/ModelsDatastore](../modules/datastore_ModelsDatastore.md).ModelsDatastore

super class for various objects that are part of the server

## Hierarchy

- [`ModelsDatastoreDB`](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md)

  ↳ **`ModelsDatastore`**

## Implements

- [`IModelsDatastore`](../interfaces/interfaces_datastore.IModelsDatastore.md)

## Table of contents

### Constructors

- [constructor](datastore_ModelsDatastore.ModelsDatastore.md#constructor)

### Properties

- [db](datastore_ModelsDatastore.ModelsDatastore.md#db)
- [dbConfiguration](datastore_ModelsDatastore.ModelsDatastore.md#dbconfiguration)
- [definitionsPath](datastore_ModelsDatastore.ModelsDatastore.md#definitionspath)
- [server](datastore_ModelsDatastore.ModelsDatastore.md#server)

### Accessors

- [appDelegate](datastore_ModelsDatastore.ModelsDatastore.md#appdelegate)
- [cache](datastore_ModelsDatastore.ModelsDatastore.md#cache)
- [configuration](datastore_ModelsDatastore.ModelsDatastore.md#configuration)
- [cron](datastore_ModelsDatastore.ModelsDatastore.md#cron)
- [dataStore](datastore_ModelsDatastore.ModelsDatastore.md#datastore)
- [definitions](datastore_ModelsDatastore.ModelsDatastore.md#definitions)
- [engine](datastore_ModelsDatastore.ModelsDatastore.md#engine)
- [listener](datastore_ModelsDatastore.ModelsDatastore.md#listener)
- [logger](datastore_ModelsDatastore.ModelsDatastore.md#logger)

### Methods

- [deleteModel](datastore_ModelsDatastore.ModelsDatastore.md#deletemodel)
- [export](datastore_ModelsDatastore.ModelsDatastore.md#export)
- [findEvents](datastore_ModelsDatastore.ModelsDatastore.md#findevents)
- [getFile](datastore_ModelsDatastore.ModelsDatastore.md#getfile)
- [getList](datastore_ModelsDatastore.ModelsDatastore.md#getlist)
- [getPath](datastore_ModelsDatastore.ModelsDatastore.md#getpath)
- [getSVG](datastore_ModelsDatastore.ModelsDatastore.md#getsvg)
- [getSource](datastore_ModelsDatastore.ModelsDatastore.md#getsource)
- [import](datastore_ModelsDatastore.ModelsDatastore.md#import)
- [install](datastore_ModelsDatastore.ModelsDatastore.md#install)
- [load](datastore_ModelsDatastore.ModelsDatastore.md#load)
- [loadModel](datastore_ModelsDatastore.ModelsDatastore.md#loadmodel)
- [rebuild](datastore_ModelsDatastore.ModelsDatastore.md#rebuild)
- [rebuildModel](datastore_ModelsDatastore.ModelsDatastore.md#rebuildmodel)
- [renameModel](datastore_ModelsDatastore.ModelsDatastore.md#renamemodel)
- [save](datastore_ModelsDatastore.ModelsDatastore.md#save)
- [saveFile](datastore_ModelsDatastore.ModelsDatastore.md#savefile)
- [saveModel](datastore_ModelsDatastore.ModelsDatastore.md#savemodel)
- [updateTimer](datastore_ModelsDatastore.ModelsDatastore.md#updatetimer)

## Constructors

### constructor

• **new ModelsDatastore**(`server`): [`ModelsDatastore`](datastore_ModelsDatastore.ModelsDatastore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`BPMNServer`](server_BPMNServer.BPMNServer.md) |

#### Returns

[`ModelsDatastore`](datastore_ModelsDatastore.ModelsDatastore.md)

#### Overrides

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[constructor](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#constructor)

#### Defined in

[src/datastore/ModelsDatastore.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L19)

## Properties

### db

• **db**: `any`

#### Inherited from

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[db](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#db)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L25)

___

### dbConfiguration

• **dbConfiguration**: `any`

#### Inherited from

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[dbConfiguration](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#dbconfiguration)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L24)

___

### definitionsPath

• **definitionsPath**: `any`

#### Defined in

[src/datastore/ModelsDatastore.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L18)

___

### server

• **server**: `any`

#### Inherited from

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[server](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#server)

#### Defined in

[src/server/ServerComponent.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L9)

## Accessors

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.appDelegate

#### Defined in

[src/server/ServerComponent.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L18)

___

### cache

• `get` **cache**(): [`CacheManager`](server_CacheManager.CacheManager.md)

#### Returns

[`CacheManager`](server_CacheManager.CacheManager.md)

#### Inherited from

ModelsDatastoreDB.cache

#### Defined in

[src/server/ServerComponent.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L17)

___

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.configuration

#### Defined in

[src/server/ServerComponent.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L14)

___

### cron

• `get` **cron**(): [`Cron`](server_Cron.Cron.md)

#### Returns

[`Cron`](server_Cron.Cron.md)

#### Inherited from

ModelsDatastoreDB.cron

#### Defined in

[src/server/ServerComponent.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L16)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.dataStore

#### Defined in

[src/server/ServerComponent.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L20)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.definitions

#### Defined in

[src/server/ServerComponent.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L21)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/interfaces_server.IEngine.md)

#### Returns

[`IEngine`](../interfaces/interfaces_server.IEngine.md)

#### Inherited from

ModelsDatastoreDB.engine

#### Defined in

[src/server/ServerComponent.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L19)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.listener

#### Defined in

[src/server/ServerComponent.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L22)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.logger

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

#### Overrides

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[deleteModel](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#deletemodel)

#### Defined in

[src/datastore/ModelsDatastore.ts:100](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L100)

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

#### Inherited from

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[export](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#export)

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

#### Inherited from

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[findEvents](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#findevents)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:97](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L97)

___

### getFile

▸ **getFile**(`name`, `type`, `owner?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `type` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`any`

#### Defined in

[src/datastore/ModelsDatastore.ts:64](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L64)

___

### getList

▸ **getList**(`query?`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `query` | `any` | `null` |

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[getList](../interfaces/interfaces_datastore.IModelsDatastore.md#getlist)

#### Overrides

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[getList](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#getlist)

#### Defined in

[src/datastore/ModelsDatastore.ts:30](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L30)

___

### getPath

▸ **getPath**(`name`, `type`, `owner?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `type` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`string`

#### Defined in

[src/datastore/ModelsDatastore.ts:59](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L59)

___

### getSVG

▸ **getSVG**(`name`, `owner?`): `Promise`\<`string`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`string`\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[getSVG](../interfaces/interfaces_datastore.IModelsDatastore.md#getsvg)

#### Overrides

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[getSVG](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#getsvg)

#### Defined in

[src/datastore/ModelsDatastore.ts:84](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L84)

___

### getSource

▸ **getSource**(`name`, `owner?`): `Promise`\<`string`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`string`\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[getSource](../interfaces/interfaces_datastore.IModelsDatastore.md#getsource)

#### Overrides

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[getSource](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#getsource)

#### Defined in

[src/datastore/ModelsDatastore.ts:79](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L79)

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

#### Overrides

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[import](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#import)

#### Defined in

[src/datastore/ModelsDatastore.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L25)

___

### install

▸ **install**(): `Promise`\<`any`\>

first time installation of DB

creates a new collection and add an index

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[install](../interfaces/interfaces_datastore.IModelsDatastore.md#install)

#### Inherited from

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[install](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#install)

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

#### Overrides

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[load](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#load)

#### Defined in

[src/datastore/ModelsDatastore.ts:49](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L49)

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

#### Inherited from

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[loadModel](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#loadmodel)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:68](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L68)

___

### rebuild

▸ **rebuild**(`model?`): `Promise`\<`void`\>

reconstruct the models database from files

use when modifying the files manually or importing new environment

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `model` | `any` | `null` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[rebuild](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#rebuild)

#### Defined in

[src/datastore/ModelsDatastore.ts:128](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L128)

___

### rebuildModel

▸ **rebuildModel**(`name`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/datastore/ModelsDatastore.ts:170](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L170)

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

#### Overrides

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[renameModel](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#renamemodel)

#### Defined in

[src/datastore/ModelsDatastore.ts:110](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L110)

___

### save

▸ **save**(`name`, `bpmn`, `svg?`, `owner?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `bpmn` | `any` | `undefined` |
| `svg?` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[IModelsDatastore](../interfaces/interfaces_datastore.IModelsDatastore.md).[save](../interfaces/interfaces_datastore.IModelsDatastore.md#save)

#### Overrides

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[save](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#save)

#### Defined in

[src/datastore/ModelsDatastore.ts:88](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L88)

___

### saveFile

▸ **saveFile**(`name`, `type`, `data`, `owner?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `type` | `any` | `undefined` |
| `data` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`void`

#### Defined in

[src/datastore/ModelsDatastore.ts:71](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastore.ts#L71)

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

#### Inherited from

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[saveModel](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#savemodel)

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

#### Inherited from

[ModelsDatastoreDB](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md).[updateTimer](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md#updatetimer)

#### Defined in

[src/datastore/ModelsDatastoreDB.ts:164](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsDatastoreDB.ts#L164)
