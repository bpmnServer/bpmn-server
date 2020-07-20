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

\+ **new CacheManager**(`server`: [IBPMNServer](../interfaces/ibpmnserver.md)): *[CacheManager](cachemanager.md)*

*Inherited from [ServerComponent](servercomponent.md).[constructor](servercomponent.md#constructor)*

Defined in src/server/ServerContext.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`server` | [IBPMNServer](../interfaces/ibpmnserver.md) |

**Returns:** *[CacheManager](cachemanager.md)*

## Properties

###  server

• **server**: *any*

*Inherited from [ServerComponent](servercomponent.md).[server](servercomponent.md#server)*

Defined in src/server/ServerContext.ts:9

___

### `Static` liveInstances

▪ **liveInstances**: *Map‹any, any›* = new Map()

Defined in src/server/CacheManager.ts:11

## Accessors

###  appDelegate

• **get appDelegate**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[appDelegate](servercomponent.md#appdelegate)*

Defined in src/server/ServerContext.ts:20

**Returns:** *any*

___

###  cache

• **get cache**(): *[CacheManager](cachemanager.md)*

*Inherited from [ServerComponent](servercomponent.md).[cache](servercomponent.md#cache)*

Defined in src/server/ServerContext.ts:18

**Returns:** *[CacheManager](cachemanager.md)*

___

###  configuration

• **get configuration**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[configuration](servercomponent.md#configuration)*

Defined in src/server/ServerContext.ts:13

**Returns:** *any*

___

###  cron

• **get cron**(): *[Cron](cron.md)*

*Inherited from [ServerComponent](servercomponent.md).[cron](servercomponent.md#cron)*

Defined in src/server/ServerContext.ts:17

**Returns:** *[Cron](cron.md)*

___

###  dataStore

• **get dataStore**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[dataStore](servercomponent.md#datastore)*

Defined in src/server/ServerContext.ts:15

**Returns:** *any*

___

###  definitions

• **get definitions**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[definitions](servercomponent.md#definitions)*

Defined in src/server/ServerContext.ts:19

**Returns:** *any*

___

###  engine

• **get engine**(): *[IEngine](../interfaces/iengine.md)*

*Inherited from [ServerComponent](servercomponent.md).[engine](servercomponent.md#engine)*

Defined in src/server/ServerContext.ts:16

**Returns:** *[IEngine](../interfaces/iengine.md)*

___

###  logger

• **get logger**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[logger](servercomponent.md#logger)*

Defined in src/server/ServerContext.ts:14

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
