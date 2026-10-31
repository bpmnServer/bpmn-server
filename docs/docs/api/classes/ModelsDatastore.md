[bpmn-server](../readme.md) / ModelsDatastore

# Class: ModelsDatastore

super class for various objects that are part of the server

## Hierarchy

- [`ModelsDatastoreDB`](ModelsDatastoreDB.md)

  ↳ **`ModelsDatastore`**

## Implements

- [`IModelsDatastore`](../interfaces/IModelsDatastore.md)

## Table of contents

### Constructors

- [constructor](ModelsDatastore.md#constructor)

### Properties

- [definitionsPath](ModelsDatastore.md#definitionspath)
- [dbConfiguration](ModelsDatastore.md#dbconfiguration)
- [db](ModelsDatastore.md#db)
- [server](ModelsDatastore.md#server)

### Accessors

- [configuration](ModelsDatastore.md#configuration)
- [logger](ModelsDatastore.md#logger)
- [cron](ModelsDatastore.md#cron)
- [cache](ModelsDatastore.md#cache)
- [appDelegate](ModelsDatastore.md#appdelegate)
- [engine](ModelsDatastore.md#engine)
- [dataStore](ModelsDatastore.md#datastore)
- [definitions](ModelsDatastore.md#definitions)
- [listener](ModelsDatastore.md#listener)

### Methods

- [import](ModelsDatastore.md#import)
- [getList](ModelsDatastore.md#getlist)
- [load](ModelsDatastore.md#load)
- [getPath](ModelsDatastore.md#getpath)
- [getFile](ModelsDatastore.md#getfile)
- [saveFile](ModelsDatastore.md#savefile)
- [getSource](ModelsDatastore.md#getsource)
- [getSVG](ModelsDatastore.md#getsvg)
- [save](ModelsDatastore.md#save)
- [deleteModel](ModelsDatastore.md#deletemodel)
- [renameModel](ModelsDatastore.md#renamemodel)
- [rebuild](ModelsDatastore.md#rebuild)
- [rebuildModel](ModelsDatastore.md#rebuildmodel)
- [get](ModelsDatastore.md#get)
- [loadModel](ModelsDatastore.md#loadmodel)
- [findEvents](ModelsDatastore.md#findevents)
- [install](ModelsDatastore.md#install)
- [updateTimer](ModelsDatastore.md#updatetimer)
- [saveModel](ModelsDatastore.md#savemodel)
- [export](ModelsDatastore.md#export)

## Constructors

### constructor

• **new ModelsDatastore**(`server`): [`ModelsDatastore`](ModelsDatastore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`BPMNServer`](BPMNServer.md) |

#### Returns

[`ModelsDatastore`](ModelsDatastore.md)

#### Overrides

[ModelsDatastoreDB](ModelsDatastoreDB.md).[constructor](ModelsDatastoreDB.md#constructor)

#### Defined in

[datastore/ModelsDatastore.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L19)

## Properties

### definitionsPath

• **definitionsPath**: `any`

#### Defined in

[datastore/ModelsDatastore.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L18)

___

### dbConfiguration

• **dbConfiguration**: `any`

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[dbConfiguration](ModelsDatastoreDB.md#dbconfiguration)

#### Defined in

[datastore/ModelsDatastoreDB.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L24)

___

### db

• **db**: `any`

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[db](ModelsDatastoreDB.md#db)

#### Defined in

[datastore/ModelsDatastoreDB.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L25)

___

### server

• **server**: `any`

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[server](ModelsDatastoreDB.md#server)

#### Defined in

[server/ServerComponent.ts:9](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L9)

## Accessors

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.configuration

#### Defined in

[server/ServerComponent.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L14)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.logger

#### Defined in

[server/ServerComponent.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L15)

___

### cron

• `get` **cron**(): [`Cron`](Cron.md)

#### Returns

[`Cron`](Cron.md)

#### Inherited from

ModelsDatastoreDB.cron

#### Defined in

[server/ServerComponent.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L16)

___

### cache

• `get` **cache**(): [`CacheManager`](CacheManager.md)

#### Returns

[`CacheManager`](CacheManager.md)

#### Inherited from

ModelsDatastoreDB.cache

#### Defined in

[server/ServerComponent.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L17)

___

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.appDelegate

#### Defined in

[server/ServerComponent.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L18)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/IEngine.md)

#### Returns

[`IEngine`](../interfaces/IEngine.md)

#### Inherited from

ModelsDatastoreDB.engine

#### Defined in

[server/ServerComponent.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L19)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.dataStore

#### Defined in

[server/ServerComponent.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L20)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.definitions

#### Defined in

[server/ServerComponent.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L21)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.listener

#### Defined in

[server/ServerComponent.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L22)

## Methods

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

[IModelsDatastore](../interfaces/IModelsDatastore.md).[import](../interfaces/IModelsDatastore.md#import)

#### Overrides

[ModelsDatastoreDB](ModelsDatastoreDB.md).[import](ModelsDatastoreDB.md#import)

#### Defined in

[datastore/ModelsDatastore.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L25)

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

[IModelsDatastore](../interfaces/IModelsDatastore.md).[getList](../interfaces/IModelsDatastore.md#getlist)

#### Overrides

[ModelsDatastoreDB](ModelsDatastoreDB.md).[getList](ModelsDatastoreDB.md#getlist)

#### Defined in

[datastore/ModelsDatastore.ts:30](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L30)

___

### load

▸ **load**(`name`, `owner?`): `Promise`\<[`Definition`](Definition.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<[`Definition`](Definition.md)\>

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[load](../interfaces/IModelsDatastore.md#load)

#### Overrides

[ModelsDatastoreDB](ModelsDatastoreDB.md).[load](ModelsDatastoreDB.md#load)

#### Defined in

[datastore/ModelsDatastore.ts:49](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L49)

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

[datastore/ModelsDatastore.ts:59](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L59)

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

[datastore/ModelsDatastore.ts:64](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L64)

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

[datastore/ModelsDatastore.ts:71](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L71)

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

[IModelsDatastore](../interfaces/IModelsDatastore.md).[getSource](../interfaces/IModelsDatastore.md#getsource)

#### Overrides

[ModelsDatastoreDB](ModelsDatastoreDB.md).[getSource](ModelsDatastoreDB.md#getsource)

#### Defined in

[datastore/ModelsDatastore.ts:79](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L79)

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

[IModelsDatastore](../interfaces/IModelsDatastore.md).[getSVG](../interfaces/IModelsDatastore.md#getsvg)

#### Overrides

[ModelsDatastoreDB](ModelsDatastoreDB.md).[getSVG](ModelsDatastoreDB.md#getsvg)

#### Defined in

[datastore/ModelsDatastore.ts:84](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L84)

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

[IModelsDatastore](../interfaces/IModelsDatastore.md).[save](../interfaces/IModelsDatastore.md#save)

#### Overrides

[ModelsDatastoreDB](ModelsDatastoreDB.md).[save](ModelsDatastoreDB.md#save)

#### Defined in

[datastore/ModelsDatastore.ts:88](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L88)

___

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

[IModelsDatastore](../interfaces/IModelsDatastore.md).[deleteModel](../interfaces/IModelsDatastore.md#deletemodel)

#### Overrides

[ModelsDatastoreDB](ModelsDatastoreDB.md).[deleteModel](ModelsDatastoreDB.md#deletemodel)

#### Defined in

[datastore/ModelsDatastore.ts:100](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L100)

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

[IModelsDatastore](../interfaces/IModelsDatastore.md).[renameModel](../interfaces/IModelsDatastore.md#renamemodel)

#### Overrides

[ModelsDatastoreDB](ModelsDatastoreDB.md).[renameModel](ModelsDatastoreDB.md#renamemodel)

#### Defined in

[datastore/ModelsDatastore.ts:110](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L110)

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

[ModelsDatastoreDB](ModelsDatastoreDB.md).[rebuild](ModelsDatastoreDB.md#rebuild)

#### Defined in

[datastore/ModelsDatastore.ts:128](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L128)

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

[datastore/ModelsDatastore.ts:170](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastore.ts#L170)

___

### get

▸ **get**(`query?`): `Promise`\<`object`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `Object` |

#### Returns

`Promise`\<`object`[]\>

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[get](../interfaces/IModelsDatastore.md#get)

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[get](ModelsDatastoreDB.md#get)

#### Defined in

[datastore/ModelsDatastoreDB.ts:34](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L34)

___

### loadModel

▸ **loadModel**(`name`, `owner?`): `Promise`\<[`BpmnModelData`](BpmnModelData.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<[`BpmnModelData`](BpmnModelData.md)\>

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[loadModel](../interfaces/IModelsDatastore.md#loadmodel)

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[loadModel](ModelsDatastoreDB.md#loadmodel)

#### Defined in

[datastore/ModelsDatastoreDB.ts:75](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L75)

___

### findEvents

▸ **findEvents**(`query`, `owner?`): `Promise`\<[`IEventData`](../interfaces/IEventData.md)[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `query` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<[`IEventData`](../interfaces/IEventData.md)[]\>

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[findEvents](../interfaces/IModelsDatastore.md#findevents)

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[findEvents](ModelsDatastoreDB.md#findevents)

#### Defined in

[datastore/ModelsDatastoreDB.ts:104](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L104)

___

### install

▸ **install**(): `Promise`\<`any`\>

first time installation of DB

creates a new collection and add an index

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[install](../interfaces/IModelsDatastore.md#install)

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[install](ModelsDatastoreDB.md#install)

#### Defined in

[datastore/ModelsDatastoreDB.ts:164](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L164)

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

[ModelsDatastoreDB](ModelsDatastoreDB.md).[updateTimer](ModelsDatastoreDB.md#updatetimer)

#### Defined in

[datastore/ModelsDatastoreDB.ts:171](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L171)

___

### saveModel

▸ **saveModel**(`model`, `owner?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `model` | [`IBpmnModelData`](../interfaces/IBpmnModelData.md) | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[saveModel](../interfaces/IModelsDatastore.md#savemodel)

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[saveModel](ModelsDatastoreDB.md#savemodel)

#### Defined in

[datastore/ModelsDatastoreDB.ts:197](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L197)

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

[ModelsDatastoreDB](ModelsDatastoreDB.md).[export](ModelsDatastoreDB.md#export)

#### Defined in

[datastore/ModelsDatastoreDB.ts:240](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L240)
