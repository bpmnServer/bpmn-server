[bpmn-server](../README.md) › [EventsRegistry](eventsregistry.md)

# Class: EventsRegistry

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **EventsRegistry**

## Implements

* [IEventsRegistry](../interfaces/ieventsregistry.md)

## Index

### Constructors

* [constructor](eventsregistry.md#constructor)

### Properties

* [server](eventsregistry.md#server)

### Accessors

* [appDelegate](eventsregistry.md#appdelegate)
* [cache](eventsregistry.md#cache)
* [configuration](eventsregistry.md#configuration)
* [cron](eventsregistry.md#cron)
* [dataStore](eventsregistry.md#datastore)
* [definitions](eventsregistry.md#definitions)
* [engine](eventsregistry.md#engine)
* [eventsRegistry](eventsregistry.md#eventsregistry)
* [logger](eventsregistry.md#logger)

### Methods

* [addEvent](eventsregistry.md#addevent)
* [deleteEvents](eventsregistry.md#deleteevents)
* [execute](eventsregistry.md#execute)
* [registerProcess](eventsregistry.md#registerprocess)

## Constructors

###  constructor

\+ **new EventsRegistry**(`server`: [BPMNServer](bpmnserver.md)): *[EventsRegistry](eventsregistry.md)*

*Inherited from [Cron](cron.md).[constructor](cron.md#constructor)*

Defined in src/server/ServerContext.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`server` | [BPMNServer](bpmnserver.md) |

**Returns:** *[EventsRegistry](eventsregistry.md)*

## Properties

###  server

• **server**: *any*

*Inherited from [Cron](cron.md).[server](cron.md#server)*

Defined in src/server/ServerContext.ts:11

## Accessors

###  appDelegate

• **get appDelegate**(): *any*

*Inherited from [Cron](cron.md).[appDelegate](cron.md#appdelegate)*

Defined in src/server/ServerContext.ts:23

**Returns:** *any*

___

###  cache

• **get cache**(): *[CacheManager](cachemanager.md)*

*Inherited from [Cron](cron.md).[cache](cron.md#cache)*

Defined in src/server/ServerContext.ts:21

**Returns:** *[CacheManager](cachemanager.md)*

___

###  configuration

• **get configuration**(): *any*

*Inherited from [Cron](cron.md).[configuration](cron.md#configuration)*

Defined in src/server/ServerContext.ts:15

**Returns:** *any*

___

###  cron

• **get cron**(): *[Cron](cron.md)*

*Inherited from [Cron](cron.md).[cron](cron.md#cron)*

Defined in src/server/ServerContext.ts:20

**Returns:** *[Cron](cron.md)*

___

###  dataStore

• **get dataStore**(): *any*

*Inherited from [Cron](cron.md).[dataStore](cron.md#datastore)*

Defined in src/server/ServerContext.ts:17

**Returns:** *any*

___

###  definitions

• **get definitions**(): *any*

*Inherited from [Cron](cron.md).[definitions](cron.md#definitions)*

Defined in src/server/ServerContext.ts:22

**Returns:** *any*

___

###  engine

• **get engine**(): *[Engine](engine.md)*

*Inherited from [Cron](cron.md).[engine](cron.md#engine)*

Defined in src/server/ServerContext.ts:19

**Returns:** *[Engine](engine.md)*

___

###  eventsRegistry

• **get eventsRegistry**(): *any*

*Inherited from [Cron](cron.md).[eventsRegistry](cron.md#eventsregistry)*

Defined in src/server/ServerContext.ts:18

**Returns:** *any*

___

###  logger

• **get logger**(): *any*

*Inherited from [Cron](cron.md).[logger](cron.md#logger)*

Defined in src/server/ServerContext.ts:16

**Returns:** *any*

## Methods

###  addEvent

▸ **addEvent**(`event`: [IEventData](../interfaces/ieventdata.md)): *Promise‹void›*

*Implementation of [IEventsRegistry](../interfaces/ieventsregistry.md)*

Defined in src/server/EventsRegistry.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`event` | [IEventData](../interfaces/ieventdata.md) |

**Returns:** *Promise‹void›*

___

###  deleteEvents

▸ **deleteEvents**(`query`: any): *void*

*Implementation of [IEventsRegistry](../interfaces/ieventsregistry.md)*

Defined in src/server/EventsRegistry.ts:44

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *void*

___

###  execute

▸ **execute**(`event`: [IEventData](../interfaces/ieventdata.md), `server`: [IBPMNServer](../interfaces/ibpmnserver.md)): *Promise‹void›*

Defined in src/server/EventsRegistry.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`event` | [IEventData](../interfaces/ieventdata.md) |
`server` | [IBPMNServer](../interfaces/ibpmnserver.md) |

**Returns:** *Promise‹void›*

___

###  registerProcess

▸ **registerProcess**(`processName`: any): *Promise‹void›*

Defined in src/server/EventsRegistry.ts:38

**Parameters:**

Name | Type |
------ | ------ |
`processName` | any |

**Returns:** *Promise‹void›*
