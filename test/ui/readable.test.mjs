// Every value set in the real model files can be read in the properties panel: each file is opened in the
// editor, each element selected with every group and list item open, and each attribute and extension
// value of the element must appear in a field of the panel. Each kind of value (element type and path) is
// checked where it first occurs, up to three times, which keeps the run short.
//   npm run test:ui
//   READABLE_MODELS_EXTRA=../bpmn-server/test npm run test:ui      also check another folder's models
//   READABLE_ALL=1 ...                                              check every occurrence (slow)
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { layoutProcess } from 'bpmn-auto-layout';
import { startWebApp, PASSWORD } from '../support/webApp.mjs';

const ROOT = path.resolve(import.meta.dirname, '..', '..');

/** Values that are structure, not settings, and that no properties panel shows. */
const STRUCTURE = [
    /^eventDefinitions\[[^\]]+\]\.id$/,              // an event definition's own id
    /\.xsi:type$/,                                   // XML typing of an expression
    /^dataObjectRef$/,                               // a data object reference's object (drawn in the diagram)
    /^properties\[bpmn:Property\]\./                 // bpmn-js's placeholder for data associations
];
/** Booleans the diagram shows (markers, dotted borders), not the panel. */
const DRAWN = /(^|\.)(isSequential|triggeredByEvent|isInterrupting|cancelActivity|isForCompensation)$/;

function modelFiles() {
    const tracked = execFileSync('git', ['ls-files', 'processes', 'test/processes'], { cwd: ROOT, encoding: 'utf8' })
        .split('\n').filter(f => /\.bpmn$/.test(f)).map(f => path.join(ROOT, f));
    const extra = process.env.READABLE_MODELS_EXTRA;
    if (!extra)
        return tracked;
    const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
        e.isDirectory() ? (e.name === 'node_modules' ? [] : walk(path.join(dir, e.name))) : /\.bpmn$/.test(e.name) ? [path.join(dir, e.name)] : []);
    return [...tracked, ...walk(path.resolve(ROOT, extra))];
}

let web, browser, page;
test.before(async () => {
    web = await startWebApp();
    browser = await chromium.launch();
    page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    await page.goto(web.base + '/login');
    await page.fill('#userName', 'admin');
    await page.fill('#password', PASSWORD);
    await Promise.all([page.waitForURL(url => !url.pathname.startsWith('/login')), page.click('button[type=submit]')]);
    await page.goto(web.base + '/model/edit/leave-request');
    await page.waitForSelector('#js-canvas .djs-shape');
});
test.after(async () => {
    await browser?.close();
    await web?.stop();
    setImmediate(() => process.exit(0));
});

/** Every value set on each element's business object and what hangs off it, with its path. */
function valuesInModel() {
    const SKIP = new Set(['incoming', 'outgoing', 'sourceRef', 'targetRef', 'flowElements', 'artifacts', 'laneSets', 'lanes',
        'flowNodeRef', 'di', 'processRef', 'participants', 'messageFlows', 'rootElements', 'diagrams', 'categoryValueRef',
        'dataInputAssociations', 'dataOutputAssociations', 'ioSpecification', 'attachedToRef', 'modelerTemplate', 'modelerTemplateVersion']);
    const registry = window.bpmnModeler.get('elementRegistry');
    const root = window.bpmnModeler.get('canvas').getRootElement();
    const walk = (obj, prefix, values, depth = 0) => {
        if (!obj || typeof obj !== 'object' || !obj.$descriptor || depth > 6) return;
        if (!Array.isArray(obj.$descriptor.properties)) {      // an element of a namespace no descriptor knows
            values.push({ path: prefix + (obj.$type || 'element'), kind: 'unknown element', value: obj.$body || '' });
            return;
        }
        for (const p of obj.$descriptor.properties) {
            if (SKIP.has(p.name) || SKIP.has(p.ns?.localName) || !Object.prototype.hasOwnProperty.call(obj, p.name)) continue;
            const v = obj[p.name];
            if (v === undefined || v === null || v === '') continue;
            if (p.default !== undefined && String(v) === String(p.default)) continue;    // the default: not a setting
            const key = `${prefix}${p.ns?.prefix && p.ns.prefix !== 'bpmn' ? p.ns.prefix + ':' : ''}${p.ns?.localName || p.name}`;
            if (p.isReference)
                values.push({ path: key, kind: 'ref', value: Array.isArray(v) ? v.map(x => x.id).join(',') : (v.id ?? String(v)), name: v.name });
            else if (Array.isArray(v))
                v.forEach(x => typeof x === 'object' ? walk(x, `${key}[${x.$type}].`, values, depth + 1) : values.push({ path: key, kind: 'value', value: String(x) }));
            else if (typeof v === 'object')
                walk(v, `${key}{${v.$type}}.`, values, depth + 1);
            else
                values.push({ path: key, kind: typeof v === 'boolean' ? 'boolean' : 'value', value: String(v) });
        }
        for (const [k, v] of Object.entries(obj.$attrs || {}))
            if (!k.startsWith('xmlns')) values.push({ path: prefix + k, kind: 'unknown attribute', value: String(v) });
        for (const child of obj.$children || [])
            values.push({ path: prefix + (child.$type || 'element'), kind: 'unknown element', value: child.$body || '' });
    };
    return [root, ...registry.filter(e => e.type !== 'label' && e !== root)].map(element => {
        const bo = element.businessObject, values = [];
        walk(bo, '', values);
        if (element.type === 'bpmn:Participant' && bo.processRef) walk(bo.processRef, 'process.', values);
        // parameters an applied element template binds are shown under the template's labels, not their names
        const template = window.bpmnModeler.get('elementTemplates').get(element);
        const boundNames = new Set((template?.properties || []).map(p => p.binding?.name).filter(Boolean));
        return { id: element.id, type: element.type, values: values.filter(v => !(/.camunda:name$/.test(v.path) && boundNames.has(v.value))) };
    });
}

