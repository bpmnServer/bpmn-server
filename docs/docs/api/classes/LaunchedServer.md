[bpmn-server](../readme.md) / LaunchedServer

# Class: LaunchedServer

What `BPMNServer.launch(...)` gives: a server seen from outside its engine, with data only.
`new BPMNServer(...)` embeds the engine instead: the caller is inside, and gets running executions.

Where its engine is: in this process (by default), at an address (`engine: 'http://...'`, startEngineService there), or
nowhere (`engine: 'none'`). All the same from here, but that without one what would run says so.

Known gap: `dataStore` and `definitions` are the engine's own classes, each with a `.server` that leads to a server of
this process (holding the engine, when it is the one in this process).

## Table of contents

### Constructors

- [constructor](LaunchedServer.md#constructor)

### Properties

- [#server](LaunchedServer.md##server)
- [#ready](LaunchedServer.md##ready)
- [engine](LaunchedServer.md#engine)
- [appDelegate](LaunchedServer.md#appdelegate)

### Accessors

- [ready](LaunchedServer.md#ready)
- [configuration](LaunchedServer.md#configuration)
- [logger](LaunchedServer.md#logger)
- [dataStore](LaunchedServer.md#datastore)
- [definitions](LaunchedServer.md#definitions)
- [connectors](LaunchedServer.md#connectors)
- [documentStore](LaunchedServer.md#documentstore)
- [models](LaunchedServer.md#models)
- [scriptHandler](LaunchedServer.md#scripthandler)

### Methods

- [status](LaunchedServer.md#status)
- [shutdown](LaunchedServer.md#shutdown)

## Constructors

### constructor

• **new LaunchedServer**(`server`, `options?`): [`LaunchedServer`](LaunchedServer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`BPMNServer`](BPMNServer.md) |
| `options` | `Object` |
| `options.engine?` | `string` |
| `options.engineKey?` | `string` |
| `options.engineTimeout?` | `number` |
| `options.calls?` | (`server`: [`BPMNServer`](BPMNServer.md)) => `Record`\<`string`, (...`args`: `any`[]) => `Promise`\<`any`\>\> |

#### Returns

[`LaunchedServer`](LaunchedServer.md)

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:218](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L218)

## Properties

### #server

• `Private` **#server**: [`BPMNServer`](BPMNServer.md)

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:213](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L213)

___

### #ready

• `Private` **#ready**: `any`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:214](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L214)

___

### engine

• `Readonly` **engine**: [`LaunchedEngine`](LaunchedEngine.md)

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:215](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L215)

___

### appDelegate

• `Readonly` **appDelegate**: `ApplicationFacts`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:216](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L216)

## Accessors

### ready

• `get` **ready**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:234](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L234)

___

### configuration

• `get` **configuration**(): [`IConfiguration`](../interfaces/IConfiguration.md)

#### Returns

[`IConfiguration`](../interfaces/IConfiguration.md)

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:235](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L235)

___

### logger

• `get` **logger**(): [`ILogger`](../interfaces/ILogger.md)

#### Returns

[`ILogger`](../interfaces/ILogger.md)

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:236](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L236)

___

### dataStore

• `get` **dataStore**(): `any`

The instance viewer: instances, their items and locks, read only (docs/design/engine-isolation.md). Writing them
is the engine's (`engine`); the raw store is not here (`documentStore` is the host's own, for its own data).

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:241](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L241)

___

### definitions

• `get` **definitions**(): `any`

Model access: the models' files (read and written, with no database), and the engine's index read only.

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:254](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L254)

___

### connectors

• `get` **connectors**(): `any`

The connectors: their files (model access's); their keys and tests the engine's.

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:262](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L262)

___

### documentStore

• `get` **documentStore**(): `any`

The host's own store, for what is the host's (users, sessions, API tokens): not the engine's collections.

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:271](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L271)

___

### models

• `get` **models**(): `Object`

The models, as the host changes them (docs/design/engine-isolation.md): model access writes their files, with no
database, and the engine updates its index of them. Models kept in the database alone (no folder) are saved there.

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `save` | (`name`: `string`, `source`: `string`, `svg?`: `string`, `savedBy?`: `string`) => `Promise`\<`any`\> | - |
| `rename` | (`name`: `string`, `newName`: `string`) => `Promise`\<`any`\> | - |
| `remove` | (`name`: `string`) => `Promise`\<`any`\> | - |
| `deleteVersion` | (`name`: `string`, `version`: `number`) => `any` | - |

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:276](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L276)

___

### scriptHandler

• `get` **scriptHandler**(): [`IScriptHandler`](../interfaces/IScriptHandler.md)

Which handler checks a model's scripts, and the variables it adds.

#### Returns

[`IScriptHandler`](../interfaces/IScriptHandler.md)

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:305](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L305)

## Methods

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

[packages/bpmn-server/src/server/LaunchedServer.ts:306](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L306)

___

### shutdown

▸ **shutdown**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:307](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L307)
