[bpmn-server](../readme.md) / NoCacheManager

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

- [configuration](NoCacheManager.md#configuration)
- [logger](NoCacheManager.md#logger)
- [cron](NoCacheManager.md#cron)
- [cache](NoCacheManager.md#cache)
- [appDelegate](NoCacheManager.md#appdelegate)
- [engine](NoCacheManager.md#engine)
- [dataStore](NoCacheManager.md#datastore)
- [lockManager](NoCacheManager.md#lockmanager)
- [definitions](NoCacheManager.md#definitions)
- [listener](NoCacheManager.md#listener)
- [scriptHandler](NoCacheManager.md#scripthandler)

### Methods

- [list](NoCacheManager.md#list)
- [getInstance](NoCacheManager.md#getinstance)
- [add](NoCacheManager.md#add)
- [remove](NoCacheManager.md#remove)
- [shutdown](NoCacheManager.md#shutdown)
- [restart](NoCacheManager.md#restart)

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

[packages/bpmn-server/src/server/CacheManager.ts:8](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/CacheManager.ts#L8)

## Properties

### server

• **server**: `any`

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:10](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L10)

## Accessors

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.configuration

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L15)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.logger

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L16)

___

### cron

• `get` **cron**(): [`Cron`](Cron.md)

#### Returns

[`Cron`](Cron.md)

#### Inherited from

ServerComponent.cron

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L17)

___

### cache

• `get` **cache**(): [`ICacheManager`](../interfaces/ICacheManager.md)

#### Returns

[`ICacheManager`](../interfaces/ICacheManager.md)

#### Inherited from

ServerComponent.cache

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L18)

___

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L19)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/IEngine.md)

#### Returns

[`IEngine`](../interfaces/IEngine.md)

#### Inherited from

ServerComponent.engine

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L20)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.dataStore

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L21)

___

### lockManager

• `get` **lockManager**(): `any`

The lock port: the configuration's, else the data store's.

#### Returns

`any`

#### Inherited from

ServerComponent.lockManager

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L23)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.definitions

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L24)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.listener

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L25)

___

### scriptHandler

• `get` **scriptHandler**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.scriptHandler

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L26)

## Methods

### list

▸ **list**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[ICacheManager](../interfaces/ICacheManager.md).[list](../interfaces/ICacheManager.md#list)

#### Defined in

[packages/bpmn-server/src/server/CacheManager.ts:12](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/CacheManager.ts#L12)

___

### getInstance

▸ **getInstance**(`instanceId`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |

#### Returns

`any`

#### Implementation of

[ICacheManager](../interfaces/ICacheManager.md).[getInstance](../interfaces/ICacheManager.md#getinstance)

#### Defined in

[packages/bpmn-server/src/server/CacheManager.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/CacheManager.ts#L15)

___

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

[packages/bpmn-server/src/server/CacheManager.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/CacheManager.ts#L17)

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

[packages/bpmn-server/src/server/CacheManager.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/CacheManager.ts#L18)

___

### shutdown

▸ **shutdown**(): `void`

#### Returns

`void`

#### Implementation of

[ICacheManager](../interfaces/ICacheManager.md).[shutdown](../interfaces/ICacheManager.md#shutdown)

#### Defined in

[packages/bpmn-server/src/server/CacheManager.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/CacheManager.ts#L20)

___

### restart

▸ **restart**(): `void`

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/server/CacheManager.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/CacheManager.ts#L21)
