// @features: queries
// The data store's paged search on MongoDB (datastore/Aggregate.ts): pages by a cursor, by instance or by item, the last or the latest
// item matching a condition. test/datastore.test.mjs in bpmn-server checks the same answers on a store that is not MongoDB.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp } from '../support/webApp.mjs';

let web, find;
const started = [];
test.before(async () => {
    web = await startWebApp();
    const { engine, dataStore } = web.bpmnServer;
    find = params => dataStore.find({ ...params, filter: { name: 'leave-request', 'data.batch': batch, ...params.filter } });
    for (const days of [1, 2, 3]) {
        const { instance } = await engine.start('leave-request', { batch, days });
        started.push(instance.id);
    }
    // the first goes on to its end, a short leave being approved by itself; the others still wait on their task
    await engine.invoke({ id: started[0], 'items.elementId': 'Submit' }, { days: 1, reason: 'rest' });
});
test.after(async () => {
    await web?.stop();
    setImmediate(() => process.exit(0));
});
const batch = `paging-${Date.now()}`;

test('instances page by _id, newest first, with the total', async () => {
    const first = await find({ limit: 2, getTotalCount: true, projection: { id: 1, data: 1 } });
    assert.deepEqual(first.data.map(r => r.id), [started[2], started[1]]);
    assert.equal(first.totalCount, 3);
    const rest = await find({ limit: 2, after: first.nextCursor, projection: { id: 1 } });
    assert.deepEqual(rest.data.map(r => r.id), [started[0]]);
});

test('instances page by a field: numbers, text and dates each make their own cursor', async () => {
    const byNumber = await find({ sort: { 'data.days': 1 }, limit: 1, projection: { id: 1, data: 1 } });
    assert.deepEqual(byNumber.data.map(r => r.data.days), [1]);
    assert.match(byNumber.nextCursor, /^1\|/);
    assert.deepEqual((await find({ sort: { 'data.days': 1 }, limit: 5, after: byNumber.nextCursor, projection: { id: 1, data: 1 } })).data.map(r => r.data.days), [2, 3]);

    const byDate = await find({ sort: { startedAt: -1 }, limit: 1, projection: { id: 1, startedAt: 1 } });
    assert.match(byDate.nextCursor, /^d:\d+\|/);
    assert.ok((await find({ sort: { startedAt: -1 }, limit: 5, after: byDate.nextCursor, projection: { id: 1, startedAt: 1 } })).data.length <= 3);

    const byText = await find({ sort: { batchText: 1, 'data.batch': 1 }, limit: 1, projection: { id: 1, data: 1, name: 1 } });
    assert.equal(byText.data.length, 1);
    const byName = await find({ sort: { name: 1 }, limit: 1, projection: { id: 1, name: 1 } });
    assert.match(byName.nextCursor, /^leave-request\|/);
    assert.equal((await find({ sort: { name: 1 }, limit: 5, after: byName.nextCursor, projection: { id: 1, name: 1 } })).data.length, 2);
});

test('a filter on items gives one row per item', async () => {
    const waiting = await find({ filter: { 'items.status': 'wait' }, limit: 10, projection: { id: 1, items: 1 } });
    assert.equal(waiting.data.length, 2, 'one for each waiting item');
    assert.ok(waiting.data.every(r => r.items.status === 'wait'));
    const page = await find({ filter: { 'items.status': 'wait' }, sort: { 'items.seq': 1 }, limit: 1, projection: { id: 1, items: 1 } });
    assert.equal(page.data.length, 1);
    const next = await find({ filter: { 'items.status': 'wait' }, sort: { 'items.seq': 1 }, limit: 1, after: `${page.data[0].items.seq}|${page.data[0]._id}`, projection: { id: 1, items: 1 } });
    assert.ok(Array.isArray(next.data));
});

test('the last item, and the latest ended one, matching a condition', async () => {
    const last = await find({ lastItem: { status: 'wait' }, limit: 5, projection: { id: 1 } });
    assert.equal(last.data.length, 2);
    assert.ok(last.data.every(r => r.lastItem.status === 'wait'));

    const latest = await find({ latestItem: { status: 'end', type: { $ne: 'bpmn:SequenceFlow' } }, limit: 5, projection: { id: 1 } });
    assert.ok(latest.data.length >= 1);
    assert.ok(latest.data.every(r => r.latestItem.status === 'end'));

    const either = await find({ lastItem: { $or: [{ status: 'wait' }, { status: 'end' }] }, limit: 5, projection: { id: 1 } });
    assert.equal(either.data.length, 3);
    const both = await find({ lastItem: { $and: [{ status: 'wait' }, { seq: { $gte: 0, $lte: 100 } }] }, limit: 5, projection: { id: 1 } });
    assert.equal(both.data.length, 2);
    const comparisons = await find({ lastItem: { seq: { $gt: -1 }, status: { $eq: 'wait' } }, limit: 5, projection: { id: 1 } });
    assert.equal(comparisons.data.length, 2);
    const under = await find({ lastItem: { seq: { $lt: 0 } }, limit: 5, projection: { id: 1 } });
    assert.equal(under.data.length, 0);
});

test('an empty page, and a condition it can not read, are answers and not exceptions', async () => {
    const none = await find({ filter: { 'data.batch': 'no such batch' }, projection: { id: 1 } });
    assert.deepEqual([none.data, none.nextCursor, none.totalCount], [[], null, 0]);
    const wrong = await find({ lastItem: { seq: { $regex: 'x' } }, projection: { id: 1 } });
    assert.match(wrong.error, /Unsupported operator: \$regex/);
});
