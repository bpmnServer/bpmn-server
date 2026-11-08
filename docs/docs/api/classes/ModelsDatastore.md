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

- [dbConfiguration](ModelsDatastore.md#dbconfiguration)
- [db](ModelsDatastore.md#db)
- [server](ModelsDatastore.md#server)

### Accessors

- [definitionsPath](ModelsDatastore.md#definitionspath)
- [modelHistory](ModelsDatastore.md#modelhistory)
- [keepsHistory](ModelsDatastore.md#keepshistory)
- [configuration](ModelsDatastore.md#configuration)
- [logger](ModelsDatastore.md#logger)
- [cron](ModelsDatastore.md#cron)
- [cache](ModelsDatastore.md#cache)
- [appDelegate](ModelsDatastore.md#appdelegate)
- [engine](ModelsDatastore.md#engine)
- [dataStore](ModelsDatastore.md#datastore)
- [lockManager](ModelsDatastore.md#lockmanager)
- [definitions](ModelsDatastore.md#definitions)
- [listener](ModelsDatastore.md#listener)
- [scriptHandler](ModelsDatastore.md#scripthandler)

### Methods

- [import](ModelsDatastore.md#import)
- [getList](ModelsDatastore.md#getlist)
- [getPath](ModelsDatastore.md#getpath)
- [getFile](ModelsDatastore.md#getfile)
- [saveFile](ModelsDatastore.md#savefile)
- [getSource](ModelsDatastore.md#getsource)
- [getSVG](ModelsDatastore.md#getsvg)
- [before](ModelsDatastore.md#before)
- [keepVersion](ModelsDatastore.md#keepversion)
- [save](ModelsDatastore.md#save)
- [history](ModelsDatastore.md#history)
- [historySource](ModelsDatastore.md#historysource)
- [deleteVersion](ModelsDatastore.md#deleteversion)
- [purgeHistory](ModelsDatastore.md#purgehistory)
- [deleteModel](ModelsDatastore.md#deletemodel)
- [renameModel](ModelsDatastore.md#renamemodel)
- [rebuild](ModelsDatastore.md#rebuild)
- [rebuildModel](ModelsDatastore.md#rebuildmodel)
- [close](ModelsDatastore.md#close)
- [backup](ModelsDatastore.md#backup)
- [get](ModelsDatastore.md#get)
- [loadFromInstance](ModelsDatastore.md#loadfrominstance)
- [load](ModelsDatastore.md#load)
- [loadDefinition](ModelsDatastore.md#loaddefinition)
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
| `server` | [`IBPMNServer`](../interfaces/IBPMNServer.md) |

#### Returns

[`ModelsDatastore`](ModelsDatastore.md)

#### Overrides

[ModelsDatastoreDB](ModelsDatastoreDB.md).[constructor](ModelsDatastoreDB.md#constructor)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L14)

## Properties

### dbConfiguration

• **dbConfiguration**: `any`

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[dbConfiguration](ModelsDatastoreDB.md#dbconfiguration)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L18)

___

### db

• **db**: `any`

The storage adapter: the server's shared `documentStore`, else this datastore's own MongoDB connection.

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[db](ModelsDatastoreDB.md#db)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L20)

___

### server

• **server**: `any`

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[server](ModelsDatastoreDB.md#server)

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:10](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L10)

## Accessors

### definitionsPath

• `get` **definitionsPath**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L18)

___

### modelHistory

• `get` **modelHistory**(): [`ModelHistory`](ModelHistory.md)

Every save of a model, kept beside it (`.history/<name>/`), in the models folder.

#### Returns

[`ModelHistory`](ModelHistory.md)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:102](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L102)

___

### keepsHistory

• `get` **keepsHistory**(): `boolean`

Is a version kept for each save (`modelHistory`, default true)?

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:117](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L117)

___

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.configuration

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L15)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.logger

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L16)

___

### cron

• `get` **cron**(): [`Cron`](Cron.md)

#### Returns

[`Cron`](Cron.md)

#### Inherited from

ModelsDatastoreDB.cron

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L17)

___

### cache

• `get` **cache**(): [`ICacheManager`](../interfaces/ICacheManager.md)

#### Returns

[`ICacheManager`](../interfaces/ICacheManager.md)

#### Inherited from

ModelsDatastoreDB.cache

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L18)

___

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.appDelegate

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L19)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/IEngine.md)

#### Returns

[`IEngine`](../interfaces/IEngine.md)

#### Inherited from

ModelsDatastoreDB.engine

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L20)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.dataStore

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L21)

___

### lockManager

• `get` **lockManager**(): `any`

The lock port: the configuration's, else the data store's.

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.lockManager

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L23)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.definitions

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L24)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.listener

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L25)

___

### scriptHandler

• `get` **scriptHandler**(): `any`

#### Returns

`any`

#### Inherited from

ModelsDatastoreDB.scriptHandler

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L26)

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

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L21)

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

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L26)

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

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:63](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L63)

___

### getFile

▸ **getFile**(`name`, `type`, `owner?`): `Promise`\<`any`\>

A model file's text; null only when it does not exist (an unreadable file throws).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `type` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:69](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L69)

___

### saveFile

▸ **saveFile**(`name`, `type`, `data`, `owner?`): `Promise`\<`void`\>

Writes a model file whole or not at all: to a temporary file beside it, then renamed over it.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `type` | `any` | `undefined` |
| `data` | `any` | `undefined` |
| `owner` | `any` | `null` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:81](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L81)

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

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:89](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L89)

___

### getSVG

▸ **getSVG**(`name`, `owner?`): `Promise`\<`string`\>

The model's diagram, or null when it has none (the SVG is optional).

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

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:97](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L97)

___

### before

▸ **before**(`file`): `Promise`\<\{ `source`: `string` ; `savedAt`: `Date`  }\>

The model's file and its time before a save: kept first when the model has no history yet.

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | `string` |

#### Returns

`Promise`\<\{ `source`: `string` ; `savedAt`: `Date`  }\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:105](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L105)

___

### keepVersion

▸ **keepVersion**(`history`, `name`, `bpmn`, `savedBy`, `before`): `Promise`\<`void`\>

Keeps a save in the model's history; a history that can not be written does not fail the save.

#### Parameters

| Name | Type |
| :------ | :------ |
| `history` | [`ModelHistory`](ModelHistory.md) |
| `name` | `any` |
| `bpmn` | `any` |
| `savedBy` | `any` |
| `before` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:120](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L120)

___

### save

▸ **save**(`name`, `bpmn`, `svg?`, `owner?`, `savedBy?`): `Promise`\<`boolean`\>

Saves the model; `savedBy` (a user name) is kept with the version in its history.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `any` | `undefined` |
| `bpmn` | `any` | `undefined` |
| `svg?` | `any` | `undefined` |
| `owner` | `any` | `null` |
| `savedBy?` | `string` | `undefined` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[save](../interfaces/IModelsDatastore.md#save)

#### Overrides

[ModelsDatastoreDB](ModelsDatastoreDB.md).[save](ModelsDatastoreDB.md#save)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:132](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L132)

___

### history

▸ **history**(`name`): `Promise`\<[`IModelVersion`](../interfaces/IModelVersion.md)[]\>

The model's saved versions, newest first.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<[`IModelVersion`](../interfaces/IModelVersion.md)[]\>

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[history](../interfaces/IModelsDatastore.md#history)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:147](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L147)

___

### historySource

▸ **historySource**(`name`, `version`): `Promise`\<`string`\>

A saved version of the model, or null.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `version` | `number` |

#### Returns

`Promise`\<`string`\>

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[historySource](../interfaces/IModelsDatastore.md#historysource)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:151](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L151)

___

### deleteVersion

▸ **deleteVersion**(`name`, `version`): `Promise`\<`boolean`\>

Removes one saved version of the model; false when there is none.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `version` | `number` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[deleteVersion](../interfaces/IModelsDatastore.md#deleteversion)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:155](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L155)

___

### purgeHistory

▸ **purgeHistory**(`name`): `Promise`\<`number`\>

Removes the model's history; returns how many versions it had.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<`number`\>

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[purgeHistory](../interfaces/IModelsDatastore.md#purgehistory)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:159](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L159)

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

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:163](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L163)

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

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:172](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L172)

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

#### Implementation of

[IModelsDatastore](../interfaces/IModelsDatastore.md).[rebuild](../interfaces/IModelsDatastore.md#rebuild)

#### Overrides

[ModelsDatastoreDB](ModelsDatastoreDB.md).[rebuild](ModelsDatastoreDB.md#rebuild)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:189](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L189)

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

[packages/bpmn-server/src/datastore/ModelsDatastore.ts:231](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastore.ts#L231)

___

### close

▸ **close**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[close](ModelsDatastoreDB.md#close)

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

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[backup](ModelsDatastoreDB.md#backup)

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

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[get](ModelsDatastoreDB.md#get)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:44](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L44)

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

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[loadFromInstance](ModelsDatastoreDB.md#loadfrominstance)

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

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[load](ModelsDatastoreDB.md#load)

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

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[loadDefinition](ModelsDatastoreDB.md#loaddefinition)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:86](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L86)

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

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:107](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L107)

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

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:137](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L137)

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

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:197](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L197)

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

#### Inherited from

[ModelsDatastoreDB](ModelsDatastoreDB.md).[saveModel](ModelsDatastoreDB.md#savemodel)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:230](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L230)

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

[packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts:273](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsDatastoreDB.ts#L273)
