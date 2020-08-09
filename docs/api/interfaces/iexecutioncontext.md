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
* [item](iexecutioncontext.md#item)
* [items](iexecutioncontext.md#items)
* [listener](iexecutioncontext.md#listener)
* [logger](iexecutioncontext.md#logger)
* [parentContext](iexecutioncontext.md#optional-parentcontext)
* [process](iexecutioncontext.md#process)
* [response](iexecutioncontext.md#response)
* [server](iexecutioncontext.md#server)

### Methods

* [error](iexecutioncontext.md#error)

## Properties

###  appDelegate

• **appDelegate**: *any*

Defined in src/interfaces/engine.ts:171

___

###  cache

• **cache**: *any*

Defined in src/interfaces/engine.ts:169

___

###  configuration

• **configuration**: *any*

Defined in src/interfaces/engine.ts:164

___

###  cron

• **cron**: *any*

Defined in src/interfaces/engine.ts:168

___

###  dataStore

• **dataStore**: *any*

Defined in src/interfaces/engine.ts:166

___

###  definitions

• **definitions**: *any*

Defined in src/interfaces/engine.ts:170

___

###  engine

• **engine**: *any*

Defined in src/interfaces/engine.ts:167

___

###  errors

• **errors**: *any*

Defined in src/interfaces/engine.ts:183

___

### `Optional` execution

• **execution**? : *[IExecution](iexecution.md)*

Defined in src/interfaces/engine.ts:173

___

###  instance

• **instance**: *any*

Defined in src/interfaces/engine.ts:176

___

###  item

• **item**: *any*

Defined in src/interfaces/engine.ts:179

___

###  items

• **items**: *[IItem](iitem.md)[]*

Defined in src/interfaces/engine.ts:184

___

###  listener

• **listener**: *any*

Defined in src/interfaces/engine.ts:174

___

###  logger

• **logger**: *any*

Defined in src/interfaces/engine.ts:165

___

### `Optional` parentContext

• **parentContext**? : *[IExecutionContext](iexecutioncontext.md)*

Defined in src/interfaces/engine.ts:189

___

###  process

• **process**: *any*

Defined in src/interfaces/engine.ts:178

___

###  response

• **response**: *[IExecutionResponse](iexecutionresponse.md)*

Defined in src/interfaces/engine.ts:180

___

###  server

• **server**: *any*

Defined in src/interfaces/engine.ts:163

## Methods

###  error

▸ **error**(`error`: any): *[IExecutionContext](iexecutioncontext.md)*

Defined in src/interfaces/engine.ts:185

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

**Returns:** *[IExecutionContext](iexecutioncontext.md)*
