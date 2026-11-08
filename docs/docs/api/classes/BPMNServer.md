[bpmn-server](../readme.md) / BPMNServer

# Class: BPMNServer

Process-wide error handling belongs to the host.

## Implements

- [`IBPMNServer`](../interfaces/IBPMNServer.md)

## Table of contents

### Constructors

- [constructor](BPMNServer.md#constructor)

### Properties

- [legacyInstance](BPMNServer.md#legacyinstance)
- [engine](BPMNServer.md#engine)
- [listener](BPMNServer.md#listener)
- [configuration](BPMNServer.md#configuration)
- [logger](BPMNServer.md#logger)
- [definitions](BPMNServer.md#definitions)
- [appDelegate](BPMNServer.md#appdelegate)
- [dataStore](BPMNServer.md#datastore)
- [cache](BPMNServer.md#cache)
- [scriptHandler](BPMNServer.md#scripthandler)
- [cron](BPMNServer.md#cron)
- [documentStore](BPMNServer.md#documentstore)
- [locker](BPMNServer.md#locker)
- [connectors](BPMNServer.md#connectors)
- [testStubs](BPMNServer.md#teststubs)
- [error](BPMNServer.md#error)
- [ready](BPMNServer.md#ready)
- [shuttingDown](BPMNServer.md#shuttingdown)

### Accessors

- [engine](BPMNServer.md#engine-1)

### Methods

- [launch](BPMNServer.md#launch)
- [create](BPMNServer.md#create)
- [start](BPMNServer.md#start)
- [onLifecycle](BPMNServer.md#onlifecycle)
- [shutdown](BPMNServer.md#shutdown)
- [stop](BPMNServer.md#stop)
- [report](BPMNServer.md#report)
- [status](BPMNServer.md#status)
- [getInstance](BPMNServer.md#getinstance)
- [getVersion](BPMNServer.md#getversion)

## Constructors

### constructor

• **new BPMNServer**(`configuration`, `logger?`, `options?`): [`BPMNServer`](BPMNServer.md)

Server Constructor: builds the server's components and starts it; `ready` says when it has started.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `configuration` | [`IConfiguration`](../interfaces/IConfiguration.md) | see |
| `logger?` | [`ILogger`](../interfaces/ILogger.md) |  |
| `options` | `Object` | - |

#### Returns

[`BPMNServer`](BPMNServer.md)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:107](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L107)

## Properties

### legacyInstance

▪ `Static` `Private` **legacyInstance**: [`BPMNServer`](BPMNServer.md)

Legacy static access retained for existing consumers; new integrations use instances.

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:49](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L49)

___

### engine

• **engine**: [`Engine`](Engine.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[engine](../interfaces/IBPMNServer.md#engine)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:52](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L52)

___

### listener

• **listener**: [`Listener`](Listener.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[listener](../interfaces/IBPMNServer.md#listener)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:53](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L53)

___

### configuration

• **configuration**: [`IConfiguration`](../interfaces/IConfiguration.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[configuration](../interfaces/IBPMNServer.md#configuration)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:54](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L54)

___

### logger

• **logger**: [`ILogger`](../interfaces/ILogger.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[logger](../interfaces/IBPMNServer.md#logger)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:55](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L55)

___

### definitions

• **definitions**: `any`

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[definitions](../interfaces/IBPMNServer.md#definitions)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:56](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L56)

___

### appDelegate

• **appDelegate**: [`IAppDelegate`](../interfaces/IAppDelegate.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[appDelegate](../interfaces/IBPMNServer.md#appdelegate)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:57](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L57)

___

### dataStore

• **dataStore**: [`IDataStore`](../interfaces/IDataStore.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[dataStore](../interfaces/IBPMNServer.md#datastore)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:58](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L58)

___

### cache

• **cache**: [`ICacheManager`](../interfaces/ICacheManager.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[cache](../interfaces/IBPMNServer.md#cache)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:59](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L59)

___

### scriptHandler

• **scriptHandler**: [`IScriptHandler`](../interfaces/IScriptHandler.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[scriptHandler](../interfaces/IBPMNServer.md#scripthandler)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:60](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L60)

___

### cron

• **cron**: [`Cron`](Cron.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[cron](../interfaces/IBPMNServer.md#cron)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:61](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L61)

___

### documentStore

• `Optional` **documentStore**: [`IDocumentStore`](../interfaces/IDocumentStore.md)

The configuration's storage adapter, shared by the data stores (absent: each opens MongoDB).

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[documentStore](../interfaces/IBPMNServer.md#documentstore)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:63](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L63)

___

### locker

• **locker**: [`ILockManager`](../interfaces/ILockManager.md)

The lock port the engine uses.

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[locker](../interfaces/IBPMNServer.md#locker)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:65](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L65)

___

### connectors

• **connectors**: [`Connectors`](Connectors.md)

The connectors an administrator added: REST APIs service tasks call (docs/docs/connectors.md).

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[connectors](../interfaces/IBPMNServer.md#connectors)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:67](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L67)

___

### testStubs

• **testStubs**: [`TestStubs`](TestStubs.md)

What the tests running in here replace: no call of the engine reaches them.

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[testStubs](../interfaces/IBPMNServer.md#teststubs)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:69](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L69)

___

### error

• **error**: `any`

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:70](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L70)

___

### ready

• `Readonly` **ready**: `Promise`\<`void`\>

Settles when the server has started: the application delegate's start-up, then (unless `cron: false`) the timers. Rejects with the reason it could not start.

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:72](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L72)

___

### shuttingDown

• `Private` **shuttingDown**: `Promise`\<`void`\> = `null`

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:73](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L73)

## Accessors

### engine

• `get` **engine**(): [`Engine`](Engine.md)

#### Returns

[`Engine`](Engine.md)

**`Deprecated`**

Prefer server.engine.

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:189](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L189)

## Methods

### launch

▸ **launch**(`configuration`, `logger?`, `options?`): [`LaunchedServer`](LaunchedServer.md)

Launches a server, instead of embedding one as `new BPMNServer` does: what you get is outside its engine, and answers
data, not running executions. The delegate and services are inside the engine, and keep them.
`engine` says where the engine is: left out, in this process; `'http://...'`, there (startEngineService, with `engineKey`);
`'none'`, nowhere: models can be edited and saved, and what would run answers EngineNotRunningError.
`calls` adds to what the engine in this process can be asked; an engine elsewhere has its own (startEngineService's `calls`).

#### Parameters

| Name | Type |
| :------ | :------ |
| `configuration` | [`IConfiguration`](../interfaces/IConfiguration.md) |
| `logger?` | [`ILogger`](../interfaces/ILogger.md) |
| `options` | `Object` |
| `options.engine?` | `string` |
| `options.engineKey?` | `string` |
| `options.engineTimeout?` | `number` |
| `options.calls?` | (`server`: [`BPMNServer`](BPMNServer.md)) => `Record`\<`string`, (...`args`: `any`[]) => `Promise`\<`any`\>\> |
| `options.cron?` | `boolean` |

#### Returns

[`LaunchedServer`](LaunchedServer.md)

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:85](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L85)

___

### create

▸ **create**(`configuration`, `logger?`, `options?`): `Promise`\<[`BPMNServer`](BPMNServer.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configuration` | [`IConfiguration`](../interfaces/IConfiguration.md) |
| `logger?` | [`ILogger`](../interfaces/ILogger.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`BPMNServer`](BPMNServer.md)\>

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:94](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L94)

___

### start

▸ **start**(`options`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:136](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L136)

___

### onLifecycle

▸ **onLifecycle**(`listener`): () => `void`

Subscribe without coupling the engine to application implementations.

#### Parameters

| Name | Type |
| :------ | :------ |
| `listener` | [`ILifecycleListener`](../interfaces/ILifecycleListener.md) |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:142](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L142)

___

### shutdown

▸ **shutdown**(): `Promise`\<`void`\>

Stops the server, once however often it is called: new engine calls are refused, its timers
cancelled, running executions given `shutdownTimeout` ms to finish (then left to the locks'
stale age), its cache, listeners and subscriptions cleared, and its connections closed.

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:150](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L150)

___

### stop

▸ **stop**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:154](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L154)

___

### report

▸ **report**(`error`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:169](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L169)

___

### status

▸ **status**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `version` | `any` |
| `cache` | `any` |
| `engineRunning` | `number` |
| `engineCalls` | `number` |
| `timers` | \{ `pending`: `number` ; `scheduled`: `number` = 0; `fired`: `number` = 0; `skipped`: `number` = 0; `failed`: `number` = 0 } |
| `timers.pending` | `number` |
| `timers.scheduled` | `number` |
| `timers.fired` | `number` |
| `timers.skipped` | `number` |
| `timers.failed` | `number` |
| `memoryUsage` | `MemoryUsage` |

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:173](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L173)

___

### getInstance

▸ **getInstance**(): [`BPMNServer`](BPMNServer.md)

#### Returns

[`BPMNServer`](BPMNServer.md)

**`Deprecated`**

Prefer the instance returned by the constructor or `create`.

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:184](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L184)

___

### getVersion

▸ **getVersion**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/server/BPMNServer.ts:190](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/BPMNServer.ts#L190)
