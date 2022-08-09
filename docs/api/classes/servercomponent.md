[bpmn-server](../README.md) › [ServerComponent](servercomponent.md)

# Class: ServerComponent

super class for various objects that are part of the server

## Hierarchy

* **ServerComponent**

  ↳ [DataStore](datastore.md)

  ↳ [Engine](engine.md)

  ↳ [CacheManager](cachemanager.md)

  ↳ [Cron](cron.md)

  ↳ [Execution](execution.md)

  ↳ [ModelsDatastoreDB](modelsdatastoredb.md)

## Index

### Constructors

* [constructor](servercomponent.md#constructor)

### Properties

* [server](servercomponent.md#server)

### Accessors

* [acl](servercomponent.md#acl)
* [appDelegate](servercomponent.md#appdelegate)
* [cache](servercomponent.md#cache)
* [configuration](servercomponent.md#configuration)
* [cron](servercomponent.md#cron)
* [dataStore](servercomponent.md#datastore)
* [definitions](servercomponent.md#definitions)
* [engine](servercomponent.md#engine)
* [iam](servercomponent.md#iam)
* [listener](servercomponent.md#listener)
* [logger](servercomponent.md#logger)

## Constructors

###  constructor

\+ **new ServerComponent**(`server`: [IBPMNServer](../interfaces/ibpmnserver.md)): *[ServerComponent](servercomponent.md)*

Defined in bpmnServer/src/server/ServerComponent.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`server` | [IBPMNServer](../interfaces/ibpmnserver.md) |

**Returns:** *[ServerComponent](servercomponent.md)*

## Properties

###  server

• **server**: *any*

Defined in bpmnServer/src/server/ServerComponent.ts:9

## Accessors

###  acl

• **get acl**(): *any*

Defined in bpmnServer/src/server/ServerComponent.ts:23

**Returns:** *any*

___

###  appDelegate

• **get appDelegate**(): *any*

Defined in bpmnServer/src/server/ServerComponent.ts:18

**Returns:** *any*

___

###  cache

• **get cache**(): *[CacheManager](cachemanager.md)*

Defined in bpmnServer/src/server/ServerComponent.ts:17

**Returns:** *[CacheManager](cachemanager.md)*

___

###  configuration

• **get configuration**(): *any*

Defined in bpmnServer/src/server/ServerComponent.ts:14

**Returns:** *any*

___

###  cron

• **get cron**(): *[Cron](cron.md)*

Defined in bpmnServer/src/server/ServerComponent.ts:16

**Returns:** *[Cron](cron.md)*

___

###  dataStore

• **get dataStore**(): *any*

Defined in bpmnServer/src/server/ServerComponent.ts:20

**Returns:** *any*

___

###  definitions

• **get definitions**(): *any*

Defined in bpmnServer/src/server/ServerComponent.ts:21

**Returns:** *any*

___

###  engine

• **get engine**(): *[IEngine](../interfaces/iengine.md)*

Defined in bpmnServer/src/server/ServerComponent.ts:19

**Returns:** *[IEngine](../interfaces/iengine.md)*

___

###  iam

• **get iam**(): *any*

Defined in bpmnServer/src/server/ServerComponent.ts:24

**Returns:** *any*

___

###  listener

• **get listener**(): *any*

Defined in bpmnServer/src/server/ServerComponent.ts:22

**Returns:** *any*

___

###  logger

• **get logger**(): *any*

Defined in bpmnServer/src/server/ServerComponent.ts:15

**Returns:** *any*
