[bpmn-server](../readme.md) / Configuration

# Class: Configuration

## Implements

- [`IConfiguration`](../interfaces/IConfiguration.md)

## Table of contents

### Constructors

- [constructor](Configuration.md#constructor)

### Properties

- [definitionsPath](Configuration.md#definitionspath)
- [templatesPath](Configuration.md#templatespath)
- [timers](Configuration.md#timers)
- [database](Configuration.md#database)
- [logger](Configuration.md#logger)
- [apiKey](Configuration.md#apikey)
- [moddleOptions](Configuration.md#moddleoptions)
- [servicesFile](Configuration.md#servicesfile)
- [sendGridAPIKey](Configuration.md#sendgridapikey)
- [serverId](Configuration.md#serverid)
- [locks](Configuration.md#locks)
- [shutdownTimeout](Configuration.md#shutdowntimeout)
- [demo](Configuration.md#demo)
- [runTimers](Configuration.md#runtimers)
- [runServiceTasks](Configuration.md#runservicetasks)
- [connectors](Configuration.md#connectors)
- [modelHistory](Configuration.md#modelhistory)

### Methods

- [definitions](Configuration.md#definitions)
- [appDelegate](Configuration.md#appdelegate)
- [dataStore](Configuration.md#datastore)
- [cacheManager](Configuration.md#cachemanager)
- [scriptHandler](Configuration.md#scripthandler)
- [documentStore](Configuration.md#documentstore)
- [locker](Configuration.md#locker)

## Constructors

### constructor

• **new Configuration**(`«destructured»`): [`Configuration`](Configuration.md)

Each factory given replaces the default one; one left out keeps it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `any` |

#### Returns

[`Configuration`](Configuration.md)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:63](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L63)

## Properties

### definitionsPath

• `Optional` **definitionsPath**: `string`

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[definitionsPath](../interfaces/IConfiguration.md#definitionspath)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L16)

___

### templatesPath

• `Optional` **templatesPath**: `string`

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[templatesPath](../interfaces/IConfiguration.md#templatespath)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L17)

___

### timers

• **timers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `forceTimersDelay` | `number` |
| `precision` | `number` |

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[timers](../interfaces/IConfiguration.md#timers)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L18)

___

### database

• **database**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `MongoDB` | \{ `db_url`: `string` ; `db`: `string` ; `Locks_collection`: ``"wf_locks"`` ; `Instance_collection`: ``"wf_instances"`` ; `Archive_collection`: ``"wf_archives"``  } |
| `MongoDB.db_url` | `string` |
| `MongoDB.db` | `string` |
| `MongoDB.Locks_collection` | ``"wf_locks"`` |
| `MongoDB.Instance_collection` | ``"wf_instances"`` |
| `MongoDB.Archive_collection` | ``"wf_archives"`` |
| `loopbackRepositories?` | `any` |

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[database](../interfaces/IConfiguration.md#database)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L19)

___

### logger

• **logger**: [`ILogger`](../interfaces/ILogger.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[logger](../interfaces/IConfiguration.md#logger)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L29)

___

### apiKey

• **apiKey**: `string`

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[apiKey](../interfaces/IConfiguration.md#apikey)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L30)

___

### moddleOptions

• `Optional` **moddleOptions**: `any`

Extensions to the BPMN model's types (bpmn-moddle's); reading a model needs them, in and out of the engine.

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[moddleOptions](../interfaces/IConfiguration.md#moddleoptions)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:31](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L31)

___

### servicesFile

• `Optional` **servicesFile**: `string`

The names of the application's services (scanServices in bpmn-web), for what checks models outside the engine. Default: services.json in the current folder.

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[servicesFile](../interfaces/IConfiguration.md#servicesfile)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L32)

___

### sendGridAPIKey

• **sendGridAPIKey**: `string`

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:33](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L33)

___

### serverId

• `Optional` **serverId**: `string`

This process's identity as a lock owner (default `SERVER_ID`, else host, process id and a random suffix).

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[serverId](../interfaces/IConfiguration.md#serverid)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:53](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L53)

___

### locks

• `Optional` **locks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `retryDelay?` | `number` |
| `maxTries?` | `number` |
| `staleAfter?` | `number` |

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[locks](../interfaces/IConfiguration.md#locks)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:54](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L54)

___

### shutdownTimeout

• `Optional` **shutdownTimeout**: `number`

How long `shutdown()` waits for running executions, in milliseconds (10000).

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[shutdownTimeout](../interfaces/IConfiguration.md#shutdowntimeout)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:55](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L55)

___

### demo

• `Optional` **demo**: `boolean`

**`Deprecated`**

Both of the above false. Set them instead.

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[demo](../interfaces/IConfiguration.md#demo)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:56](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L56)

___

### runTimers

• `Optional` **runTimers**: `boolean`

false: timers are never scheduled: a timer event waits until it is invoked, and no process starts on a timer. It
says so in the run's decisions. Default true.

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[runTimers](../interfaces/IConfiguration.md#runtimers)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:57](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L57)

___

### runServiceTasks

• `Optional` **runServiceTasks**: `boolean`

false: service tasks call nothing: they end with no output, and say so in the run's decisions. Default true.

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[runServiceTasks](../interfaces/IConfiguration.md#runservicetasks)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:58](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L58)

___

### connectors

• `Optional` **connectors**: [`IConnectorsConfiguration`](../interfaces/IConnectorsConfiguration.md)

Connectors' calls (docs/docs/connectors.md): the defaults a connector's own timeout and retries override.

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[connectors](../interfaces/IConfiguration.md#connectors)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:59](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L59)

___

### modelHistory

• `Optional` **modelHistory**: `boolean`

Each save of a model keeps a version in `.history/<name>/` beside it, for the editor's History tab (default true).

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[modelHistory](../interfaces/IConfiguration.md#modelhistory)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:60](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L60)

## Methods

### definitions

▸ **definitions**(`server`): [`ModelsDatastore`](ModelsDatastore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`ModelsDatastore`](ModelsDatastore.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[definitions](../interfaces/IConfiguration.md#definitions)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L34)

___

### appDelegate

▸ **appDelegate**(`server`): [`IAppDelegate`](../interfaces/IAppDelegate.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IAppDelegate`](../interfaces/IAppDelegate.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[appDelegate](../interfaces/IConfiguration.md#appdelegate)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L37)

___

### dataStore

▸ **dataStore**(`server`): [`IDataStore`](../interfaces/IDataStore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IDataStore`](../interfaces/IDataStore.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[dataStore](../interfaces/IConfiguration.md#datastore)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:40](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L40)

___

### cacheManager

▸ **cacheManager**(`server`): [`NoCacheManager`](NoCacheManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`NoCacheManager`](NoCacheManager.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[cacheManager](../interfaces/IConfiguration.md#cachemanager)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:43](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L43)

___

### scriptHandler

▸ **scriptHandler**(`server`): [`ScriptHandler`](ScriptHandler.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`ScriptHandler`](ScriptHandler.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[scriptHandler](../interfaces/IConfiguration.md#scripthandler)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:46](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L46)

___

### documentStore

▸ **documentStore**(`server`): [`IDocumentStore`](../interfaces/IDocumentStore.md)

The storage adapter both data stores use (MongoDB when absent): an in-memory store, an application's database.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IDocumentStore`](../interfaces/IDocumentStore.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[documentStore](../interfaces/IConfiguration.md#documentstore)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:51](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L51)

___

### locker

▸ **locker**(`server`): [`ILockManager`](../interfaces/ILockManager.md)

The lock adapter (the data store's own when absent).

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`ILockManager`](../interfaces/ILockManager.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[locker](../interfaces/IConfiguration.md#locker)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:52](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L52)
