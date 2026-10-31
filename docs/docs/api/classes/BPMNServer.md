[bpmn-server](../readme.md) / BPMNServer

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

- [engine](BPMNServer.md#engine)
- [listener](BPMNServer.md#listener)
- [configuration](BPMNServer.md#configuration)
- [logger](BPMNServer.md#logger)
- [definitions](BPMNServer.md#definitions)
- [appDelegate](BPMNServer.md#appdelegate)
- [dataStore](BPMNServer.md#datastore)
- [cache](BPMNServer.md#cache)
- [cron](BPMNServer.md#cron)
- [error](BPMNServer.md#error)
- [instance](BPMNServer.md#instance)

### Accessors

- [engine](BPMNServer.md#engine-1)

### Methods

- [status](BPMNServer.md#status)
- [getVersion](BPMNServer.md#getversion)
- [getInstance](BPMNServer.md#getinstance)

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

[server/BPMNServer.ts:64](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L64)

## Properties

### engine

• **engine**: [`Engine`](Engine.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[engine](../interfaces/IBPMNServer.md#engine)

#### Defined in

[server/BPMNServer.ts:44](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L44)

___

### listener

• **listener**: `EventEmitter`

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[listener](../interfaces/IBPMNServer.md#listener)

#### Defined in

[server/BPMNServer.ts:45](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L45)

___

### configuration

• **configuration**: [`IConfiguration`](../interfaces/IConfiguration.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[configuration](../interfaces/IBPMNServer.md#configuration)

#### Defined in

[server/BPMNServer.ts:46](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L46)

___

### logger

• **logger**: [`ILogger`](../interfaces/ILogger.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[logger](../interfaces/IBPMNServer.md#logger)

#### Defined in

[server/BPMNServer.ts:47](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L47)

___

### definitions

• **definitions**: `any`

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[definitions](../interfaces/IBPMNServer.md#definitions)

#### Defined in

[server/BPMNServer.ts:48](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L48)

___

### appDelegate

• **appDelegate**: [`IAppDelegate`](../interfaces/IAppDelegate.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[appDelegate](../interfaces/IBPMNServer.md#appdelegate)

#### Defined in

[server/BPMNServer.ts:49](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L49)

___

### dataStore

• **dataStore**: [`IDataStore`](../interfaces/IDataStore.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[dataStore](../interfaces/IBPMNServer.md#datastore)

#### Defined in

[server/BPMNServer.ts:50](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L50)

___

### cache

• **cache**: [`ICacheManager`](../interfaces/ICacheManager.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[cache](../interfaces/IBPMNServer.md#cache)

#### Defined in

[server/BPMNServer.ts:51](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L51)

___

### cron

• **cron**: [`Cron`](Cron.md)

#### Implementation of

[IBPMNServer](../interfaces/IBPMNServer.md).[cron](../interfaces/IBPMNServer.md#cron)

#### Defined in

[server/BPMNServer.ts:52](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L52)

___

### error

• **error**: `any`

#### Defined in

[server/BPMNServer.ts:53](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L53)

___

### instance

▪ `Static` `Private` **instance**: [`BPMNServer`](BPMNServer.md)

#### Defined in

[server/BPMNServer.ts:55](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L55)

## Accessors

### engine

• `get` **engine**(): [`Engine`](Engine.md)

#### Returns

[`Engine`](Engine.md)

#### Defined in

[server/BPMNServer.ts:117](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L117)

## Methods

### status

▸ **status**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `version` | `any` |
| `cache` | () => `any` |
| `engineRunning` | `number` |
| `engineCalls` | `number` |
| `memoryUsage` | `any` |

#### Defined in

[server/BPMNServer.ts:93](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L93)

___

### getVersion

▸ **getVersion**(): `any`

#### Returns

`any`

#### Defined in

[server/BPMNServer.ts:102](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L102)

___

### getInstance

▸ **getInstance**(): [`BPMNServer`](BPMNServer.md)

#### Returns

[`BPMNServer`](BPMNServer.md)

#### Defined in

[server/BPMNServer.ts:120](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/BPMNServer.ts#L120)
