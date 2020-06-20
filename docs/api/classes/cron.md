[bpmn-server](../README.md) › [Cron](cron.md)

# Class: Cron

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **Cron**

## Index

### Constructors

* [constructor](cron.md#constructor)

### Properties

* [server](cron.md#server)
* [checkingTimers](cron.md#static-checkingtimers)
* [timersFired](cron.md#static-timersfired)

### Accessors

* [appDelegate](cron.md#appdelegate)
* [cache](cron.md#cache)
* [configuration](cron.md#configuration)
* [cron](cron.md#cron)
* [dataStore](cron.md#datastore)
* [definitions](cron.md#definitions)
* [engine](cron.md#engine)
* [eventsRegistry](cron.md#eventsregistry)
* [logger](cron.md#logger)

### Methods

* [_checkTimers](cron.md#_checktimers)
* [checkTimers](cron.md#checktimers)
* [findEventById](cron.md#findeventbyid)
* [findEvents](cron.md#findevents)
* [start](cron.md#start)
* [timersFired](cron.md#timersfired)

## Constructors

###  constructor

\+ **new Cron**(`server`: [BPMNServer](bpmnserver.md)): *[Cron](cron.md)*

*Inherited from [Cron](cron.md).[constructor](cron.md#constructor)*

Defined in src/server/ServerContext.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`server` | [BPMNServer](bpmnserver.md) |

**Returns:** *[Cron](cron.md)*

## Properties

###  server

• **server**: *any*

*Inherited from [Cron](cron.md).[server](cron.md#server)*

Defined in src/server/ServerContext.ts:11

___

### `Static` checkingTimers

▪ **checkingTimers**: *boolean* = false

Defined in src/server/Cron.ts:10

___

### `Static` timersFired

▪ **timersFired**: *number* = 0

Defined in src/server/Cron.ts:11

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

###  _checkTimers

▸ **_checkTimers**(): *Promise‹void›*

Defined in src/server/Cron.ts:25

**Returns:** *Promise‹void›*

___

###  checkTimers

▸ **checkTimers**(`duration`: number): *Promise‹void›*

Defined in src/server/Cron.ts:16

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`duration` | number | 0 |

**Returns:** *Promise‹void›*

___

###  findEventById

▸ **findEventById**(`signalId`: string): *Promise‹[IEventData](../interfaces/ieventdata.md)›*

Defined in src/server/Cron.ts:82

**Parameters:**

Name | Type |
------ | ------ |
`signalId` | string |

**Returns:** *Promise‹[IEventData](../interfaces/ieventdata.md)›*

___

###  findEvents

▸ **findEvents**(`query`: any): *Promise‹[IEventData](../interfaces/ieventdata.md)[]›*

Defined in src/server/Cron.ts:77

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹[IEventData](../interfaces/ieventdata.md)[]›*

___

###  start

▸ **start**(): *Promise‹void›*

Defined in src/server/Cron.ts:22

**Returns:** *Promise‹void›*

___

###  timersFired

▸ **timersFired**(): *void*

Defined in src/server/Cron.ts:13

**Returns:** *void*
