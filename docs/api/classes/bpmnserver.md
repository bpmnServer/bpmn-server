[bpmn-server](../README.md) › [BPMNServer](bpmnserver.md)

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

## Hierarchy

* **BPMNServer**

## Implements

* [IBPMNServer](../interfaces/ibpmnserver.md)

## Index

### Constructors

* [constructor](bpmnserver.md#constructor)

### Properties

* [acl](bpmnserver.md#acl)
* [appDelegate](bpmnserver.md#appdelegate)
* [cache](bpmnserver.md#cache)
* [configuration](bpmnserver.md#configuration)
* [cron](bpmnserver.md#cron)
* [dataStore](bpmnserver.md#datastore)
* [definitions](bpmnserver.md#definitions)
* [engine](bpmnserver.md#engine)
* [iam](bpmnserver.md#iam)
* [listener](bpmnserver.md#listener)
* [logger](bpmnserver.md#logger)

### Accessors

* [engine](bpmnserver.md#static-engine)

### Methods

* [getInstance](bpmnserver.md#static-getinstance)
* [getVersion](bpmnserver.md#static-getversion)

## Constructors

###  constructor

\+ **new BPMNServer**(`configuration`: [IConfiguration](../interfaces/iconfiguration.md), `logger?`: [ILogger](../interfaces/ilogger.md), `options`: object): *[BPMNServer](bpmnserver.md)*

Defined in bpmnServer/src/server/BPMNServer.ts:44

Server Constructor

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`configuration` | [IConfiguration](../interfaces/iconfiguration.md) | - | see |
`logger?` | [ILogger](../interfaces/ilogger.md) | - |   |
`options` | object | {} | - |

**Returns:** *[BPMNServer](bpmnserver.md)*

## Properties

###  acl

• **acl**: *[IACL](../interfaces/iacl.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[acl](../interfaces/ibpmnserver.md#acl)*

Defined in bpmnServer/src/server/BPMNServer.ts:41

___

###  appDelegate

• **appDelegate**: *[IAppDelegate](../interfaces/iappdelegate.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[appDelegate](../interfaces/ibpmnserver.md#appdelegate)*

Defined in bpmnServer/src/server/BPMNServer.ts:37

___

###  cache

• **cache**: *[CacheManager](cachemanager.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[cache](../interfaces/ibpmnserver.md#cache)*

Defined in bpmnServer/src/server/BPMNServer.ts:39

___

###  configuration

• **configuration**: *[IConfiguration](../interfaces/iconfiguration.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[configuration](../interfaces/ibpmnserver.md#configuration)*

Defined in bpmnServer/src/server/BPMNServer.ts:34

___

###  cron

• **cron**: *[Cron](cron.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[cron](../interfaces/ibpmnserver.md#cron)*

Defined in bpmnServer/src/server/BPMNServer.ts:40

___

###  dataStore

• **dataStore**: *[IDataStore](../interfaces/idatastore.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[dataStore](../interfaces/ibpmnserver.md#datastore)*

Defined in bpmnServer/src/server/BPMNServer.ts:38

___

###  definitions

• **definitions**: *any*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[definitions](../interfaces/ibpmnserver.md#definitions)*

Defined in bpmnServer/src/server/BPMNServer.ts:36

___

###  engine

• **engine**: *[Engine](engine.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[engine](../interfaces/ibpmnserver.md#engine)*

Defined in bpmnServer/src/server/BPMNServer.ts:32

___

###  iam

• **iam**: *[IIAM](../interfaces/iiam.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[iam](../interfaces/ibpmnserver.md#iam)*

Defined in bpmnServer/src/server/BPMNServer.ts:42

___

###  listener

• **listener**: *EventEmitter*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[listener](../interfaces/ibpmnserver.md#listener)*

Defined in bpmnServer/src/server/BPMNServer.ts:33

___

###  logger

• **logger**: *[ILogger](../interfaces/ilogger.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[logger](../interfaces/ibpmnserver.md#logger)*

Defined in bpmnServer/src/server/BPMNServer.ts:35

## Accessors

### `Static` engine

• **get engine**(): *[Engine](engine.md)‹›*

Defined in bpmnServer/src/server/BPMNServer.ts:85

**Returns:** *[Engine](engine.md)‹›*

## Methods

### `Static` getInstance

▸ **getInstance**(): *[BPMNServer](bpmnserver.md)*

Defined in bpmnServer/src/server/BPMNServer.ts:88

**Returns:** *[BPMNServer](bpmnserver.md)*

___

### `Static` getVersion

▸ **getVersion**(): *string*

Defined in bpmnServer/src/server/BPMNServer.ts:82

**Returns:** *string*
