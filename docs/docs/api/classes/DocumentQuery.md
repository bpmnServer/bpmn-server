[bpmn-server](../readme.md) / DocumentQuery

# Class: DocumentQuery

Evaluates the engine's MongoDB-style queries, projections, sorts and updates over plain JSON
documents: the shared semantics of every non-MongoDB [IDocumentStore](../interfaces/IDocumentStore.md) (the in-memory store;
adapters that keep documents as JSON in another database). An operator it does not know is
refused, never ignored.

## Table of contents

### Constructors

- [constructor](DocumentQuery.md#constructor)

### Methods

- [matches](DocumentQuery.md#matches)
- [values](DocumentQuery.md#values)
- [first](DocumentQuery.md#first)
- [list](DocumentQuery.md#list)
- [isOperatorObject](DocumentQuery.md#isoperatorobject)
- [candidates](DocumentQuery.md#candidates)
- [matchCondition](DocumentQuery.md#matchcondition)
- [comparable](DocumentQuery.md#comparable)
- [equal](DocumentQuery.md#equal)
- [compare](DocumentQuery.md#compare)
- [project](DocumentQuery.md#project)
- [sort](DocumentQuery.md#sort)
- [apply](DocumentQuery.md#apply)
- [seed](DocumentQuery.md#seed)
- [indexKey](DocumentQuery.md#indexkey)

## Constructors

### constructor

• **new DocumentQuery**(): [`DocumentQuery`](DocumentQuery.md)

#### Returns

[`DocumentQuery`](DocumentQuery.md)

## Methods

### matches

▸ **matches**(`doc`, `query`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `doc` | `any` |
| `query` | [`StorageQuery`](../readme.md#storagequery) |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:11](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L11)

___

### values

▸ **values**(`doc`, `path`): `any`[]

The values at a dotted path, descending into arrays (as MongoDB does): every value reached, arrays included
as themselves. An array's element that lacks the field gives `undefined`, so `{ 'items.assignee': null }`
matches an item without an assignee, as in MongoDB, whether the field is absent or `undefined`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `doc` | `any` |
| `path` | `string` |

#### Returns

`any`[]

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L30)

___

### first

▸ **first**(`doc`, `path`): `any`

The first value at a path that is there: what a sort or a unique index is keyed by.

#### Parameters

| Name | Type |
| :------ | :------ |
| `doc` | `any` |
| `path` | `string` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:48](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L48)

___

### list

▸ **list**(`condition`, `operator`): [`StorageQuery`](../readme.md#storagequery)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `condition` | `any` |
| `operator` | `string` |

#### Returns

[`StorageQuery`](../readme.md#storagequery)[]

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:52](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L52)

___

### isOperatorObject

▸ **isOperatorObject**(`condition`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `condition` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:57](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L57)

___

### candidates

▸ **candidates**(`values`): `any`[]

Each value, and each element of an array value: what an equality or comparison is tried against.

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `any`[] |

#### Returns

`any`[]

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:63](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L63)

___

### matchCondition

▸ **matchCondition**(`values`, `condition`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `any`[] |
| `condition` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:69](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L69)

___

### comparable

▸ **comparable**(`value`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:95](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L95)

___

### equal

▸ **equal**(`a`, `b`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `any` |
| `b` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:101](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L101)

___

### compare

▸ **compare**(`a`, `b`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `any` |
| `b` | `any` |

#### Returns

`number`

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:109](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L109)

___

### project

▸ **project**(`doc`, `projection`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `doc` | `any` |
| `projection` | `Record`\<`string`, `any`\> |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:114](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L114)

___

### sort

▸ **sort**(`docs`, `sort`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `docs` | `any`[] |
| `sort` | `Record`\<`string`, ``-1`` \| ``1``\> |

#### Returns

`any`[]

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:133](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L133)

___

### apply

▸ **apply**(`doc`, `update`): `any`

`update` applied to `doc`: `$set` (dotted paths create objects), `$unset`, `$inc`, `$push`; a document without operators replaces it (its `_id` kept).

#### Parameters

| Name | Type |
| :------ | :------ |
| `doc` | `any` |
| `update` | `Record`\<`string`, `any`\> |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:146](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L146)

___

### seed

▸ **seed**(`query`): `any`

The document an upsert inserts: the query's plain equality fields, then the update.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | [`StorageQuery`](../readme.md#storagequery) |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:169](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L169)

___

### indexKey

▸ **indexKey**(`doc`, `fields`): `string`

The values a unique index is keyed by, or null when the document has none of its fields.

#### Parameters

| Name | Type |
| :------ | :------ |
| `doc` | `any` |
| `fields` | `string`[] |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/datastore/DocumentQuery.ts:176](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentQuery.ts#L176)
