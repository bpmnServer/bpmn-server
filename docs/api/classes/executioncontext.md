[bpmn-server](../README.md) › [ExecutionContext](executioncontext.md)

# Class: ExecutionContext

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **ExecutionContext**

## Implements

* [IExecutionContext](../interfaces/iexecutioncontext.md)

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
* [instance](executioncontext.md#instance)
* [items](executioncontext.md#items)

### Methods

* [error](executioncontext.md#error)

## Constructors

###  constructor

\+ **new ExecutionContext**(`server`: [IBPMNServer](../interfaces/ibpmnserver.md)): *[ExecutionContext](executioncontext.md)*

*Overrides [ServerComponent](servercomponent.md).[constructor](servercomponent.md#constructor)*

Defined in src/server/ServerContext.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`server` | [IBPMNServer](../interfaces/ibpmnserver.md) |

**Returns:** *[ExecutionContext](executioncontext.md)*

## Properties

###  dataStore

• **dataStore**: *any*

*Implementation of [IExecutionContext](../interfaces/iexecutioncontext.md).[dataStore](../interfaces/iexecutioncontext.md#datastore)*

*Overrides [ServerComponent](servercomponent.md).[dataStore](servercomponent.md#datastore)*

Defined in src/server/ServerContext.ts:27

___

###  errors

• **errors**: *any*

*Implementation of [IExecutionContext](../interfaces/iexecutioncontext.md).[errors](../interfaces/iexecutioncontext.md#errors)*

Defined in src/server/ServerContext.ts:28

___

### `Optional` execution

• **execution**? : *[IExecution](../interfaces/iexecution.md)*

*Implementation of [IExecutionContext](../interfaces/iexecutioncontext.md).[execution](../interfaces/iexecutioncontext.md#optional-execution)*

Defined in src/server/ServerContext.ts:24

___

###  listener

• **listener**: *any*

*Implementation of [IExecutionContext](../interfaces/iexecutioncontext.md).[listener](../interfaces/iexecutioncontext.md#listener)*

Defined in src/server/ServerContext.ts:26

___

###  logger

• **logger**: *any*

*Implementation of [IExecutionContext](../interfaces/iexecutioncontext.md).[logger](../interfaces/iexecutioncontext.md#logger)*

*Overrides [ServerComponent](servercomponent.md).[logger](servercomponent.md#logger)*

Defined in src/server/ServerContext.ts:25

___

###  server

• **server**: *any*

*Implementation of [IExecutionContext](../interfaces/iexecutioncontext.md).[server](../interfaces/iexecutioncontext.md#server)*

*Inherited from [ServerComponent](servercomponent.md).[server](servercomponent.md#server)*

Defined in src/server/ServerContext.ts:9

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

###  instance

• **get instance**(): *[IInstanceData](../interfaces/iinstancedata.md)*

Defined in src/server/ServerContext.ts:32

**Returns:** *[IInstanceData](../interfaces/iinstancedata.md)*

___

###  items

• **get items**(): *[IItem](../interfaces/iitem.md)[]*

Defined in src/server/ServerContext.ts:40

**Returns:** *[IItem](../interfaces/iitem.md)[]*

## Methods

###  error

▸ **error**(`error`: any): *[IExecutionContext](../interfaces/iexecutioncontext.md)*

*Implementation of [IExecutionContext](../interfaces/iexecutioncontext.md)*

Defined in src/server/ServerContext.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

**Returns:** *[IExecutionContext](../interfaces/iexecutioncontext.md)*
