[bpmn-server](../README.md) › [IExecutionContext](iexecutioncontext.md)

# Interface: IExecutionContext

## Hierarchy

* **IExecutionContext**

## Index

### Properties

* [dataStore](iexecutioncontext.md#datastore)
* [errors](iexecutioncontext.md#errors)
* [execution](iexecutioncontext.md#optional-execution)
* [items](iexecutioncontext.md#items)
* [listener](iexecutioncontext.md#listener)
* [logger](iexecutioncontext.md#logger)

### Methods

* [error](iexecutioncontext.md#error)

## Properties

###  dataStore

• **dataStore**: *any*

Defined in src/interfaces/engine.ts:154

___

###  errors

• **errors**: *any*

Defined in src/interfaces/engine.ts:155

___

### `Optional` execution

• **execution**? : *[IExecution](iexecution.md)*

Defined in src/interfaces/engine.ts:151

___

###  items

• **items**: *[IItem](iitem.md)[]*

Defined in src/interfaces/engine.ts:156

___

###  listener

• **listener**: *any*

Defined in src/interfaces/engine.ts:153

___

###  logger

• **logger**: *any*

Defined in src/interfaces/engine.ts:152

## Methods

###  error

▸ **error**(`error`: any): *[IExecutionContext](iexecutioncontext.md)*

Defined in src/interfaces/engine.ts:157

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

**Returns:** *[IExecutionContext](iexecutioncontext.md)*
