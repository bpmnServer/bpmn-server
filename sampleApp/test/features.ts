// Every model's tests (processes/*.feature) run in the engine, as the model editor's Run all runs them: this
// application's settings, delegate and services, in memory (no database, no server). For a release, and for CI.
//
//   npm test                        all of them; the exit code is 1 when one fails
//   npm test -- "Leave Application" one model's
import fs from 'node:fs';
import path from 'node:path';
import { BPMNServer, Logger, MemoryDocumentStore, webConfiguration, runFeature } from 'bpmn-web';
import { config } from '../settings/config.js';
import { AppDelegate } from '../delegates/appDelegate.js';

const store = new MemoryDocumentStore();
const logger = () => new Logger({ toConsole: false });
const configuration = webConfiguration({
    ...config(),
    timers: { precision: 1000, pollInterval: 0 },
    documentStore: () => store,
    logger,
}, AppDelegate);
const models = configuration.definitionsPath;
const only = process.argv.slice(2);
const files = fs.readdirSync(models)
    .filter(file => file.endsWith('.feature') && !file.endsWith('.engine.feature'))
    .filter(file => !only.length || only.includes(file.replace(/(\.dmn)?\.feature$/, '')));

// the engine's own output (scripts' console.log) is not the report
const log = console.log;
console.log = console.info = console.debug = () => { };
const server = new BPMNServer(configuration, logger(), { cron: false });
await server.ready;
await server.dataStore.install();
await server.definitions.rebuild();

let failed = 0, passed = 0;
for (const file of files) {
    const results = await runFeature(server, fs.readFileSync(path.join(models, file), 'utf8'), file);
    for (const feature of results)
        for (const scenario of feature.elements ?? []) {
            const failure = scenario.steps.find(step => step.result.status !== 'passed' && step.result.status !== 'skipped');
            if (failure) failed++; else passed++;
            log(`${failure ? 'FAIL' : 'pass'}  ${file}: ${scenario.name}`);
            if (failure) log(`      ${failure.keyword}${failure.name}\n      ${String(failure.result.error_message ?? failure.result.status).split('\n')[0]}`);
        }
}
log(`\n${passed} passed, ${failed} failed`);
await server.shutdown();
process.exit(failed ? 1 : 0);
