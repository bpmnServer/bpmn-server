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

[server/CacheManager.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/CacheManager.ts#lines-13)

## Properties

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

[server/CacheManager.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/CacheManager.ts#lines-22)

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

[server/CacheManager.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/CacheManager.ts#lines-20)

___

### list

▸ **list**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[ICacheManager](../interfaces/ICacheManager.md).[list](../interfaces/ICacheManager.md#list)

#### Defined in

[server/CacheManager.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/CacheManager.ts#lines-17)

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

[server/CacheManager.ts:23](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/CacheManager.ts#lines-23)

___

### restart

▸ **restart**(): `void`

#### Returns

`void`

#### Defined in

[server/CacheManager.ts:26](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/CacheManager.ts#lines-26)

___

### shutdown

▸ **shutdown**(): `void`

#### Returns

`void`

#### Implementation of

[ICacheManager](../interfaces/ICacheManager.md).[shutdown](../interfaces/ICacheManager.md#shutdown)

#### Defined in

[server/CacheManager.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/CacheManager.ts#lines-25)
