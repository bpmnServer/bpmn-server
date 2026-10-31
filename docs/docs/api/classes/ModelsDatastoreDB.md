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
- [server](ModelsDatastoreDB.md#server)

### Accessors

- [configuration](ModelsDatastoreDB.md#configuration)
- [logger](ModelsDatastoreDB.md#logger)
- [cron](ModelsDatastoreDB.md#cron)
- [cache](ModelsDatastoreDB.md#cache)
- [appDelegate](ModelsDatastoreDB.md#appdelegate)
- [engine](ModelsDatastoreDB.md#engine)
- [dataStore](ModelsDatastoreDB.md#datastore)
- [definitions](ModelsDatastoreDB.md#definitions)
- [listener](ModelsDatastoreDB.md#listener)

### Methods

- [get](ModelsDatastoreDB.md#get)
- [getList](ModelsDatastoreDB.md#getlist)
- [load](ModelsDatastoreDB.md#load)
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
| `server` | [`BPMNServer`](BPMNServer.md) |

#### Returns

[`ModelsDatastoreDB`](ModelsDatastoreDB.md)

#### Overrides

[ServerComponent](ServerComponent.md).[constructor](ServerComponent.md#constructor)

#### Defined in

[datastore/ModelsDatastoreDB.ts:27](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L27)

## Properties

### dbConfiguration

• **dbConfiguration**: `any`

#### Defined in

[datastore/ModelsDatastoreDB.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L24)

___

### db

• **db**: `any`

#### Defined in

[datastore/ModelsDatastoreDB.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L25)

___

### server

• **server**: `any`

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[server/ServerComponent.ts:9](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L9)

## Accessors

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.configuration

#### Defined in

[server/ServerComponent.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L14)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.logger

#### Defined in

[server/ServerComponent.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L15)

___

### cron

• `get` **cron**(): [`Cron`](Cron.md)

#### Returns

[`Cron`](Cron.md)

#### Inherited from

ServerComponent.cron

#### Defined in

[server/ServerComponent.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L16)

___

### cache

• `get` **cache**(): [`CacheManager`](CacheManager.md)

#### Returns

[`CacheManager`](CacheManager.md)

#### Inherited from

ServerComponent.cache

#### Defined in

[server/ServerComponent.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L17)

___

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[server/ServerComponent.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L18)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/IEngine.md)

#### Returns

[`IEngine`](../interfaces/IEngine.md)

#### Inherited from

ServerComponent.engine

#### Defined in

[server/ServerComponent.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L19)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.dataStore

#### Defined in

[server/ServerComponent.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L20)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.definitions

#### Defined in

[server/ServerComponent.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L21)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.listener

#### Defined in

[server/ServerComponent.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L22)

## Methods

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

[datastore/ModelsDatastoreDB.ts:34](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L34)

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

[datastore/ModelsDatastoreDB.ts:40](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L40)

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

[datastore/ModelsDatastoreDB.ts:54](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L54)

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

[datastore/ModelsDatastoreDB.ts:61](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L61)

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

[datastore/ModelsDatastoreDB.ts:66](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L66)

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

[datastore/ModelsDatastoreDB.ts:75](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L75)

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

[datastore/ModelsDatastoreDB.ts:85](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L85)

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

[datastore/ModelsDatastoreDB.ts:104](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L104)

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

[datastore/ModelsDatastoreDB.ts:138](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L138)

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

[datastore/ModelsDatastoreDB.ts:164](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L164)

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

[datastore/ModelsDatastoreDB.ts:167](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L167)

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

#### Defined in

[datastore/ModelsDatastoreDB.ts:197](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L197)

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

[datastore/ModelsDatastoreDB.ts:217](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L217)

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

[datastore/ModelsDatastoreDB.ts:222](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L222)

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

[datastore/ModelsDatastoreDB.ts:240](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L240)

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

[datastore/ModelsDatastoreDB.ts:258](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsDatastoreDB.ts#L258)
