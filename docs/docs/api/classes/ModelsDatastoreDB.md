[bpmn-server](../readme.md) / ModelsDatastoreDB

# Class: ModelsDatastoreDB

super class for various objects that are part of the server

## Hierarchy

- [`ServerComponent`](ServerComponent.md)

  ↳ **`ModelsDatastoreDB`**

  ↳↳ [`ModelsDatastore`](ModelsDatastore.md)

## Implements

- [`IModelsDatastore`](../interfaces/IModelsDatastore.md)

## Table of contents

### Constructors

- [constructor](ModelsDatastoreDB.md#constructor)

### Properties

- [dbConfiguration](ModelsDatastoreDB.md#dbconfiguration)
- [db](ModelsDatastoreDB.md#db)
- [ownsDb](ModelsDatastoreDB.md#ownsdb)
- [server](ModelsDatastoreDB.md#server)

### Accessors

- [configuration](ModelsDatastoreDB.md#configuration)
- [logger](ModelsDatastoreDB.md#logger)
- [cron](ModelsDatastoreDB.md#cron)
- [cache](ModelsDatastoreDB.md#cache)
- [appDelegate](ModelsDatastoreDB.md#appdelegate)
- [engine](ModelsDatastoreDB.md#engine)
- [dataStore](ModelsDatastoreDB.md#datastore)
- [lockManager](ModelsDatastoreDB.md#lockmanager)
- [definitions](ModelsDatastoreDB.md#definitions)
- [listener](ModelsDatastoreDB.md#listener)
- [scriptHandler](ModelsDatastoreDB.md#scripthandler)

### Methods

- [close](ModelsDatastoreDB.md#close)
- [backup](ModelsDatastoreDB.md#backup)
- [get](ModelsDatastoreDB.md#get)
- [getList](ModelsDatastoreDB.md#getlist)
- [loadFromInstance](ModelsDatastoreDB.md#loadfrominstance)
- [load](ModelsDatastoreDB.md#load)
- [loadDefinition](ModelsDatastoreDB.md#loaddefinition)
- [getSource](ModelsDatastoreDB.md#getsource)
- [getSVG](ModelsDatastoreDB.md#getsvg)
- [loadModel](ModelsDatastoreDB.md#loadmodel)
- [save](ModelsDatastoreDB.md#save)
- [findEvents](ModelsDatastoreDB.md#findevents)
- [getProjection](ModelsDatastoreDB.md#getprojection)
- [install](ModelsDatastoreDB.md#install)
- [import](ModelsDatastoreDB.md#import)
- [updateTimer](ModelsDatastoreDB.md#updatetimer)
- [saveModel](ModelsDatastoreDB.md#savemodel)
- [deleteModel](ModelsDatastoreDB.md#deletemodel)
- [renameModel](ModelsDatastoreDB.md#renamemodel)
- [export](ModelsDatastoreDB.md#export)
- [rebuild](ModelsDatastoreDB.md#rebuild)

## Constructors

### constructor

• **new ModelsDatastoreDB**(`server`): [`ModelsDatastoreDB`](ModelsDatastoreDB.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`IBPMNServer`](../interfaces/IBPMNServer.md) |

#### Returns

[`ModelsDatastoreDB`](ModelsDatastoreDB.md)

#### Overrides

[ServerComponent](ServerComponent.md).[constructor](ServerComponent.md#constructor)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L23)

## Properties

### dbConfiguration

• **dbConfiguration**: `any`

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L18)

___

### db

• **db**: `any`

The storage adapter: the server's shared `documentStore`, else this datastore's own MongoDB connection.

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L20)

___

### ownsDb

• `Private` `Readonly` **ownsDb**: `boolean`

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L21)

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

### close

▸ **close**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L34)

___

### backup

▸ **backup**(): `Promise`\<`Record`\<`string`, `any`[]\>\>

Every document of the models and events collections, by collection name: for a backup.

#### Returns

`Promise`\<`Record`\<`string`, `any`[]\>\>

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[backup](../interfaces/IModelsDatastore.md#backup)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:38](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L38)

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

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:44](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L44)

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

[IModelsDatastore](../interfaces/IModelsDatastore.md).[getList](../interfaces/IModelsDatastore.md#getlist)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:50](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L50)

___

### loadFromInstance

▸ **loadFromInstance**(`instance`, `owner?`): `Promise`\<[`Definition`](Definition.md)\>

load definition for instance

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `instance` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<[`Definition`](Definition.md)\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:67](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L67)

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

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:80](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L80)

___

### loadDefinition

▸ **loadDefinition**(`name`, `source`): `Promise`\<[`Definition`](Definition.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `source` | `any` |

#### Returns

`Promise`\<[`Definition`](Definition.md)\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:86](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L86)

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

[IModelsDatastore](../interfaces/IModelsDatastore.md).[getSource](../interfaces/IModelsDatastore.md#getsource)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:93](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L93)

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

[IModelsDatastore](../interfaces/IModelsDatastore.md).[getSVG](../interfaces/IModelsDatastore.md#getsvg)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:98](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L98)

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

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:107](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L107)

___

### save

▸ **save**(`name`, `source`, `svg`, `owner?`): `Promise`\<`any`\>

`savedBy`: who saves it, kept in the model's history (files-based datastores)

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

[IModelsDatastore](../interfaces/IModelsDatastore.md).[save](../interfaces/IModelsDatastore.md#save)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:118](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L118)

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

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:137](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L137)

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

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:171](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L171)

___

### install

▸ **install**(): `Promise`\<`any`\>

first time installation of DB

creates a new collection and add an index

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[install](../interfaces/IModelsDatastore.md#install)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:197](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L197)

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

[IModelsDatastore](../interfaces/IModelsDatastore.md).[import](../interfaces/IModelsDatastore.md#import)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:200](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L200)

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

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:204](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L204)

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

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:230](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L230)

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

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:250](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L250)

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

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:255](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L255)

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

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:273](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L273)

___

### rebuild

▸ **rebuild**(`model?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `model` | `any` | `null` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[rebuild](../interfaces/IModelsDatastore.md#rebuild)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:292](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L292)
