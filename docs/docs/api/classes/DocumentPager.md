[bpmn-server](../readme.md) / DocumentPager

# Class: DocumentPager

The data store's paged search (`DataStore.find`) on any storage adapter: what the MongoDB
aggregation (Aggregate.ts) answers, computed from the documents the adapter finds.

- `filter`: on the instance (`name`, `data.x`) and on its items (`items.x`); with an item filter,
  the answer has one entry per matching item, `items` being that item (MongoDB's `$unwind`).
- `lastItem` / `latestItem`: instead, one entry per instance, with its last item (by `seq`) or its
  latest ended item (by `endedAt`) matching the condition, under `lastItem` / `latestItem`.
- `sort` (one field, `1` or `-1`; default `_id` descending), `limit` (10), `projection`.
- `after`: the `nextCursor` of the page before: `<sort value>|<_id>` (`d:<ms>` for a date), or the `_id`.
- `getTotalCount`: how many instances match the filter.

## Table of contents

### Constructors

- [constructor](DocumentPager.md#constructor)

### Methods

- [find](DocumentPager.md#find)
- [cursorOf](DocumentPager.md#cursorof)
- [cursorRow](DocumentPager.md#cursorrow)

## Constructors

### constructor

• **new DocumentPager**(): [`DocumentPager`](DocumentPager.md)

#### Returns

[`DocumentPager`](DocumentPager.md)

## Methods

### find

▸ **find**(`store`, `database`, `collection`, `«destructured»`): `Promise`\<[`FindResult`](../interfaces/FindResult.md)\<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | [`IDocumentStore`](../interfaces/IDocumentStore.md) |
| `database` | `string` |
| `collection` | `string` |
| `«destructured»` | [`FindParams`](../interfaces/FindParams.md) |

#### Returns

`Promise`\<[`FindResult`](../interfaces/FindResult.md)\<`any`\>\>

#### Defined in

[packages/bpmn-server/src/datastore/DocumentPager.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentPager.ts#L19)

___

### cursorOf

▸ **cursorOf**(`row`, `sortField`, `value`): `string`

The cursor of a row: its sort value (a date as `d:<ms>`) and its `_id`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `row` | `any` |
| `sortField` | `string` |
| `value` | `any` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/datastore/DocumentPager.ts:72](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentPager.ts#L72)

___

### cursorRow

▸ **cursorRow**(`after`, `sortField`): `any`

A row standing for a cursor, to compare the rows against.

#### Parameters

| Name | Type |
| :------ | :------ |
| `after` | `string` |
| `sortField` | `string` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/datastore/DocumentPager.ts:79](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/DocumentPager.ts#L79)
