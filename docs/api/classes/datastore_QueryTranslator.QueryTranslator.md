[bpmn-server](../README.md) / [Exports](../modules.md) / [datastore/QueryTranslator](../modules/datastore_QueryTranslator.md) / QueryTranslator

# Class: QueryTranslator

[datastore/QueryTranslator](../modules/datastore_QueryTranslator.md).QueryTranslator

input Query:
{"items.status":"wait",
	"name": "Buy Used Car with Lanes",
	"$or":[
		{"items.candidateGroups":"Owner"},
		{"items.candidateUsers":"User1"}
		]
		};

/*

MongoQuery:

{"name":"Buy Used Car with Lanes",
"$or":[
		{"items":{"$elemMatch":{"candidateGroups":"Owner"}}},
		{"items":{"$elemMatch":{"candidateUsers":"User1"}}}
	],
"items":{"$elemMatch":{"status":"wait"}}

And filter items by performing the Query on each Instance Item 

Supported Operators:
		$or
		$lte
		$lt
		$gte
		$gt
		$eq
	Missing the following:
		$ne
		$regex
		$in
		$and
		
	https://www.mongodb.com/docs/manual/reference/operator/query/

## Table of contents

### Constructors

- [constructor](datastore_QueryTranslator.QueryTranslator.md#constructor)

### Properties

- [childName](datastore_QueryTranslator.QueryTranslator.md#childname)

### Methods

- [evaluateCondition](datastore_QueryTranslator.QueryTranslator.md#evaluatecondition)
- [filterItem](datastore_QueryTranslator.QueryTranslator.md#filteritem)
- [filterOr](datastore_QueryTranslator.QueryTranslator.md#filteror)
- [parseComplexCondition](datastore_QueryTranslator.QueryTranslator.md#parsecomplexcondition)
- [translateCriteria](datastore_QueryTranslator.QueryTranslator.md#translatecriteria)

## Constructors

### constructor

• **new QueryTranslator**(`childName`): [`QueryTranslator`](datastore_QueryTranslator.QueryTranslator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `childName` | `any` |

#### Returns

[`QueryTranslator`](datastore_QueryTranslator.QueryTranslator.md)

#### Defined in

[src/datastore/QueryTranslator.ts:46](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/QueryTranslator.ts#L46)

## Properties

### childName

• **childName**: `any`

#### Defined in

[src/datastore/QueryTranslator.ts:45](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/QueryTranslator.ts#L45)

## Methods

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

[src/datastore/QueryTranslator.ts:111](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/QueryTranslator.ts#L111)

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

[src/datastore/QueryTranslator.ts:90](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/QueryTranslator.ts#L90)

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

[src/datastore/QueryTranslator.ts:81](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/QueryTranslator.ts#L81)

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

[src/datastore/QueryTranslator.ts:151](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/QueryTranslator.ts#L151)

___

### translateCriteria

▸ **translateCriteria**(`query`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Object`

#### Defined in

[src/datastore/QueryTranslator.ts:49](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/QueryTranslator.ts#L49)
