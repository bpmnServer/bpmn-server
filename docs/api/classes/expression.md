[bpmn-server](../README.md) › [Expression](expression.md)

# Class: Expression

## Hierarchy

* **Expression**

  ↳ [Condition](condition.md)

## Index

### Constructors

* [constructor](expression.md#constructor)

### Properties

* [ast](expression.md#ast)
* [script](expression.md#script)

### Accessors

* [isCondition](expression.md#iscondition)

### Methods

* [compile](expression.md#compile)
* [display](expression.md#display)
* [evaluate](expression.md#evaluate)
* [getState](expression.md#getstate)
* [load](expression.md#static-load)

## Constructors

###  constructor

\+ **new Expression**(`script`: any): *[Expression](expression.md)*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:8

**Parameters:**

Name | Type |
------ | ------ |
`script` | any |

**Returns:** *[Expression](expression.md)*

## Properties

###  ast

• **ast**: *any*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:8

___

###  script

• **script**: *any*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:7

## Accessors

###  isCondition

• **get isCondition**(): *Boolean*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:12

**Returns:** *Boolean*

## Methods

###  compile

▸ **compile**(): *Promise‹void›*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:19

**Returns:** *Promise‹void›*

___

###  display

▸ **display**(): *void*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:28

**Returns:** *void*

___

###  evaluate

▸ **evaluate**(`data`: any): *Promise‹any›*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹any›*

___

###  getState

▸ **getState**(): *this*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:25

**Returns:** *this*

___

### `Static` load

▸ **load**(`json`: any): *[Expression](expression.md)*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`json` | any |

**Returns:** *[Expression](expression.md)*
