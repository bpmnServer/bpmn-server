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
* [input](iexecutioncontext.md#input)
* [instance](iexecutioncontext.md#instance)
* [item](iexecutioncontext.md#item)
* [items](iexecutioncontext.md#items)
* [listener](iexecutioncontext.md#listener)
* [logger](iexecutioncontext.md#logger)
* [messageMatchingKey](iexecutioncontext.md#messagematchingkey)
* [output](iexecutioncontext.md#output)
* [parentContext](iexecutioncontext.md#optional-parentcontext)
* [process](iexecutioncontext.md#process)
* [server](iexecutioncontext.md#server)

### Methods

* [error](iexecutioncontext.md#error)

## Properties

###  appDelegate

• **appDelegate**: *any*

Defined in src/interfaces/engine.ts:165

___

###  cache

• **cache**: *any*

Defined in src/interfaces/engine.ts:163

___

###  configuration

• **configuration**: *any*

Defined in src/interfaces/engine.ts:158

___

###  cron

• **cron**: *any*

Defined in src/interfaces/engine.ts:162

___

###  dataStore

• **dataStore**: *any*

Defined in src/interfaces/engine.ts:160

___

###  definitions

• **definitions**: *any*

Defined in src/interfaces/engine.ts:164

___

###  engine

• **engine**: *any*

Defined in src/interfaces/engine.ts:161

___

###  errors

• **errors**: *any*

Defined in src/interfaces/engine.ts:179

___

### `Optional` execution

• **execution**? : *[IExecution](iexecution.md)*

Defined in src/interfaces/engine.ts:167

___

###  input

• **input**: *any*

Defined in src/interfaces/engine.ts:174

___

###  instance

• **instance**: *any*

Defined in src/interfaces/engine.ts:170

___

###  item

• **item**: *any*

Defined in src/interfaces/engine.ts:173

___

###  items

• **items**: *[IItem](iitem.md)[]*

Defined in src/interfaces/engine.ts:180

___

###  listener

• **listener**: *any*

Defined in src/interfaces/engine.ts:168

___

###  logger

• **logger**: *any*

Defined in src/interfaces/engine.ts:159

___

###  messageMatchingKey

• **messageMatchingKey**: *any*

Defined in src/interfaces/engine.ts:176

___

###  output

• **output**: *any*

Defined in src/interfaces/engine.ts:175

___

### `Optional` parentContext

• **parentContext**? : *[IExecutionContext](iexecutioncontext.md)*

Defined in src/interfaces/engine.ts:185

___

###  process

• **process**: *any*

Defined in src/interfaces/engine.ts:172

___

###  server

• **server**: *any*

Defined in src/interfaces/engine.ts:157

## Methods

###  error

▸ **error**(`error`: any): *[IExecutionContext](iexecutioncontext.md)*

Defined in src/interfaces/engine.ts:181

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

**Returns:** *[IExecutionContext](iexecutioncontext.md)*
