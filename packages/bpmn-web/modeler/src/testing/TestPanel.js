// The Test tab: scenarios of the model, run on the saved model (src/testing/scenarios.ts on the server).
//
// One screen for a scenario: Run, Record, its result, its steps with their checks.
//
// Record opens the start form (the start event, its form fields or start data); starting it shows the user tasks,
// receive tasks and events that wait as the next steps, each with its data (prefilled from the scenario, else from the element's
// form fields). Completing a step shows what waits after it, and so on until nothing waits: the recording then closes
// by itself, and its result shows. The data chooses the
// branches; which step is completed first chooses between elements that wait together. The steps completed are the
// scenario's steps, saved as they are done, so Run (and Run all) can repeat them without stopping: a new instance
// each time. Checks run after a step or at the end: a node (how often, in what status), a data value, the instance's
// status. Add as a check, on an item or a value of the run shown, checks it is as it is there: where the run waits
// (after the last step done, or at the start), else at the end. A check shows under its step, in words; Edit opens its
// fields. Its shield says what the run shown found: green, or red with what was there; a check changed since is not
// marked.
// Each scenario keeps its last run: when, how, the result and the instance, which stays in the database until the next
// run replaces it.
// The run has its commands by its result, each with a panel of its own under them. Simulate shows it on the
// diagram one change at a time (Back, Step, Play). Debug shows the instance's variables: change them before the next
// step, or go back to a step done (Restart here: the engine's restart, from the save point the test instance keeps)
// with the variables as they are to be there, and run it again. Inspect this run: its data, items, the engine's
// decisions and log.
//
// Coverage has two ways to close what is not reached. Fill a gap, on an element not reached, records a new scenario with
// that element as its goal: the data its conditions ask is filled in, and the run says which step leads there and whether
// it can still get there. Test all paths tries the model's paths by itself (paths.js) and saves a scenario for each one
// that reaches something new. Those are marked as generated until reviewed: they show a path runs, not that it is right.
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { el, json, parse, parseValue, showValue, request, CHECK_OPS } from './common.js';
import { coverageOf, reachedIn } from '../../../src/testing/coverage.js';
import { conditionValues, explore, modelGraph, withValue } from './paths.js';

const STATUSES = ['', 'end', 'wait', 'running', 'terminated'];
/** The steps (src/testing/scenarios.ts isStep): user tasks, receive tasks and events. */
const isStep = item => item.status === 'wait' && (item.type === 'bpmn:UserTask' || item.type === 'bpmn:ReceiveTask' || String(item.type).includes('Event'));
/** The button that completes one. */
const stepAction = item => item.type === 'bpmn:UserTask' ? 'Complete step' : item.type === 'bpmn:ReceiveTask' ? 'Receive' : 'Trigger event';
const MARKERS = ['test-started', 'test-passed', 'test-waiting', 'test-failed', 'test-reached', 'test-untested', 'test-generated', 'test-goal-element'];
const SIMULATION_STEP = 450;    // ms between the elements a simulation shows
const HOW = { start: 'Recorded', run: 'Run', all: 'Run all', explore: 'Test all paths' };
const MAX_TRIES = 200;          // Test all paths: the runs it may start
const LIST_WIDTH_KEY = 'bpmn-web.modeler.test-list-width';
const MIN_LIST_WIDTH = 160, MIN_MAIN_WIDTH = 240;

const sameSteps = (a, b) => a.length <= b.length && a.every((step, i) => step.element === b[i].element);
const clone = value => JSON.parse(JSON.stringify(value ?? {}));

const CHECK_KINDS = [['node', 'Node'], ['data', 'Data'], ['status', 'Instance status']];
const ITEM_STATUSES = ['', 'end', 'wait', 'start', 'terminated'];
const STATE_WORDS = { end: 'has ended', wait: 'is waiting', start: 'has started', running: 'is running', terminated: 'was terminated' };
const OP_WORDS = { '=': 'is', '<>': 'is not' };
/** What makes a check that check: the same, whatever object holds it (a scenario's, or a result's). */
const checkKey = c => JSON.stringify([c.at ?? 'end', c.step ?? '', c.kind, c.node ?? '', c.status ?? '', c.count ?? '', c.path ?? '', c.op ?? '=', c.value]);
/** A step's icon, by its element's type (bpmn-font), the most particular first. */
const ELEMENT_ICONS = [
    ['bpmn:UserTask', 'user-task'], ['bpmn:ServiceTask', 'service-task'], ['bpmn:ScriptTask', 'script-task'], ['bpmn:SendTask', 'send-task'],
    ['bpmn:ReceiveTask', 'receive-task'], ['bpmn:ManualTask', 'manual-task'], ['bpmn:BusinessRuleTask', 'business-rule-task'],
    ['bpmn:CallActivity', 'call-activity'], ['bpmn:SubProcess', 'subprocess-collapsed'], ['bpmn:StartEvent', 'start-event-none'],
    ['bpmn:EndEvent', 'end-event-none'], ['bpmn:Event', 'intermediate-event-none'], ['bpmn:Task', 'task-none']];

/** The older `expect` (status, data, passes, avoids) as checks at the end (src/testing/scenarios.ts expectChecks). */
function expectChecks(expect) {
    if (!expect) return [];
    return [
        ...(expect.status ? [{ kind: 'status', status: expect.status }] : []),
        ...Object.entries(expect.data ?? {}).map(([path, value]) => ({ kind: 'data', path, op: '=', value })),
        ...(expect.passes ?? []).map(node => ({ kind: 'node', node })),
        ...(expect.avoids ?? []).map(node => ({ kind: 'node', node, count: 0 })),
    ];
}

export default class TestPanel {
    constructor(config, eventBus, bpmnjs, elementRegistry, canvas, overlays, selection) {
        this._config = config || {};
        this._selection = selection;
        this._overlays = overlays;
        this._simulation = null;        // a simulation: { frames, index, timer, paused }
        this._bpmnjs = bpmnjs;
        this._elementRegistry = elementRegistry;
        this._canvas = canvas;
        this._root = document.querySelector(this._config.container);
        this._scenarios = [];
        this._results = new Map();      // scenario -> the result of its last Run
        this._current = null;
        this._live = null;              // a step-by-step run: { scenario, instance, done, checks, stepChecks, failed, startData }
        this._starting = null;          // the scenario whose start form is open
        this._debug = false;            // Debug: the variables shown and changed, steps restarted
        this._restarting = null;        // the done step whose Restart here is open: its index
        this._opened = new Set(['inspect', 'steps', 'data', 'items', 'rationale', 'gaps']);   // the parts shown open
        this._openSteps = new Set();     // the Steps opened to what happened, by their number
        this._editing = new Set();      // the checks whose fields are open
        this._marked = [];
        this._coverageOn = false;       // the diagram shows coverage, not the run shown
        this._coverageItems = new Map();    // a kept run's instance id -> its items, null when it is gone
        this._modelEdited = false;      // since the runs: coverage may be out of date
        this._goal = null;              // Fill a gap: { scenario, id }, what its recording is to reach
        this._exploring = null;         // Test all paths: { asked }, { tries, stop } while it runs, { report } after
        this._text = null;              // Edit as text: { text, base }, the .feature being edited and what it was
        this._visible = false;
        this._loaded = false;
        if (!this._root)
            return;
        eventBus.on('import.done', () => { this._modelEdited = false; if (this._visible) this.render(); });
        eventBus.on('commandStack.changed', () => {
            this._modelEdited = true;
            if (this._visible) this._refreshCoverage();
        });
        try {
            const width = Number(localStorage.getItem(LIST_WIDTH_KEY));
            if (width) this._setListWidth(width);
        } catch { /* no storage: the default width */ }
        // an edit not saved yet goes with the page
        window.addEventListener('pagehide', () => { if (this._saveTimer) this._save({ keepalive: true }); });
    }

    // ---- shown and hidden with the tab

    async show() {
        this._visible = true;
        if (!this._loaded) {
            this._loaded = true;
            await this._load();
        }
        this.render();
        this._markCurrent();
        this._showLastRun(this._current);
    }

    hide() {
        this._visible = false;
        this._stopSimulation();
        this._unmark();
    }

    // ---- the server

    _request(method, url, body, options = {}) {
        return request(method, url, body, options);
    }

    async _load() {
        try {
            const { scenarios } = await this._request('GET', `/model/scenarios/${encodeURIComponent(this._config.processName)}`);
            // an older scenario's expect becomes its checks at the end
            let migrated = false;
            for (const scenario of scenarios)
                if (scenario.expect) {
                    scenario.checks = [...expectChecks(scenario.expect), ...(scenario.checks ?? [])];
                    delete scenario.expect;
                    migrated = true;
                }
            this._scenarios = scenarios;
            this._current = scenarios[0] ?? null;
            if (migrated) this._scheduleSave();
        } catch (err) {
            this._status(`Could not load the scenarios: ${err.message}`, true);
        }
    }

    _scheduleSave() {
        clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(() => this._save(), 600);
    }

    async _save(options) {
        clearTimeout(this._saveTimer);
        this._saveTimer = null;
        try {
            await this._request('PUT', `/model/scenarios/${encodeURIComponent(this._config.processName)}`, { scenarios: this._scenarios }, options);
        } catch (err) {
            this._status(`Scenarios not saved: ${err.message}`, true);
        }
    }

    // ---- Edit as text: the model's .feature, all of it

    async openText() {
        try {
            if (this._saveTimer) await this._save();
            const { text } = await this._request('GET', `/model/scenarios/${encodeURIComponent(this._config.processName)}/feature`);
            this._stopSimulation();
            this._text = { text, base: text };
            this._status('');
            this.render();
            this._root.querySelector('.test-text-input')?.focus();
        } catch (err) {
            this._status(`Could not open the file: ${err.message}`, true);
        }
    }

    closeText() {
        const { text, base } = this._text;
        if (text !== base.replace(/\r\n/g, '\n') && !confirm('Discard what you changed in the file?')) return;
        this._text = null;
        this._status('');
        this.render();
    }

    /** Saved only if it reads as tests; what is wrong stays on the screen, with the text. Then the tab reads it back. */
    async saveText() {
        const { text, base } = this._text;
        const name = this._current?.name;
        try {
            await this._request('PUT', `/model/scenarios/${encodeURIComponent(this._config.processName)}/feature`, { text, base });
        } catch (err) {
            this._status(`Not saved: ${err.message}`, true);
            return;
        }
        this._text = null;
        this._results = new Map();
        await this._load();
        this._current = this._scenarios.find(scenario => scenario.name === name) ?? this._current;
        this._status('Saved.');
        this.render();
        this._markCurrent();
        this._showLastRun(this._current);
    }

    _renderText() {
        return el('div', { class: 'test-text' },
            el('div', { class: 'test-text-actions' },
                el('strong', {}, `${this._config.processName}.feature`),
                el('button', { type: 'button', class: 'test-text-save primary', onclick: () => this.saveText() }, 'Save'),
                el('button', { type: 'button', class: 'test-text-cancel', onclick: () => this.closeText() }, 'Cancel')),
            el('textarea', { class: 'test-text-input', 'aria-label': `The tests of ${this._config.processName}, in Gherkin`, spellcheck: 'false', wrap: 'off', value: this._text.text,
                oninput: e => { this._text.text = e.target.value; } }));
    }

    /** The saved model is what runs: save the editor's changes first. */
    async _modelSaved() {
        if (this._config.save)
            await this._config.save();
    }

    // ---- the scenario's runs

    /** The scenario's last run: it replaces what was kept, whose instances are deleted. */
    _recordRun(scenario, run) {
        for (const old of scenario.runs ?? [])
            if (old.instanceId !== run.instanceId)
                this._request('DELETE', `/model/test/instance/${encodeURIComponent(old.instanceId)}`).catch(() => { });
        scenario.runs = [run];
    }

    /** Show a kept run: its instance (fetched), its result. */
    async showRun(scenario, run) {
        this._stopSimulation();
        if (this._live?.scenario === scenario) this._live = null;
        const before = this._results.get(scenario);
        let instance = null, error = run.error ?? null;
        try {
            ({ instance } = await this._request('GET', `/model/test/instance/${encodeURIComponent(run.instanceId)}`));
        } catch (err) {
            error = err.reported
                ? `The instance of this run is no longer kept: ${err.message}`
                : `Could not load this run's instance (${err.message}): restart bpmn-web if it predates this editor`;
        }
        // something newer arrived meanwhile (a Run, a Start): it stays
        if (this._results.get(scenario) !== before || this._live?.scenario === scenario)
            return;
        this._results.set(scenario, { ...run, error, instance });
        if (scenario === this._current) {
            this.render();
            this._markCurrent();
        }
    }

    // ---- running step by step

    /** Start: the start form opens (the start event, its data); starting it is `start`. */
    openStart(scenario = this._current) {
        if (!scenario) return;
        this._starting = this._starting === scenario ? null : scenario;
        this.render();
    }

    /** Start the process: what waits shows as the next steps. */
    async start(scenario = this._current) {
        this._coverageOn = false;
        if (!scenario) return;
        this._starting = null;
        this._restarting = null;
        this._debug = false;
        this._results.delete(scenario);
        try {
            await this._modelSaved();
            const { instance } = await this._request('POST', '/model/test/start', {
                processName: this._config.processName, startNodeId: scenario.start?.startNodeId, only: !!scenario.start?.only, data: scenario.start?.data ?? {}
            });
            this._live = { scenario, instance, done: [], checks: null, stepChecks: [], failed: null, startData: clone(instance.data),
                run: { instanceId: instance.id, at: new Date().toISOString(), how: 'start', ok: null } };
            this._recordRun(scenario, this._live.run);
            await this._save();
            const { checks: startChecks } = await this._request('POST', '/model/test/check', { instanceId: instance.id, checks: scenario.checks ?? [], at: 'start' });
            this._live.startChecks = startChecks;
            this._live.stepChecks.push(...startChecks);
            this._status(`Started ${scenario.name}`);
            await this._finishIfDone();
        } catch (err) {
            this._live = null;
            this._status(`Could not start: ${err.message}`, true);
        }
        this.render();
        this._markCurrent();
    }

