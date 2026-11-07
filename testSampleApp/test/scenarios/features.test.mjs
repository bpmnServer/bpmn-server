// The engine's scenarios: every processes/<model>.engine.feature, each scenario a test, on a database of their own that each
// run empties first (BPMN_SCENARIOS_DB, default bpmn_scenarios).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient } from 'mongodb';
import { BPMNServer, engineCalls, Logger, runFeature } from 'bpmn-web';
import { configuration, MONGO_URL, DATABASE } from './testConfiguration.js';

const PROCESSES = fileURLToPath(new URL('../../processes/', import.meta.url));
const files = fs.readdirSync(PROCESSES).filter(file => file.endsWith('.engine.feature')).sort();
let server, inside;

test.before(async () => {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    await client.db(DATABASE).dropDatabase();
    await client.close();
    server = new BPMNServer(configuration, new Logger({ toConsole: false }));
    await server.ready;
    await server.dataStore.install();
    await server.definitions.install();
    // a test goes by the engine's calls and JSON copies, as anyone outside does
    inside = Object.create(server, { engine: { value: engineCalls(server) } });
});
test.after(async () => {
    await server?.shutdown();
    setImmediate(() => process.exit(process.exitCode ?? 0));
});

for (const file of files) {
    test(file, async t => {
        const [{ elements }] = await runFeature(inside, fs.readFileSync(path.join(PROCESSES, file), 'utf8'), file);
        for (const element of elements)
            await t.test(element.name, { skip: element.tags.some(tag => tag.name === '@skip') }, () => {
                const failed = element.steps.find(step => step.result.status === 'failed');
                assert.equal(failed ? `${failed.name}: ${failed.result.error_message}` : undefined, undefined);
            });
    });
}
