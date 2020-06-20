[bpmn-server](../README.md) › [CacheManager](cachemanager.md)

# Class: CacheManager

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **CacheManager**

## Index

### Constructors

* [constructor](cachemanager.md#constructor)

### Properties

* [server](cachemanager.md#server)
* [liveInstances](cachemanager.md#static-liveinstances)

### Accessors

* [appDelegate](cachemanager.md#appdelegate)
* [cache](cachemanager.md#cache)
* [configuration](cachemanager.md#configuration)
* [cron](cachemanager.md#cron)
* [dataStore](cachemanager.md#datastore)
* [definitions](cachemanager.md#definitions)
* [engine](cachemanager.md#engine)
* [eventsRegistry](cachemanager.md#eventsregistry)
* [logger](cachemanager.md#logger)

### Methods

* [add](cachemanager.md#add)
* [getInstance](cachemanager.md#getinstance)
* [list](cachemanager.md#list)
* [remove](cachemanager.md#remove)
* [restart](cachemanager.md#restart)
* [shutdown](cachemanager.md#shutdown)

## Constructors

###  constructor

\+ **new CacheManager**(`server`: [BPMNServer](bpmnserver.md)): *[CacheManager](cachemanager.md)*

*Inherited from [Cron](cron.md).[constructor](cron.md#constructor)*

Defined in src/server/ServerContext.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`server` | [BPMNServer](bpmnserver.md) |

**Returns:** *[CacheManager](cachemanager.md)*

## Properties

###  server

• **server**: *any*

*Inherited from [Cron](cron.md).[server](cron.md#server)*

Defined in src/server/ServerContext.ts:11

___

### `Static` liveInstances

▪ **liveInstances**: *Map‹any, any›* = new Map()

Defined in src/server/CacheManager.ts:11

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

###  add

▸ **add**(`executionContext`: [ExecutionContext](executioncontext.md)): *void*

Defined in src/server/CacheManager.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`executionContext` | [ExecutionContext](executioncontext.md) |

**Returns:** *void*

___

###  getInstance

▸ **getInstance**(`instanceId`: any): *any*

Defined in src/server/CacheManager.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`instanceId` | any |

**Returns:** *any*

___

###  list

▸ **list**(): *any[]*

Defined in src/server/CacheManager.ts:13

**Returns:** *any[]*

___

###  remove

▸ **remove**(`instanceId`: any): *void*

Defined in src/server/CacheManager.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`instanceId` | any |

**Returns:** *void*

___

###  restart

▸ **restart**(): *Promise‹void›*

Defined in src/server/CacheManager.ts:50

**Returns:** *Promise‹void›*

___

###  shutdown

▸ **shutdown**(): *Promise‹void›*

Defined in src/server/CacheManager.ts:34

**Returns:** *Promise‹void›*