    /** Complete a waiting item with data: a step of the scenario. */
    /** Complete a waiting item: `input` is its data, or the JSON text of it. */
    async runStep(item, input) {
        const live = this._live;
        await this._checking;   // a check just added is about the run as it is before this step
        const { value, error } = typeof input === 'string' ? parse(input) : { value: input };
        if (error) {
            this._status(`The data is not valid JSON: ${error}`, true);
            return;
        }
        try {
            const { instance } = await this._request('POST', '/model/test/invoke', { instanceId: live.instance.id, itemId: item.id, data: value });
            live.instance = instance;
            live.failed = null;
            // the checks due after this step
            const { checks } = await this._request('POST', '/model/test/check', {
                instanceId: instance.id, checks: live.scenario.checks ?? [], after: { element: item.elementId, name: item.name } });
            live.stepChecks.push(...checks);
            live.done.push({ element: item.elementId, data: value, itemId: item.id, after: clone(instance.data), checks });
            // the steps run are the scenario's; saved steps further on are kept while the run follows them
            const saved = live.scenario.steps ?? [];
            live.scenario.steps = sameSteps(live.done, saved) ? [...live.done, ...saved.slice(live.done.length)] : [...live.done];
            await this._save();
            this._status(`Ran ${item.name || item.elementId}`);
            await this._finishIfDone();
        } catch (err) {
            if (err.instance) live.instance = err.instance;
            live.failed = item.elementId;
            this._status(`${item.name || item.elementId} failed: ${err.message}`, true);
        }
        this.render();
        this._markCurrent();
    }

    /** Nothing waits: the run is over; check what the scenario expects. */
    async _finishIfDone() {
        const live = this._live;
        if (!live || this._waiting(live.instance).length) return;
        try {
            const { checks: atEnd, instance } = await this._request('POST', '/model/test/check', { instanceId: live.instance.id, checks: live.scenario.checks ?? [] });
            const checks = [...live.stepChecks, ...atEnd];
            live.checks = checks;
            live.instance = instance;
            live.run.ok = checks.every(c => c.ok);
            live.run.checks = checks;
            live.run.steps = live.done.map(d => ({ element: d.element, ok: true }));
            // saved steps beyond the end of this run are not part of it
            live.scenario.steps = [...live.done];
            await this._save();
            const failed = checks.filter(c => !c.ok).length;
            this._status(failed ? `Finished: ${failed} of ${checks.length} checks failed` : `Finished${checks.length ? ': all checks passed' : ''}`, failed > 0);
            // it closes by itself: the result shows
            this.stop();
        } catch (err) {
            this._status(err.message, true);
        }
    }

    stop() {
        // the run stays the scenario's last: its result and items are shown, and Simulate replays it
        const live = this._live;
        if (live?.instance)
            this._results.set(live.scenario, { ...live.run, ok: live.checks ? live.checks.every(c => c.ok) : null,
                checks: live.checks ?? [], steps: live.done.map(d => ({ element: d.element, ok: true })), instance: live.instance });
        this._live = null;
        this._debug = false;
        this.render();
        this._markCurrent();
    }

    // ---- the runs: debugged, deleted, cleared

