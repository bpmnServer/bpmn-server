[bpmn-server](../readme.md) / IConfiguration

# Interface: IConfiguration

## Implemented by

- [`Configuration`](../classes/Configuration.md)

## Table of contents

### Properties

- [definitionsPath](IConfiguration.md#definitionspath)
- [templatesPath](IConfiguration.md#templatespath)
- [timers](IConfiguration.md#timers)
- [database](IConfiguration.md#database)
- [apiKey](IConfiguration.md#apikey)
- [moddleOptions](IConfiguration.md#moddleoptions)
- [servicesFile](IConfiguration.md#servicesfile)
- [logger](IConfiguration.md#logger)
- [serverId](IConfiguration.md#serverid)
- [locks](IConfiguration.md#locks)
- [shutdownTimeout](IConfiguration.md#shutdowntimeout)
- [runTimers](IConfiguration.md#runtimers)
- [runServiceTasks](IConfiguration.md#runservicetasks)
- [demo](IConfiguration.md#demo)
- [modelHistory](IConfiguration.md#modelhistory)
- [connectors](IConfiguration.md#connectors)

### Methods

- [definitions](IConfiguration.md#definitions)
- [appDelegate](IConfiguration.md#appdelegate)
- [dataStore](IConfiguration.md#datastore)
- [scriptHandler](IConfiguration.md#scripthandler)
- [cacheManager](IConfiguration.md#cachemanager)
- [documentStore](IConfiguration.md#documentstore)
- [locker](IConfiguration.md#locker)

## Properties

### definitionsPath

• `Optional` **definitionsPath**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:10](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L10)

___

### templatesPath

• `Optional` **templatesPath**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:11](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L11)

___

### timers

• **timers**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `forceTimersDelay?` | `number` | - |
| `precision?` | `number` | - |
| `pollInterval?` | `number` | Milliseconds between re-reads of waiting timers, so a timer another server scheduled is fired here when that server is gone (0: never; default 60000). |

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:12](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L12)

___

### database

• **database**: `IMongoDBDatabaseConfiguration` \| `ISQLiteDatabaseConfiguration`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L18)

___

### apiKey

• **apiKey**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L19)

___

### moddleOptions

• `Optional` **moddleOptions**: `any`

Extensions to the BPMN model's types (bpmn-moddle's); reading a model needs them, in and out of the engine.

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L21)

___

### servicesFile

• `Optional` **servicesFile**: `string`

The names of the application's services (scanServices in bpmn-web), for what checks models outside the engine. Default: services.json in the current folder.

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L23)

___

### logger

• **logger**: [`ILogger`](ILogger.md)

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L24)

___

### serverId

• `Optional` **serverId**: `string`

This process's identity as a lock owner (default `SERVER_ID`, else host, process id and a random suffix).

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L35)

___

### locks

• `Optional` **locks**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `retryDelay?` | `number` | Milliseconds between lock tries (1500). |
| `maxTries?` | `number` | Tries before a lock gives up (20). |
| `staleAfter?` | `number` | Milliseconds after which a lock or a timer claim is stale (300000). |

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:36](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L36)

___

### shutdownTimeout

• `Optional` **shutdownTimeout**: `number`

How long `shutdown()` waits for running executions, in milliseconds (10000).

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:45](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L45)

___

### runTimers

• `Optional` **runTimers**: `boolean`

false: timers are never scheduled: a timer event waits until it is invoked, and no process starts on a timer. It
says so in the run's decisions. Default true.

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:50](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L50)

___

### runServiceTasks

• `Optional` **runServiceTasks**: `boolean`

false: service tasks call nothing: they end with no output, and say so in the run's decisions. Default true.

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:52](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L52)

___

### demo

• `Optional` **demo**: `boolean`

**`Deprecated`**

Both of the above false. Set them instead.

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:54](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L54)

___

### modelHistory

• `Optional` **modelHistory**: `boolean`

Each save of a model keeps a version in `.history/<name>/` beside it, for the editor's History tab (default true).

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:56](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L56)

___

### connectors

• `Optional` **connectors**: [`IConnectorsConfiguration`](IConnectorsConfiguration.md)

Connectors' calls (docs/docs/connectors.md): the defaults a connector's own timeout and retries override.

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:58](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L58)

## Methods

### definitions

▸ **definitions**(`server`): [`IModelsDatastore`](IModelsDatastore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IModelsDatastore`](IModelsDatastore.md)

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L25)

___

### appDelegate

▸ **appDelegate**(`server`): [`IAppDelegate`](IAppDelegate.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IAppDelegate`](IAppDelegate.md)

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L26)

___

### dataStore

▸ **dataStore**(`server`): [`IDataStore`](IDataStore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IDataStore`](IDataStore.md)

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:27](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L27)

___

### scriptHandler

▸ **scriptHandler**(`server`): [`IScriptHandler`](IScriptHandler.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IScriptHandler`](IScriptHandler.md)

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L28)

___

### cacheManager

▸ **cacheManager**(`server`): [`ICacheManager`](ICacheManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`ICacheManager`](ICacheManager.md)

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L29)

___

### documentStore

▸ **documentStore**(`server`): [`IDocumentStore`](IDocumentStore.md)

The storage adapter both data stores use (MongoDB when absent): an in-memory store, an application's database.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IDocumentStore`](IDocumentStore.md)

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:31](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L31)

___

### locker

▸ **locker**(`server`): [`ILockManager`](ILockManager.md)

The lock adapter (the data store's own when absent).

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`ILockManager`](ILockManager.md)

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:33](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L33)
