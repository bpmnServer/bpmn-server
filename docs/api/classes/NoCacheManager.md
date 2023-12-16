[bpmn-server](../README.md) / NoCacheManager

# Class: NoCacheManager

super class for various objects that are part of the server

## Hierarchy

- [`ServerComponent`](ServerComponent.md)

  ↳ **`NoCacheManager`**

## Implements

- [`ICacheManager`](../interfaces/ICacheManager.md)

## Table of contents

### Constructors

- [constructor](NoCacheManager.md#constructor)

### Properties

- [server](NoCacheManager.md#server)

### Accessors

- [appDelegate](NoCacheManager.md#appdelegate)
- [cache](NoCacheManager.md#cache)
- [configuration](NoCacheManager.md#configuration)
- [cron](NoCacheManager.md#cron)
- [dataStore](NoCacheManager.md#datastore)
- [definitions](NoCacheManager.md#definitions)
- [engine](NoCacheManager.md#engine)
- [listener](NoCacheManager.md#listener)
- [logger](NoCacheManager.md#logger)

### Methods

- [add](NoCacheManager.md#add)
- [getInstance](NoCacheManager.md#getinstance)
- [list](NoCacheManager.md#list)
- [remove](NoCacheManager.md#remove)
- [restart](NoCacheManager.md#restart)
- [shutdown](NoCacheManager.md#shutdown)

## Constructors

### constructor

• **new NoCacheManager**(`server`): [`NoCacheManager`](NoCacheManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`NoCacheManager`](NoCacheManager.md)

#### Overrides

[ServerComponent](ServerComponent.md).[constructor](ServerComponent.md#constructor)

#### Defined in

[server/CacheManager.ts:13](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/CacheManager.ts#L13)

## Properties

### server

• **server**: `any`

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[server/ServerComponent.ts:9](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/ServerComponent.ts#L9)

## Accessors

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[server/ServerComponent.ts:18](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/ServerComponent.ts#L18)

___

### cache

• `get` **cache**(): [`CacheManager`](CacheManager.md)

#### Returns

[`CacheManager`](CacheManager.md)

#### Inherited from

ServerComponent.cache

#### Defined in

[server/ServerComponent.ts:17](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/ServerComponent.ts#L17)

___

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.configuration

#### Defined in

[server/ServerComponent.ts:14](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/ServerComponent.ts#L14)

___

### cron

• `get` **cron**(): [`Cron`](Cron.md)

#### Returns

[`Cron`](Cron.md)

#### Inherited from

ServerComponent.cron

#### Defined in

[server/ServerComponent.ts:16](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/ServerComponent.ts#L16)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.dataStore

#### Defined in

[server/ServerComponent.ts:20](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/ServerComponent.ts#L20)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.definitions

#### Defined in

[server/ServerComponent.ts:21](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/ServerComponent.ts#L21)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/IEngine.md)

#### Returns

[`IEngine`](../interfaces/IEngine.md)

#### Inherited from

ServerComponent.engine

#### Defined in

[server/ServerComponent.ts:19](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/ServerComponent.ts#L19)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.listener

#### Defined in

[server/ServerComponent.ts:22](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/ServerComponent.ts#L22)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.logger

#### Defined in

[server/ServerComponent.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/ServerComponent.ts#L15)

## Methods

### add

▸ **add**(`execution`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](../interfaces/IExecution.md) |

#### Returns

`any`

#### Implementation of

[ICacheManager](../interfaces/ICacheManager.md).[add](../interfaces/ICacheManager.md#add)

#### Defined in

[server/CacheManager.ts:22](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/CacheManager.ts#L22)

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

[server/CacheManager.ts:20](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/CacheManager.ts#L20)

___

### list

▸ **list**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[ICacheManager](../interfaces/ICacheManager.md).[list](../interfaces/ICacheManager.md#list)

#### Defined in

[server/CacheManager.ts:17](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/CacheManager.ts#L17)

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

[ICacheManager](../interfaces/ICacheManager.md).[remove](../interfaces/ICacheManager.md#remove)

#### Defined in

[server/CacheManager.ts:23](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/CacheManager.ts#L23)

___

### restart

▸ **restart**(): `void`

#### Returns

`void`

#### Defined in

[server/CacheManager.ts:26](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/CacheManager.ts#L26)

___

### shutdown

▸ **shutdown**(): `void`

#### Returns

`void`

#### Implementation of

[ICacheManager](../interfaces/ICacheManager.md).[shutdown](../interfaces/ICacheManager.md#shutdown)

#### Defined in

[server/CacheManager.ts:25](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/CacheManager.ts#L25)
