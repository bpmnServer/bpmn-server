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

[server/CacheManager.ts:32](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/CacheManager.ts#L32)

## Properties

### server

• **server**: `any`

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[server/ServerComponent.ts:9](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/ServerComponent.ts#L9)

___

### liveInstances

▪ `Static` **liveInstances**: `Map`\<`any`, `any`\>

#### Defined in

[server/CacheManager.ts:30](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/CacheManager.ts#L30)

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

[server/CacheManager.ts:58](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/CacheManager.ts#L58)

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

[server/CacheManager.ts:52](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/CacheManager.ts#L52)

___

### list

▸ **list**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[ICacheManager](../interfaces/ICacheManager.md).[list](../interfaces/ICacheManager.md#list)

#### Defined in

[server/CacheManager.ts:44](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/CacheManager.ts#L44)

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

[server/CacheManager.ts:62](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/CacheManager.ts#L62)

___

### shutdown

▸ **shutdown**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ICacheManager](../interfaces/ICacheManager.md).[shutdown](../interfaces/ICacheManager.md#shutdown)

#### Defined in

[server/CacheManager.ts:66](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/CacheManager.ts#L66)
