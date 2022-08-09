[bpmn-server](../README.md) › [DecisionTable](decisiontable.md)

# Class: DecisionTable

## Hierarchy

* **DecisionTable**

## Index

### Constructors

* [constructor](decisiontable.md#constructor)

### Properties

* [actionVars](decisiontable.md#actionvars)
* [conditionVars](decisiontable.md#conditionvars)
* [hitPolicy](decisiontable.md#hitpolicy)
* [name](decisiontable.md#name)
* [rules](decisiontable.md#rules)

### Methods

* [asJson](decisiontable.md#asjson)
* [compile](decisiontable.md#compile)
* [evaluate](decisiontable.md#evaluate)
* [save](decisiontable.md#save)
* [execute](decisiontable.md#static-execute)
* [load](decisiontable.md#static-load)

## Constructors

###  constructor

\+ **new DecisionTable**(`__namedParameters`: object): *[DecisionTable](decisiontable.md)*

Defined in bpmnServer/node_modules/dmn-engine/DecisionTable.ts:30

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`actionVars` | any |
`conditionVars` | any |
`hitPolicy` | any |
`name` | any |
`rules` | any |

**Returns:** *[DecisionTable](decisiontable.md)*

## Properties

###  actionVars

• **actionVars**: *[OutputClause](outputclause.md)[]*

Defined in bpmnServer/node_modules/dmn-engine/DecisionTable.ts:28

___

###  conditionVars

• **conditionVars**: *[InputClause](inputclause.md)[]*

Defined in bpmnServer/node_modules/dmn-engine/DecisionTable.ts:27

___

###  hitPolicy

• **hitPolicy**: *[HitPolicy](hitpolicy.md)*

Defined in bpmnServer/node_modules/dmn-engine/DecisionTable.ts:30

___

###  name

• **name**: *any*

Defined in bpmnServer/node_modules/dmn-engine/DecisionTable.ts:26

___

###  rules

• **rules**: *[Rule](rule.md)[]*

Defined in bpmnServer/node_modules/dmn-engine/DecisionTable.ts:29

## Methods

###  asJson

▸ **asJson**(): *string*

Defined in bpmnServer/node_modules/dmn-engine/DecisionTable.ts:111

**Returns:** *string*

___

###  compile

▸ **compile**(): *object*

Defined in bpmnServer/node_modules/dmn-engine/DecisionTable.ts:62

**Returns:** *object*

* **rules**: *undefined[]* = []

___

###  evaluate

▸ **evaluate**(`data`: any): *Promise‹any›*

Defined in bpmnServer/node_modules/dmn-engine/DecisionTable.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹any›*

___

###  save

▸ **save**(`fileName`: any): *void*

Defined in bpmnServer/node_modules/dmn-engine/DecisionTable.ts:99

**Parameters:**

Name | Type |
------ | ------ |
`fileName` | any |

**Returns:** *void*

___

### `Static` execute

▸ **execute**(`dtDefinition`: any, `data`: any): *Promise‹object›*

Defined in bpmnServer/node_modules/dmn-engine/DecisionTable.ts:52

Execute a DT on the fly, passing multiple records
used for WebAPI

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dtDefinition` | any | - |
`data` | any |   |

**Returns:** *Promise‹object›*

___

### `Static` load

▸ **load**(`fileName`: any): *[DecisionTable](decisiontable.md)‹›*

Defined in bpmnServer/node_modules/dmn-engine/DecisionTable.ts:103

**Parameters:**

Name | Type |
------ | ------ |
`fileName` | any |

**Returns:** *[DecisionTable](decisiontable.md)‹›*
