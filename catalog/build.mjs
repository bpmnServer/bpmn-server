// Builds catalog.json from entries.json and models/<id>.bpmn: each model checked (verifyModel), the
// services it calls, what it is made of, and its diagram drawn (models/<id>.svg).
//   node catalog/build.mjs        (after npm run build: it uses bpmn-server's and bpmn-web's builds)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { verifyModel } from 'bpmn-server';
import { bpmnToSvg } from '../packages/bpmn-web/dist/routes/bpmnToSvg.js';

const DIR = import.meta.dirname;
const entries = JSON.parse(fs.readFileSync(path.join(DIR, 'entries.json'), 'utf8'));

/** The names service tasks call: their delegateExpression or implementation. */
function services(xml) {
    const names = new Set();
    for (const m of xml.matchAll(/<(\w+:)?(serviceTask|sendTask|businessRuleTask)\b([^>]*)>/g))
        for (const a of m[3].matchAll(/\b(?:camunda:delegateExpression|implementation)="([^"]+)"/g))
            if (!/^##|^\$\{?/.test(a[1])) names.add(a[1]);
    return [...names].sort();
}

/** How many of each kind of element, for the catalog's summary. */
function elements(xml) {
    const count = re => (xml.match(re) ?? []).length;
    return {
        processes: count(/<(\w+:)?process\b/g),
        userTasks: count(/<(\w+:)?userTask\b/g),
        serviceTasks: count(/<(\w+:)?(serviceTask|sendTask)\b/g),
        scriptTasks: count(/<(\w+:)?scriptTask\b/g),
        gateways: count(/<(\w+:)?\w+Gateway\b/g),
        timers: count(/<(\w+:)?timerEventDefinition\b/g),
        messages: count(/<(\w+:)?messageEventDefinition\b/g),
        subProcesses: count(/<(\w+:)?(subProcess|callActivity)\b/g),
    };
}

const out = [];
for (const entry of entries) {
    const file = `models/${entry.id}.bpmn`;
    const xml = fs.readFileSync(path.join(DIR, file), 'utf8');
    const result = await verifyModel(xml, undefined, entry.name, { decisionsFolder: path.join(DIR, 'models') });
    const svg = await bpmnToSvg(xml).catch(() => null);
    if (svg) fs.writeFileSync(path.join(DIR, 'models', entry.id + '.svg'), svg);
    out.push({
        ...entry,
        bpmn: file,
        svg: svg ? `models/${entry.id}.svg` : null,
        size: Buffer.byteLength(xml),
        sha256: crypto.createHash('sha256').update(xml).digest('hex'),
        elements: elements(xml),
        services: services(xml),
        verify: {
            errors: result.errors,
            warnings: result.warnings,
            issues: result.issues.filter(i => i.severity !== 'info').map(({ severity, code, elementId, message }) => ({ severity, code, elementId, message })),
        },
    });
    console.log(`${entry.id}: ${result.errors} errors, ${result.warnings} warnings${svg ? '' : ', no diagram'}`);
}

const catalog = { format: 'bpmn-server-catalog', version: 1, updated: new Date().toISOString(), entries: out };
fs.writeFileSync(path.join(DIR, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
console.log(`catalog.json: ${out.length} entries`);
