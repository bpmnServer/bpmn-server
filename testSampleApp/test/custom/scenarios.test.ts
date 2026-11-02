// Runs scenario files: test/custom/*.json, or the files named on the command line
//   node --import tsx --test test/custom/scenarios.test.ts                       every scenario file
//   node --import tsx test/custom/scenarios.test.ts test/custom/buy-used-car.json   one file (VS Code: Scenarios: current file)
//
// A file is one scenario with its model, or a model's list of them:
//   { "model": "Buy Used Car", "name": "...", "start": {...}, "steps": [...], "checks": [...] }
//   { "model": "Buy Used Car", "scenarios": [ { "name": "...", ... }, ... ] }
// The scenario format is the model editor's Test tab's: start (data, startNodeId), steps (each the waiting element
// to complete, with its data), checks (status, node, data; at the end or after a step). Each scenario runs in
// memory on this application's delegate and services (testApp).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { runScenario, checkScenarios, type Scenario } from 'bpmn-web';
import { testApp, type TestApp } from '../support/testApp.js';

const FOLDER = import.meta.dirname;
const named = process.argv.slice(2).filter(arg => arg.endsWith('.json'));
const files = named.length ? named.map(f => path.resolve(f))
    : fs.readdirSync(FOLDER).filter(f => f.endsWith('.json')).map(f => path.join(FOLDER, f));

/** A file's scenarios, each with its model. */
function read(file: string): { model: string; scenario: Scenario }[] {
    const json = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!json.model) throw new Error(`${file}: no "model"`);
    const scenarios: Scenario[] = json.scenarios ?? [json];
    const problems = checkScenarios(scenarios);
    if (problems.length) throw new Error(`${file}: ${problems.join('; ')}`);
    return scenarios.map(scenario => ({ model: json.model, scenario }));
}

/** What went wrong, readably: the failed step, the failed checks, where the instance stopped. */
function report(result): string {
    const lines = [];
    if (result.error) lines.push(result.error);
    for (const step of result.steps.filter(s => !s.ok)) lines.push(`step ${step.index + 1} (${step.element}): ${step.error}`);
    for (const check of result.checks.filter(c => !c.ok)) lines.push(`check failed: ${check.what}${check.actual !== undefined ? ` (actual ${JSON.stringify(check.actual)})` : ''}`);
    if (result.instance) lines.push(`instance: ${JSON.stringify(result.instance)}`);
    return lines.join('\n');
}

let app: TestApp;
before(async () => { app = await testApp(); });
after(async () => { await app?.stop(); });

for (const file of files) {
    for (const { model, scenario } of read(file)) {
        test(`${path.basename(file)}: ${scenario.name}`, async () => {
            const result = await runScenario(app.server, model, scenario);
            assert.ok(result.ok, report(result));
        });
    }
}
