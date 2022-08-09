[bpmn-server](../README.md) › [Cron](cron.md)

# Class: Cron

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **Cron**

## Implements

* [ICron](../interfaces/icron.md)

## Index

### Constructors

* [constructor](cron.md#constructor)

### Properties

* [server](cron.md#server)

### Accessors

* [acl](cron.md#acl)
* [appDelegate](cron.md#appdelegate)
* [cache](cron.md#cache)
* [configuration](cron.md#configuration)
* [cron](cron.md#cron)
* [dataStore](cron.md#datastore)
* [definitions](cron.md#definitions)
* [engine](cron.md#engine)
* [iam](cron.md#iam)
* [listener](cron.md#listener)
* [logger](cron.md#logger)

### Methods

* [checkTimers](cron.md#checktimers)
* [start](cron.md#start)
* [startTimers](cron.md#starttimers)
* [checkCron](cron.md#static-checkcron)
* [timeDue](cron.md#static-timedue)
* [timerEnded](cron.md#static-timerended)
* [timerScheduled](cron.md#static-timerscheduled)

## Constructors

###  constructor

\+ **new Cron**(`server`: [IBPMNServer](../interfaces/ibpmnserver.md)): *[Cron](cron.md)*

*Inherited from [ServerComponent](servercomponent.md).[constructor](servercomponent.md#constructor)*

Defined in bpmnServer/src/server/ServerComponent.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`server` | [IBPMNServer](../interfaces/ibpmnserver.md) |

**Returns:** *[Cron](cron.md)*

## Properties

###  server

• **server**: *any*

*Inherited from [ServerComponent](servercomponent.md).[server](servercomponent.md#server)*

Defined in bpmnServer/src/server/ServerComponent.ts:9

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

###  checkTimers

▸ **checkTimers**(`duration`: number): *Promise‹void›*

Defined in bpmnServer/src/server/Cron.ts:28

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`duration` | number | 0 |

**Returns:** *Promise‹void›*

___

###  start

▸ **start**(): *Promise‹void›*

*Implementation of [ICron](../interfaces/icron.md)*

Defined in bpmnServer/src/server/Cron.ts:31

**Returns:** *Promise‹void›*

___

###  startTimers

▸ **startTimers**(): *Promise‹void›*

*Implementation of [ICron](../interfaces/icron.md)*

Defined in bpmnServer/src/server/Cron.ts:34

**Returns:** *Promise‹void›*

___

### `Static` checkCron

▸ **checkCron**(`expression`: any, `referenceDateTime`: any): *number*

Defined in bpmnServer/src/server/Cron.ts:133

**Parameters:**

Name | Type |
------ | ------ |
`expression` | any |
`referenceDateTime` | any |

**Returns:** *number*

___

### `Static` timeDue

▸ **timeDue**(`expression`: any, `referenceDateTime`: any): *any*

Defined in bpmnServer/src/server/Cron.ts:152

**Parameters:**

Name | Type |
------ | ------ |
`expression` | any |
`referenceDateTime` | any |

**Returns:** *any*

___

### `Static` timerEnded

▸ **timerEnded**(`item`: any): *void*

Defined in bpmnServer/src/server/Cron.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

___

### `Static` timerScheduled

▸ **timerScheduled**(`timeDue`: any): *void*

Defined in bpmnServer/src/server/Cron.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`timeDue` | any |

**Returns:** *void*
