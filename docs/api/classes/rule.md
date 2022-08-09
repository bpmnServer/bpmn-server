[bpmn-server](../README.md) › [Rule](rule.md)

# Class: Rule

## Hierarchy

* **Rule**

## Index

### Constructors

* [constructor](rule.md#constructor)

### Properties

* [actionVars](rule.md#actionvars)
* [actions](rule.md#actions)
* [conditionVars](rule.md#conditionvars)
* [conditions](rule.md#conditions)
* [id](rule.md#id)

### Methods

* [asJson](rule.md#asjson)
* [compile](rule.md#compile)
* [evaluate](rule.md#evaluate)

## Constructors

###  constructor

\+ **new Rule**(`id`: any, `conditions`: string[], `actions`: string[], `conditionVars`: [InputClause](inputclause.md)[], `actionVars`: [OutputClause](outputclause.md)[]): *[Rule](rule.md)*

Defined in bpmnServer/node_modules/dmn-engine/Rule.ts:10

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`conditions` | string[] |
`actions` | string[] |
`conditionVars` | [InputClause](inputclause.md)[] |
`actionVars` | [OutputClause](outputclause.md)[] |

**Returns:** *[Rule](rule.md)*

## Properties

###  actionVars

• **actionVars**: *[OutputClause](outputclause.md)[]*

Defined in bpmnServer/node_modules/dmn-engine/Rule.ts:10

___

###  actions

• **actions**: *[Expression](expression.md)[]*

Defined in bpmnServer/node_modules/dmn-engine/Rule.ts:8

___

###  conditionVars

• **conditionVars**: *[InputClause](inputclause.md)[]*

Defined in bpmnServer/node_modules/dmn-engine/Rule.ts:9

___

###  conditions

• **conditions**: *[Condition](condition.md)[]*

Defined in bpmnServer/node_modules/dmn-engine/Rule.ts:7

___

###  id

• **id**: *any*

Defined in bpmnServer/node_modules/dmn-engine/Rule.ts:6

## Methods

###  asJson

▸ **asJson**(): *any[]*

Defined in bpmnServer/node_modules/dmn-engine/Rule.ts:29

**Returns:** *any[]*

___

###  compile

▸ **compile**(): *any*

Defined in bpmnServer/node_modules/dmn-engine/Rule.ts:36

**Returns:** *any*

___

###  evaluate

▸ **evaluate**(`data`: any, `result`: any): *Promise‹boolean›*

Defined in bpmnServer/node_modules/dmn-engine/Rule.ts:42

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |
`result` | any |

**Returns:** *Promise‹boolean›*
