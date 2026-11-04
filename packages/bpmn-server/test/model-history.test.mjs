// @features: history, models-files
// A model's history (ModelHistory): every save kept as files in the models folder's .history/<name>/, who saved
// it and when; a save that changes nothing adds nothing; renaming and deleting the model take its history along;
// purging removes it.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { makeServer } from './helpers.mjs';
import { ModelHistory } from '../dist/index.js';

const NAME = 'expense-approval';

test('every save is kept, with who saved it; an unchanged save adds nothing; the file before the history comes first', async () => {
    const { server, dir } = await makeServer();
    const original = fs.readFileSync(path.join(dir, NAME + '.bpmn'), 'utf8');
    const edited = original.replace(/name="([^"]+)"/, 'name="$1, edited"');
    assert.notEqual(edited, original);

    await server.definitions.save(NAME, edited, null, null, 'ann');
    let versions = await server.definitions.history(NAME);
    assert.deepEqual(versions.map(v => [v.version, v.savedBy]), [[2, 'ann'], [1, undefined]], 'the file as it was, then the save');
    assert.equal(await server.definitions.historySource(NAME, 1), original);
    assert.equal(await server.definitions.historySource(NAME, 2), edited);
    assert.equal(versions[0].size, Buffer.byteLength(edited));
    assert.ok(!Number.isNaN(Date.parse(versions[0].savedAt)));

    await server.definitions.save(NAME, edited, null, null, 'bob');
    assert.equal((await server.definitions.history(NAME)).length, 2, 'unchanged: no new version');

    await server.definitions.save(NAME, original, null, null, 'bob');
    versions = await server.definitions.history(NAME);
    assert.deepEqual(versions.map(v => [v.version, v.savedBy]), [[3, 'bob'], [2, 'ann'], [1, undefined]]);
    assert.deepEqual(fs.readdirSync(path.join(dir, '.history', NAME)).sort(), ['0001.bpmn', '0002.ann.bpmn', '0003.bob.bpmn'],
        'one file per version, beside the models: who saved it in its name; its time and size are the files');
    assert.equal(versions[0].size, fs.statSync(path.join(dir, '.history', NAME, '0003.bob.bpmn')).size);
    assert.equal(await server.definitions.historySource(NAME, 9), null);
    await server.shutdown?.();
});

test('the version kept from before the history has the file time; any user name goes in a file name', async () => {
    const { server, dir } = await makeServer();
    const file = path.join(dir, NAME + '.bpmn');
    const then = new Date('2026-01-02T03:04:05Z');
    fs.utimesSync(file, then, then);
    const original = fs.readFileSync(file, 'utf8');
    await server.definitions.save(NAME, original.replace(/name="([^"]+)"/, 'name="$1, edited"'), null, null, "Ann O'Neil/HR*");
    const versions = await server.definitions.history(NAME);
    assert.equal(versions[1].savedAt, then.toISOString());
    assert.equal(versions[0].savedBy, "Ann O'Neil/HR*");
    await server.shutdown?.();
});

test('a new model starts its history with its first save', async () => {
    const { server, dir } = await makeServer();
    const source = fs.readFileSync(path.join(dir, NAME + '.bpmn'), 'utf8');
    await server.definitions.save('brand-new', source, null, null, 'ann');
    assert.deepEqual((await server.definitions.history('brand-new')).map(v => v.version), [1]);
    await server.shutdown?.();
});

test('renaming moves the history, deleting removes it, purging empties it', async () => {
    const { server, dir } = await makeServer();
    const source = fs.readFileSync(path.join(dir, NAME + '.bpmn'), 'utf8');
    await server.definitions.save(NAME, source.replace('isExecutable="true"', 'isExecutable="true" '), null, null, 'ann');
    const count = (await server.definitions.history(NAME)).length;
    assert.ok(count >= 1);

    await server.definitions.renameModel(NAME, 'renamed');
    assert.equal((await server.definitions.history(NAME)).length, 0);
    assert.equal((await server.definitions.history('renamed')).length, count);

    assert.equal(await server.definitions.purgeHistory('renamed'), count);
    assert.deepEqual(await server.definitions.history('renamed'), []);
    assert.ok(!fs.existsSync(path.join(dir, '.history', 'renamed')));

    await server.definitions.save('renamed', source + ' ', null, null, 'ann');
    assert.equal((await server.definitions.history('renamed')).length, 2, 'after a purge: the file as it was, then the save');
    await server.definitions.deleteModel('renamed');
    assert.ok(!fs.existsSync(path.join(dir, '.history', 'renamed')), 'deleted with the model');
    await server.shutdown?.();
});

test('two saves at once are two versions; a name that leaves the folder is refused', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'history-'));
    const history = new ModelHistory(dir);
    await Promise.all([history.keep('m', '<a/>', 'ann'), history.keep('m', '<b/>', 'bob')]);
    const versions = await history.list('m');
    assert.deepEqual(versions.map(v => v.version).sort(), [1, 2]);
    assert.deepEqual(new Set([await history.source('m', 1), await history.source('m', 2)]), new Set(['<a/>', '<b/>']));
    await assert.rejects(history.list('../outside'), /not a model name/);
    await assert.rejects(history.list('.hidden'), /not a model name/);
});

test('modelHistory: false keeps no versions; the save itself is as before', async () => {
    const { server, dir } = await makeServer();
    server.configuration.modelHistory = false;
    const original = fs.readFileSync(path.join(dir, NAME + '.bpmn'), 'utf8');
    const edited = original.replace(/name="([^"]+)"/, 'name="$1, edited"');
    await server.definitions.save(NAME, edited, null, null, 'ann');
    assert.equal(fs.readFileSync(path.join(dir, NAME + '.bpmn'), 'utf8'), edited);
    assert.deepEqual(await server.definitions.history(NAME), []);
    assert.ok(!fs.existsSync(path.join(dir, '.history', NAME)));
    await server.shutdown?.();
});
