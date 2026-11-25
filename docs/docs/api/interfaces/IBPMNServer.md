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
- [addOns](IBPMNServer.md#addons)

## Properties

### engine

• **engine**: [`IEngine`](IEngine.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:12](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L12)

___

### listener

• **listener**: `EventEmitter`\<`any`\> \| `EventEmitter`\<`string` \| `symbol`, `any`\>

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:13](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L13)

___

### configuration

• **configuration**: [`IConfiguration`](IConfiguration.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:14](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L14)

___

### logger

• **logger**: [`ILogger`](ILogger.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:15](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L15)

___

### definitions

• **definitions**: [`IModelsDatastore`](IModelsDatastore.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:16](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L16)

___

### appDelegate

• **appDelegate**: [`IAppDelegate`](IAppDelegate.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:17](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L17)

___

### dataStore

• **dataStore**: [`IDataStore`](IDataStore.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L18)

___

### cache

• **cache**: [`ICacheManager`](ICacheManager.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L19)

___

### cron

• **cron**: [`ICron`](ICron.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L20)

___

### locker

• `Optional` **locker**: [`ILockManager`](ILockManager.md)

The lock port the engine uses: the configuration's `locker`, else the data store's.

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L22)

___

### documentStore

• `Optional` **documentStore**: [`IDocumentStore`](IDocumentStore.md)

The storage adapter the configuration's `documentStore` supplied, shared by the data stores; absent for the MongoDB default.

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:24](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L24)

___

### scriptHandler

• `Optional` **scriptHandler**: [`IScriptHandler`](IScriptHandler.md)

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:25](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L25)

___

### connectors

• `Optional` **connectors**: [`Connectors`](../classes/Connectors.md)

The connectors an administrator added: REST APIs that service tasks call (camunda:connector).

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:27](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L27)

___

### testStubs

• `Optional` **testStubs**: `any`

What the tests running in here replace.

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:29](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L29)

___

### addOns

• `Optional` **addOns**: [`IAddOn`](IAddOn.md)[]

What is built on the engine and plugs into its hooks (engine/AddOns.ts): by default the policies.

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L31)
