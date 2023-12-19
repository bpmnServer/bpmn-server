[bpmn-server](../README.md) / [Exports](../modules.md) / [server/BPMNServer](../modules/server_BPMNServer.md) / BPMNServer

# Class: BPMNServer

[server/BPMNServer](../modules/server_BPMNServer.md).BPMNServer

The main class of Server Layer
	provides the full functionalities:
	
		at start of the app:
			new BPMNServer(configuration,options);
			
		after that point:
		
			BPMNServer.engine.start(...)
			BPMNServer.engine.invoke(...)
			BPMNServer.dataStore.findInstances(...)
			BPMNServer.dataStore.findItems(...)

## Implements

- [`IBPMNServer`](../interfaces/interfaces_server.IBPMNServer.md)

## Table of contents

### Constructors

- [constructor](server_BPMNServer.BPMNServer.md#constructor)

### Properties

- [appDelegate](server_BPMNServer.BPMNServer.md#appdelegate)
- [cache](server_BPMNServer.BPMNServer.md#cache)
- [configuration](server_BPMNServer.BPMNServer.md#configuration)
- [cron](server_BPMNServer.BPMNServer.md#cron)
- [dataStore](server_BPMNServer.BPMNServer.md#datastore)
- [definitions](server_BPMNServer.BPMNServer.md#definitions)
- [engine](server_BPMNServer.BPMNServer.md#engine)
- [error](server_BPMNServer.BPMNServer.md#error)
- [listener](server_BPMNServer.BPMNServer.md#listener)
- [logger](server_BPMNServer.BPMNServer.md#logger)
- [userService](server_BPMNServer.BPMNServer.md#userservice)
- [instance](server_BPMNServer.BPMNServer.md#instance)

### Accessors

- [engine](server_BPMNServer.BPMNServer.md#engine-1)

### Methods

- [getInstance](server_BPMNServer.BPMNServer.md#getinstance)
- [getVersion](server_BPMNServer.BPMNServer.md#getversion)

## Constructors

### constructor

• **new BPMNServer**(`configuration`, `logger?`, `options?`): [`BPMNServer`](server_BPMNServer.BPMNServer.md)

Server Constructor

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `configuration` | [`IConfiguration`](../interfaces/interfaces_common.IConfiguration.md) | see |
| `logger?` | [`ILogger`](../interfaces/interfaces_common.ILogger.md) |  |
| `options` | `Object` | - |

#### Returns

[`BPMNServer`](server_BPMNServer.BPMNServer.md)

#### Defined in

[src/server/BPMNServer.ts:65](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L65)

## Properties

### appDelegate

• **appDelegate**: [`IAppDelegate`](../interfaces/interfaces_common.IAppDelegate.md)

#### Implementation of

[IBPMNServer](../interfaces/interfaces_server.IBPMNServer.md).[appDelegate](../interfaces/interfaces_server.IBPMNServer.md#appdelegate)

#### Defined in

[src/server/BPMNServer.ts:49](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L49)

___

### cache

• **cache**: [`ICacheManager`](../interfaces/interfaces_server.ICacheManager.md)

#### Implementation of

[IBPMNServer](../interfaces/interfaces_server.IBPMNServer.md).[cache](../interfaces/interfaces_server.IBPMNServer.md#cache)

#### Defined in

[src/server/BPMNServer.ts:51](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L51)

___

### configuration

• **configuration**: [`IConfiguration`](../interfaces/interfaces_common.IConfiguration.md)

#### Implementation of

[IBPMNServer](../interfaces/interfaces_server.IBPMNServer.md).[configuration](../interfaces/interfaces_server.IBPMNServer.md#configuration)

#### Defined in

[src/server/BPMNServer.ts:46](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L46)

___

### cron

• **cron**: [`Cron`](server_Cron.Cron.md)

#### Implementation of

[IBPMNServer](../interfaces/interfaces_server.IBPMNServer.md).[cron](../interfaces/interfaces_server.IBPMNServer.md#cron)

#### Defined in

[src/server/BPMNServer.ts:52](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L52)

___

### dataStore

• **dataStore**: [`IDataStore`](../interfaces/interfaces_datastore.IDataStore.md)

#### Implementation of

[IBPMNServer](../interfaces/interfaces_server.IBPMNServer.md).[dataStore](../interfaces/interfaces_server.IBPMNServer.md#datastore)

#### Defined in

[src/server/BPMNServer.ts:50](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L50)

___

### definitions

• **definitions**: `any`

#### Implementation of

[IBPMNServer](../interfaces/interfaces_server.IBPMNServer.md).[definitions](../interfaces/interfaces_server.IBPMNServer.md#definitions)

#### Defined in

[src/server/BPMNServer.ts:48](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L48)

___

### engine

• **engine**: [`Engine`](server_Engine.Engine.md)

#### Implementation of

[IBPMNServer](../interfaces/interfaces_server.IBPMNServer.md).[engine](../interfaces/interfaces_server.IBPMNServer.md#engine)

#### Defined in

[src/server/BPMNServer.ts:44](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L44)

___

### error

• **error**: `any`

#### Defined in

[src/server/BPMNServer.ts:54](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L54)

___

### listener

• **listener**: `EventEmitter`

#### Implementation of

[IBPMNServer](../interfaces/interfaces_server.IBPMNServer.md).[listener](../interfaces/interfaces_server.IBPMNServer.md#listener)

#### Defined in

[src/server/BPMNServer.ts:45](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L45)

___

### logger

• **logger**: [`ILogger`](../interfaces/interfaces_common.ILogger.md)

#### Implementation of

[IBPMNServer](../interfaces/interfaces_server.IBPMNServer.md).[logger](../interfaces/interfaces_server.IBPMNServer.md#logger)

#### Defined in

[src/server/BPMNServer.ts:47](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L47)

___

### userService

• **userService**: [`IUserService`](../interfaces/interfaces_User.IUserService.md)

#### Implementation of

[IBPMNServer](../interfaces/interfaces_server.IBPMNServer.md).[userService](../interfaces/interfaces_server.IBPMNServer.md#userservice)

#### Defined in

[src/server/BPMNServer.ts:53](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L53)

___

### instance

▪ `Static` `Private` **instance**: [`BPMNServer`](server_BPMNServer.BPMNServer.md)

#### Defined in

[src/server/BPMNServer.ts:56](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L56)

## Accessors

### engine

• `get` **engine**(): [`Engine`](server_Engine.Engine.md)

#### Returns

[`Engine`](server_Engine.Engine.md)

#### Defined in

[src/server/BPMNServer.ts:111](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L111)

## Methods

### getInstance

▸ **getInstance**(): [`BPMNServer`](server_BPMNServer.BPMNServer.md)

#### Returns

[`BPMNServer`](server_BPMNServer.BPMNServer.md)

#### Defined in

[src/server/BPMNServer.ts:114](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L114)

___

### getVersion

▸ **getVersion**(): `any`

#### Returns

`any`

#### Defined in

[src/server/BPMNServer.ts:96](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/BPMNServer.ts#L96)
