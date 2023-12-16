[bpmn-server](../README.md) / BPMNServer

# Class: BPMNServer

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

- [`IBPMNServer`](../interfaces/IBPMNServer.md)

## Table of contents

### Constructors

- [constructor](BPMNServer.md#constructor)

### Properties

- [appDelegate](BPMNServer.md#appdelegate)
- [cache](BPMNServer.md#cache)
- [configuration](BPMNServer.md#configuration)
- [cron](BPMNServer.md#cron)
- [dataStore](BPMNServer.md#datastore)
- [definitions](BPMNServer.md#definitions)
- [engine](BPMNServer.md#engine)
- [error](BPMNServer.md#error)
- [listener](BPMNServer.md#listener)
- [logger](BPMNServer.md#logger)
- [userService](BPMNServer.md#userservice)

### Accessors

- [engine](BPMNServer.md#engine-1)

### Methods

- [getInstance](BPMNServer.md#getinstance)
- [getVersion](BPMNServer.md#getversion)

## Constructors

### constructor

• **new BPMNServer**(`configuration`, `logger?`, `options?`): [`BPMNServer`](BPMNServer.md)

Server Constructor

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `configuration` | [`IConfiguration`](../interfaces/IConfiguration.md) | see |
| `logger?` | [`ILogger`](../interfaces/ILogger.md) |  |
| `options` | `Object` | - |

#### Returns

[`BPMNServer`](BPMNServer.md)

#### Defined in

[server/BPMNServer.ts:64](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L64)

## Properties

### appDelegate

• **appDelegate**: [`IAppDelegate`](../interfaces/IAppDelegate.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[appDelegate](../interfaces/IBPMNServer.md#appdelegate)

#### Defined in

[server/BPMNServer.ts:48](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L48)

___

### cache

• **cache**: [`ICacheManager`](../interfaces/ICacheManager.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[cache](../interfaces/IBPMNServer.md#cache)

#### Defined in

[server/BPMNServer.ts:50](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L50)

___

### configuration

• **configuration**: [`IConfiguration`](../interfaces/IConfiguration.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[configuration](../interfaces/IBPMNServer.md#configuration)

#### Defined in

[server/BPMNServer.ts:45](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L45)

___

### cron

• **cron**: [`Cron`](Cron.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[cron](../interfaces/IBPMNServer.md#cron)

#### Defined in

[server/BPMNServer.ts:51](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L51)

___

### dataStore

• **dataStore**: [`IDataStore`](../interfaces/IDataStore.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[dataStore](../interfaces/IBPMNServer.md#datastore)

#### Defined in

[server/BPMNServer.ts:49](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L49)

___

### definitions

• **definitions**: `any`

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[definitions](../interfaces/IBPMNServer.md#definitions)

#### Defined in

[server/BPMNServer.ts:47](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L47)

___

### engine

• **engine**: [`Engine`](Engine.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[engine](../interfaces/IBPMNServer.md#engine)

#### Defined in

[server/BPMNServer.ts:43](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L43)

___

### error

• **error**: `any`

#### Defined in

[server/BPMNServer.ts:53](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L53)

___

### listener

• **listener**: `EventEmitter`

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[listener](../interfaces/IBPMNServer.md#listener)

#### Defined in

[server/BPMNServer.ts:44](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L44)

___

### logger

• **logger**: [`ILogger`](../interfaces/ILogger.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[logger](../interfaces/IBPMNServer.md#logger)

#### Defined in

[server/BPMNServer.ts:46](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L46)

___

### userService

• **userService**: [`IUserService`](../interfaces/IUserService.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[userService](../interfaces/IBPMNServer.md#userservice)

#### Defined in

[server/BPMNServer.ts:52](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L52)

## Accessors

### engine

• `get` **engine**(): [`Engine`](Engine.md)

#### Returns

[`Engine`](Engine.md)

#### Defined in

[server/BPMNServer.ts:110](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L110)

## Methods

### getInstance

▸ **getInstance**(): [`BPMNServer`](BPMNServer.md)

#### Returns

[`BPMNServer`](BPMNServer.md)

#### Defined in

[server/BPMNServer.ts:113](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L113)

___

### getVersion

▸ **getVersion**(): `any`

#### Returns

`any`

#### Defined in

[server/BPMNServer.ts:95](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/server/BPMNServer.ts#L95)
