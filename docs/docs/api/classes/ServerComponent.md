[bpmn-server](../readme.md) / ServerComponent

# Class: ServerComponent

super class for various objects that are part of the server

## Hierarchy

- **`ServerComponent`**

  ↳ [`Execution`](Execution.md)

  ↳ [`Cron`](Cron.md)

  ↳ [`CacheManager`](CacheManager.md)

  ↳ [`NoCacheManager`](NoCacheManager.md)

  ↳ [`Engine`](Engine.md)

  ↳ [`DataStore`](DataStore.md)

  ↳ [`ModelsDatastoreDB`](ModelsDatastoreDB.md)

## Table of contents

### Constructors

- [constructor](ServerComponent.md#constructor)

### Properties

- [server](ServerComponent.md#server)

### Accessors

- [configuration](ServerComponent.md#configuration)
- [logger](ServerComponent.md#logger)
- [cron](ServerComponent.md#cron)
- [cache](ServerComponent.md#cache)
- [appDelegate](ServerComponent.md#appdelegate)
- [engine](ServerComponent.md#engine)
- [dataStore](ServerComponent.md#datastore)
- [definitions](ServerComponent.md#definitions)
- [listener](ServerComponent.md#listener)

## Constructors

### constructor

• **new ServerComponent**(`server`): [`ServerComponent`](ServerComponent.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`IBPMNServer`](../interfaces/IBPMNServer.md) |

#### Returns

[`ServerComponent`](ServerComponent.md)

#### Defined in

[server/ServerComponent.ts:10](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L10)

## Properties

### server

• **server**: `any`

#### Defined in

[server/ServerComponent.ts:9](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L9)

## Accessors

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Defined in

[server/ServerComponent.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L14)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Defined in

[server/ServerComponent.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L15)

___

### cron

• `get` **cron**(): [`Cron`](Cron.md)

#### Returns

[`Cron`](Cron.md)

#### Defined in

[server/ServerComponent.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L16)

___

### cache

• `get` **cache**(): [`CacheManager`](CacheManager.md)

#### Returns

[`CacheManager`](CacheManager.md)

#### Defined in

[server/ServerComponent.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L17)

___

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Defined in

[server/ServerComponent.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L18)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/IEngine.md)

#### Returns

[`IEngine`](../interfaces/IEngine.md)

#### Defined in

[server/ServerComponent.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L19)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Defined in

[server/ServerComponent.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L20)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Defined in

[server/ServerComponent.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L21)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Defined in

[server/ServerComponent.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L22)
