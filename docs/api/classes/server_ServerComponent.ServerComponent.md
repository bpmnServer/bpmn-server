[bpmn-server](../README.md) / [Exports](../modules.md) / [server/ServerComponent](../modules/server_ServerComponent.md) / ServerComponent

# Class: ServerComponent

[server/ServerComponent](../modules/server_ServerComponent.md).ServerComponent

super class for various objects that are part of the server

## Hierarchy

- **`ServerComponent`**

  ↳ [`DataStore`](datastore_DataStore.DataStore.md)

  ↳ [`ModelsDatastoreDB`](datastore_ModelsDatastoreDB.ModelsDatastoreDB.md)

  ↳ [`Execution`](engine_Execution.Execution.md)

  ↳ [`CacheManager`](server_CacheManager.CacheManager.md)

  ↳ [`NoCacheManager`](server_CacheManager.NoCacheManager.md)

  ↳ [`Cron`](server_Cron.Cron.md)

  ↳ [`Engine`](server_Engine.Engine.md)

## Table of contents

### Constructors

- [constructor](server_ServerComponent.ServerComponent.md#constructor)

### Properties

- [server](server_ServerComponent.ServerComponent.md#server)

### Accessors

- [appDelegate](server_ServerComponent.ServerComponent.md#appdelegate)
- [cache](server_ServerComponent.ServerComponent.md#cache)
- [configuration](server_ServerComponent.ServerComponent.md#configuration)
- [cron](server_ServerComponent.ServerComponent.md#cron)
- [dataStore](server_ServerComponent.ServerComponent.md#datastore)
- [definitions](server_ServerComponent.ServerComponent.md#definitions)
- [engine](server_ServerComponent.ServerComponent.md#engine)
- [listener](server_ServerComponent.ServerComponent.md#listener)
- [logger](server_ServerComponent.ServerComponent.md#logger)

## Constructors

### constructor

• **new ServerComponent**(`server`): [`ServerComponent`](server_ServerComponent.ServerComponent.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`IBPMNServer`](../interfaces/interfaces_server.IBPMNServer.md) |

#### Returns

[`ServerComponent`](server_ServerComponent.ServerComponent.md)

#### Defined in

[src/server/ServerComponent.ts:10](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L10)

## Properties

### server

• **server**: `any`

#### Defined in

[src/server/ServerComponent.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L9)

## Accessors

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Defined in

[src/server/ServerComponent.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L18)

___

### cache

• `get` **cache**(): [`CacheManager`](server_CacheManager.CacheManager.md)

#### Returns

[`CacheManager`](server_CacheManager.CacheManager.md)

#### Defined in

[src/server/ServerComponent.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L17)

___

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Defined in

[src/server/ServerComponent.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L14)

___

### cron

• `get` **cron**(): [`Cron`](server_Cron.Cron.md)

#### Returns

[`Cron`](server_Cron.Cron.md)

#### Defined in

[src/server/ServerComponent.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L16)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Defined in

[src/server/ServerComponent.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L20)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Defined in

[src/server/ServerComponent.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L21)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/interfaces_server.IEngine.md)

#### Returns

[`IEngine`](../interfaces/interfaces_server.IEngine.md)

#### Defined in

[src/server/ServerComponent.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L19)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Defined in

[src/server/ServerComponent.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L22)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Defined in

[src/server/ServerComponent.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L15)
