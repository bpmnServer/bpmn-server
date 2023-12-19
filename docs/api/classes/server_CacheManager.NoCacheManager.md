[bpmn-server](../README.md) / [Exports](../modules.md) / [server/CacheManager](../modules/server_CacheManager.md) / NoCacheManager

# Class: NoCacheManager

[server/CacheManager](../modules/server_CacheManager.md).NoCacheManager

super class for various objects that are part of the server

## Hierarchy

- [`ServerComponent`](server_ServerComponent.ServerComponent.md)

  ↳ **`NoCacheManager`**

## Implements

- [`ICacheManager`](../interfaces/interfaces_server.ICacheManager.md)

## Table of contents

### Constructors

- [constructor](server_CacheManager.NoCacheManager.md#constructor)

### Properties

- [server](server_CacheManager.NoCacheManager.md#server)

### Accessors

- [appDelegate](server_CacheManager.NoCacheManager.md#appdelegate)
- [cache](server_CacheManager.NoCacheManager.md#cache)
- [configuration](server_CacheManager.NoCacheManager.md#configuration)
- [cron](server_CacheManager.NoCacheManager.md#cron)
- [dataStore](server_CacheManager.NoCacheManager.md#datastore)
- [definitions](server_CacheManager.NoCacheManager.md#definitions)
- [engine](server_CacheManager.NoCacheManager.md#engine)
- [listener](server_CacheManager.NoCacheManager.md#listener)
- [logger](server_CacheManager.NoCacheManager.md#logger)

### Methods

- [add](server_CacheManager.NoCacheManager.md#add)
- [getInstance](server_CacheManager.NoCacheManager.md#getinstance)
- [list](server_CacheManager.NoCacheManager.md#list)
- [remove](server_CacheManager.NoCacheManager.md#remove)
- [restart](server_CacheManager.NoCacheManager.md#restart)
- [shutdown](server_CacheManager.NoCacheManager.md#shutdown)

## Constructors

### constructor

• **new NoCacheManager**(`server`): [`NoCacheManager`](server_CacheManager.NoCacheManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`NoCacheManager`](server_CacheManager.NoCacheManager.md)

#### Overrides

[ServerComponent](server_ServerComponent.ServerComponent.md).[constructor](server_ServerComponent.ServerComponent.md#constructor)

#### Defined in

[src/server/CacheManager.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/CacheManager.ts#L13)

## Properties

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

### add

▸ **add**(`execution`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](../interfaces/interfaces_engine.IExecution.md) |

#### Returns

`any`

#### Implementation of

[ICacheManager](../interfaces/interfaces_server.ICacheManager.md).[add](../interfaces/interfaces_server.ICacheManager.md#add)

#### Defined in

[src/server/CacheManager.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/CacheManager.ts#L22)

___

### getInstance

▸ **getInstance**(`instanceId`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |

#### Returns

`any`

#### Defined in

[src/server/CacheManager.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/CacheManager.ts#L20)

___

### list

▸ **list**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[ICacheManager](../interfaces/interfaces_server.ICacheManager.md).[list](../interfaces/interfaces_server.ICacheManager.md#list)

#### Defined in

[src/server/CacheManager.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/CacheManager.ts#L17)

___

### remove

▸ **remove**(`instanceId`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |

#### Returns

`any`

#### Implementation of

[ICacheManager](../interfaces/interfaces_server.ICacheManager.md).[remove](../interfaces/interfaces_server.ICacheManager.md#remove)

#### Defined in

[src/server/CacheManager.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/CacheManager.ts#L23)

___

### restart

▸ **restart**(): `void`

#### Returns

`void`

#### Defined in

[src/server/CacheManager.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/CacheManager.ts#L26)

___

### shutdown

▸ **shutdown**(): `void`

#### Returns

`void`

#### Implementation of

[ICacheManager](../interfaces/interfaces_server.ICacheManager.md).[shutdown](../interfaces/interfaces_server.ICacheManager.md#shutdown)

#### Defined in

[src/server/CacheManager.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/CacheManager.ts#L25)
