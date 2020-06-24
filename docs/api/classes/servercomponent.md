[bpmn-server](../README.md) › [ServerComponent](servercomponent.md)

# Class: ServerComponent

super class for various objects that are part of the server

## Hierarchy

* **ServerComponent**

  ↳ [ExecutionContext](executioncontext.md)

  ↳ [DataStore](datastore.md)

  ↳ [ModelsDatastoreFS](modelsdatastorefs.md)

  ↳ [Engine](engine.md)

  ↳ [CacheManager](cachemanager.md)

  ↳ [Cron](cron.md)

  ↳ [ModelsDatastoreDB](modelsdatastoredb.md)

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
* [logger](servercomponent.md#logger)

## Constructors

###  constructor

\+ **new ServerComponent**(`server`: [IBPMNServer](../interfaces/ibpmnserver.md)): *[ServerComponent](servercomponent.md)*

Defined in src/server/ServerContext.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`server` | [IBPMNServer](../interfaces/ibpmnserver.md) |

**Returns:** *[ServerComponent](servercomponent.md)*

## Properties

###  server

• **server**: *any*

Defined in src/server/ServerContext.ts:9

## Accessors

###  appDelegate

• **get appDelegate**(): *any*

Defined in src/server/ServerContext.ts:20

**Returns:** *any*

___

###  cache

• **get cache**(): *[CacheManager](cachemanager.md)*

Defined in src/server/ServerContext.ts:18

**Returns:** *[CacheManager](cachemanager.md)*

___

###  configuration

• **get configuration**(): *any*

Defined in src/server/ServerContext.ts:13

**Returns:** *any*

___

###  cron

• **get cron**(): *[Cron](cron.md)*

Defined in src/server/ServerContext.ts:17

**Returns:** *[Cron](cron.md)*

___

###  dataStore

• **get dataStore**(): *any*

Defined in src/server/ServerContext.ts:15

**Returns:** *any*

___

###  definitions

• **get definitions**(): *any*

Defined in src/server/ServerContext.ts:19

**Returns:** *any*

___

###  engine

• **get engine**(): *[IEngine](../interfaces/iengine.md)*

Defined in src/server/ServerContext.ts:16

**Returns:** *[IEngine](../interfaces/iengine.md)*

___

###  logger

• **get logger**(): *any*

Defined in src/server/ServerContext.ts:14

**Returns:** *any*
