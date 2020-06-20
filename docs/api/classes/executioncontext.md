[bpmn-server](../README.md) › [ExecutionContext](executioncontext.md)

# Class: ExecutionContext

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **ExecutionContext**

## Index

### Constructors

* [constructor](executioncontext.md#constructor)

### Properties

* [dataStore](executioncontext.md#datastore)
* [errors](executioncontext.md#errors)
* [execution](executioncontext.md#optional-execution)
* [listener](executioncontext.md#listener)
* [logger](executioncontext.md#logger)
* [server](executioncontext.md#server)

### Accessors

* [appDelegate](executioncontext.md#appdelegate)
* [cache](executioncontext.md#cache)
* [configuration](executioncontext.md#configuration)
* [cron](executioncontext.md#cron)
* [definitions](executioncontext.md#definitions)
* [engine](executioncontext.md#engine)
* [eventsRegistry](executioncontext.md#eventsregistry)
* [items](executioncontext.md#items)

### Methods

* [error](executioncontext.md#error)

## Constructors

###  constructor

\+ **new ExecutionContext**(`server`: [BPMNServer](bpmnserver.md)): *[ExecutionContext](executioncontext.md)*

*Inherited from [Cron](cron.md).[constructor](cron.md#constructor)*

Defined in src/server/ServerContext.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`server` | [BPMNServer](bpmnserver.md) |

**Returns:** *[ExecutionContext](executioncontext.md)*

## Properties

###  dataStore

• **dataStore**: *any*

*Overrides [Cron](cron.md).[dataStore](cron.md#datastore)*

Defined in src/server/ServerContext.ts:30

___

###  errors

• **errors**: *any*

Defined in src/server/ServerContext.ts:31

___

### `Optional` execution

• **execution**? : *[IExecution](../interfaces/iexecution.md)*

Defined in src/server/ServerContext.ts:27

___

###  listener

• **listener**: *any*

Defined in src/server/ServerContext.ts:29

___

###  logger

• **logger**: *any*

*Overrides [Cron](cron.md).[logger](cron.md#logger)*

Defined in src/server/ServerContext.ts:28

___

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

###  items

• **get items**(): *[IItem](../interfaces/iitem.md)[]*

Defined in src/server/ServerContext.ts:32

**Returns:** *[IItem](../interfaces/iitem.md)[]*

## Methods

###  error

▸ **error**(`error`: any): *[ExecutionContext](executioncontext.md)*

Defined in src/server/ServerContext.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

**Returns:** *[ExecutionContext](executioncontext.md)*
