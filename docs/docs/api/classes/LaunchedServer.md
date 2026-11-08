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

[packages/bpmn-server/src/server/LaunchedServer.ts:155](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L155)

## Properties

### #server

• `Private` **#server**: [`BPMNServer`](BPMNServer.md)

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:150](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L150)

___

### #ready

• `Private` **#ready**: `any`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:151](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L151)

___

### engine

• `Readonly` **engine**: [`LaunchedEngine`](LaunchedEngine.md)

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:152](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L152)

___

### appDelegate

• `Readonly` **appDelegate**: `ApplicationFacts`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:153](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L153)

## Accessors

### ready

• `get` **ready**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:168](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L168)

___

### configuration

• `get` **configuration**(): [`IConfiguration`](../interfaces/IConfiguration.md)

#### Returns

[`IConfiguration`](../interfaces/IConfiguration.md)

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:169](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L169)

___

### logger

• `get` **logger**(): [`ILogger`](../interfaces/ILogger.md)

#### Returns

[`ILogger`](../interfaces/ILogger.md)

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:170](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L170)

___

### dataStore

• `get` **dataStore**(): [`IDataStore`](../interfaces/IDataStore.md)

#### Returns

[`IDataStore`](../interfaces/IDataStore.md)

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:171](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L171)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:172](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L172)

___

### connectors

• `get` **connectors**(): [`Connectors`](Connectors.md)

#### Returns

[`Connectors`](Connectors.md)

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:173](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L173)

___

### scriptHandler

• `get` **scriptHandler**(): [`IScriptHandler`](../interfaces/IScriptHandler.md)

Which handler checks a model's scripts, and the variables it adds.

#### Returns

[`IScriptHandler`](../interfaces/IScriptHandler.md)

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:175](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L175)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:176](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L176)

___

### shutdown

▸ **shutdown**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:177](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L177)
