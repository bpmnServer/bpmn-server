[bpmn-server](../README.md) › [ExecutionResponse](executionresponse.md)

# Class: ExecutionResponse

## Hierarchy

* **ExecutionResponse**

## Index

### Constructors

* [constructor](executionresponse.md#constructor)

### Properties

* [errors](executionresponse.md#errors)
* [instance](executionresponse.md#instance)

### Accessors

* [execution](executionresponse.md#execution)
* [items](executionresponse.md#items)

## Constructors

###  constructor

\+ **new ExecutionResponse**(`execution`: [IExecution](../interfaces/iexecution.md), `errors`: any): *[ExecutionResponse](executionresponse.md)*

Defined in src/server/ServerContext.ts:41

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`execution` | [IExecution](../interfaces/iexecution.md) | - |
`errors` | any | null |

**Returns:** *[ExecutionResponse](executionresponse.md)*

## Properties

###  errors

• **errors**: *any*

Defined in src/server/ServerContext.ts:51

___

###  instance

• **instance**: *[IInstanceData](../interfaces/iinstancedata.md)*

Defined in src/server/ServerContext.ts:49

## Accessors

###  execution

• **get execution**(): *[IInstanceData](../interfaces/iinstancedata.md)*

Defined in src/server/ServerContext.ts:50

**Returns:** *[IInstanceData](../interfaces/iinstancedata.md)*

___

###  items

• **get items**(): *[IItemData](../interfaces/iitemdata.md)[]*

Defined in src/server/ServerContext.ts:52

**Returns:** *[IItemData](../interfaces/iitemdata.md)[]*
