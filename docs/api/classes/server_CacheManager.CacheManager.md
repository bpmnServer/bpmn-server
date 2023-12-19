[bpmn-server](../README.md) / [Exports](../modules.md) / [server/CacheManager](../modules/server_CacheManager.md) / CacheManager

# Class: CacheManager

[server/CacheManager](../modules/server_CacheManager.md).CacheManager

super class for various objects that are part of the server

## Hierarchy

- [`ServerComponent`](server_ServerComponent.ServerComponent.md)

  ↳ **`CacheManager`**

## Implements

- [`ICacheManager`](../interfaces/interfaces_server.ICacheManager.md)

## Table of contents

### Constructors

- [constructor](server_CacheManager.CacheManager.md#constructor)

### Properties

- [server](server_CacheManager.CacheManager.md#server)
- [liveInstances](server_CacheManager.CacheManager.md#liveinstances)

### Accessors

- [appDelegate](server_CacheManager.CacheManager.md#appdelegate)
- [cache](server_CacheManager.CacheManager.md#cache)
- [configuration](server_CacheManager.CacheManager.md#configuration)
- [cron](server_CacheManager.CacheManager.md#cron)
- [dataStore](server_CacheManager.CacheManager.md#datastore)
- [definitions](server_CacheManager.CacheManager.md#definitions)
- [engine](server_CacheManager.CacheManager.md#engine)
- [listener](server_CacheManager.CacheManager.md#listener)
- [logger](server_CacheManager.CacheManager.md#logger)

### Methods

- [add](server_CacheManager.CacheManager.md#add)
- [getInstance](server_CacheManager.CacheManager.md#getinstance)
- [list](server_CacheManager.CacheManager.md#list)
- [remove](server_CacheManager.CacheManager.md#remove)
- [shutdown](server_CacheManager.CacheManager.md#shutdown)

## Constructors

### constructor

• **new CacheManager**(`server`): [`CacheManager`](server_CacheManager.CacheManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`CacheManager`](server_CacheManager.CacheManager.md)

#### Overrides

[ServerComponent](server_ServerComponent.ServerComponent.md).[constructor](server_ServerComponent.ServerComponent.md#constructor)

#### Defined in

[src/server/CacheManager.ts:32](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/CacheManager.ts#L32)

## Properties

### server

• **server**: `any`

#### Inherited from

[ServerComponent](server_ServerComponent.ServerComponent.md).[server](server_ServerComponent.ServerComponent.md#server)

#### Defined in

[src/server/ServerComponent.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L9)

___

### liveInstances

▪ `Static` **liveInstances**: `Map`\<`any`, `any`\>

#### Defined in

[src/server/CacheManager.ts:30](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/CacheManager.ts#L30)

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

▸ **add**(`execution`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](../interfaces/interfaces_engine.IExecution.md) |

#### Returns

`void`

#### Implementation of

[ICacheManager](../interfaces/interfaces_server.ICacheManager.md).[add](../interfaces/interfaces_server.ICacheManager.md#add)

#### Defined in

[src/server/CacheManager.ts:58](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/CacheManager.ts#L58)

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

[src/server/CacheManager.ts:52](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/CacheManager.ts#L52)

___

### list

▸ **list**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[ICacheManager](../interfaces/interfaces_server.ICacheManager.md).[list](../interfaces/interfaces_server.ICacheManager.md#list)

#### Defined in

[src/server/CacheManager.ts:44](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/CacheManager.ts#L44)

___

### remove

▸ **remove**(`instanceId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |

#### Returns

`void`

#### Implementation of

[ICacheManager](../interfaces/interfaces_server.ICacheManager.md).[remove](../interfaces/interfaces_server.ICacheManager.md#remove)

#### Defined in

[src/server/CacheManager.ts:62](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/CacheManager.ts#L62)

___

### shutdown

▸ **shutdown**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ICacheManager](../interfaces/interfaces_server.ICacheManager.md).[shutdown](../interfaces/interfaces_server.ICacheManager.md#shutdown)

#### Defined in

[src/server/CacheManager.ts:66](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/CacheManager.ts#L66)
