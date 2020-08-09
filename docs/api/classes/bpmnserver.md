[bpmn-server](../README.md) › [BPMNServer](bpmnserver.md)

# Class: BPMNServer

The main class of Server Layer
	provides the full functionalities:

		1.	access to Execution engine
		2.	data Presistence through DataStore class
		3.	access to models definitions, loading and saving of models
		4.	access to BPMN definition details

		primary Use Cases:
		a.	execute a process
			server= new BPMNServer(...);
			server.execute(...);

		b.	invoke a task in an already started process
			server= new BPMNServer(...);
			server.invoke(...);

		c.	find items (various options)
			server= new BPMNServer(...);
			server.findItems(...);

## Hierarchy

* **BPMNServer**

## Implements

* [IBPMNServer](../interfaces/ibpmnserver.md)

## Index

### Constructors

* [constructor](bpmnserver.md#constructor)

### Properties

* [appDelegate](bpmnserver.md#appdelegate)
* [cache](bpmnserver.md#cache)
* [configuration](bpmnserver.md#configuration)
* [cron](bpmnserver.md#cron)
* [dataStore](bpmnserver.md#datastore)
* [definitions](bpmnserver.md#definitions)
* [engine](bpmnserver.md#engine)
* [logger](bpmnserver.md#logger)

### Methods

* [getVersion](bpmnserver.md#static-getversion)

## Constructors

###  constructor

\+ **new BPMNServer**(`configuration`: [IConfiguration](../interfaces/iconfiguration.md), `logger?`: [ILogger](../interfaces/ilogger.md), `options`: object): *[BPMNServer](bpmnserver.md)*

Defined in src/server/BPMNServer.ts:42

Server Constructor

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`configuration` | [IConfiguration](../interfaces/iconfiguration.md) | - | see |
`logger?` | [ILogger](../interfaces/ilogger.md) | - |   |
`options` | object | {} | - |

**Returns:** *[BPMNServer](bpmnserver.md)*

## Properties

###  appDelegate

• **appDelegate**: *[IAppDelegate](../interfaces/iappdelegate.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[appDelegate](../interfaces/ibpmnserver.md#appdelegate)*

Defined in src/server/BPMNServer.ts:39

___

###  cache

• **cache**: *[CacheManager](cachemanager.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[cache](../interfaces/ibpmnserver.md#cache)*

Defined in src/server/BPMNServer.ts:41

___

###  configuration

• **configuration**: *any*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[configuration](../interfaces/ibpmnserver.md#configuration)*

Defined in src/server/BPMNServer.ts:36

___

###  cron

• **cron**: *[Cron](cron.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[cron](../interfaces/ibpmnserver.md#cron)*

Defined in src/server/BPMNServer.ts:42

___

###  dataStore

• **dataStore**: *[IDataStore](../interfaces/idatastore.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[dataStore](../interfaces/ibpmnserver.md#datastore)*

Defined in src/server/BPMNServer.ts:40

___

###  definitions

• **definitions**: *any*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[definitions](../interfaces/ibpmnserver.md#definitions)*

Defined in src/server/BPMNServer.ts:38

___

###  engine

• **engine**: *[Engine](engine.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[engine](../interfaces/ibpmnserver.md#engine)*

Defined in src/server/BPMNServer.ts:35

___

###  logger

• **logger**: *[ILogger](../interfaces/ilogger.md)*

*Implementation of [IBPMNServer](../interfaces/ibpmnserver.md).[logger](../interfaces/ibpmnserver.md#logger)*

Defined in src/server/BPMNServer.ts:37

## Methods

### `Static` getVersion

▸ **getVersion**(): *any*

Defined in src/server/BPMNServer.ts:74

**Returns:** *any*
