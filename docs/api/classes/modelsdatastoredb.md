[bpmn-server](../README.md) / ModelsDatastoreDB

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

- [db](ModelsDatastoreDB.md#db)
- [dbConfiguration](ModelsDatastoreDB.md#dbconfiguration)
- [server](ModelsDatastoreDB.md#server)

### Accessors

- [appDelegate](ModelsDatastoreDB.md#appdelegate)
- [cache](ModelsDatastoreDB.md#cache)
- [configuration](ModelsDatastoreDB.md#configuration)
- [cron](ModelsDatastoreDB.md#cron)
- [dataStore](ModelsDatastoreDB.md#datastore)
- [definitions](ModelsDatastoreDB.md#definitions)
- [engine](ModelsDatastoreDB.md#engine)
- [listener](ModelsDatastoreDB.md#listener)
- [logger](ModelsDatastoreDB.md#logger)

### Methods

- [deleteModel](ModelsDatastoreDB.md#deletemodel)
- [export](ModelsDatastoreDB.md#export)
- [findEvents](ModelsDatastoreDB.md#findevents)
- [getList](ModelsDatastoreDB.md#getlist)
- [getSVG](ModelsDatastoreDB.md#getsvg)
- [getSource](ModelsDatastoreDB.md#getsource)
- [import](ModelsDatastoreDB.md#import)
- [install](ModelsDatastoreDB.md#install)
- [load](ModelsDatastoreDB.md#load)
- [loadModel](ModelsDatastoreDB.md#loadmodel)
- [rebuild](ModelsDatastoreDB.md#rebuild)
- [renameModel](ModelsDatastoreDB.md#renamemodel)
- [save](ModelsDatastoreDB.md#save)
- [saveModel](ModelsDatastoreDB.md#savemodel)
- [updateTimer](ModelsDatastoreDB.md#updatetimer)

## Constructors

### constructor

• **new ModelsDatastoreDB**(`server`): [`ModelsDatastoreDB`](ModelsDatastoreDB.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`BPMNServer`](BPMNServer.md) |

#### Returns

[`ModelsDatastoreDB`](ModelsDatastoreDB.md)

#### Overrides

[ServerComponent](ServerComponent.md).[constructor](ServerComponent.md#constructor)

#### Defined in

[datastore/ModelsDatastoreDB.ts:27](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-27)

## Properties

### db

• **db**: `any`

#### Defined in

[datastore/ModelsDatastoreDB.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-25)

___

### dbConfiguration

• **dbConfiguration**: `any`

#### Defined in

[datastore/ModelsDatastoreDB.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-24)

___

### server

• **server**: `any`

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[server/ServerComponent.ts:9](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-9)

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

#### Inherited from

ServerComponent.logger

#### Defined in

[server/ServerComponent.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-15)

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

[IModelsDatastore](../interfaces/IModelsDatastore.md).[deleteModel](../interfaces/IModelsDatastore.md#deletemodel)

#### Defined in

[datastore/ModelsDatastoreDB.ts:210](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-210)

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

[datastore/ModelsDatastoreDB.ts:233](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-233)

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

[datastore/ModelsDatastoreDB.ts:97](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-97)

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

[datastore/ModelsDatastoreDB.ts:34](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-34)

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

[datastore/ModelsDatastoreDB.ts:59](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-59)

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

[datastore/ModelsDatastoreDB.ts:54](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-54)

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

[datastore/ModelsDatastoreDB.ts:160](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-160)

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

[datastore/ModelsDatastoreDB.ts:157](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-157)

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

[datastore/ModelsDatastoreDB.ts:47](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-47)

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

[datastore/ModelsDatastoreDB.ts:68](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-68)

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

[datastore/ModelsDatastoreDB.ts:251](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-251)

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

[datastore/ModelsDatastoreDB.ts:215](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-215)

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

[IModelsDatastore](../interfaces/IModelsDatastore.md).[save](../interfaces/IModelsDatastore.md#save)

#### Defined in

[datastore/ModelsDatastoreDB.ts:78](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-78)

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

[datastore/ModelsDatastoreDB.ts:190](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-190)

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

[datastore/ModelsDatastoreDB.ts:164](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsDatastoreDB.ts#lines-164)
