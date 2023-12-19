[bpmn-server](../README.md) / [Exports](../modules.md) / [interfaces/server](../modules/interfaces_server.md) / IBPMNServer

# Interface: IBPMNServer

[interfaces/server](../modules/interfaces_server.md).IBPMNServer

## Implemented by

- [`BPMNServer`](../classes/server_BPMNServer.BPMNServer.md)

## Table of contents

### Properties

- [appDelegate](interfaces_server.IBPMNServer.md#appdelegate)
- [cache](interfaces_server.IBPMNServer.md#cache)
- [configuration](interfaces_server.IBPMNServer.md#configuration)
- [cron](interfaces_server.IBPMNServer.md#cron)
- [dataStore](interfaces_server.IBPMNServer.md#datastore)
- [definitions](interfaces_server.IBPMNServer.md#definitions)
- [engine](interfaces_server.IBPMNServer.md#engine)
- [listener](interfaces_server.IBPMNServer.md#listener)
- [logger](interfaces_server.IBPMNServer.md#logger)
- [userService](interfaces_server.IBPMNServer.md#userservice)

## Properties

### appDelegate

• **appDelegate**: [`IAppDelegate`](interfaces_common.IAppDelegate.md)

#### Defined in

[src/interfaces/server.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L13)

___

### cache

• **cache**: [`ICacheManager`](interfaces_server.ICacheManager.md)

#### Defined in

[src/interfaces/server.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L15)

___

### configuration

• **configuration**: [`IConfiguration`](interfaces_common.IConfiguration.md)

#### Defined in

[src/interfaces/server.ts:10](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L10)

___

### cron

• **cron**: [`ICron`](interfaces_server.ICron.md)

#### Defined in

[src/interfaces/server.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L16)

___

### dataStore

• **dataStore**: [`IDataStore`](interfaces_datastore.IDataStore.md)

#### Defined in

[src/interfaces/server.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L14)

___

### definitions

• **definitions**: [`IModelsDatastore`](interfaces_datastore.IModelsDatastore.md)

#### Defined in

[src/interfaces/server.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L12)

___

### engine

• **engine**: [`IEngine`](interfaces_server.IEngine.md)

#### Defined in

[src/interfaces/server.ts:8](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L8)

___

### listener

• **listener**: `EventEmitter`

#### Defined in

[src/interfaces/server.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L9)

___

### logger

• **logger**: [`ILogger`](interfaces_common.ILogger.md)

#### Defined in

[src/interfaces/server.ts:11](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L11)

___

### userService

• **userService**: [`IUserService`](interfaces_User.IUserService.md)

#### Defined in

[src/interfaces/server.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/server.ts#L17)
