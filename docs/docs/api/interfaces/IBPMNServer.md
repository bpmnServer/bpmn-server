[bpmn-server](../readme.md) / IBPMNServer

# Interface: IBPMNServer

## Implemented by

- [`BPMNServer`](../classes/BPMNServer.md)

## Table of contents

### Properties

- [engine](IBPMNServer.md#engine)
- [listener](IBPMNServer.md#listener)
- [configuration](IBPMNServer.md#configuration)
- [logger](IBPMNServer.md#logger)
- [definitions](IBPMNServer.md#definitions)
- [appDelegate](IBPMNServer.md#appdelegate)
- [dataStore](IBPMNServer.md#datastore)
- [cache](IBPMNServer.md#cache)
- [cron](IBPMNServer.md#cron)
- [locker](IBPMNServer.md#locker)
- [documentStore](IBPMNServer.md#documentstore)
- [scriptHandler](IBPMNServer.md#scripthandler)
- [connectors](IBPMNServer.md#connectors)
- [testStubs](IBPMNServer.md#teststubs)

## Properties

### engine

• **engine**: [`IEngine`](IEngine.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:11](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L11)

___

### listener

• **listener**: `EventEmitter`\<`any`\> \| `EventEmitter`\<`string` \| `symbol`, `any`\>

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:12](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L12)

___

### configuration

• **configuration**: [`IConfiguration`](IConfiguration.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L13)

___

### logger

• **logger**: [`ILogger`](ILogger.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L14)

___

### definitions

• **definitions**: [`IModelsDatastore`](IModelsDatastore.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L15)

___

### appDelegate

• **appDelegate**: [`IAppDelegate`](IAppDelegate.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L16)

___

### dataStore

• **dataStore**: [`IDataStore`](IDataStore.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L17)

___

### cache

• **cache**: [`ICacheManager`](ICacheManager.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L18)

___

### cron

• **cron**: [`ICron`](ICron.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L19)

___

### locker

• `Optional` **locker**: [`ILockManager`](ILockManager.md)

The lock port the engine uses: the configuration's `locker`, else the data store's.

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L21)

___

### documentStore

• `Optional` **documentStore**: [`IDocumentStore`](IDocumentStore.md)

The storage adapter the configuration's `documentStore` supplied, shared by the data stores; absent for the MongoDB default.

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L23)

___

### scriptHandler

• `Optional` **scriptHandler**: [`IScriptHandler`](IScriptHandler.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L24)

___

### connectors

• `Optional` **connectors**: [`Connectors`](../classes/Connectors.md)

The connectors an administrator added: REST APIs that service tasks call (camunda:connector).

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L26)

___

### testStubs

• `Optional` **testStubs**: `any`

What the tests running in here replace.

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L28)
