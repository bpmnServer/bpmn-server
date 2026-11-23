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
- [delegateFile](IConfiguration.md#delegatefile)
- [serviceNames](IConfiguration.md#servicenames)
- [servicesFile](IConfiguration.md#servicesfile)
- [logger](IConfiguration.md#logger)
- [appConfig](IConfiguration.md#appconfig)
- [serverId](IConfiguration.md#serverid)
- [locks](IConfiguration.md#locks)
- [shutdownTimeout](IConfiguration.md#shutdowntimeout)
- [runTimers](IConfiguration.md#runtimers)
- [runServiceTasks](IConfiguration.md#runservicetasks)
- [demo](IConfiguration.md#demo)
- [modelHistory](IConfiguration.md#modelhistory)
- [formRules](IConfiguration.md#formrules)
- [connectors](IConfiguration.md#connectors)

### Methods

- [definitions](IConfiguration.md#definitions)
- [appDelegate](IConfiguration.md#appdelegate)
- [dataStore](IConfiguration.md#datastore)
- [scriptHandler](IConfiguration.md#scripthandler)
- [cacheManager](IConfiguration.md#cachemanager)
- [documentStore](IConfiguration.md#documentstore)
- [locker](IConfiguration.md#locker)
- [addOns](IConfiguration.md#addons)
- [addOnManifests](IConfiguration.md#addonmanifests)

## Properties

### definitionsPath

• `Optional` **definitionsPath**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:11](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L11)

___

### templatesPath

• `Optional` **templatesPath**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:12](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L12)

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

[packages/bpmn-server/src/interfaces/common.ts:13](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L13)

___

### database

• **database**: `IMongoDBDatabaseConfiguration` \| `ISQLiteDatabaseConfiguration`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L19)

___

### apiKey

• **apiKey**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L20)

___

### moddleOptions

• `Optional` **moddleOptions**: `any`

Extensions to the BPMN model's types (bpmn-moddle's); reading a model needs them, in and out of the engine.

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L22)

___

### delegateFile

• `Optional` **delegateFile**: `string`

Where the application's delegate's source is, read at start for its services' names (default delegates/appDelegate.ts).

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:24](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L24)

___

### serviceNames

• `Optional` **serviceNames**: `string`[] \| `Promise`\<`string`[]\>

The names of the application's services, read from the delegate's source at start (bpmn-web: runtime/serviceNames.ts),
for what checks models outside the engine; null when it could not be read (the engine is asked instead).

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:29](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L29)

___

### servicesFile

• `Optional` **servicesFile**: `string`

No longer read (before 3.7.2: a services.json the scan wrote); the names come from the delegate's source.

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L31)

___

### logger

• **logger**: [`ILogger`](ILogger.md)

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:32](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L32)

___

### appConfig

• `Optional` **appConfig**: `string`

Where the application's app-config.json is (which add-ons are on); the working folder's by default.

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:50](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L50)

___

### serverId

• `Optional` **serverId**: `string`

This process's identity as a lock owner (default `SERVER_ID`, else host, process id and a random suffix).

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:52](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L52)

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

[packages/bpmn-server/src/interfaces/common.ts:53](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L53)

___

### shutdownTimeout

• `Optional` **shutdownTimeout**: `number`

How long `shutdown()` waits for running executions, in milliseconds (10000).

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:62](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L62)

___

### runTimers

• `Optional` **runTimers**: `boolean`

false: timers are never scheduled: a timer event waits until it is invoked, and no process starts on a timer. It
says so in the run's decisions. Default true.

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:67](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L67)

___

### runServiceTasks

• `Optional` **runServiceTasks**: `boolean`

false: service tasks call nothing: they end with no output, and say so in the run's decisions. Default true.

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:69](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L69)

___

### demo

• `Optional` **demo**: `boolean`

**`Deprecated`**

Both of the above false. Set them instead.

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:71](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L71)

___

### modelHistory

• `Optional` **modelHistory**: `boolean`

Each save of a model keeps a version in `.history/<name>/` beside it, for the editor's History tab (default true).

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:73](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L73)

___

### formRules

• `Optional` **formRules**: `boolean`

false: a form's rules (a field's type, its constraints, a list's choices: elements/FormRules.ts) are not checked
when a user task is completed (the validate event still runs). Default true.

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:78](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L78)

___

### connectors

• `Optional` **connectors**: [`IConnectorsConfiguration`](IConnectorsConfiguration.md)

Connectors' calls (docs/docs/connectors.md): the defaults a connector's own timeout and retries override.

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:80](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L80)

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

[packages/bpmn-server/src/interfaces/common.ts:33](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L33)

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

[packages/bpmn-server/src/interfaces/common.ts:34](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L34)

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

[packages/bpmn-server/src/interfaces/common.ts:35](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L35)

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

[packages/bpmn-server/src/interfaces/common.ts:36](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L36)

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

[packages/bpmn-server/src/interfaces/common.ts:37](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L37)

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

[packages/bpmn-server/src/interfaces/common.ts:39](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L39)

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

[packages/bpmn-server/src/interfaces/common.ts:41](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L41)

___

### addOns

▸ **addOns**(`server`): [`IAddOn`](IAddOn.md)[]

What is built on the engine and plugs into its hooks (engine/AddOns.ts): by default the policies (assignment,
notification, security). `() => []`: the engine alone.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IAddOn`](IAddOn.md)[]

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:46](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L46)

___

### addOnManifests

▸ **addOnManifests**(): [`IAddOnManifest`](IAddOnManifest.md)[]

Every add-on bpmn-server comes with, on or off: their manifests (which attributes each reads).

#### Returns

[`IAddOnManifest`](IAddOnManifest.md)[]

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:48](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L48)
