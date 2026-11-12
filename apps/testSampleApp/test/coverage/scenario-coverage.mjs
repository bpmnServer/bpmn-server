// Scenario coverage, for `npm run test:coverage`: runs each model's saved scenarios (processes/<model>.tests.json) as the Test tab's
// Run tests does, and counts what they reached with the tab's own rules (src/testing/coverage.js). In a server and a database
// of its own, on a copy of the models, so it changes nothing there. A failing scenario is reported, it does not fail this.
//   node --import tsx test/coverage/scenario-coverage.mjs <file to write>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { startWebApp } from '../support/webApp.mjs';

const PROCESSES = fileURLToPath(new URL('../../processes/', import.meta.url));
const dist = file => new URL(`../../../../packages/bpmn-web/dist/testing/${file}`, import.meta.url).href;

const count = ({ total, tested, generated, reached }) => ({ total, tested, generated, reached });
const untested = group => group.elements.filter(e => e.state === 'untested' || e.state === 'reached').map(e => e.id);

async function report() {
    const web = await startWebApp();
    for (const file of fs.readdirSync(PROCESSES, { withFileTypes: true }))
        if (file.isFile()) fs.copyFileSync(path.join(PROCESSES, file.name), path.join(web.definitionsPath, file.name));
    await web.bpmnServer.engine.install({ rebuild: true });
    const { loadScenarios, runScenario } = await import(dist('scenarios.js'));
    const { modelElements } = await import(dist('modelCoverage.js'));
    const { coverageOf } = await import(dist('coverage.js'));

    const models = [];
    const names = fs.readdirSync(PROCESSES).filter(f => f.endsWith('.bpmn')).map(f => f.slice(0, -'.bpmn'.length)).sort();
    for (const model of names) {
        const { elements, listeners } = await modelElements(fs.readFileSync(path.join(PROCESSES, `${model}.bpmn`), 'utf8'));
        const scenarios = await loadScenarios(model).catch(() => []);
        const runs = [], failed = [];
        for (const scenario of scenarios) {
            const result = await runScenario(web.bpmnServer, model, scenario, 'admin');
            if (!result.ok) failed.push({ name: scenario.name, error: result.error ?? result.steps?.find(s => !s.ok)?.error ?? result.checks?.find(c => !c.ok)?.text ?? 'a check failed' });
            if (result.instance) runs.push({ ok: result.ok, items: result.instance.items, generated: !!scenario.generated });
        }
        const { nodes, flows } = coverageOf(elements, runs, listeners);
        models.push({ model, scenarios: scenarios.length, failed, nodes: count(nodes), flows: count(flows), notCovered: [...untested(nodes), ...untested(flows)] });
    }
    await web.stop();
    return { at: new Date().toISOString(), models };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const result = await report();
    fs.mkdirSync(path.dirname(process.argv[2]), { recursive: true });
    fs.writeFileSync(process.argv[2], JSON.stringify(result, null, 2));
    const tested = result.models.filter(m => m.scenarios);
    process.stderr.write(`Scenario coverage: ${tested.length} of ${result.models.length} models have scenarios\n`);
    setImmediate(() => process.exit(0));
}