    /**
     * Debug: the run shown, step by step with the variables. A run in progress turns the debugger on or off; a kept
     * run becomes the run in progress again, its steps done read from its items (a step's data and the variables
     * after it are not kept), so a step can be restarted.
     */
    debugRun(scenario = this._current) {
        const live = this._live?.scenario === scenario ? this._live : null;
        if (live) {
            if (this._debug && live.debugOnly) return this.stop();
            this._debug = !this._debug;
            this._restarting = null;
            return this.render();
        }
        const result = this._results.get(scenario);
        const instance = result?.instance;
        if (!instance?.id) return;
        const done = [...(instance.items || [])]
            .filter(i => i.status === 'end' && (i.type === 'bpmn:UserTask' || i.type === 'bpmn:ReceiveTask' || (String(i.type).includes('Event') && i.type !== 'bpmn:StartEvent' && i.type !== 'bpmn:EndEvent')))
            .sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0))
            .map(i => ({ element: i.elementId, itemId: i.id, data: null, after: null, checks: [] }));
        const run = (scenario.runs || []).find(r => r.instanceId === instance.id) ?? { instanceId: instance.id, at: new Date().toISOString(), how: 'start', ok: result.ok };
        this._live = { scenario, instance, done, checks: result.checks ?? null, stepChecks: [], failed: null, startData: null, run, debugOnly: true };
        this._debug = true;
        this._restarting = null;
        this._status('Debugging this run: change the variables, or Restart here at a step done');
        this.render();
        this._markCurrent();
    }

    /** The kept run deleted, with its test instance (and any an older version of the editor kept). */
    async deleteRun(scenario) {
        if (!confirm('Delete this run and its instance?')) return;
        for (const run of scenario.runs ?? []) {
            try {
                await this._request('DELETE', `/model/test/instance/${encodeURIComponent(run.instanceId)}`);
            } catch (err) {
                if (err.reported) return this._status(`The run was not deleted: ${err.message}`, true);
            }
        }
        scenario.runs = [];
        if (this._live?.scenario === scenario) this._live = null;
        this._results.delete(scenario);
        this._stopSimulation();
        await this._save();
        this._status('Run deleted');
        this.render();
        this._markCurrent();
    }

    /** Clear all: every scenario's runs deleted, with their test instances. */
    async clearAll() {
        const runs = this._scenarios.flatMap(s => s.runs || []);
        if (!runs.length) return this._status('No runs to clear');
        if (!confirm(`Delete all ${runs.length} runs of this model's scenarios, and their instances?`)) return;
        for (const run of runs)
            await this._request('DELETE', `/model/test/instance/${encodeURIComponent(run.instanceId)}`).catch(() => { });
        for (const scenario of this._scenarios) scenario.runs = [];
        this._results.clear();
        this._live = null;
        this._stopSimulation();
        await this._save();
        this._status(`${runs.length} runs cleared`);
        this.render();
        this._markCurrent();
    }

    // ---- the debugger: the variables changed; a step done restarted

    /** The instance's variables replaced; the next steps run with them (this run only: not part of the scenario). */
    async applyVariables(data) {
        const live = this._live;
        try {
            const { instance } = await this._request('POST', '/model/test/data', { instanceId: live.instance.id, data });
            live.instance = instance;
            this._status('Variables changed: the next steps run with them');
        } catch (err) {
            this._status(`The variables were not changed: ${err.message}`, true);
        }
        this.render();
    }

    /**
     * Restart here: the instance goes back to an item (the engine's restart), with the variables given; a step waits
     * again, another element runs again. The steps done after it are no longer done.
     */
    async restartAt(itemId, data, label) {
        const live = this._live;
        try {
            const { instance } = await this._request('POST', '/model/test/restart', { instanceId: live.instance.id, itemId, data });
            live.instance = instance;
            const kept = new Set((instance.items || []).filter(i => i.status !== 'wait').map(i => i.id));
            const at = live.done.findIndex(d => !kept.has(d.itemId));
            if (at >= 0) live.done = live.done.slice(0, at);
            live.stepChecks = [...(live.startChecks ?? []), ...live.done.flatMap(d => d.checks ?? [])];
            live.checks = null;
            live.failed = null;
            live.run.ok = null;
            this._restarting = null;
            this._status(`Back at ${label}: change what you need, then run it again`);
            await this._finishIfDone();
        } catch (err) {
            this._status(`Could not restart at ${label}: ${err.message}`, true);
        }
        this.render();
        this._markCurrent();
    }

    /** The steps that can be run now. */
    _waiting(instance) {
        return (instance?.items || []).filter(isStep);
    }

    /** What also waits but completes by itself: a joining gateway, a sub-process. */
    _waitingInside(instance) {
        return (instance?.items || []).filter(i => i.status === 'wait' && !isStep(i));
    }

    // ---- running the saved steps without stopping: a new instance

    async replay(scenario = this._current) {
        this._coverageOn = false;
        if (!scenario) return;
        this._live = null;
        this._status(`Running ${scenario.name}…`);
        try {
            await this._modelSaved();
            await this._save();
            const { results } = await this._request('POST', '/model/test/run', { processName: this._config.processName, scenario });
            this._results.set(scenario, results[0]);
            this._keepResult(scenario, results[0], 'run');
            await this._save();
            this._status(results[0].ok ? `${scenario.name}: passed` : `${scenario.name}: failed`, !results[0].ok);
        } catch (err) {
            this._results.set(scenario, { ok: false, error: err.message, steps: [], checks: [] });
            this._status(err.message, true);
        }
        this.render();
        this._markCurrent();
    }

    /** A Run's result, kept with the scenario. */
    _keepResult(scenario, result, how) {
        if (!result.instance?.id) return;
        this._recordRun(scenario, {
            instanceId: result.instance.id, at: new Date().toISOString(), how,
            ok: result.ok, error: result.error ?? undefined, checks: result.checks, steps: result.steps
        });
    }

    async runAll() {
        this._live = null;
        this._status('Running all scenarios…');
        try {
            await this._modelSaved();
            await this._save();
            const { results } = await this._request('POST', '/model/test/run', { processName: this._config.processName, all: true });
            results.forEach((result, i) => {
                this._results.set(this._scenarios[i], result);
                this._keepResult(this._scenarios[i], result, 'all');
            });
            await this._save();
            this._modelEdited = false;
            const failed = results.filter(r => !r.ok).length;
            this._status(failed ? `${failed} of ${results.length} failed` : `All ${results.length} passed`, failed > 0);
        } catch (err) {
            this._status(err.message, true);
        }
        this.render();
        this._markCurrent();
    }

    // ---- the model's elements

    _elements(types) {
        const found = [];
        const walk = container => (container.get('flowElements') || []).forEach(e => {
            if (!types || types.some(t => is(e, t))) found.push(e);
            if (is(e, 'bpmn:SubProcess')) walk(e);
        });
        for (const process of (this._bpmnjs.getDefinitions()?.get('rootElements') || []).filter(e => is(e, 'bpmn:Process')))
            walk(process);
        return found;
    }

    /** An element's form fields (camunda:formData): { id, label, type, defaultValue, values: [{ id, name }] }. */
    _formFields(elementId) {
        const bo = this._elements().find(e => e.id === elementId);
        const formData = (bo?.get('extensionElements')?.get('values') || []).find(v => is(v, 'camunda:FormData'));
        return (formData?.get('fields') || []).map(field => ({
            id: field.get('id'), label: field.get('label') || field.get('id'), type: field.get('type') || 'string',
            defaultValue: field.get('defaultValue'),
            values: (field.get('values') || []).map(v => ({ id: v.get('id'), name: v.get('name') || v.get('id') }))
        })).filter(field => field.id);
    }

    /** A waiting element's data to start from: the element's form fields. */
    _formTemplate(elementId) {
        const data = {};
        for (const field of this._formFields(elementId))
            data[field.id] = field.defaultValue ?? (field.type === 'boolean' ? false : field.type === 'long' ? 0 : '');
        return data;
    }

    /**
     * A user task's form for a step: an input per form field, typed as the task page shows it, and the data that
     * is not a form field as JSON under "Other data". `read()` gives the data, or { error }.
     */
    _stepForm(item, data) {
        const fields = this._formFields(item.elementId);
        const inputs = fields.map(field => {
            const value = data?.[field.id] ?? field.defaultValue;
            const id = `test-form-${item.id}-${field.id}`;
            let input;
            if (field.type === 'enum')
                input = el('select', { id, 'data-field': field.id },
                    el('option', { value: '' }, ''),
                    field.values.map(v => el('option', { value: v.id, selected: String(value ?? '') === v.id }, v.name)));
            else if (field.type === 'boolean')
                input = el('input', { id, type: 'checkbox', 'data-field': field.id, checked: value === true || value === 'true' });
            else if (field.type === 'long')
                input = el('input', { id, type: 'number', 'data-field': field.id, value: value ?? '' });
            else if (field.type === 'date')
                input = el('input', { id, type: 'date', 'data-field': field.id, value: value ? String(value).slice(0, 10) : '' });
            else
                input = el('input', { id, type: 'text', 'data-field': field.id, value: value ?? '' });
            return el('label', { class: 'test-form-field', for: id }, el('span', {}, field.label), input);
        });
        const other = Object.fromEntries(Object.entries(data ?? {}).filter(([key]) => !fields.some(f => f.id === key)));
        const extra = this._jsonField('Other data', other, () => { }, { rows: 2 });
        const node = el('div', { class: 'test-form' }, inputs,
            el('details', { class: 'test-form-other', open: Object.keys(other).length > 0 }, el('summary', {}, 'Other data (JSON)'), extra));
        const read = () => {
            const { value: rest, error } = parse(extra.querySelector('textarea').value);
            if (error) return { error };
            const values = { ...rest };
            for (const field of fields) {
                const input = node.querySelector(`[data-field="${CSS.escape(field.id)}"]`);
                if (field.type === 'boolean') values[field.id] = input.checked;
                else if (field.type === 'long') values[field.id] = input.value === '' ? null : Number(input.value);
                else values[field.id] = input.value;
            }
            return { value: values };
        };
        return { node, read };
    }

    /** The data a pending step starts with: the saved step at this point of the run, else the form fields. */
    _stepData(item) {
        const live = this._live;
        const saved = live.scenario.steps ?? [];
        if (sameSteps(live.done, saved)) {
            const next = saved.slice(live.done.length).find(s => s.element === item.elementId);
            if (next) return next.data ?? {};
        }
        return { ...this._formTemplate(item.elementId), ...this._goalFormData(item.elementId) };
    }

    /** An element's icon, by its type. */
    _elementIcon(elementId) {
        const bo = this._elements().find(e => e.id === elementId);
        const icon = bo && ELEMENT_ICONS.find(([type]) => is(bo, type))?.[1];
        return el('span', { class: `test-step-icon bpmn-icon-${icon ?? 'task-none'}`, 'aria-hidden': 'true' });
    }

    _label(elementId, name) {
        const bo = this._elements().find(e => e.id === elementId);
        const label = name || bo?.get('name');
        return label ? `${label} (${elementId})` : elementId;
    }

    // ---- simulating the last run: its elements one after another, numbered in the order they ran

    /** The instance of the scenario's last run: the step-by-step one, else the last Run. */
    _lastRun(scenario = this._current) {
        if (this._live?.scenario === scenario) return this._live.instance;
        return this._results.get(scenario)?.instance ?? null;
    }

    /**
     * Simulate: the last run on the diagram one change at a time, paused on the first: Step (and Back) one change,
     * Play the rest (Pause), Stop. The status says what each change is.
     */
    simulate() {
        const sim = this._simulation;
        if (sim) return sim.paused ? this._playSimulation() : this._pauseSimulation();
        const instance = this._lastRun();
        if (!instance) return;
        this._coverageOn = false;
        this._config.showDiagram?.();       // it shows on the diagram
        this._unmark();
        this._simulation = { frames: this._simulationFrames(instance), index: 0, timer: null, paused: true };
        this._stepSimulation();
        this._simulationControls();
    }

    _playSimulation() {
        const sim = this._simulation;
        sim.paused = false;
        const next = () => {
            if (this._simulation !== sim || sim.paused) return;
            if (!this._stepSimulation()) return;
            sim.timer = setTimeout(next, SIMULATION_STEP);
        };
        next();
        this._simulationControls();
    }

    _pauseSimulation() {
        const sim = this._simulation;
        clearTimeout(sim.timer);
        sim.paused = true;
        this._simulationStatus();
        this._simulationControls();
    }

    /** Show the next change; false when there is none (the simulation stays on its last, paused). */
    _stepSimulation() {
        const sim = this._simulation;
        if (!sim) return false;
        if (sim.index >= sim.frames.length) {
            clearTimeout(sim.timer);
            sim.paused = true;
            sim.text = `Done (${sim.frames.length} changes): blue started, green done, orange still waiting; the numbers are the order they started in`;
            this._simulationControls();
            return false;
        }
        sim.frames[sim.index++].show();
        this._simulationStatus();
        this._simulationControls();
        return true;
    }

    /** One change back: the diagram drawn again up to the change before. */
    _backSimulation() {
        const sim = this._simulation;
        if (!sim || sim.index <= 1) return;
        clearTimeout(sim.timer);
        sim.paused = true;
        this._unmark();
        sim.index--;
        sim.frames.slice(0, sim.index).forEach(frame => frame.show());
        this._simulationStatus();
        this._simulationControls();
    }

    _simulationStatus() {
        const sim = this._simulation;
        if (sim?.index) sim.text = `${sim.index} of ${sim.frames.length}: ${sim.frames[sim.index - 1].text}`;
    }

    /** The simulation's panel as it stands: shown while it runs, Back, Step, Play or Pause, what it is showing. */
    _simulationControls() {
        const sim = this._simulation;
        const root = this._root;
        if (!root) return;
        const panel = root.querySelector('.test-sim-panel');
        if (panel) panel.hidden = !sim;
        const button = root.querySelector('.test-simulate');
        if (button) {
            button.classList.toggle('active', Boolean(sim));
            button.setAttribute('aria-pressed', String(Boolean(sim)));
        }
        const atEnd = sim && sim.index >= sim.frames.length;
        const play = root.querySelector('.test-sim-play');
        if (play) {
            play.textContent = sim && !sim.paused ? '⏸ Pause' : '▶ Play';
            play.disabled = !sim || atEnd;
        }
        const back = root.querySelector('.test-sim-back');
        if (back) back.disabled = !(sim?.index > 1);
        const step = root.querySelector('.test-sim-step');
        if (step) step.disabled = !sim || atEnd;
        const text = root.querySelector('.test-sim-text');
        if (text) text.textContent = sim?.text ?? '';
    }

    /**
     * The simulation, one frame at a time. An element starts (blue, numbered by its place among the run's items
     * as the instance page numbers them) when its item is created, and ends just before the flow that leaves it is
     * taken: a joining gateway starts when its first branch arrives and ends only when the last has. Flows are
     * taken at once (green). An element nothing left ends right after it starts; one that still waits when the run
     * stopped turns orange at the end.
     */
    _simulationFrames(instance) {
        // the model's flows, drawn or not: a flow taken ends the element it leaves
        const flowSource = new Map(this._elements(['bpmn:SequenceFlow']).map(f => [f.id, f.get('sourceRef')?.id]));
        const items = [...(instance.items || [])]
            .filter(i => this._elementRegistry.get(i.elementId) || flowSource.has(i.elementId))
            .sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
        const number = new Map(items.map((item, i) => [item, i + 1]));
        const isFlow = item => flowSource.has(item.elementId);
        const sourceOf = item => flowSource.get(item.elementId);
        const open = [];        // started, not ended
        const frames = [];      // { show, text }
        const name = item => this._label(item.elementId, item.name);
        const frame = (item, marker, text, numbered = true) =>
            frames.push({ show: () => this._simulateItem(item, marker, numbered ? number.get(item) : undefined), text });
        const end = item => {
            open.splice(open.indexOf(item), 1);
            frame(item, 'test-passed', `${name(item)} done`);
        };
        for (const item of items) {
            if (isFlow(item)) {
                // the element the flow leaves ends first (its latest item started before the flow)
                const source = [...open].reverse().find(o => o.elementId === sourceOf(item));
                if (source) end(source);
                frame(item, 'test-passed', `flow ${name(item)} taken`, false);
                continue;
            }
            open.push(item);
            frame(item, 'test-started', `${name(item)} started`);
        }
        // what nothing left: ended where it stopped (end events), or still waiting
        for (const item of [...open])
            if (item.status !== 'wait') end(item);
        // and what still waits shows as waiting
        for (const item of open.filter(i => i.status === 'wait'))
            frame(item, 'test-waiting', `${name(item)} waits`);
        return frames;
    }

    /** Show an item's element in a state; with a number, label it. */
    _simulateItem(item, marker, number) {
        const element = this._elementRegistry.get(item.elementId);
        if (!element) return;      // not drawn (a flow without a line): nothing to show
        MARKERS.forEach(m => this._canvas.removeMarker(element, m));
        this._canvas.addMarker(element, marker);
        if (!this._marked.includes(element)) this._marked.push(element);
        if (number !== undefined && !element.waypoints) {
            this._overlays.remove({ element, type: 'test-seq' });
            this._overlays.add(element, 'test-seq', {
                position: { top: -14, left: -8 },
                html: `<div class="test-seq ${marker}" data-seq="${number}">${number}</div>`
            });
        }
    }

    /** Stop: the simulation ends, and the diagram shows the run as it ended. */
    _stopSimulation() {
        const was = this._simulation;
        clearTimeout(was?.timer);
        this._simulation = null;
        this._simulationControls();
        if (was) this._markCurrent();
    }

    // ---- the diagram: the path taken

    _markCurrent() {
        if (this._coverageOn)
            return this._markCoverage();
        if (this._live?.scenario === this._current)
            this._mark(this._live.instance, this._live.failed ? [this._live.failed] : []);
        else {
            const result = this._results.get(this._current);
            this._mark(result?.instance, (result?.steps || []).filter(s => !s.ok).map(s => s.element));
        }
    }

    _mark(instance, failedElements = []) {
        this._unmark();
        if (!instance || !this._visible) return;
        const failed = new Set(failedElements);
        for (const item of instance.items || [])
            this._markItem(item, failed.has(item.elementId));
        const goal = this._goal?.scenario === this._current && this._elementRegistry.get(this._goal.id);
        if (goal && !this._marked.includes(goal)) {
            this._canvas.addMarker(goal, 'test-goal-element');
            this._marked.push(goal);
        }
    }

    /** Mark an item's element by how it ran; with a number, label it (a simulation). */
    _markItem(item, failed, number) {
        const element = this._elementRegistry.get(item.elementId);
        if (!element || element.type === 'label') return;
        const marker = failed ? 'test-failed' : item.status === 'wait' ? 'test-waiting' : 'test-passed';
        MARKERS.forEach(m => this._canvas.removeMarker(element, m));
        this._canvas.addMarker(element, marker);
        this._marked.push(element);
        if (number !== undefined && !element.waypoints)
            this._overlays.add(element, 'test-seq', {
                position: { top: -14, left: -8 },
                html: `<div class="test-seq ${marker}" data-seq="${number}">${number}</div>`
            });
    }

    _unmark() {
        for (const element of this._marked)
            MARKERS.forEach(m => this._canvas.removeMarker(element, m));
        this._marked = [];
        this._overlays.remove({ type: 'test-seq' });
    }

    // ---- the tab

    _status(text, isError = false) {
        const status = this._root?.querySelector('.test-status');
        if (!status) return;
        status.textContent = text;
        status.classList.toggle('error', isError);
    }

    render() {
        if (!this._root) return;
        const status = this._root.querySelector('.test-status');
        const keep = status ? [status.textContent, status.classList.contains('error')] : ['', false];
        const scrolled = this._root.querySelector('.test-main')?.scrollTop ?? 0;
        this._root.replaceChildren(el('div', { class: 'test-panel' },
            this._text ? null : this._renderList(),
            this._text ? null : this._renderListResizer(),
            el('div', { class: 'test-main' },
                el('div', { class: `test-status${keep[1] ? ' error' : ''}`, role: 'status' }, keep[0]),
                this._text ? this._renderText() : this._current ? this._renderScenario(this._current) :
                    el('p', { class: 'test-hint' }, 'A scenario tests the process: add one with New, then Record it by doing its steps.'))));
        const main = this._root.querySelector('.test-main');
        if (main) main.scrollTop = scrolled;
    }

    /** The list's width, on the tab's root: it stays when the panel is drawn again. */
    _setListWidth(width) {
        const room = this._root.clientWidth ? this._root.clientWidth - MIN_MAIN_WIDTH : Infinity;
        this._listWidth = Math.round(Math.max(MIN_LIST_WIDTH, Math.min(width, room)));
        this._root.style.setProperty('--test-list-width', `${this._listWidth}px`);
    }

    _saveListWidth() {
        try {
            localStorage.setItem(LIST_WIDTH_KEY, String(this._listWidth));
        } catch { /* no storage: this page only */ }
    }

    /** The handle between the list and the scenario: drag it, or use the arrow keys. */
    _renderListResizer() {
        const current = () => this._root.querySelector('.test-list').getBoundingClientRect().width;
        return el('div', { class: 'test-list-resizer', role: 'separator', 'aria-orientation': 'vertical', 'aria-label': 'Resize the scenario list', tabindex: '0',
            onpointerdown: down => {
                down.preventDefault();
                const startX = down.clientX, startWidth = current();
                this._root.classList.add('test-resizing');
                const move = event => this._setListWidth(startWidth + event.clientX - startX);
                const up = () => {
                    window.removeEventListener('pointermove', move);
                    window.removeEventListener('pointerup', up);
                    this._root.classList.remove('test-resizing');
                    this._saveListWidth();
                };
                window.addEventListener('pointermove', move);
                window.addEventListener('pointerup', up);
            },
            onkeydown: event => {
                const by = { ArrowLeft: -20, ArrowRight: 20 }[event.key];
                if (!by) return;
                event.preventDefault();
                this._setListWidth(current() + by);
                this._saveListWidth();
            } });
    }

    /** A drop-down of commands: [label, class, what it does, title, disabled]. It closes on a choice, or when left. */
    _menu(label, className, items) {
        const menu = el('details', { class: `test-menu ${className}` }, el('summary', { 'aria-label': label === '⋯' ? 'More' : label }, label),
            el('div', { class: 'test-menu-items' }, items.map(([text, itemClass, action, title, disabled]) =>
                el('button', { type: 'button', class: itemClass, title, disabled, onclick: () => { menu.open = false; action(); } }, text))));
        menu.addEventListener('focusout', e => { if (!menu.contains(e.relatedTarget)) menu.open = false; });
        return menu;
    }

    /** The instance of the run shown for a scenario. */
    _shownId(scenario) {
        return this._live?.scenario === scenario ? this._live.run?.instanceId : this._results.get(scenario)?.instance?.id;
    }

    /** A scenario: its name, Run, Record and the rest; its result; its steps with their checks; Inspect this run. */
    _renderScenario(scenario) {
        const changed = () => this._scheduleSave();
        const live = this._live?.scenario === scenario ? this._live : null;
        scenario.steps ??= [];
        scenario.checks ??= [];
        const starts = this._elements(['bpmn:StartEvent']).filter(e => is(e.$parent, 'bpmn:Process'));
        return el('div', { class: 'test-editor' },
            el('div', { class: 'test-editor-actions' },
                el('input', { class: 'test-name', 'aria-label': 'Scenario name', value: scenario.name, disabled: scenario.source !== undefined, oninput: e => { scenario.name = e.target.value; changed(); } }),
                // a scenario with a start and no steps is a test too: started, then what is expected checked (a process
                // that runs to its end by itself, or stops at its first wait)
                el('button', { type: 'button', class: 'test-replay primary', onclick: () => this.replay(scenario), disabled: !scenario.start && scenario.source === undefined,
                    title: scenario.steps.length || scenario.source !== undefined ? 'Repeat the steps on a new instance without stopping, and check what is expected'
                        : 'Start it on a new instance, and check what is expected (no steps recorded: Record adds them)' }, '▶ Run'),
                scenario.source !== undefined ? null : live && !live.debugOnly ? el('button', { type: 'button', class: 'test-stop-recording', onclick: () => this.stop(),
                    title: 'End this: the steps done so far stay the scenario\'s' }, '■ Stop')
                    : el('button', { type: 'button', class: `test-run${this._starting === scenario ? ' active' : ''}`, onclick: () => this.openStart(scenario),
                        title: 'Do the steps yourself, one at a time: they become the scenario\'s steps' }, '● Record'),
                this._menu('⋯', 'test-scenario-menu', [
                    ...(scenario.source !== undefined ? [] : [['Duplicate', 'test-duplicate', () => {
                        const copy = JSON.parse(JSON.stringify(scenario));
                        copy.name = `${scenario.name} (copy)`;
                        delete copy.runs;       // the runs are the original's
                        this._scenarios.splice(this._scenarios.indexOf(scenario) + 1, 0, copy);
                        changed(); this._select(copy);
                    }, 'A copy of this scenario']]),
                    ['Delete scenario', 'test-delete', () => {
                        if (!confirm(`Delete the scenario '${scenario.name}'?`)) return;
                        this._scenarios.splice(this._scenarios.indexOf(scenario), 1);
                        if (this._live?.scenario === scenario) this._live = null;
                        changed(); this._select(this._scenarios[0] ?? null);
                    }, 'Delete this scenario and forget its runs']])),
            scenario.generated ? this._renderGenerated(scenario) : null,
            this._goal?.scenario === scenario ? this._renderGoal(scenario, live) : null,
            this._starting === scenario ? this._renderStart(scenario, starts) : null,
            this._renderSummary(scenario, live),
            this._renderSimulation(),
            live && this._debug ? this._renderDebug(scenario, live) : null,
            // written by hand in its .feature, with what this tab has no form for: it runs, and stays as written
            scenario.source !== undefined ? el('div', { class: 'test-written' },
                el('p', {}, 'Written in Gherkin, with what this tab has no form for. Run it here; to change it, ',
                    el('button', { type: 'button', class: 'test-written-edit', onclick: () => this.openText(), disabled: !!this._live }, 'Edit as text'), '.'),
                el('pre', {}, scenario.source),
                this._writtenSteps(scenario, live)) : this._renderTimeline(scenario, live),
            scenario.source !== undefined ? null : this._renderChecks(scenario, live),
            this._renderInspect(scenario, live));
    }

    /** The result line: passed, failed, recording or not run; the instance and the run's commands; a run that could not go on. */
    _renderSummary(scenario, live) {
        const result = live ? { ok: live.checks ? live.checks.every(c => c.ok) : null, checks: live.checks ?? [], steps: [], instance: live.instance }
            : this._results.get(scenario);
        const shownId = this._shownId(scenario);
        const inProgress = live && !live.checks;
        const kept = (scenario.runs || []).find(r => r.instanceId === shownId);
        const title = inProgress ? (this._debug ? '● Debugging this run' : '● Recording: complete each step below')
            : !result ? (scenario.runs?.length ? 'Loading the last run…' : 'Not run yet')
            : result.ok === null ? `Not finished: the instance is ${result.instance?.status ?? 'gone'}`
            : result.ok ? '✓ Passed' : '✗ Failed';
        const state = inProgress ? 'recording' : !result || result.ok === null ? '' : result.ok ? 'ok' : 'failed';
        return el('div', { class: `test-summary test-result ${state}` },
            el('div', { class: 'test-summary-line' },
                el('strong', { class: 'test-summary-title', ...(kept ? { title: `${HOW[kept.how] ?? kept.how}, ${new Date(kept.at).toLocaleString()}` } : {}) }, title),
                shownId ? el('a', { class: 'test-instance-link', href: `/instanceDetails?id=${encodeURIComponent(shownId)}`, target: '_blank', title: 'Open the instance page' }, 'Open instance ↗') : null,
                shownId ? this._runCommands(scenario, live, shownId) : null),
            result?.error ? el('p', { class: 'test-error' }, result.error) : null);
    }

    /** The steps, each with its result, then what waits now. */
    _renderTimeline(scenario, live) {
        const result = live ? null : this._results.get(scenario);
        const steps = live ? live.done : scenario.steps;
        // the run shown, step by step: under each of the timeline's, what happened when it ran
        const instance = live ? live.instance : result?.instance;
        const run = instance?.steps?.length ? this._runSteps(scenario, instance, live) : null;
        const partOf = stepIndex => {
            const i = run ? run.places.findIndex(p => p.stepIndex === stepIndex) : -1;
            return i < 0 ? null : run.part(i);
        };
        // the run's steps no step of the scenario asked for (a timer the server fired), after the step they followed
        const unasked = new Map();
        if (run) {
            let after = -1;
            run.places.forEach((p, i) => {
                if (p.stepIndex !== undefined) after = p.stepIndex;
                else unasked.set(after, [...(unasked.get(after) ?? []), i]);
            });
        }
        const unaskedRows = after => (unasked.get(after) ?? []).map(i => el('div', { class: 'test-step by-itself', 'data-element-id': run.groups[i].element ?? '' },
            run.line(run.groups[i]), run.part(i)));
        const seen = new Set();     // a step repeated (a loop): its checks under the first
        const startId = scenario.start?.startNodeId;
        const firstStart = this._elements(['bpmn:StartEvent']).find(e => is(e.$parent, 'bpmn:Process'));
        const startName = startId ? this._label(startId) : (firstStart?.get('name') || 'the process');
        return el('div', { class: 'test-timeline' },
            el('div', { class: 'test-step test-step-start' },
                el('span', { class: 'test-step-name' }, this._elementIcon(startId ?? firstStart?.id), scenario.start?.only ? `This task alone: ${startName}` : `Start: ${startName}`),
                el('code', { class: 'test-step-data' }, JSON.stringify(scenario.start?.data ?? {})),
                // its checks: under their items in what happened, once it ran; before, here
                partOf(-1) ?? this._checkRows(scenario, c => c.at === 'start')),
            unaskedRows(-1),
            steps.map((step, i) => {
                // a Run's result for this step; a stopped run has none for the steps after
                const outcome = result?.steps?.[i]?.element === step.element ? result.steps[i] : null;
                const mark = live || outcome?.ok ? '✓ ' : outcome ? '✗ ' : '';
                const first = !seen.has(step.element);
                seen.add(step.element);
                return [el('div', { class: `test-step ${live ? 'done' : 'saved'}${outcome && !outcome.ok ? ' failed' : ''}`, 'data-element-id': step.element },
                    el('span', { class: 'test-step-name' }, mark, this._elementIcon(step.element), this._label(step.element)),
                    el('code', { class: 'test-step-data' }, JSON.stringify(step.data ?? {})),
                    live ? null : el('button', { type: 'button', class: 'test-step-remove', title: 'Remove this step and the ones after it',
                        onclick: () => { scenario.steps.splice(i); this._scheduleSave(); this.render(); } }, '✕'),
                    outcome?.error ? el('span', { class: 'test-error test-step-error' }, outcome.error) : null,
                    live && this._debug ? this._renderDoneDebug(live, step, i) : null,
                    partOf(i) ?? (first ? this._checkRows(scenario, c => c.at === 'after' && c.step === step.element) : null)),
                    unaskedRows(i)];
            }),
            live ? this._renderPending(live) : null,
            !live && !steps.length ? el('p', { class: 'test-hint' }, 'No steps yet. Record the scenario: each task you complete becomes a step, and Run then repeats them.') : null);
    }

    /** The run shown's commands: Simulate and Debug, each opening its panel; Delete. */
    _runCommands(scenario, live, shownId) {
        const shownRun = (scenario.runs || []).find(r => r.instanceId === shownId);
        const sim = this._simulation;
        const debugging = Boolean(live && this._debug);
        return [
            el('button', { type: 'button', class: `test-simulate${sim ? ' active' : ''}`, 'aria-pressed': String(Boolean(sim)), disabled: !this._lastRun(scenario),
                onclick: () => { if (this._simulation) this._stopSimulation(); else this.simulate(); },
                title: 'Show this run on the diagram one change at a time' }, 'Simulate'),
            el('button', { type: 'button', class: `test-debug${debugging ? ' active' : ''}`, 'aria-pressed': String(debugging),
                onclick: () => this.debugRun(scenario),
                title: 'Change the variables of this run; restart a step done and run it again' }, 'Debug'),
            shownRun ? el('button', { type: 'button', class: 'test-run-delete', onclick: () => this.deleteRun(scenario),
                title: 'Delete this run and its instance' }, 'Delete') : null];
    }

    /** Simulate's panel: always there, shown while a simulation runs (_simulationControls). */
    _renderSimulation() {
        const sim = this._simulation;
        const atEnd = sim && sim.index >= sim.frames.length;
        return el('div', { class: 'test-command-panel test-sim-panel', hidden: !sim },
            el('strong', {}, 'Simulate'),
            el('button', { type: 'button', class: 'test-sim-back', disabled: !(sim?.index > 1),
                onclick: () => this._backSimulation(), title: 'Back one change' }, '◀ Back'),
            el('button', { type: 'button', class: 'test-sim-step', disabled: !sim || atEnd,
                onclick: () => { this._pauseSimulation(); this._stepSimulation(); }, title: 'The next change' }, 'Step ▶'),
            el('button', { type: 'button', class: 'test-sim-play', disabled: !sim || atEnd,
                onclick: () => this.simulate(), title: 'Play the rest, or pause' }, sim && !sim.paused ? '⏸ Pause' : '▶ Play'),
            el('button', { type: 'button', class: 'test-sim-stop', onclick: () => this._stopSimulation(), title: 'End the simulation' }, '■ Stop'),
            el('span', { class: 'test-sim-text' }, sim?.text ?? ''));
    }

    /** Debug's panel: the variables now; Restart here is on each step done, below. */
    _renderDebug(scenario, live) {
        return el('div', { class: 'test-command-panel test-debug-panel' },
            el('div', { class: 'test-debug-head' },
                el('strong', {}, 'Debug'),
                live.done.length ? el('span', { class: 'test-hint' }, 'To go back: Restart here, on a step below.') : null,
                el('button', { type: 'button', class: 'test-debug-stop', onclick: () => this.debugRun(scenario) }, '■ Stop debugging')),
            this._renderVariables(live));
    }

    /** Where the run shown is, as a check's When: while it waits, after the last step done or at the start; else at the end. */
    _runPosition(scenario, instance, live) {
        if (!this._waiting(instance).length) return {};
        const steps = live ? live.done : this._results.get(scenario)?.steps ?? [];
        const last = steps.at(-1)?.element;
        return last ? { at: 'after', step: last } : { at: 'start' };
    }

    /** Add as a check: this check, at that position; once it is there, says so. */
    _addCheckButton(scenario, check) {
        if ((scenario.checks ?? []).some(c => checkKey(c) === checkKey(check)))
            return el('button', { type: 'button', class: 'test-add-check added', disabled: true, title: 'This check is in the scenario\'s checks' }, '✓ In checks');
        const where = check.at === 'after' ? `after ${this._label(check.step)}` : check.at === 'start' ? 'at the start' : 'at the end';
        return el('button', { type: 'button', class: 'test-add-check', title: `Check this is so ${where}`, onclick: e => {
            e.stopPropagation();
            (scenario.checks ??= []).push(check);
            this._scheduleSave();
            this._status(`Check added, ${where}`);
            this._checkNow(scenario, check);
            this.render();
        } }, 'Add as a check');
    }

    /** A check added while recording, under a step already done: what it finds now is that step's result. */
    _checkNow(scenario, check) {
        const live = this._live?.scenario === scenario && !this._live.checks ? this._live : null;
        if (!live) return;
        this._checking = (this._checking ?? Promise.resolve()).then(async () => {
            const { checks } = await this._request('POST', '/model/test/check', { instanceId: live.instance.id, checks: [check],
                ...(check.at === 'after' ? { after: { element: check.step } } : { at: check.at }) });
            live.stepChecks.push(...checks);
            if (check.at === 'after') (live.done.at(-1).checks ??= []).push(...checks);
            else (live.startChecks ??= []).push(...checks);
            this.render();
        }).catch(err => this._status(err.message, true));
    }

    /** The run's data, a value a row: an object's values under their paths (a.b), each to Add as a check. */
    _renderData(scenario, instance, live) {
        const position = this._runPosition(scenario, instance, live);
        const isObject = value => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length;
        const rows = [];
        const walk = (value, prefix) => {
            for (const [key, v] of Object.entries(value)) {
                const path = prefix ? `${prefix}.${key}` : key;
                if (isObject(v)) walk(v, path);
                else rows.push([path, v]);
            }
        };
        walk(instance.data ?? {}, '');
        if (!rows.length) return el('p', { class: 'test-hint' }, 'No data.');
        return el('table', { class: 'test-data-table' }, el('tbody', {}, rows.map(([path, value]) => el('tr', { class: 'test-data-row', 'data-path': path },
            el('td', { class: 'test-data-path' }, path),
            el('td', { class: 'test-data-value' }, JSON.stringify(value)),
            el('td', {}, this._addCheckButton(scenario, { kind: 'data', path, op: '=', value, ...position }))))));
    }

    /** Inspect this run: the instance's data, items, the engine's decisions and log. */
    _renderInspect(scenario, live) {
        const result = live ? { instance: live.instance } : this._results.get(scenario);
        const instance = result?.instance;
        if (!instance?.id) return null;
        return this._part('inspect', 'Inspect this run', [
            this._part('data', 'Data', this._renderData(scenario, instance, live), { class: 'test-data-part' }),
            this._renderItems(scenario, instance, live),
            this._part('log', `Log (${instance.logs?.length ?? 0} lines)`, el('pre', { class: 'test-log' }, (instance.logs || []).join('\n')))
        ], { class: 'test-inspect' });
    }

    _select(scenario) {
        this._stopSimulation();
        this._coverageOn = false;
        if (this._goal?.scenario !== scenario) this._goal = null;
        if (this._current !== scenario) this._openSteps.clear();
        this._current = scenario;
        this.render();
        this._markCurrent();
        this._showLastRun(scenario);
    }

    /** A scenario opened with nothing run in this session: its last kept run. */
    _showLastRun(scenario) {
        if (scenario && !this._results.has(scenario) && this._live?.scenario !== scenario && scenario.runs?.length)
            this.showRun(scenario, scenario.runs[0]);
    }

    _renderList() {
        const add = () => {
            const scenario = { name: `Scenario ${this._scenarios.length + 1}`, start: { data: {} }, steps: [], expect: {} };
            this._scenarios.push(scenario);
            this._scheduleSave();
            this._select(scenario);
        };
        // a scenario of the task selected on the diagram, by itself
        const addTask = () => {
            const bo = this._selection.get()[0]?.businessObject;
            if (!bo || !this._isTask(bo))
                return this._status('Select a task on the diagram first, then New: The task selected', true);
            const scenario = { name: `${bo.get('name') || bo.id} by itself`, start: { startNodeId: bo.id, only: true, data: {} }, steps: [], expect: {} };
            this._scenarios.push(scenario);
            this._scheduleSave();
            this._select(scenario);
            this.openStart(scenario);
        };
        return el('div', { class: 'test-list' },
            el('div', { class: 'test-list-actions' },
                this._menu('New ▾', 'test-new-menu', [
                    ['The whole process', 'test-new', add, 'A scenario that goes through the process'],
                    ['The task selected', 'test-task', addTask, 'A scenario that runs the task selected on the diagram by itself: its input, then what it did']]),
                el('button', { type: 'button', class: 'test-run-all', onclick: () => this.runAll(), disabled: !this._scenarios.length,
                    title: 'Run every scenario\'s saved steps' }, 'Run all'),
                this._menu('⋯', 'test-list-menu', [
                    ['Edit as text', 'test-edit-text', () => this.openText(), 'The tests of this model as Gherkin, all of the .feature file', !!this._live],
                    ['Delete all runs', 'test-clear-all', () => this.clearAll(), 'Delete every run of these scenarios, and their instances (the scenarios stay)',
                        !this._scenarios.some(s => s.runs?.length)],
                    ['Delete generated scenarios', 'test-delete-generated', () => this.deleteGenerated(), 'Delete the scenarios Test all paths saved that have not been reviewed, and their runs',
                        !this._scenarios.some(s => s.generated)]])),
            el('ul', { class: 'test-tree' }, this._scenarios.map(scenario => this._renderScenarioRow(scenario))),
            this._renderCoverage());
    }

    // ---- coverage: how much of the model the scenarios' last runs have reached

    /** The last run of each scenario that has an instance, and how many have none, or one still to fetch. */
    _coverageRuns() {
        const runs = [], toFetch = [];
        let notRun = 0;
        for (const scenario of this._scenarios) {
            const live = this._live?.scenario === scenario ? this._live : null;
            const result = this._results.get(scenario);
            const kept = scenario.runs?.[0];
            const generated = !!scenario.generated;
            if (live) runs.push({ ok: live.checks ? live.checks.every(c => c.ok) : null, items: live.instance?.items, generated });
            else if (result?.instance?.items) runs.push({ ok: result.ok, items: result.instance.items, generated });
            else if (!kept) notRun++;
            else if (!this._coverageItems.has(kept.instanceId)) toFetch.push(kept.instanceId);
            else if (this._coverageItems.get(kept.instanceId)) runs.push({ ok: kept.ok, items: this._coverageItems.get(kept.instanceId), generated });
            else notRun++;      // its instance is gone
        }
        return { runs, notRun, toFetch };
    }

    /** The kept runs' instances this session has not seen; then what they add. */
    _fetchCoverage(ids) {
        for (const id of ids) {
            this._coverageItems.set(id, null);
            this._request('GET', `/model/test/instance/${encodeURIComponent(id)}`)
                .then(({ instance }) => this._coverageItems.set(id, instance?.items ?? null))
                .catch(() => this._coverageItems.set(id, null))
                .finally(() => {
                    this._coverageLoading.delete(id);
                    this._refreshCoverage();
                });
            (this._coverageLoading ??= new Set()).add(id);
        }
    }

    _coverage() {
        const { runs, notRun, toFetch } = this._coverageRuns();
        if (toFetch.length) this._fetchCoverage(toFetch);
        const ids = types => this._elements(types).filter(e => !e.get('triggeredByEvent')).map(e => e.id);  // an event sub-process has no item: what is inside counts
        return { ...coverageOf({ nodes: ids(['bpmn:FlowNode']), flows: ids(['bpmn:SequenceFlow']) }, runs, this._listeners()), notRun };
    }

    _refreshCoverage() {
        const block = this._root?.querySelector('.test-coverage');
        const fresh = this._renderCoverage();
        if (block && fresh) block.replaceWith(fresh);
        if (this._coverageOn && this._visible) this._markCoverage();
    }

    /** An element of a gap, in words: a flow by where it goes. */
    _gapLabel(id) {
        const bo = this._elements().find(e => e.id === id);
        if (!bo?.sourceRef) return this._label(id);
        const name = bo.get('name');
        return `${name ? `'${name}': ` : 'Flow: '}${bo.sourceRef.get('name') || bo.sourceRef.id} → ${bo.targetRef.get('name') || bo.targetRef.id}`;
    }

    _renderCoverage() {
        if (!this._elements().length) return null;
        const { nodes, flows, notRun } = this._coverage();
        // nodes and flows together, tested of all, rounded: as the Design dashboard
        const percent = (tested, total) => total ? Math.round(100 * tested / total) : 0;
        const line = (which, label, of) => el('div', { class: `test-coverage-line test-coverage-${which}` },
            el('span', {}, label), el('strong', {}, `${of.tested} of ${of.total}`));
        const notPassed = nodes.reached + flows.reached;
        const gaps = [...nodes.elements, ...flows.elements].filter(e => e.state === 'untested');
        const generated = nodes.generated + flows.generated;
        return el('div', { class: `test-coverage${this._coverageLoading?.size ? ' test-coverage-loading' : ''}` },
            el('h5', {}, 'Coverage ', el('strong', { class: 'test-coverage-total', title: 'Nodes and flows tested, of all of them' },
                `${percent(nodes.tested + flows.tested, nodes.total + flows.total)}%`)),
            line('nodes', 'Nodes', nodes),
            line('flows', 'Flows', flows),
            generated ? el('p', { class: 'test-coverage-note test-coverage-generated' }, `${generated} of these only by generated scenarios, not reviewed`) : null,
            notPassed ? el('p', { class: 'test-coverage-note test-coverage-reached' }, `${notPassed} reached, but not in a run that passed`) : null,
            notRun ? el('p', { class: 'test-coverage-note' }, `${notRun} scenario${notRun === 1 ? ' has' : 's have'} not run`) : null,
            this._modelEdited ? el('p', { class: 'test-coverage-note test-coverage-stale' }, 'The model changed: Run all to bring this up to date') : null,
            el('button', { type: 'button', class: `test-coverage-show${this._coverageOn ? ' on' : ''}`, 'aria-pressed': String(this._coverageOn),
                title: 'Green: tested. Light green: only by generated scenarios, not reviewed. Orange: reached, but not in a run that passed. Purple, dashed: not reached by any scenario',
                onclick: () => this._toggleCoverage() }, this._coverageOn ? 'Hide on diagram' : 'Show on diagram'),
            this._renderExplore(gaps),
            gaps.length ? this._part('gaps', `Not reached (${gaps.length})`, el('ul', { class: 'test-gaps' }, gaps.map(({ id }) =>
                el('li', { class: 'test-gap', 'data-element-id': id },
                    el('span', { class: 'test-gap-name', title: 'Show it on the diagram', onclick: () => this._showGap(id) }, this._gapLabel(id)),
                    el('button', { type: 'button', class: 'test-gap-fill', disabled: Boolean(this._live) || Boolean(this._exploring?.stop), title: 'Record a new scenario that reaches this',
                        onclick: () => this.fillGap(id) }, 'Fill')))), { class: 'test-coverage-gaps' }) : null);
    }

    _toggleCoverage() {
        this._coverageOn = !this._coverageOn;
        if (this._coverageOn) {
            this._stopSimulation();
            this._config.showDiagram?.();
        }
        this._markCurrent();
        this._refreshCoverage();
    }

    _showGap(id) {
        const element = this._elementRegistry.get(id);
        if (!element) return;
        this._config.showDiagram?.();
        this._selection.select(element);
        this._canvas.scrollToElement?.(element);
    }

    _markCoverage() {
        this._unmark();
        if (!this._visible) return;
        const { nodes, flows } = this._coverage();
        const MARK = { tested: 'test-passed', generated: 'test-generated', reached: 'test-reached', untested: 'test-untested' };
        for (const { id, state } of [...nodes.elements, ...flows.elements]) {
            const element = this._elementRegistry.get(id);
            if (!element) continue;
            this._canvas.addMarker(element, MARK[state]);
            this._marked.push(element);
        }
    }

    // ---- the model as Fill a gap and Test all paths read it

    /** What paths.js needs of the model's elements. */
    _modelElements() {
        const THROW = ['bpmn:EndEvent', 'bpmn:IntermediateThrowEvent'];
        const signals = bo => (bo.get('eventDefinitions') ?? []).map(def => {
            const kind = def.$type.replace('bpmn:', '').replace('EventDefinition', '').toLowerCase();
            return `${kind}:${def.errorRef?.id ?? def.escalationRef?.id ?? def.signalRef?.id ?? (kind === 'link' ? def.name ?? '' : '')}`;
        });
        return this._elements().map(bo => {
            const isEvent = is(bo, 'bpmn:Event');
            return {
                id: bo.id, source: bo.sourceRef?.id, target: bo.targetRef?.id, condition: bo.conditionExpression?.body,
                parent: is(bo.$parent, 'bpmn:SubProcess') ? bo.$parent.id : undefined, attachedTo: bo.attachedToRef?.id,
                isStart: is(bo, 'bpmn:StartEvent'), triggered: is(bo, 'bpmn:SubProcess') && !!bo.get('triggeredByEvent'),
                throws: isEvent && THROW.some(t => is(bo, t)) ? signals(bo) : [],
                catches: isEvent && !THROW.some(t => is(bo, t)) ? signals(bo) : [],
            };
        });
    }

    /** What listens from the start, and fires or not: boundary events, event sub-processes' starts. Each with its flows out. */
    _listeners() {
        const flows = this._elements(['bpmn:SequenceFlow']);
        return new Map(this._elements(['bpmn:BoundaryEvent', 'bpmn:StartEvent'])
            .filter(e => is(e, 'bpmn:BoundaryEvent') || e.$parent.get('triggeredByEvent'))
            .map(e => [e.id, flows.filter(f => f.sourceRef === e).map(f => f.id)]));
    }

    /** The process's own start events. */
    _starts() {
        return this._elements(['bpmn:StartEvent']).filter(e => is(e.$parent, 'bpmn:Process'));
    }

    /** The form fields of every element. */
    _allFieldIds() {
        return new Set(this._elements().flatMap(e => this._formFields(e.id).map(f => f.id)));
    }

    // ---- Fill a gap: a recording with a goal

    /** A new scenario to reach an element: the start form opens, with the data the way there asks. */
    fillGap(id) {
        const graph = modelGraph(this._modelElements());
        const start = this._starts().find(s => graph.way([s.id], id)) ?? this._starts()[0];
        const fields = this._allFieldIds();
        const asked = Object.entries(graph.valuesOn(graph.way([start?.id], id))).filter(([path]) => !fields.has(path));
        const scenario = {
            name: `Reach ${this._gapLabel(id)}`,
            start: { ...(this._starts().length > 1 ? { startNodeId: start.id } : {}), data: asked.reduce((data, [path, value]) => withValue(data, path, value), {}) },
            steps: [], checks: []
        };
        this._scenarios.push(scenario);
        this._scheduleSave();
        this._live = null;
        this._goal = { scenario, id };
        this._select(scenario);
        this.openStart(scenario);
        this._showGap(id);
    }

    /** The form values the way to the goal asks of this element. */
    _goalFormData(elementId) {
        if (!this._goal) return {};
        const graph = modelGraph(this._modelElements());
        const fields = new Set(this._formFields(elementId).map(f => f.id));
        return Object.fromEntries(Object.entries(graph.valuesOn(graph.way([elementId], this._goal.id))).filter(([path]) => fields.has(path)));
    }

    /** Of the steps that wait, the one closest to the goal. */
    _towardsGoal(live) {
        const graph = modelGraph(this._modelElements());
        const ways = this._waiting(live.instance).map(item => ({ item, way: graph.way([item.elementId], this._goal.id) })).filter(w => w.way);
        return ways.sort((a, b) => a.way.length - b.way.length)[0]?.item ?? null;
    }

    /** Where the recording stands with its goal, and what to do next. */
    _renderGoal(scenario, live) {
        const { id } = this._goal;
        const name = this._gapLabel(id);
        const graph = modelGraph(this._modelElements());
        const instance = live?.instance ?? this._results.get(scenario)?.instance;
        const reached = reachedIn(instance?.items, this._listeners()).has(id);
        const waits = (instance?.items ?? []).filter(i => i.status === 'wait').map(i => i.elementId);
        const known = this._starts().some(s => graph.canReach([s.id], id));
        const again = el('button', { type: 'button', class: 'test-goal-again', onclick: () => this.openStart(scenario) }, 'Try again');
        let state = 'open', text;
        if (!instance) text = `Goal: reach ${name}. The start data below is what the way there asks; change it if you need to.`;
        else if (reached) {
            state = 'reached';
            text = waits.length ? `✓ Reached ${name}. Finish the run to save it as this scenario's steps.` : `✓ Reached ${name}.`;
        }
        else if (!waits.length) { state = 'lost'; text = `This run ended without reaching ${name}.`; }
        else if (known && !graph.canReach(waits, id)) { state = 'lost'; text = `${name} can no longer be reached from where this run is.`; }
        else {
            const next = this._towardsGoal(live ?? { instance });
            text = next ? `Goal: reach ${name}. Next: ${this._label(next.elementId, next.name)}.` : `Goal: reach ${name}.`;
        }
        return el('div', { class: `test-goal ${state}`, role: 'status' }, el('span', { class: 'test-goal-text' }, text), state === 'lost' ? again : null);
    }

    // ---- Test all paths

    /** The values to try for an element's data: its form as it starts, then each field's choices and what the conditions ask. */
    _pathOptions(elementId, asked) {
        const base = this._formTemplate(elementId);
        const options = [base];
        for (const field of this._formFields(elementId)) {
            if (field.type === 'enum') field.values.forEach(v => options.push({ ...base, [field.id]: v.id }));
            if (field.type === 'boolean') options.push({ ...base, [field.id]: true });
            (asked.get(field.id) ?? []).forEach(value => options.push({ ...base, [field.id]: value }));
        }
        const seen = new Set();
        return options.filter(option => {
            const key = JSON.stringify(option);
            return seen.has(key) ? false : (seen.add(key), true);
        });
    }

    /** Test all paths' plan, from the model: the starts to try and the values to try at each step. */
    _explorePlan() {
        const asked = new Map();
        for (const bo of this._elements(['bpmn:SequenceFlow']))
            for (const { path, when, otherwise } of conditionValues(bo.conditionExpression?.body))
                asked.set(path, [...(asked.get(path) ?? []), when, otherwise]);
        const fields = this._allFieldIds();
        const notInForms = [...asked].filter(([path]) => !fields.has(path));
        const starts = this._starts().flatMap(s => {
            const start = this._starts().length > 1 ? { startNodeId: s.id } : {};
            const base = this._pathOptions(s.id, asked);
            const set = notInForms.flatMap(([path, values]) => [...new Set(values)].map(value => withValue(base[0], path, value)));
            return [...base, ...set].map(data => ({ ...start, data }));
        });
        return { asked, starts, variables: new Set([...asked.keys()].map(path => path.split('.').at(-1))) };
    }

    /** Test all paths' part of Coverage: the command, what it will run before it does, how far it is, and what it did. */
    _renderExplore(gaps) {
        const state = this._exploring;
        if (state?.stop)
            return el('div', { class: 'test-explore running', role: 'status' }, el('span', {}, `Trying paths: ${state.tries} of up to ${MAX_TRIES} runs`),
                el('button', { type: 'button', class: 'test-explore-stop', onclick: () => { state.stop.asked = true; } }, 'Stop'));
        if (state?.asked) {
            const real = this._elements(['bpmn:ServiceTask', 'bpmn:SendTask']).map(bo => bo.get('name') || bo.id);
            return el('div', { class: 'test-explore' },
                el('p', {}, `Runs up to ${MAX_TRIES} instances of the saved model, trying each form's choices and the values in its conditions. A scenario is saved for each path that reaches something new; the other runs are deleted.`),
                real.length ? el('p', { class: 'test-explore-real' }, `These run for real on every try: ${real.join(', ')}.`) : null,
                el('div', { class: 'test-explore-actions' },
                    el('button', { type: 'button', class: 'test-explore-go primary', onclick: () => this.testAllPaths(gaps.map(g => g.id)) }, 'Start'),
                    el('button', { type: 'button', class: 'test-explore-cancel', onclick: () => { this._exploring = null; this._refreshCoverage(); } }, 'Cancel')));
        }
        return [
            state?.report ? el('p', { class: 'test-explore-report', role: 'status' }, state.report) : null,
            gaps.length ? el('button', { type: 'button', class: 'test-explore-open', disabled: Boolean(this._live), title: 'Try the model\'s paths by itself, and save a scenario for each one that reaches something new',
                onclick: () => { this._exploring = { asked: true }; this._refreshCoverage(); } }, 'Test all paths') : null];
    }

    /** Try the paths; a scenario for each that reaches something of `goal`, with its run. */
    async testAllPaths(goal) {
        const state = this._exploring = { tries: 0, stop: { asked: false } };
        this._refreshCoverage();
        const processName = this._config.processName;
        let report;
        try {
            await this._modelSaved();
            await this._save();
            const { asked, starts, variables } = this._explorePlan();
            const run = async path => {
                const { results } = await this._request('POST', '/model/test/run', { processName, scenario: { name: 'Test all paths', start: path.start, steps: path.steps } });
                if (results[0].instance?.id) await this._request('DELETE', `/model/test/instance/${encodeURIComponent(results[0].instance.id)}`).catch(() => { });
                return results[0];
            };
            const found = await explore({
                starts, goal, variables, run, maxTries: MAX_TRIES, isStep,
                reachedBy: items => reachedIn(items, this._listeners()),
                options: element => this._pathOptions(element, asked),
                stopped: () => state.stop.asked,
                progress: ({ tries }) => { state.tries = tries; this._refreshCoverage(); }
            });
            for (const one of found.paths) {
                const scenario = { name: this._generatedName(one), generated: true, start: one.path.start, steps: one.path.steps, checks: [] };
                const { results } = await this._request('POST', '/model/test/run', { processName, scenario });
                this._scenarios.push(scenario);
                this._results.set(scenario, results[0]);
                this._keepResult(scenario, results[0], 'explore');
            }
            await this._save();
            this._modelEdited = false;
            this._current ??= this._scenarios[0] ?? null;
            const [first] = found.failures;
            const why = first ? ` ${found.failures.length} of the runs failed. The first, with start data ${JSON.stringify(first.path.start.data)}${first.path.steps.length ? ` after ${first.path.steps.length} steps` : ''}: ${first.error}` : '';
            const ended = found.ended === 'stopped' ? 'Stopped. ' : found.ended === 'limit' ? `It stopped at the limit of ${MAX_TRIES} runs. ` : '';
            const left = found.left.length ? `${found.left.length} still not reached: use Fill on those.` : 'Nothing is left unreached.';
            report = `${ended}${found.paths.length} scenario${found.paths.length === 1 ? '' : 's'} added, from ${found.tries} runs. ${left}${why}`;
        } catch (err) {
            report = `Test all paths stopped: ${err.message}`;
        }
        this._exploring = { report };
        this.render();
        this._markCurrent();
    }

    /** A generated scenario's name: what it was kept for. */
    _generatedName(one) {
        const named = one.adds.map(id => this._elements().find(e => e.id === id)).filter(bo => bo && !bo.sourceRef && bo.get('name'));
        const what = named.at(-1)?.get('name') ?? this._gapLabel(one.adds.at(-1));
        const taken = name => this._scenarios.some(s => s.name === name);
        let name = `Path to ${what}`;
        for (let n = 2; taken(name); n++) name = `Path to ${what} (${n})`;
        return name;
    }

    /** A generated scenario's note: what it shows, and Mark as reviewed. */
    _renderGenerated(scenario) {
        return el('div', { class: 'test-generated-note' },
            el('span', {}, 'Generated by Test all paths: it shows this path runs, not that it does the right thing. Add checks, then mark it as reviewed.'),
            el('button', { type: 'button', class: 'test-generated-review', onclick: () => {
                delete scenario.generated;
                this._scheduleSave();
                this.render();
                this._markCurrent();
            } }, 'Mark as reviewed'));
    }

    /** The generated scenarios not reviewed: deleted, with their runs. */
    async deleteGenerated() {
        const generated = this._scenarios.filter(s => s.generated);
        if (!confirm(`Delete the ${generated.length} generated scenario${generated.length === 1 ? '' : 's'} not reviewed, and their runs?`)) return;
        for (const scenario of generated) {
            for (const run of scenario.runs ?? [])
                await this._request('DELETE', `/model/test/instance/${encodeURIComponent(run.instanceId)}`).catch(() => { });
            this._results.delete(scenario);
        }
        this._scenarios = this._scenarios.filter(s => !s.generated);
        if (!this._scenarios.includes(this._current)) this._current = this._scenarios[0] ?? null;
        await this._save();
        this._status(`${generated.length} generated scenario${generated.length === 1 ? '' : 's'} deleted`);
        this.render();
        this._markCurrent();
    }

    /** A scenario in the list: its result and name. */
    _renderScenarioRow(scenario) {
        // this session's result, else the last kept run's (a step-by-step run not finished has none)
        const ok = this._results.has(scenario) ? this._results.get(scenario).ok : scenario.runs?.[0]?.ok;
        return el('li', { class: 'test-tree-scenario' },
            el('div', { class: `test-tree-row${scenario === this._current ? ' selected' : ''}`, onclick: () => this._select(scenario) },
                el('span', { class: `test-badge ${ok === true ? 'ok' : ok === false ? 'failed' : ''}`, title: ok === true ? 'passed' : ok === false ? 'failed' : 'not run' },
                    ok === true ? '✓' : ok === false ? '✗' : '·'),
                el('span', { class: 'test-tree-name' }, scenario.name),
                scenario.generated ? el('span', { class: 'test-tree-generated', title: 'Generated by Test all paths, not reviewed' }, 'auto') : null));
    }

    _jsonField(label, value, onValid, attrs = {}) {
        const message = el('div', { class: 'test-json-error' });
        const area = el('textarea', {
            class: 'test-json', rows: attrs.rows ?? 3, spellcheck: 'false', 'aria-label': label, ...attrs,
            oninput: () => {
                const { value: parsed, error } = parse(area.value);
                area.classList.toggle('invalid', Boolean(error));
                message.textContent = error || '';
                if (!error) onValid(parsed);
            }
        });
        area.value = Object.keys(value ?? {}).length ? json(value) : '';
        return el('label', { class: 'test-field' }, el('span', {}, label), area, message);
    }

    /** A task that can run by itself (Test this task): an activity, not a sub-process. */
    _isTask(bo) {
        return is(bo, 'bpmn:Activity') && !is(bo, 'bpmn:SubProcess');
    }

    /**
     * The start form: where it starts (a start event, or a task by itself), the start event's form fields or the data
     * (a task's input), and Start.
     */
    _renderStart(scenario, starts) {
        const changed = () => this._scheduleSave();
        const tasks = this._elements(['bpmn:Activity']).filter(e => this._isTask(e));
        const only = !!scenario.start?.only;
        const startId = scenario.start?.startNodeId || starts[0]?.id;
        const fields = startId && !only ? this._formFields(startId) : [];
        let read;
        let input;
        if (fields.length) {
            const form = this._stepForm({ id: 'start', elementId: startId }, scenario.start?.data ?? {});
            input = form.node;
            read = () => form.read();
        } else {
            input = this._jsonField(only ? 'Data (the task\'s input)' : 'Start data', scenario.start?.data, () => { }, { class: 'test-json test-start-data' });
            read = () => parse(input.querySelector('textarea').value);
        }
        const go = () => {
            const { value, error } = read();
            if (error) return this._status(`The start data is not valid JSON: ${error}`, true);
            scenario.start = { ...scenario.start, data: value };
            changed();
            this.start(scenario);
        };
        return el('fieldset', { class: 'test-start' }, el('legend', {}, 'Record: start'),
            starts.length > 1 || tasks.length ? el('label', { class: 'test-field' }, el('span', {}, 'Start at'),
                el('select', { class: 'test-start-event', onchange: e => {
                    const id = e.target.value || undefined;
                    scenario.start = { ...scenario.start, startNodeId: id, only: tasks.some(t => t.id === id) || undefined };
                    changed(); this.render();
                } },
                    el('optgroup', { label: 'The process, from' }, starts.map(s => el('option', { value: s.id, selected: !only && s.id === startId }, s.get('name') || s.id))),
                    tasks.length ? el('optgroup', { label: 'A task by itself' }, tasks.map(t => el('option', { value: t.id, selected: only && t.id === startId }, t.get('name') ? `${t.get('name')} (${t.id})` : t.id))) : null)) : null,
            only ? el('p', { class: 'test-hint' }, 'Runs this task alone, with the data below as its input; the run ends when it is done.') : null,
            input,
            el('div', { class: 'test-start-actions' },
                el('button', { type: 'button', class: 'test-start-go primary', onclick: go }, only ? 'Run the task' : 'Start recording'),
                el('button', { type: 'button', class: 'test-start-cancel', onclick: () => { this._starting = null; this.render(); } }, 'Cancel')));
    }

    /**
     * A check: at the end or after a step; a node (by id or name: how many times it ran, in what status), a data value
     * compared, the instance's status.
     */
    _checkRow(scenario, check, inPlace = false, inStep = false) {
        const outcome = this._checkOutcome(scenario, check);
        const icon = () => el('span', { class: `test-check-icon${outcome ? (outcome.ok ? ' ok' : ' failed') : ''}`,
            title: outcome ? (outcome.ok ? 'Passed in this run' : 'Failed in this run') : 'A check', 'aria-hidden': 'true' });
        const remove = el('button', { type: 'button', class: 'test-check-remove', title: 'Remove this check',
            onclick: () => { scenario.checks.splice(scenario.checks.indexOf(check), 1); this._editing.delete(check); this._scheduleSave(); this.render(); } }, '✕');
        if (!this._editing.has(check)) {
            const where = inPlace ? '' : check.at === 'after' ? `After ${this._label(check.step)}: ` : check.at === 'start' ? 'At the start: ' : 'At the end: ';
            return el('div', { class: 'test-check-row test-check-read' },
                icon(),
                el('span', { class: 'test-check-prose' }, where, this._checkInWords(check),
                    outcome && !outcome.ok ? el('span', { class: 'test-check-found' }, this._foundInWords(check, outcome.actual)) : null),
                el('button', { type: 'button', class: 'test-check-edit', onclick: () => { this._editing.add(check); this.render(); } }, 'Edit'),
                remove);
        }
        const changed = () => this._scheduleSave();
        const steps = this._elements(['bpmn:UserTask', 'bpmn:ReceiveTask', 'bpmn:Event']).filter(e => !is(e, 'bpmn:StartEvent') && !is(e, 'bpmn:EndEvent'));
        const nodes = this._elements().filter(e => !is(e, 'bpmn:SequenceFlow') && !is(e, 'bpmn:DataObjectReference') && !is(e, 'bpmn:DataStoreReference') && !is(e, 'bpmn:DataObject'));
        const option = (value, label, selected) => el('option', { value, selected: selected === value }, label);
        const set = (patch, again = false) => { Object.assign(check, patch); changed(); if (again) this.render(); };
        const when = check.at === 'after' ? `after:${check.step}` : check.at === 'start' ? 'start' : 'end';
        const fields = check.kind === 'node' ? [
            el('select', { class: 'test-check-node', 'aria-label': 'Node', onchange: e => set({ node: e.target.value }) },
                option('', '(choose a node)', check.node ?? ''),
                nodes.map(n => option(n.id, this._label(n.id), check.node)),
                // what the list does not offer (a flow, from Add as a check)
                check.node && !nodes.some(n => n.id === check.node) ? option(check.node, this._label(check.node), check.node) : null),
            el('input', { class: 'test-check-count', type: 'number', min: '0', placeholder: 'times', 'aria-label': 'How many times (empty: at least once)',
                value: check.count ?? '', oninput: e => set({ count: e.target.value === '' ? undefined : Number(e.target.value) }) }),
            el('select', { class: 'test-check-status', 'aria-label': 'Status', onchange: e => set({ status: e.target.value || undefined }) },
                ITEM_STATUSES.map(s => option(s, s || '(any status)', check.status ?? '')))
        ] : check.kind === 'data' ? [
            el('input', { class: 'test-check-path', placeholder: 'variable, or a.b', 'aria-label': 'Variable', value: check.path ?? '',
                oninput: e => set({ path: e.target.value }) }),
            el('select', { class: 'test-check-op', 'aria-label': 'Comparison', onchange: e => set({ op: e.target.value }) },
                CHECK_OPS.map(op => option(op, op, check.op ?? '='))),
            el('input', { class: 'test-check-value', placeholder: 'value', 'aria-label': 'Value', value: check.value === undefined ? '' : showValue(check.value),
                oninput: e => set({ value: parseValue(e.target.value) }) })
        ] : [
            el('select', { class: 'test-check-status', 'aria-label': 'Instance status', onchange: e => set({ status: e.target.value || undefined }) },
                STATUSES.map(s => option(s, s || '(choose)', check.status ?? '')))
        ];
        return el('div', { class: 'test-check-row' },
            icon(),
            // in a step's what happened, the step is when: no When
            inStep ? null : el('select', { class: 'test-check-at', 'aria-label': 'When', onchange: e => {
                const value = e.target.value;
                // it moves to where it now belongs
                set(value === 'end' ? { at: undefined, step: undefined } : value === 'start' ? { at: 'start', step: undefined } : { at: 'after', step: value.slice(6) }, true);
            } },
                option('start', 'At the start', when),
                steps.map(s => option(`after:${s.id}`, `After ${this._label(s.id)}`, when)),
                option('end', 'At the end', when)),
            el('select', { class: 'test-check-kind', 'aria-label': 'What', onchange: e => set({ kind: e.target.value }, true) },
                CHECK_KINDS.map(([value, label]) => option(value, label, check.kind))),
            fields,
            el('button', { type: 'button', class: 'test-check-done primary', onclick: () => { this._editing.delete(check); this.render(); } }, 'Done'),
            remove);
    }

    /** A check, in words. */
    _checkInWords(check) {
        if (check.kind === 'status')
            return check.status ? `The instance ${STATE_WORDS[check.status] ?? `is ${check.status}`}` : 'The instance: no status chosen yet';
        if (check.kind === 'data') {
            if (!check.path) return 'A value: no variable chosen yet';
            const op = check.op ?? '=';
            return `${check.path} ${OP_WORDS[op] ?? op} ${check.value === undefined ? '(no value yet)' : JSON.stringify(check.value)}`;
        }
        if (!check.node) return 'A node: none chosen yet';
        const who = this._label(check.node);
        if (Number(check.count) === 0 && check.count !== undefined && check.count !== null && check.count !== '')
            return `${who} was not reached${check.status ? ` with status ${check.status}` : ''}`;
        const times = check.count ? ` ${check.count} time${Number(check.count) === 1 ? '' : 's'}` : '';
        return `${who} was reached${times}${check.status ? `, and ${STATE_WORDS[check.status] ?? `is ${check.status}`}` : ''}`;
    }

    /**
     * The run step by step (instance.steps): each operation the engine logged (Start Process, Invoke Item, Timer Fired,
     * ...), its outcome as the engine logged it (the instance's status, the items whose status changed, what waits), the
     * decisions under it, the scenario's checks of it, and the checks to add: one for each fact of the outcome that no
     * check looks at. Nothing here knows BPMN: what is shown and offered is the log's.
     * A recorded scenario adds a check with a button; one written in Gherkin gets the line to paste.
     */
    _runSteps(scenario, instance, live) {
        const written = scenario.source !== undefined;
        const groups = instance.steps;
        const last = groups.length - 1;
        const ownSteps = live ? live.done : scenario.steps;
        const opens = g => g.label === 'Start Process';
        // the scenario's own steps, matched in order to the run's operations: an operation none of them asked for (a timer
        // the server fired) matches none
        const places = [];
        if (written) {
            const blocks = [];
            for (const line of String(scenario.source).split('\n').map(l => l.trim())) {
                if (/@(start|invoke|signal|message|throw|restart)\b/.test(line)) blocks.push({ action: line, checks: [] });
                else if (/@(check|wait)\b/.test(line) && blocks.length) blocks.at(-1).checks.push(line);
            }
            const instanceName = (/@start\b.*\bas :(\w+)/.exec(scenario.source) ?? [])[1] ?? 'instance';
            let at = 0;
            for (const g of groups) {
                const block = blocks[at];
                const mine = block && (opens(g) ? /@start\b/.test(block.action)
                    : g.label !== 'Timer Fired' || block.action.includes(`element:${g.element}`) || block.action.includes(`element:"${g.element}"`));
                places.push(mine ? { block, instanceName } : { instanceName });
                if (mine) at++;
            }
        }
        else {
            const seen = new Set();
            let at = 0;
            for (const g of groups) {
                if (opens(g)) { places.push({ position: { at: 'start' }, stepIndex: -1 }); continue; }
                const step = ownSteps[at];
                if (step && step.element === g.element) {
                    // a step repeated (a loop): its checks are under the first, as in the timeline
                    places.push(seen.has(g.element) ? { repeated: true, stepIndex: at } : { position: { at: 'after', step: g.element }, stepIndex: at });
                    seen.add(g.element);
                    at++;
                }
                else places.push({});
            }
        }
        const inPlace = i => {
            const place = places[i];
            if (written) return place.block ? place.block.checks : [];
            const ids = new Set(ownSteps.map(s => s.element));
            const atTheEnd = c => c.at !== 'start' && !(c.at === 'after' && ids.has(c.step));
            if (!place.position) return i === last ? scenario.checks.filter(atTheEnd) : [];
            return scenario.checks.filter(c => place.position.at === 'start' ? c.at === 'start'
                : (c.at === 'after' && c.step === place.position.step) || (i === last && atTheEnd(c)));
        };
        // a fact of the outcome as a check: what waits, each item's new status, the instance's status when it changed
        const quote = id => /^[\w-]+$/.test(id) ? id : `"${String(id).replace(/"/g, '\\"')}"`;
        const candidates = i => {
            const g = groups[i], place = places[i], outcome = g.outcome;
            if (!outcome) return [];
            const position = place.position ?? {};
            const name = place.instanceName ?? 'instance';
            const list = [];
            const waiting = new Map();
            for (const w of outcome.waiting) waiting.set(w.elementId, (waiting.get(w.elementId) ?? 0) + 1);
            for (const [id, count] of waiting)
                list.push({ check: { kind: 'node', node: id, status: 'wait', count, ...position },
                    gherkin: `@check :${name} has ${count} items of element:${quote(id)} with status "wait"` });
            for (const c of outcome.changed) {
                if (c.status === 'wait' || c.elementId === g.element || list.some(x => x.check.node === c.elementId)) continue;
                list.push({ check: { kind: 'node', node: c.elementId, status: c.status, ...position },
                    gherkin: `@check :${name} last element:${quote(c.elementId)} status is "${c.status}"` });
            }
            if (outcome.status !== g.statusBefore)
                list.push({ check: { kind: 'status', status: outcome.status, ...(i === last ? {} : position) },
                    gherkin: `@check :${name} status is "${outcome.status}"` });
            return list;
        };
        // a check written in Gherkin is there when its statement is, whatever the instance is named
        const statement = line => line.replace(/^(Given|When|Then|And|But|\*)\s+/, '').replace(/^@(check|wait) :\w+ /, '');
        const copyCheck = c => el('button', { type: 'button', class: 'test-copy-check', title: `Copy, to paste in Edit as text: ${c.gherkin}`,
            onclick: () => { navigator.clipboard?.writeText(c.gherkin); this._status(`Copied: ${c.gherkin}`); } }, 'Copy check');
        // a step's What happened: its rows, Add check on an item it changed, the instance's status it changed; in a
        // written scenario, the checks under the row of their item (a recorded one shows them in its timeline)
        const part = i => {
            const g = groups[i], place = places[i];
            const checks = inPlace(i);
            const present = written ? (place.block?.checks ?? []).map(statement) : [];
            // what no check looks at yet: a check is shown once, under the row of its item
            const offers = (place.repeated || (!written && !place.position && i !== last) ? [] : candidates(i))
                .filter(c => written ? !present.some(p => p.startsWith(statement(c.gherkin)))
                    : !(scenario.checks ?? []).some(x => checkKey(x) === checkKey(c.check)));
            const button = c => written ? copyCheck(c) : this._addCheckButton(scenario, c.check);
            // an item's last row in the step: its button, and its checks
            const lastRow = new Map();
            g.events.forEach((e, n) => { if (e.raw !== 'decision' && e.id) lastRow.set(e.id, n); });
            const nodeOf = c => written ? (/element:(?:"([^"]+)"|([^\s]+))/.exec(c) ?? []).slice(1).find(Boolean) : c.kind === 'node' ? c.node : null;
            // the step's own row: its element's (the task it completed); at the start, its first
            const stepRow = g.element && lastRow.has(g.element) ? lastRow.get(g.element) : g.events.findIndex(e => e.raw !== 'decision');
            // a check under the row of its item; one of no item (data, the instance's status) under the step's row
            const under = new Map(), rest = [];
            for (const c of checks) {
                const row = lastRow.get(nodeOf(c)) ?? (stepRow >= 0 ? stepRow : undefined);
                if (row === undefined) rest.push(c); else under.set(row, [...(under.get(row) ?? []), c]);
            }
            // a recorded check with its result in this run, to edit or remove; a written one, its line
            const showCheck = c => written ? el('code', { class: 'test-rationale-check' }, c) : this._checkRow(scenario, c, true, true);
            // open stays open when the tab is drawn again (a result, a check added)
            return el('details', { class: 'test-steps-rows', open: this._openSteps.has(g.n),
                ontoggle: e => { if (e.target.open) this._openSteps.add(g.n); else this._openSteps.delete(g.n); } },
                el('summary', {}, `What happened (${g.events.length} rows${checks.length ? `, ${checks.length} check${checks.length === 1 ? '' : 's'}` : ''})`,
                    // a check of this step, of any kind: it opens under the step's row, to be filled in
                    !written && place.position ? el('button', { type: 'button', class: 'test-step-add-check', title: 'Add a check after this step: an element, data or the instance',
                        onclick: e => {
                            e.preventDefault(); e.stopPropagation();
                            const check = { kind: 'node', ...place.position };
                            scenario.checks.push(check);
                            this._editing.add(check);
                            this._openSteps.add(g.n);
                            this._scheduleSave(); this.render();
                        } }, 'Add check') : null),
                // the checks of no item of the step (the instance, data, an expression)
                rest.length ? el('div', { class: 'test-steps-other-checks' }, rest.map(showCheck)) : null,
                this._renderRationale(g.events, {
                    action: (e, n) => {
                        const offer = lastRow.get(e.id) === n && offers.find(c => c.check.kind === 'node' && c.check.node === e.id);
                        return offer ? button(offer) : null;
                    },
                    below: (e, n) => under.get(n)?.map(showCheck),
                }));
        };
        // a step's line, when it is not a timeline's: Step n, what the engine logged, who, the data
        const line = g => el('div', { class: 'test-steps-head' },
            el('strong', {}, `Step ${g.n}${g.label ? ` · ${g.label}` : ''}`),
            g.element ? el('span', {}, this._label(g.element, g.name)) : null,
            g.userName ? el('span', { class: 'test-steps-user' }, `by ${g.userName}`) : null,
            g.data && Object.keys(g.data).length ? el('code', { class: 'test-step-data' }, JSON.stringify(g.data)) : null);
        return { groups, places, part, line };
    }

    /** A written scenario's last run, step by step, under its text. */
    _writtenSteps(scenario, live) {
        const instance = (live ? live.instance : this._results.get(scenario)?.instance);
        return instance?.steps?.length ? el('div', { class: 'test-steps test-rationale' }, this._renderSteps(scenario, instance, live)) : null;
    }

    /** A scenario written in Gherkin: its run's steps, each its line and What happened. */
    _renderSteps(scenario, instance, live) {
        const { groups, places, part, line } = this._runSteps(scenario, instance, live);
        return el('div', { class: 'test-steps-list' }, groups.map((g, i) =>
            el('div', { class: `test-steps-step${places[i].block ? '' : ' by-itself'}`, 'data-element-id': g.element ?? '' }, line(g), part(i))));
    }

    /** The Rationale, as the instance page shows it: what happened, in order; in a panel's width, the why under its row. */
    _renderRationale(events, { action = null, below = null, end = null } = {}) {
        const what = e => {
            const badge = e.raw === 'Waiting' ? 'wait' : e.raw === 'Aborted' || e.raw === 'Cancelled' ? 'error' : '';
            return [e.word && badge ? el('span', { class: `test-rationale-badge ${badge}` }, e.word) : e.word,
                ...e.decisions.filter(d => d.action).map(d => el('div', { class: `test-rationale-decision${d.not ? ' not' : ''}` }, d.action))];
        };
        const whys = e => e.decisions.filter(d => d.why);
        const columns = action ? 6 : 5;
        // the element: its name and id, or its id
        const element = e => e.name ? `${e.name} (${e.id})` : e.id ?? '';
        const checks = list => list?.length ? el('tr', { class: 'test-rationale-checks' }, el('td', { colspan: columns }, list)) : null;
        // styled as the Rationale wherever it is (a step of the timeline, a written scenario's steps)
        return el('div', { class: 'test-rationale-scroll test-rationale' }, el('table', {},
            el('thead', {}, el('tr', {}, ['Seq #', 'At', 'Element', 'Type', 'What happened', ...(action ? [''] : [])].map(h => el('th', { scope: 'col' }, h)))),
            el('tbody', {}, events.flatMap((e, n) => [
                el('tr', { class: e.decisions.length ? 'chose' : '', 'data-element': e.id ?? '' },
                    el('td', {}, e.seq ?? ''),
                    el('td', {}, e.at),
                    el('td', {}, element(e)),
                    el('td', {}, (e.type ?? '').replace('bpmn:', '')),
                    el('td', {}, what(e)),
                    action ? el('td', { class: 'test-rationale-action' }, action(e, n)) : null),
                whys(e).length ? el('tr', { class: 'chose' }, el('td', { colspan: columns, class: 'test-rationale-why' }, whys(e).map(d => el('div', {}, d.why)))) : null,
                below ? checks(below(e, n)) : null]),
                checks(end))));
    }

    /** What the run shown found for a check, if it got there; a step repeated (a loop): a time it failed, if any. */
    _checkOutcome(scenario, check) {
        const live = this._live?.scenario === scenario ? this._live : null;
        const results = (live ? live.checks ?? live.stepChecks : this._results.get(scenario)?.checks) ?? [];
        const mine = results.filter(r => r.check && checkKey(r.check) === checkKey(check));
        return mine.find(r => !r.ok) ?? mine[0] ?? null;
    }

    /** What a failed check found, in words. */
    _foundInWords(check, actual) {
        if (check.kind === 'status') return `Found: the instance ${STATE_WORDS[actual] ?? `is ${actual}`}`;
        if (check.kind === 'data') return `Found: ${actual === undefined ? 'no value' : JSON.stringify(actual)}`;
        return `Found: ${actual} time${actual === 1 ? '' : 's'}${check.status ? `, ${STATE_WORDS[check.status] ?? `is ${check.status}`}` : ''}`;
    }

    /** The checks that belong at a place in the timeline. */
    _checkRows(scenario, belongs) {
        const checks = scenario.checks.filter(belongs);
        return checks.length ? el('div', { class: 'test-step-check-rows' }, checks.map(c => this._checkRow(scenario, c, true))) : null;
    }

    /**
     * The checks that are not under a step (at the end; after a step this scenario does not have), and adding one: where
     * the recording waits, else at the end.
     */
    _renderChecks(scenario, live) {
        const elements = new Set((live ? live.done : scenario.steps).map(s => s.element));
        const rest = scenario.checks.filter(c => c.at !== 'start' && !(c.at === 'after' && elements.has(c.step)));
        return el('div', { class: 'test-checks-editor' },
            el('h5', {}, 'Checks'),
            !scenario.checks.length ? el('p', { class: 'test-hint' }, 'No checks yet: a run passes when its steps can be done.') : null,
            rest.map(c => this._checkRow(scenario, c)),
            el('button', { type: 'button', class: 'test-check-add', onclick: () => {
                const check = { kind: 'node', ...(live ? this._runPosition(scenario, live.instance, live) : {}) };
                scenario.checks.push(check);
                this._editing.add(check);
                this._scheduleSave(); this.render();
            } }, 'Add check'));
    }

    /** A part of the run shown (+Data, +Items, ...), open or closed as last left. */
    _part(key, summary, content, attrs = {}) {
        const details = el('details', { ...attrs, open: this._opened.has(key) }, el('summary', {}, summary), content);
        details.addEventListener('toggle', () => { if (details.open) this._opened.add(key); else this._opened.delete(key); });
        return details;
    }

    /** A run in progress: what waits now, each with its data and the button that completes it. */
    _renderPending(live) {
        const pending = this._waiting(live.instance);
        return [
            pending.length ? pending.map(item => {
                const data = this._stepData(item);
                let input, read;
                if (item.type === 'bpmn:UserTask' && this._formFields(item.elementId).length) {
                    const form = this._stepForm(item, data);
                    input = form.node;
                    read = () => {
                        const { value, error } = form.read();
                        if (error) this._status(`The other data is not valid JSON: ${error}`, true);
                        return error ? null : value;
                    };
                } else {
                    input = this._jsonField('Data', data, () => { }, { rows: 2 });
                    read = () => input.querySelector('textarea').value;
                }
                const towards = this._goal?.scenario === live.scenario && pending.length > 1 && this._towardsGoal(live) === item;
                return el('div', { class: `test-step pending${live.failed === item.elementId ? ' failed' : ''}`, 'data-element-id': item.elementId },
                    el('span', { class: 'test-step-name' }, this._elementIcon(item.elementId), this._label(item.elementId, item.name)),
                    towards ? el('span', { class: 'test-goal-next' }, 'Towards the goal') : null,
                    input,
                    el('button', { type: 'button', class: 'test-step-run primary', onclick: () => {
                        const value = read();
                        if (value !== null) this.runStep(item, value);
                    } }, stepAction(item)));
            }) : el('p', { class: 'test-finished' }, `No more steps: the instance is ${live.instance.status}. `,
                live.debugOnly ? null : el('button', { type: 'button', class: 'test-stop', onclick: () => this.stop() }, 'Close')),
            this._waitingInside(live.instance).length ? el('p', { class: 'test-hint test-inside' }, 'Also waiting, not a step here: ',
                this._waitingInside(live.instance).map(i => this._label(i.elementId, i.name)).join(', ')) : null];
    }

    /**
     * The variables as a table (name, value as JSON or text), changed and applied to the instance: the next steps
     * run with them. `values` gives the starting values; `onApply` what Apply does (default: the instance's data).
     */
    _variablesTable(values, onApply, applyLabel = 'Apply') {
        const rows = el('tbody', {});
        const addRow = (name = '', value = '') => rows.append(el('tr', { class: 'test-variable' },
            el('td', {}, el('input', { class: 'test-variable-name', 'aria-label': 'Variable', value: name })),
            el('td', {}, el('input', { class: 'test-variable-value', 'aria-label': `Value of ${name || 'the variable'}`, value: name === '' && value === '' ? '' : showValue(value) })),
            el('td', {}, el('button', { type: 'button', class: 'test-variable-remove', title: 'Remove this variable', onclick: e => e.target.closest('tr').remove() }, '✕'))));
        for (const [name, value] of Object.entries(values ?? {})) addRow(name, value);
        const read = () => {
            const data = {};
            for (const row of rows.querySelectorAll('tr')) {
                const name = row.querySelector('.test-variable-name').value.trim();
                if (name) data[name] = parseValue(row.querySelector('.test-variable-value').value);
            }
            return data;
        };
        return el('div', { class: 'test-variables-table' },
            el('table', {}, el('thead', {}, el('tr', {}, el('th', {}, 'Variable'), el('th', {}, 'Value'), el('th', {}, ''))), rows),
            el('div', { class: 'test-variables-actions' },
                el('button', { type: 'button', class: 'test-variable-add', onclick: () => addRow() }, 'Add variable'),
                el('button', { type: 'button', class: 'test-variables-apply primary', onclick: () => onApply(read()) }, applyLabel)));
    }

    /** Debug: the instance's variables now, changed before the next step. */
    _renderVariables(live) {
        return el('div', { class: 'test-variables' },
            el('h5', {}, 'Variables now'),
            el('p', { class: 'test-hint' }, 'Change them, then Apply: the next steps run with them. This run only: the scenario does not keep them.'),
            this._variablesTable(live.instance.data, data => this.applyVariables(data)));
    }

    /** Debug, on a step done: the variables after it, and Restart here (back to it, with the variables as they are to be there). */
    _renderDoneDebug(live, step, i) {
        // a kept run debugged again has no variables per step: it starts from the instance's
        const before = (i === 0 ? live.startData : live.done[i - 1].after) ?? live.instance.data;
        const label = this._label(step.element);
        return el('div', { class: 'test-step-debug' },
            step.after ? el('details', {}, el('summary', {}, 'Variables after this step'), el('pre', { class: 'test-data' }, JSON.stringify(step.after, null, 2)))
                : el('p', { class: 'test-hint' }, 'The variables after this step were not kept (an earlier run).'),
            this._restarting === i
                ? el('div', { class: 'test-restart-form' },
                    el('p', { class: 'test-hint' }, `Back to ${label}: the variables as they are to be when it runs again (as they were before it, to start from).`),
                    this._variablesTable(before, data => this.restartAt(step.itemId, data, label), 'Restart here'),
                    el('button', { type: 'button', class: 'test-restart-cancel', onclick: () => { this._restarting = null; this.render(); } }, 'Cancel'))
                : el('button', { type: 'button', class: 'test-restart', disabled: !step.itemId,
                    title: 'Go back to this step (the engine restarts the instance there) and run it again',
                    onclick: () => { this._restarting = i; this.render(); } }, 'Restart here'));
    }

    /**
     * The run's items in the order they ran, numbered as Simulate numbers them; a row selects its element. Debugging a
     * run step by step, an element done can be restarted (it runs again, with the variables as they are now).
     */
    _renderItems(scenario, instance, live = null) {
        const restartable = item => live && this._debug && item.status === 'end' && !this._flowIds().has(item.elementId);
        const items = [...(instance.items || [])].sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
        const time = value => value ? new Date(value).toLocaleTimeString() : '';
        const select = elementId => {
            const element = this._elementRegistry.get(elementId);
            if (!element) return;
            this._canvas.scrollToElement(element);
            this._selection.select(element);
        };
        return this._part('items', `Items (${items.length})`,
            el('table', {},
                el('thead', {}, el('tr', {}, ['#', 'Element', 'Name', 'Type', 'Status', 'Assignee', 'Started', 'Ended', ''].map(h => el('th', {}, h)))),
                el('tbody', {}, items.map((item, i) => el('tr', {
                    'data-element-id': item.elementId,
                    title: this._elementRegistry.get(item.elementId) ? 'Select it in the diagram' : null,
                    onclick: () => select(item.elementId)
                },
                    el('td', {}, i + 1),
                    el('td', {}, item.elementId),
                    el('td', {}, item.name || ''),
                    el('td', {}, String(item.type || '').replace('bpmn:', '')),
                    el('td', {}, el('span', { class: `test-item-status ${item.status}` }, item.status)),
                    el('td', {}, item.assignee || ''),
                    el('td', {}, time(item.startedAt)),
                    el('td', {}, time(item.endedAt)),
                    // a check is added on its step's rows (What happened), not here
                    el('td', { class: 'test-item-commands' }, restartable(item) ? el('button', { type: 'button', class: 'test-item-restart',
                        title: 'Go back to this element and run it again, with the variables as they are now',
                        onclick: e => { e.stopPropagation(); this.restartAt(item.id, live.instance.data, this._label(item.elementId, item.name)); } }, 'Restart') : null))))),
            { class: 'test-items' });
    }

    /** The model's sequence flows' ids (an item of one is not restarted). */
    _flowIds() {
        return new Set(this._elements(['bpmn:SequenceFlow']).map(f => f.id));
    }
}

TestPanel.$inject = ['config.test', 'eventBus', 'bpmnjs', 'elementRegistry', 'canvas', 'overlays', 'selection'];
