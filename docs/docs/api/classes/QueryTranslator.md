[bpmn-server](../readme.md) / QueryTranslator

# Class: QueryTranslator

input Query:

```json
{		"items.status":"wait",
	"name": "Buy Used Car with Lanes",
	"$or":[
		{"items.candidateGroups":"Owner"},
		{"items.candidateUsers":"User1"}
		]
}
```
/*

MongoQuery:

```json
{	"name":"Buy Used Car with Lanes",
"$or":[
		{"items":{"$elemMatch":{"candidateGroups":"Owner"}}},
		{"items":{"$elemMatch":{"candidateUsers":"User1"}}}
	],
"items":{"$elemMatch":{"status":"wait"}
}
```

And filter items by performing the Query on each Instance Item 

Supported Operators:
- $or
- $lte
- $lt
- $gte
- $gt
- $eq
	Missing the following:
- $ne
- $regex
- $in
- $and

	https://www.mongodb.com/docs/manual/reference/operator/query/

## Table of contents

### Constructors

- [constructor](QueryTranslator.md#constructor)

### Properties

- [childName](QueryTranslator.md#childname)

### Methods

- [translateCriteria](QueryTranslator.md#translatecriteria)
- [filterOr](QueryTranslator.md#filteror)
- [filterItem](QueryTranslator.md#filteritem)
- [evaluateCondition](QueryTranslator.md#evaluatecondition)
- [evaluateValue](QueryTranslator.md#evaluatevalue)
- [parseComplexCondition](QueryTranslator.md#parsecomplexcondition)

## Constructors

### constructor

• **new QueryTranslator**(`childName`): [`QueryTranslator`](QueryTranslator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `childName` | `any` |

#### Returns

[`QueryTranslator`](QueryTranslator.md)

#### Defined in

[packages/bpmn-server/src/datastore/QueryTranslator.ts:51](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/QueryTranslator.ts#L51)

## Properties

### childName

• **childName**: `any`

#### Defined in

[packages/bpmn-server/src/datastore/QueryTranslator.ts:50](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/QueryTranslator.ts#L50)

## Methods

### translateCriteria

▸ **translateCriteria**(`query`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Object`

#### Defined in

[packages/bpmn-server/src/datastore/QueryTranslator.ts:54](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/QueryTranslator.ts#L54)

___

### filterOr

▸ **filterOr**(`item`, `condition`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `condition` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/datastore/QueryTranslator.ts:86](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/QueryTranslator.ts#L86)

___

### filterItem

▸ **filterItem**(`item`, `query`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `query` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/datastore/QueryTranslator.ts:95](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/QueryTranslator.ts#L95)

___

### evaluateCondition

▸ **evaluateCondition**(`i`, `condition`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `any` |
| `condition` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/datastore/QueryTranslator.ts:116](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/QueryTranslator.ts#L116)

___

### evaluateValue

▸ **evaluateValue**(`i`, `key`, `cond`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `any` |
| `key` | `any` |
| `cond` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/datastore/QueryTranslator.ts:130](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/QueryTranslator.ts#L130)

___

### parseComplexCondition

▸ **parseComplexCondition**(`condition`, `val`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `condition` | `any` |
| `val` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/datastore/QueryTranslator.ts:166](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/QueryTranslator.ts#L166)
