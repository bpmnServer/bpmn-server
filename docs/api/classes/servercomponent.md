[bpmn-server](../README.md) › [ServerComponent](servercomponent.md)

# Class: ServerComponent

super class for various objects that are part of the server

## Hierarchy

* **ServerComponent**

  ↳ [Cron](cron.md)

  ↳ [DataStore](datastore.md)

  ↳ [EventsRegistry](eventsregistry.md)

  ↳ [Engine](engine.md)

  ↳ [CacheManager](cachemanager.md)

  ↳ [ExecutionContext](executioncontext.md)

  ↳ [ModelsDatastore](modelsdatastore.md)

## Index

### Constructors

* [constructor](servercomponent.md#constructor)

### Properties

* [server](servercomponent.md#server)

### Accessors

* [appDelegate](servercomponent.md#appdelegate)
* [cache](servercomponent.md#cache)
* [configuration](servercomponent.md#configuration)
* [cron](servercomponent.md#cron)
* [dataStore](servercomponent.md#datastore)
* [definitions](servercomponent.md#definitions)
* [engine](servercomponent.md#engine)
* [eventsRegistry](servercomponent.md#eventsregistry)
* [logger](servercomponent.md#logger)

## Constructors

###  constructor

\+ **new ServerComponent**(`server`: [BPMNServer](bpmnserver.md)): *[ServerComponent](servercomponent.md)*

Defined in src/server/ServerContext.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`server` | [BPMNServer](bpmnserver.md) |

**Returns:** *[ServerComponent](servercomponent.md)*

## Properties

###  server

• **server**: *any*

Defined in src/server/ServerContext.ts:11

## Accessors

###  appDelegate

• **get appDelegate**(): *any*

Defined in src/server/ServerContext.ts:23

**Returns:** *any*

___

###  cache

• **get cache**(): *[CacheManager](cachemanager.md)*

Defined in src/server/ServerContext.ts:21

**Returns:** *[CacheManager](cachemanager.md)*

___

###  configuration

• **get configuration**(): *any*

Defined in src/server/ServerContext.ts:15

**Returns:** *any*

___

###  cron

• **get cron**(): *[Cron](cron.md)*

Defined in src/server/ServerContext.ts:20

**Returns:** *[Cron](cron.md)*

___

###  dataStore

• **get dataStore**(): *any*

Defined in src/server/ServerContext.ts:17

**Returns:** *any*

___

###  definitions

• **get definitions**(): *any*

Defined in src/server/ServerContext.ts:22

**Returns:** *any*

___

###  engine

• **get engine**(): *[Engine](engine.md)*

Defined in src/server/ServerContext.ts:19

**Returns:** *[Engine](engine.md)*

___

###  eventsRegistry

• **get eventsRegistry**(): *any*

Defined in src/server/ServerContext.ts:18

**Returns:** *any*

___

###  logger

• **get logger**(): *any*

Defined in src/server/ServerContext.ts:16

**Returns:** *any*