/** Select the element and open every group and list item; what the panel's fields show. */
async function shownFor(id) {
    await page.evaluate(id => {
        const m = window.bpmnModeler, element = m.get('elementRegistry').get(id);
        document.activeElement?.blur();
        m.get('selection').select(element === m.get('canvas').getRootElement() ? [] : element);
    }, id);
    for (let round = 0; round < 6; round++) {
        const opened = await page.evaluate(() => {
            let n = 0;
            for (const h of document.querySelectorAll('#js-properties-panel .bio-properties-panel-group-header:not(.open)')) { h.click(); n++; }
            for (const h of document.querySelectorAll('#js-properties-panel .bio-properties-panel-collapsible-entry-header')) {
                const entry = h.closest('.bio-properties-panel-collapsible-entry');
                if (entry && !entry.classList.contains('open')) { h.click(); n++; }
            }
            return n;
        });
        if (!opened) break;
        await page.waitForTimeout(30);
    }
    return page.evaluate(() => {
        const panel = document.getElementById('js-properties-panel'), texts = [];
        panel.querySelectorAll('input:not([type=checkbox]), textarea').forEach(e => texts.push(e.value));
        panel.querySelectorAll('select').forEach(e => texts.push(e.value, e.selectedOptions[0]?.textContent || ''));
        panel.querySelectorAll('.cm-content').forEach(e => texts.push(e.innerText));
        const toggles = Object.fromEntries([...panel.querySelectorAll('[data-entry-id] input[type=checkbox]')]
            .map(e => [e.closest('[data-entry-id]').dataset.entryId, e.checked]));
        return { texts, toggles };
    });
}

const norm = s => String(s).replace(/\s+/g, ' ').trim();

test('every value in the model files can be read in the properties panel', async () => {
    const files = modelFiles();
    assert.ok(files.length > 20, `found ${files.length} model files`);
    const unread = [], checked = new Map();
    const PER_KIND = process.env.READABLE_ALL ? Infinity : 3;     // READABLE_ALL=1: every occurrence
    for (const file of files) {
        let xml = fs.readFileSync(file, 'utf8');
        if (!/<(\w+:)?BPMNDiagram[\s>]/.test(xml))
            xml = await layoutProcess(xml);    // as the editor route does
        const error = await page.evaluate(async xml => {
            try { await window.bpmnModeler.importXML(xml); return null; } catch (e) { return e.stack || e.message; }
        }, xml);
        assert.equal(error, null, `${path.relative(ROOT, file)} opens`);

        for (const { id, type, values } of await page.evaluate(valuesInModel)) {
            const wanted = values.filter(v => !STRUCTURE.some(re => re.test(v.path)) && !(v.kind === 'boolean' && DRAWN.test(v.path)))
                .filter(v => (checked.get(`${type} ${v.path}`) ?? 0) < PER_KIND);
            if (!wanted.length) continue;
            const { texts, toggles } = await shownFor(id);
            const shown = new Set(texts.map(norm));
            for (const v of wanted) {
                checked.set(`${type} ${v.path}`, (checked.get(`${type} ${v.path}`) ?? 0) + 1);
                const ok = v.kind === 'boolean'
                    ? String(toggles[v.path.split('.').pop()]) === v.value || shown.has(v.value)   // a toggle, or a read-only field
                    : shown.has(norm(v.value)) || (v.name && shown.has(norm(v.name)));
                if (!ok)
                    unread.push(`${path.relative(ROOT, file)} ${id}: ${v.path} = ${JSON.stringify(v.value).slice(0, 60)} (${v.kind})`);
            }
        }
    }
    assert.ok(checked.size > 50, `checked ${checked.size} kinds of value`);
    assert.deepEqual(unread, [], `${unread.length} values the panel does not show`);
});
