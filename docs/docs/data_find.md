# Finding instances: dataStore.find

`server.dataStore.find` reads a page of instances from the store: a filter chooses them, a sort orders them, and a
cursor walks through them a page at a time. It is what a list of cases is built on, and it reads only the fields the
page needs.

```ts
const { data, nextCursor, totalCount, error } = await server.dataStore.find({
    filter: { name: 'Buy Used Car', status: 'end' },
    sort: { _id: -1 },
    projection: { id: 1, name: 1, status: 1, startedAt: 1, data: 1 },
    limit: 50,
    getTotalCount: true,
});
```

For one instance or a few, `findInstances` is simpler: see [Managing data](data.md). Over the API, a list of cases is
`GET /api/v3/instances` ([API v3](api-v3.md)), which uses this underneath.

## What to pass

Every parameter is optional.

| | |
|---|---|
| `filter` | Which instances: `{ status: 'end' }`, `{ 'items.status': 'wait' }`, `{ 'items.type': 'bpmn:UserTask' }`, `{ 'data.caseId': 7 }`. Fields of the instance, or of its items. |
| `sort` | One field, `1` for ascending or `-1` for descending: `{ startedAt: -1 }`, `{ 'data.caseId': 1 }`. The default is `{ _id: -1 }`, the newest first, because `_id` grows with each instance. |
| `projection` | The fields to return: `{ id: 1, name: 1, data: 1 }`. It must include every field the filter and the sort use. |
| `limit` | How many instances in a page. The default is 10. |
| `after` | The `nextCursor` of the page before, to read the next one. |
| `getTotalCount` | `true` also counts every instance the filter matches. It costs a second pass, so ask for it on the first page only. |

## What comes back

| | |
|---|---|
| `data` | The instances, with the fields the projection asked for. |
| `nextCursor` | Where the next page starts, or `null` on the last page. |
| `totalCount` | How many instances match, when `getTotalCount` was `true`. |
| `error` | What went wrong, when something did. |

Each instance's `items` is a single object, not an array, unless the projection asks for them as one (see
[Only some items](#only-some-items)).

## Page by page

Pass the `nextCursor` of one page as the `after` of the next, with the same `filter`, `sort` and `projection`:

```ts
let after: string | undefined;
do {
    const page = await server.dataStore.find({
        filter: { name: 'Buy Used Car' },
        sort: { startedAt: -1 },
        projection: { id: 1, name: 1, startedAt: 1 },
        limit: 50,
        after,
    });
    if (page.error) throw new Error(page.error);
    for (const instance of page.data ?? []) console.log(instance.id, instance.startedAt);
    after = page.nextCursor ?? undefined;
} while (after);
```

Any field can be the sort field, even one that many instances share: instances with the same value are then ordered by
`_id`, so each one appears exactly once across the pages. Instances that don't have the field come first when
ascending and last when descending.

## Only some items

An instance carries every item it has run. To read only some of them, ask for them as a filtered list. On MongoDB the
projection takes an expression:

```ts
projection: {
    id: 1, name: 1, status: 1,
    items: { $filter: { input: '$items', as: 'item', cond: { $eq: ['$$item.type', 'bpmn:UserTask'] } } },
}
```

`data.items` is then an array of the user tasks only.

## Timing it

To see what a filter costs on your own data, time the call and ask for the count once:

```ts
console.time('find');
const page = await server.dataStore.find({ filter: { 'items.status': 'wait' }, limit: 50, getTotalCount: true });
console.timeEnd('find');
console.log(page.totalCount, 'instances match;', Math.ceil(page.totalCount / 50), 'pages');
```

The store's indexes decide how fast a filter and sort are: [Performance](performance.md) has the ones it creates and
how to add your own.
