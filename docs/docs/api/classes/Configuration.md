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
- [delegateFile](Configuration.md#delegatefile)
- [serviceNames](Configuration.md#servicenames)
- [sendGridAPIKey](Configuration.md#sendgridapikey)
- [appConfig](Configuration.md#appconfig)
- [serverId](Configuration.md#serverid)
- [locks](Configuration.md#locks)
- [shutdownTimeout](Configuration.md#shutdowntimeout)
- [demo](Configuration.md#demo)
- [runTimers](Configuration.md#runtimers)
- [runServiceTasks](Configuration.md#runservicetasks)
- [connectors](Configuration.md#connectors)
- [modelHistory](Configuration.md#modelhistory)
- [formRules](Configuration.md#formrules)

### Methods

- [definitions](Configuration.md#definitions)
- [appDelegate](Configuration.md#appdelegate)
- [dataStore](Configuration.md#datastore)
- [cacheManager](Configuration.md#cachemanager)
- [scriptHandler](Configuration.md#scripthandler)
- [addOns](Configuration.md#addons)
- [addOnManifests](Configuration.md#addonmanifests)
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

[packages/bpmn-server/src/common/DefaultConfiguration.ts:79](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L79)

## Properties

### definitionsPath

• `Optional` **definitionsPath**: `string`

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[definitionsPath](../interfaces/IConfiguration.md#definitionspath)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L18)

___

### templatesPath

• `Optional` **templatesPath**: `string`

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[templatesPath](../interfaces/IConfiguration.md#templatespath)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L19)

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

[packages/bpmn-server/src/common/DefaultConfiguration.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L20)

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

[packages/bpmn-server/src/common/DefaultConfiguration.ts:21](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L21)

___

### logger

• **logger**: [`ILogger`](../interfaces/ILogger.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[logger](../interfaces/IConfiguration.md#logger)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L31)

___

### apiKey

• **apiKey**: `string`

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[apiKey](../interfaces/IConfiguration.md#apikey)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:32](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L32)

___

### moddleOptions

• `Optional` **moddleOptions**: `any`

Extensions to the BPMN model's types (bpmn-moddle's); reading a model needs them, in and out of the engine.

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[moddleOptions](../interfaces/IConfiguration.md#moddleoptions)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:33](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L33)

___

### servicesFile

• `Optional` **servicesFile**: `string`

No longer read (before 3.7.2: a services.json the scan wrote); the names come from the delegate's source.

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[servicesFile](../interfaces/IConfiguration.md#servicesfile)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:34](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L34)

___

### delegateFile

• `Optional` **delegateFile**: `string`

Where the application's delegate's source is, read at start for its services' names (default delegates/appDelegate.ts).

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[delegateFile](../interfaces/IConfiguration.md#delegatefile)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:35](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L35)

___

### serviceNames

• `Optional` **serviceNames**: `string`[] \| `Promise`\<`string`[]\>

The names of the application's services, read from the delegate's source at start (bpmn-web: runtime/serviceNames.ts),
for what checks models outside the engine; null when it could not be read (the engine is asked instead).

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[serviceNames](../interfaces/IConfiguration.md#servicenames)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:36](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L36)

___

### sendGridAPIKey

• **sendGridAPIKey**: `string`

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:37](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L37)

___

### appConfig

• `Optional` **appConfig**: `string`

Where the application's app-config.json is (which add-ons are on); the working folder's by default.

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[appConfig](../interfaces/IConfiguration.md#appconfig)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:54](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L54)

___

### serverId

• `Optional` **serverId**: `string`

This process's identity as a lock owner (default `SERVER_ID`, else host, process id and a random suffix).

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[serverId](../interfaces/IConfiguration.md#serverid)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:67](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L67)

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

[packages/bpmn-server/src/common/DefaultConfiguration.ts:68](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L68)

___

### shutdownTimeout

• `Optional` **shutdownTimeout**: `number`

How long `shutdown()` waits for running executions, in milliseconds (10000).

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[shutdownTimeout](../interfaces/IConfiguration.md#shutdowntimeout)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:69](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L69)

___

### demo

• `Optional` **demo**: `boolean`

**`Deprecated`**

Both of the above false. Set them instead.

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[demo](../interfaces/IConfiguration.md#demo)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:70](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L70)

___

### runTimers

• `Optional` **runTimers**: `boolean`

false: timers are never scheduled: a timer event waits until it is invoked, and no process starts on a timer. It
says so in the run's decisions. Default true.

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[runTimers](../interfaces/IConfiguration.md#runtimers)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:71](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L71)

___

### runServiceTasks

• `Optional` **runServiceTasks**: `boolean`

false: service tasks call nothing: they end with no output, and say so in the run's decisions. Default true.

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[runServiceTasks](../interfaces/IConfiguration.md#runservicetasks)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:72](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L72)

___

### connectors

• `Optional` **connectors**: [`IConnectorsConfiguration`](../interfaces/IConnectorsConfiguration.md)

Connectors' calls (docs/docs/connectors.md): the defaults a connector's own timeout and retries override.

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[connectors](../interfaces/IConfiguration.md#connectors)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:73](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L73)

___

### modelHistory

• `Optional` **modelHistory**: `boolean`

Each save of a model keeps a version in `.history/<name>/` beside it, for the editor's History tab (default true).

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[modelHistory](../interfaces/IConfiguration.md#modelhistory)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:74](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L74)

___

### formRules

• `Optional` **formRules**: `boolean`

false: a form's rules are not checked (elements/FormRules.ts). Default true.

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[formRules](../interfaces/IConfiguration.md#formrules)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:76](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L76)

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

[packages/bpmn-server/src/common/DefaultConfiguration.ts:38](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L38)

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

[packages/bpmn-server/src/common/DefaultConfiguration.ts:41](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L41)

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

[packages/bpmn-server/src/common/DefaultConfiguration.ts:44](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L44)

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

[packages/bpmn-server/src/common/DefaultConfiguration.ts:47](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L47)

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

[packages/bpmn-server/src/common/DefaultConfiguration.ts:50](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L50)

___

### addOns

▸ **addOns**(`server`): [`IAddOn`](../interfaces/IAddOn.md)[]

The add-ons that are on (engine/AddOns.ts): those app-config.json names, every one without it; unless the configuration gives its own.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IAddOn`](../interfaces/IAddOn.md)[]

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[addOns](../interfaces/IConfiguration.md#addons)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:56](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L56)

___

### addOnManifests

▸ **addOnManifests**(): [`IAddOnManifest`](../interfaces/IAddOnManifest.md)[]

Every add-on bpmn-server comes with, on or off: their manifests.

#### Returns

[`IAddOnManifest`](../interfaces/IAddOnManifest.md)[]

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[addOnManifests](../interfaces/IConfiguration.md#addonmanifests)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:60](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L60)

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

[packages/bpmn-server/src/common/DefaultConfiguration.ts:65](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L65)

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

[packages/bpmn-server/src/common/DefaultConfiguration.ts:66](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L66)
