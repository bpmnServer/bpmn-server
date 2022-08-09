[bpmn-server](../README.md) › [Condition](condition.md)

# Class: Condition

## Hierarchy

* [Expression](expression.md)

  ↳ **Condition**

## Index

### Constructors

* [constructor](condition.md#constructor)

### Properties

* [ast](condition.md#ast)
* [script](condition.md#script)
* [variableName](condition.md#variablename)

### Accessors

* [isCondition](condition.md#iscondition)

### Methods

* [compile](condition.md#compile)
* [display](condition.md#display)
* [evaluate](condition.md#evaluate)
* [getState](condition.md#getstate)
* [load](condition.md#static-load)

## Constructors

###  constructor

\+ **new Condition**(`script`: any, `variableName`: any): *[Condition](condition.md)*

*Overrides [Expression](expression.md).[constructor](expression.md#constructor)*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:58

**Parameters:**

Name | Type |
------ | ------ |
`script` | any |
`variableName` | any |

**Returns:** *[Condition](condition.md)*

## Properties

###  ast

• **ast**: *any*

*Inherited from [Expression](expression.md).[ast](expression.md#ast)*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:8

___

###  script

• **script**: *any*

*Inherited from [Expression](expression.md).[script](expression.md#script)*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:7

___

###  variableName

• **variableName**: *any*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:58

## Accessors

###  isCondition

• **get isCondition**(): *Boolean*

*Overrides [Expression](expression.md).[isCondition](expression.md#iscondition)*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:57

**Returns:** *Boolean*

## Methods

###  compile

▸ **compile**(): *Promise‹void›*

*Overrides [Expression](expression.md).[compile](expression.md#compile)*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:64

**Returns:** *Promise‹void›*

___

###  display

▸ **display**(): *void*

*Inherited from [Expression](expression.md).[display](expression.md#display)*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:28

**Returns:** *void*

___

###  evaluate

▸ **evaluate**(`data`: any): *Promise‹any›*

*Overrides [Expression](expression.md).[evaluate](expression.md#evaluate)*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹any›*

___

###  getState

▸ **getState**(): *this*

*Inherited from [Expression](expression.md).[getState](expression.md#getstate)*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:25

**Returns:** *this*

___

### `Static` load

▸ **load**(`json`: any): *[Expression](expression.md)*

*Inherited from [Expression](expression.md).[load](expression.md#static-load)*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`json` | any |

**Returns:** *[Expression](expression.md)*
