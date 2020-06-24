[bpmn-server](../README.md) › [IExecutionContext](iexecutioncontext.md)

# Interface: IExecutionContext

## Hierarchy

* **IExecutionContext**

## Implemented by

* [ExecutionContext](../classes/executioncontext.md)

## Index

### Properties

* [appDelegate](iexecutioncontext.md#appdelegate)
* [cache](iexecutioncontext.md#cache)
* [configuration](iexecutioncontext.md#configuration)
* [cron](iexecutioncontext.md#cron)
* [dataStore](iexecutioncontext.md#datastore)
* [definitions](iexecutioncontext.md#definitions)
* [engine](iexecutioncontext.md#engine)
* [errors](iexecutioncontext.md#errors)
* [execution](iexecutioncontext.md#optional-execution)
* [instance](iexecutioncontext.md#instance)
* [items](iexecutioncontext.md#items)
* [listener](iexecutioncontext.md#listener)
* [logger](iexecutioncontext.md#logger)
* [server](iexecutioncontext.md#server)

### Methods

* [error](iexecutioncontext.md#error)

## Properties

###  appDelegate

• **appDelegate**: *any*

Defined in src/interfaces/engine.ts:162

___

###  cache

• **cache**: *any*

Defined in src/interfaces/engine.ts:160

___

###  configuration

• **configuration**: *any*

Defined in src/interfaces/engine.ts:155

___

###  cron

• **cron**: *any*

Defined in src/interfaces/engine.ts:159

___

###  dataStore

• **dataStore**: *any*

Defined in src/interfaces/engine.ts:157

___

###  definitions

• **definitions**: *any*

Defined in src/interfaces/engine.ts:161

___

###  engine

• **engine**: *any*

Defined in src/interfaces/engine.ts:158

___

###  errors

• **errors**: *any*

Defined in src/interfaces/engine.ts:166

___

### `Optional` execution

• **execution**? : *[IExecution](iexecution.md)*

Defined in src/interfaces/engine.ts:164

___

###  instance

• **instance**: *any*

Defined in src/interfaces/engine.ts:169

___

###  items

• **items**: *[IItem](iitem.md)[]*

Defined in src/interfaces/engine.ts:167

___

###  listener

• **listener**: *any*

Defined in src/interfaces/engine.ts:165

___

###  logger

• **logger**: *any*

Defined in src/interfaces/engine.ts:156

___

###  server

• **server**: *any*

Defined in src/interfaces/engine.ts:154

## Methods

###  error

▸ **error**(`error`: any): *[IExecutionContext](iexecutioncontext.md)*

Defined in src/interfaces/engine.ts:168

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

**Returns:** *[IExecutionContext](iexecutioncontext.md)*
