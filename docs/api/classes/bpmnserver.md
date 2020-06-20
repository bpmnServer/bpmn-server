[bpmn-server](../README.md) › [BPMNServer](bpmnserver.md)

# Class: BPMNServer

## Hierarchy

* **BPMNServer**

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
* [eventsRegistry](bpmnserver.md#eventsregistry)
* [logger](bpmnserver.md#logger)

## Constructors

###  constructor

\+ **new BPMNServer**(`configuration`: [IConfiguration](../interfaces/iconfiguration.md), `logger?`: [ILogger](../interfaces/ilogger.md)): *[BPMNServer](bpmnserver.md)*

Defined in src/server/BPMNServer.ts:54

Server Constructor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`configuration` | [IConfiguration](../interfaces/iconfiguration.md) | see |
`logger?` | [ILogger](../interfaces/ilogger.md) |   |

**Returns:** *[BPMNServer](bpmnserver.md)*

## Properties

###  appDelegate

• **appDelegate**: *[IAppDelegate](../interfaces/iappdelegate.md)*

Defined in src/server/BPMNServer.ts:50

___

###  cache

• **cache**: *[CacheManager](cachemanager.md)*

Defined in src/server/BPMNServer.ts:53

___

###  configuration

• **configuration**: *any*

Defined in src/server/BPMNServer.ts:47

___

###  cron

• **cron**: *[Cron](cron.md)*

Defined in src/server/BPMNServer.ts:54

___

###  dataStore

• **dataStore**: *[DataStore](datastore.md)*

Defined in src/server/BPMNServer.ts:51

___

###  definitions

• **definitions**: *any*

Defined in src/server/BPMNServer.ts:49

___

###  engine

• **engine**: *[Engine](engine.md)*

Defined in src/server/BPMNServer.ts:46

___

###  eventsRegistry

• **eventsRegistry**: *[IEventsRegistry](../interfaces/ieventsregistry.md)*

Defined in src/server/BPMNServer.ts:52

___

###  logger

• **logger**: *[ILogger](../interfaces/ilogger.md)*

Defined in src/server/BPMNServer.ts:48
