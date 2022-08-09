[bpmn-server](../README.md) › [CacheManager](cachemanager.md)

# Class: CacheManager

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **CacheManager**

## Implements

* [ICacheManager](../interfaces/icachemanager.md)

## Index

### Constructors

* [constructor](cachemanager.md#constructor)

### Properties

* [server](cachemanager.md#server)
* [liveInstances](cachemanager.md#static-liveinstances)

### Accessors

* [acl](cachemanager.md#acl)
* [appDelegate](cachemanager.md#appdelegate)
* [cache](cachemanager.md#cache)
* [configuration](cachemanager.md#configuration)
* [cron](cachemanager.md#cron)
* [dataStore](cachemanager.md#datastore)
* [definitions](cachemanager.md#definitions)
* [engine](cachemanager.md#engine)
* [iam](cachemanager.md#iam)
* [listener](cachemanager.md#listener)
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

Defined in bpmnServer/src/server/ServerComponent.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`server` | [IBPMNServer](../interfaces/ibpmnserver.md) |

**Returns:** *[CacheManager](cachemanager.md)*

## Properties

###  server

• **server**: *any*

*Inherited from [ServerComponent](servercomponent.md).[server](servercomponent.md#server)*

Defined in bpmnServer/src/server/ServerComponent.ts:9

___

### `Static` liveInstances

▪ **liveInstances**: *Map‹any, any›* = new Map()

Defined in bpmnServer/src/server/CacheManager.ts:13

## Accessors

###  acl

• **get acl**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[acl](servercomponent.md#acl)*

Defined in bpmnServer/src/server/ServerComponent.ts:23

**Returns:** *any*

___

###  appDelegate

• **get appDelegate**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[appDelegate](servercomponent.md#appdelegate)*

Defined in bpmnServer/src/server/ServerComponent.ts:18

**Returns:** *any*

___

###  cache

• **get cache**(): *[CacheManager](cachemanager.md)*

*Inherited from [ServerComponent](servercomponent.md).[cache](servercomponent.md#cache)*

Defined in bpmnServer/src/server/ServerComponent.ts:17

**Returns:** *[CacheManager](cachemanager.md)*

___

###  configuration

• **get configuration**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[configuration](servercomponent.md#configuration)*

Defined in bpmnServer/src/server/ServerComponent.ts:14

**Returns:** *any*

___

###  cron

• **get cron**(): *[Cron](cron.md)*

*Inherited from [ServerComponent](servercomponent.md).[cron](servercomponent.md#cron)*

Defined in bpmnServer/src/server/ServerComponent.ts:16

**Returns:** *[Cron](cron.md)*

___

###  dataStore

• **get dataStore**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[dataStore](servercomponent.md#datastore)*

Defined in bpmnServer/src/server/ServerComponent.ts:20

**Returns:** *any*

___

###  definitions

• **get definitions**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[definitions](servercomponent.md#definitions)*

Defined in bpmnServer/src/server/ServerComponent.ts:21

**Returns:** *any*

___

###  engine

• **get engine**(): *[IEngine](../interfaces/iengine.md)*

*Inherited from [ServerComponent](servercomponent.md).[engine](servercomponent.md#engine)*

Defined in bpmnServer/src/server/ServerComponent.ts:19

**Returns:** *[IEngine](../interfaces/iengine.md)*

___

###  iam

• **get iam**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[iam](servercomponent.md#iam)*

Defined in bpmnServer/src/server/ServerComponent.ts:24

**Returns:** *any*

___

###  listener

• **get listener**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[listener](servercomponent.md#listener)*

Defined in bpmnServer/src/server/ServerComponent.ts:22

**Returns:** *any*

___

###  logger

• **get logger**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[logger](servercomponent.md#logger)*

Defined in bpmnServer/src/server/ServerComponent.ts:15

**Returns:** *any*

## Methods

###  add

▸ **add**(`execution`: [IExecution](../interfaces/iexecution.md)): *void*

*Implementation of [ICacheManager](../interfaces/icachemanager.md)*

Defined in bpmnServer/src/server/CacheManager.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [IExecution](../interfaces/iexecution.md) |

**Returns:** *void*

___

###  getInstance

▸ **getInstance**(`instanceId`: any): *any*

Defined in bpmnServer/src/server/CacheManager.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`instanceId` | any |

**Returns:** *any*

___

###  list

▸ **list**(): *any[]*

*Implementation of [ICacheManager](../interfaces/icachemanager.md)*

Defined in bpmnServer/src/server/CacheManager.ts:15

**Returns:** *any[]*

___

###  remove

▸ **remove**(`instanceId`: any): *void*

*Implementation of [ICacheManager](../interfaces/icachemanager.md)*

Defined in bpmnServer/src/server/CacheManager.ts:32

**Parameters:**

Name | Type |
------ | ------ |
`instanceId` | any |

**Returns:** *void*

___

###  restart

▸ **restart**(): *Promise‹void›*

*Implementation of [ICacheManager](../interfaces/icachemanager.md)*

Defined in bpmnServer/src/server/CacheManager.ts:52

**Returns:** *Promise‹void›*

___

###  shutdown

▸ **shutdown**(): *Promise‹void›*

*Implementation of [ICacheManager](../interfaces/icachemanager.md)*

Defined in bpmnServer/src/server/CacheManager.ts:36

**Returns:** *Promise‹void›*
