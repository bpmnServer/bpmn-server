[bpmn-server](../README.md) / CacheManager

# Class: CacheManager

super class for various objects that are part of the server

## Hierarchy

- [`ServerComponent`](ServerComponent.md)

  ↳ **`CacheManager`**

## Implements

- [`ICacheManager`](../interfaces/ICacheManager.md)

## Table of contents

### Constructors

- [constructor](CacheManager.md#constructor)

### Properties

- [server](CacheManager.md#server)
- [liveInstances](CacheManager.md#liveinstances)

### Accessors

- [appDelegate](CacheManager.md#appdelegate)
- [cache](CacheManager.md#cache)
- [configuration](CacheManager.md#configuration)
- [cron](CacheManager.md#cron)
- [dataStore](CacheManager.md#datastore)
- [definitions](CacheManager.md#definitions)
- [engine](CacheManager.md#engine)
- [listener](CacheManager.md#listener)
- [logger](CacheManager.md#logger)

### Methods

- [add](CacheManager.md#add)
- [getInstance](CacheManager.md#getinstance)
- [list](CacheManager.md#list)
- [remove](CacheManager.md#remove)
- [shutdown](CacheManager.md#shutdown)

## Constructors

### constructor

• **new CacheManager**(`server`): [`CacheManager`](CacheManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`CacheManager`](CacheManager.md)

#### Overrides

[ServerComponent](ServerComponent.md).[constructor](ServerComponent.md#constructor)

#### Defined in

[server/CacheManager.ts:32](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/CacheManager.ts#lines-32)

## Properties

### server

• **server**: `any`

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[server/ServerComponent.ts:9](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/ServerComponent.ts#lines-9)

___

### liveInstances

▪ `Static` **liveInstances**: `Map`\<`any`, `any`\>

#### Defined in

[server/CacheManager.ts:30](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/CacheManager.ts#lines-30)

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

▸ **add**(`execution`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](../interfaces/IExecution.md) |

#### Returns

`void`

#### Implementation of

[ICacheManager](../interfaces/ICacheManager.md).[add](../interfaces/ICacheManager.md#add)

#### Defined in

[server/CacheManager.ts:58](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/CacheManager.ts#lines-58)

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

[server/CacheManager.ts:52](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/CacheManager.ts#lines-52)

___

### list

▸ **list**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[ICacheManager](../interfaces/ICacheManager.md).[list](../interfaces/ICacheManager.md#list)

#### Defined in

[server/CacheManager.ts:44](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/CacheManager.ts#lines-44)

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

[ICacheManager](../interfaces/ICacheManager.md).[remove](../interfaces/ICacheManager.md#remove)

#### Defined in

[server/CacheManager.ts:62](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/CacheManager.ts#lines-62)

___

### shutdown

▸ **shutdown**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ICacheManager](../interfaces/ICacheManager.md).[shutdown](../interfaces/ICacheManager.md#shutdown)

#### Defined in

[server/CacheManager.ts:66](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/server/CacheManager.ts#lines-66)
