[bpmn-server](../README.md) › [HitPolicy](hitpolicy.md)

# Class: HitPolicy

## Hierarchy

* **HitPolicy**

## Index

### Constructors

* [constructor](hitpolicy.md#constructor)

### Properties

* [dt](hitpolicy.md#dt)
* [hitPolicy](hitpolicy.md#hitpolicy)

### Accessors

* [processAll](hitpolicy.md#processall)

### Methods

* [checkSameResults](hitpolicy.md#checksameresults)
* [error](hitpolicy.md#error)
* [getValidResults](hitpolicy.md#getvalidresults)
* [processResults](hitpolicy.md#processresults)
* [sortOutput](hitpolicy.md#sortoutput)

## Constructors

###  constructor

\+ **new HitPolicy**(`decisionTable`: any, `hitPolicy`: any): *[HitPolicy](hitpolicy.md)*

Defined in bpmnServer/node_modules/dmn-engine/HitPolicy.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`decisionTable` | any |
`hitPolicy` | any |

**Returns:** *[HitPolicy](hitpolicy.md)*

## Properties

###  dt

• **dt**: *[DecisionTable](decisiontable.md)*

Defined in bpmnServer/node_modules/dmn-engine/HitPolicy.ts:21

___

###  hitPolicy

• **hitPolicy**: *[HIT_POLICY](../enums/hit_policy.md)*

Defined in bpmnServer/node_modules/dmn-engine/HitPolicy.ts:20

## Accessors

###  processAll

• **get processAll**(): *boolean*

Defined in bpmnServer/node_modules/dmn-engine/HitPolicy.ts:26

**Returns:** *boolean*

## Methods

###  checkSameResults

▸ **checkSameResults**(`results`: any): *boolean*

Defined in bpmnServer/node_modules/dmn-engine/HitPolicy.ts:123

checks to see if all results have same values

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`results` | any |   |

**Returns:** *boolean*

___

###  error

▸ **error**(`msg`: any, `output`: any): *any*

Defined in bpmnServer/node_modules/dmn-engine/HitPolicy.ts:33

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |
`output` | any |

**Returns:** *any*

___

###  getValidResults

▸ **getValidResults**(`output`: any): *any[]*

Defined in bpmnServer/node_modules/dmn-engine/HitPolicy.ts:152

**Parameters:**

Name | Type |
------ | ------ |
`output` | any |

**Returns:** *any[]*

___

###  processResults

▸ **processResults**(`output`: any): *any*

Defined in bpmnServer/node_modules/dmn-engine/HitPolicy.ts:42

**Parameters:**

Name | Type |
------ | ------ |
`output` | any |

**Returns:** *any*

___

###  sortOutput

▸ **sortOutput**(`results`: any, `orderValues`: any): *any*

Defined in bpmnServer/node_modules/dmn-engine/HitPolicy.ts:210

Sorts results based on values provided

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`results` | any | - |
`orderValues` | any |   |

**Returns:** *any*
