// The Test tab: scenarios of the model, run on the saved model (src/testing/scenarios.ts on the server).
//
// One screen for a scenario: Run, Record, its result, its steps with their checks.
//
// Record opens the start form (the start event, its form fields or start data); starting it shows the user tasks
// and events that wait as the next steps, each with its data (prefilled from the scenario, else from the element's
// form fields). Completing a step shows what waits after it, and so on until nothing waits: the recording then closes
// by itself, and its result shows. The data chooses the
// branches; which step is completed first chooses between elements that wait together. The steps completed are the
// scenario's steps, saved as they are done, so Run (and Run all) can repeat them without stopping: a new instance
// each time. Checks run after a step or at the end: a node (how often, in what status), a data value, the instance's
// status. Add as a check, on an item or a value of the run shown, checks it is as it is there: where the run waits
// (after the last step done, or at the start), else at the end. A check shows under its step, in words; Edit opens its
// fields.
// Each scenario keeps its runs (the latest RUNS_KEPT): when, how, the result and the instance, which stays in the
// database; they are listed under the scenario, in the tree, and clicking one shows it.
// The run shown has its commands by its result, each with a panel of its own under them. Simulate shows it on the
// diagram one change at a time (Back, Step, Play). Debug shows the instance's variables: change them before the next
// step, or go back to a step done (Restart here: the engine's restart, from the save point the test instance keeps)
// with the variables as they are to be there, and run it again. Inspect this run: its data, items, the engine's
// decisions and log.
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { el, json, parse, parseValue, showValue, request, CHECK_OPS, RUNS_KEPT } from './common.js';

const STATUSES = ['', 'end', 'wait', 'running', 'terminated'];
/** The steps, as the instance page offers them (src/testing/scenarios.ts isStep): user tasks and events. */
const isStep = item => item.status === 'wait' && (item.type === 'bpmn:UserTask' || String(item.type).includes('Event'));
/** The button that completes one. */
const stepAction = item => item.type === 'bpmn:UserTask' ? 'Complete step' : 'Trigger event';
const MARKERS = ['test-started', 'test-passed', 'test-waiting', 'test-failed'];
const SIMULATION_STEP = 450;    // ms between the elements a simulation shows
const HOW = { start: 'Recorded', run: 'Run', all: 'Run all' };

const sameSteps = (a, b) => a.length <= b.length && a.every((step, i) => step.element === b[i].element);
const clone = value => JSON.parse(JSON.stringify(value ?? {}));

const CHECK_KINDS = [['node', 'Node'], ['data', 'Data'], ['status', 'Instance status']];
const ITEM_STATUSES = ['', 'end', 'wait', 'start', 'terminated'];
const STATE_WORDS = { end: 'has ended', wait: 'is waiting', start: 'has started', running: 'is running', terminated: 'was terminated' };
const OP_WORDS = { '=': 'is', '<>': 'is not' };
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
        this._opened = new Set(['inspect', 'data', 'items', 'decisions']);   // the parts shown open
        this._expanded = new Set();     // the scenarios whose runs the tree shows
        this._editing = new Set();      // the checks whose fields are open
        this._marked = [];
        this._visible = false;
        this._loaded = false;
        if (!this._root)
            return;
        eventBus.on('import.done', () => { if (this._visible) this.render(); });
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
            if (this._current) this._expanded.add(this._current);
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

    /** The saved model is what runs: save the editor's changes first. */
    async _modelSaved() {
        if (this._config.save)
            await this._config.save();
    }

    // ---- the scenario's runs

    /** Keep a run with the scenario, newest first; the tree shows it. */
    _recordRun(scenario, run) {
        this._expanded.add(scenario);
        scenario.runs = [run, ...(scenario.runs ?? []).filter(r => r.instanceId !== run.instanceId)].slice(0, RUNS_KEPT);
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
            .filter(i => i.status === 'end' && (i.type === 'bpmn:UserTask' || (String(i.type).includes('Event') && i.type !== 'bpmn:StartEvent' && i.type !== 'bpmn:EndEvent')))
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

    /** A kept run deleted, with its test instance. */
    async deleteRun(scenario, run) {
        if (!confirm('Delete this run and its instance?')) return;
        try {
            await this._request('DELETE', `/model/test/instance/${encodeURIComponent(run.instanceId)}`);
        } catch (err) {
            if (err.reported) return this._status(`The run was not deleted: ${err.message}`, true);
        }
        scenario.runs = (scenario.runs || []).filter(r => r !== run);
        if (this._live?.scenario === scenario && this._live.run?.instanceId === run.instanceId) this._live = null;
        if (this._results.get(scenario)?.instance?.id === run.instanceId) this._results.delete(scenario);
        this._stopSimulation();
        await this._save();
        this._status('Run deleted');
        this.render();
        this._markCurrent();
        this._showLastRun(scenario);
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
        return this._formTemplate(item.elementId);
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
            this._renderList(),
            el('div', { class: 'test-main' },
                el('div', { class: `test-status${keep[1] ? ' error' : ''}`, role: 'status' }, keep[0]),
                this._current ? this._renderScenario(this._current) :
                    el('p', { class: 'test-hint' }, 'A scenario tests the process: add one with New, then Record it by doing its steps.'))));
        const main = this._root.querySelector('.test-main');
        if (main) main.scrollTop = scrolled;
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
                el('input', { class: 'test-name', 'aria-label': 'Scenario name', value: scenario.name, oninput: e => { scenario.name = e.target.value; changed(); } }),
                el('button', { type: 'button', class: 'test-replay primary', onclick: () => this.replay(scenario), disabled: !scenario.steps.length,
                    title: scenario.steps.length ? 'Repeat the steps on a new instance without stopping, and check what is expected' : 'Record the steps first' }, '▶ Run'),
                live && !live.debugOnly ? el('button', { type: 'button', class: 'test-stop-recording', onclick: () => this.stop(),
                    title: 'End this: the steps done so far stay the scenario\'s' }, '■ Stop')
                    : el('button', { type: 'button', class: `test-run${this._starting === scenario ? ' active' : ''}`, onclick: () => this.openStart(scenario),
                        title: 'Do the steps yourself, one at a time: they become the scenario\'s steps' }, '● Record'),
                this._menu('⋯', 'test-scenario-menu', [
                    ['Duplicate', 'test-duplicate', () => {
                        const copy = JSON.parse(JSON.stringify(scenario));
                        copy.name = `${scenario.name} (copy)`;
                        delete copy.runs;       // the runs are the original's
                        this._scenarios.splice(this._scenarios.indexOf(scenario) + 1, 0, copy);
                        changed(); this._select(copy);
                    }, 'A copy of this scenario'],
                    ['Delete scenario', 'test-delete', () => {
                        if (!confirm(`Delete the scenario '${scenario.name}'?`)) return;
                        this._scenarios.splice(this._scenarios.indexOf(scenario), 1);
                        if (this._live?.scenario === scenario) this._live = null;
                        changed(); this._select(this._scenarios[0] ?? null);
                    }, 'Delete this scenario and forget its runs']])),
            this._starting === scenario ? this._renderStart(scenario, starts) : null,
            this._renderSummary(scenario, live),
            this._renderSimulation(),
            live && this._debug ? this._renderDebug(scenario, live) : null,
            this._renderTimeline(scenario, live),
            this._renderChecks(scenario, live),
            this._renderInspect(scenario, live));
    }

    /** The result line: passed, failed, recording or not run; the instance and the run's commands; a run that could not go on. */
    _renderSummary(scenario, live) {
        const result = live ? { ok: live.checks ? live.checks.every(c => c.ok) : null, checks: live.checks ?? [], steps: [], instance: live.instance }
            : this._results.get(scenario);
        const shownId = this._shownId(scenario);
        const inProgress = live && !live.checks;
        const title = inProgress ? (this._debug ? '● Debugging this run' : '● Recording: complete each step below')
            : !result ? (scenario.runs?.length ? 'Loading the last run…' : 'Not run yet')
            : result.ok === null ? `Not finished: the instance is ${result.instance?.status ?? 'gone'}`
            : result.ok ? '✓ Passed' : '✗ Failed';
        const state = inProgress ? 'recording' : !result || result.ok === null ? '' : result.ok ? 'ok' : 'failed';
        return el('div', { class: `test-summary test-result ${state}` },
            el('div', { class: 'test-summary-line' },
                el('strong', { class: 'test-summary-title' }, title),
                shownId ? el('a', { class: 'test-instance-link', href: `/instanceDetails?id=${encodeURIComponent(shownId)}`, target: '_blank', title: 'Open the instance page' }, 'Open instance ↗') : null,
                shownId ? this._runCommands(scenario, live, shownId) : null),
            result?.error ? el('p', { class: 'test-error' }, result.error) : null);
    }

    /** The steps, each with its result, then what waits now. */
    _renderTimeline(scenario, live) {
        const result = live ? null : this._results.get(scenario);
        const steps = live ? live.done : scenario.steps;
        const seen = new Set();     // a step repeated (a loop): its checks under the first
        const startId = scenario.start?.startNodeId;
        const firstStart = this._elements(['bpmn:StartEvent']).find(e => is(e.$parent, 'bpmn:Process'));
        const startName = startId ? this._label(startId) : (firstStart?.get('name') || 'the process');
        return el('div', { class: 'test-timeline' },
            el('div', { class: 'test-step test-step-start' },
                el('span', { class: 'test-step-name' }, this._elementIcon(startId ?? firstStart?.id), scenario.start?.only ? `This task alone: ${startName}` : `Start: ${startName}`),
                el('code', { class: 'test-step-data' }, JSON.stringify(scenario.start?.data ?? {})),
                live ? this._checkResults(live.startChecks) : null,
                this._checkRows(scenario, c => c.at === 'start')),
            steps.map((step, i) => {
                // a Run's result for this step; a stopped run has none for the steps after
                const outcome = result?.steps?.[i]?.element === step.element ? result.steps[i] : null;
                const mark = live || outcome?.ok ? '✓ ' : outcome ? '✗ ' : '';
                const first = !seen.has(step.element);
                seen.add(step.element);
                return el('div', { class: `test-step ${live ? 'done' : 'saved'}${outcome && !outcome.ok ? ' failed' : ''}`, 'data-element-id': step.element },
                    el('span', { class: 'test-step-name' }, mark, this._elementIcon(step.element), this._label(step.element)),
                    el('code', { class: 'test-step-data' }, JSON.stringify(step.data ?? {})),
                    live ? null : el('button', { type: 'button', class: 'test-step-remove', title: 'Remove this step and the ones after it',
                        onclick: () => { scenario.steps.splice(i); this._scheduleSave(); this.render(); } }, '✕'),
                    outcome?.error ? el('span', { class: 'test-error test-step-error' }, outcome.error) : null,
                    live ? this._checkResults(step.checks) : null,
                    live && this._debug ? this._renderDoneDebug(live, step, i) : null,
                    first ? this._checkRows(scenario, c => c.at === 'after' && c.step === step.element) : null);
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
            shownRun ? el('button', { type: 'button', class: 'test-run-delete', onclick: () => this.deleteRun(scenario, shownRun),
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
        const key = c => JSON.stringify([c.at ?? 'end', c.step ?? '', c.kind, c.node ?? '', c.status ?? '', c.count ?? '', c.path ?? '', c.op ?? '=', c.value]);
        if ((scenario.checks ?? []).some(c => key(c) === key(check)))
            return el('button', { type: 'button', class: 'test-add-check added', disabled: true, title: 'This check is in the scenario\'s checks' }, '✓ In checks');
        const where = check.at === 'after' ? `after ${this._label(check.step)}` : check.at === 'start' ? 'at the start' : 'at the end';
        return el('button', { type: 'button', class: 'test-add-check', title: `Check this is so ${where}`, onclick: e => {
            e.stopPropagation();
            (scenario.checks ??= []).push(check);
            this._scheduleSave();
            this._status(`Check added, ${where}`);
            this.render();
        } }, 'Add as a check');
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
            instance.decisions?.length ? this._part('decisions', `Why: the engine's decisions (${instance.decisions.length})`,
                el('ol', {}, instance.decisions.map(d => el('li', {}, d))), { class: 'test-decisions' }) : null,
            this._part('log', `Log (${instance.logs?.length ?? 0} lines)`, el('pre', { class: 'test-log' }, (instance.logs || []).join('\n')))
        ], { class: 'test-inspect' });
    }

    _select(scenario) {
        this._stopSimulation();
        this._current = scenario;
        if (scenario) this._expanded.add(scenario);
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
                    ['Delete all runs', 'test-clear-all', () => this.clearAll(), 'Delete every run of these scenarios, and their instances (the scenarios stay)',
                        !this._scenarios.some(s => s.runs?.length)]])),
            el('ul', { class: 'test-tree' }, this._scenarios.map(scenario => this._renderTreeScenario(scenario))));
    }

    /** A scenario in the tree: its result and name; opened, its runs (instances), newest first. */
    _renderTreeScenario(scenario) {
        // this session's result, else the last kept run's (a step-by-step run not finished has none)
        const ok = this._results.has(scenario) ? this._results.get(scenario).ok : scenario.runs?.[0]?.ok;
        const runs = scenario.runs ?? [];
        const open = this._expanded.has(scenario);
        const toggle = e => {
            e.stopPropagation();
            if (open) this._expanded.delete(scenario); else this._expanded.add(scenario);
            this.render();
        };
        return el('li', { class: 'test-tree-scenario' },
            el('div', { class: `test-tree-row${scenario === this._current ? ' selected' : ''}`, onclick: () => this._select(scenario) },
                runs.length ? el('button', { type: 'button', class: 'test-tree-toggle', 'aria-expanded': String(open),
                    'aria-label': `${open ? 'Hide' : 'Show'} the runs of ${scenario.name}`, onclick: toggle }, open ? '▾' : '▸')
                    : el('span', { class: 'test-tree-toggle-space' }),
                el('span', { class: `test-badge ${ok === true ? 'ok' : ok === false ? 'failed' : ''}`, title: ok === true ? 'passed' : ok === false ? 'failed' : 'not run' },
                    ok === true ? '✓' : ok === false ? '✗' : '·'),
                el('span', { class: 'test-tree-name' }, scenario.name),
                runs.length ? el('span', { class: 'test-tree-count' }, runs.length) : null),
            open && runs.length ? el('ul', { class: 'test-tree-runs' }, runs.map(run => this._renderTreeRun(scenario, run))) : null);
    }

    /** A run in the tree: its result, when and how; clicking shows it. */
    _renderTreeRun(scenario, run) {
        const recording = this._live?.scenario === scenario && this._live.run?.instanceId === run.instanceId && !this._live.checks;
        const at = new Date(run.at);
        const today = at.toDateString() === new Date().toDateString();
        const when = today ? at.toLocaleTimeString() : at.toLocaleString();
        return el('li', {
            class: `test-tree-run${scenario === this._current && run.instanceId === this._shownId(scenario) ? ' shown' : ''}`,
            'data-instance-id': run.instanceId, title: `Show this run (${at.toLocaleString()}, instance ${run.instanceId})`,
            onclick: () => {
                if (scenario === this._current && run.instanceId === this._shownId(scenario)) return;
                this._stopSimulation();
                this._current = scenario;
                this.render();
                this.showRun(scenario, run);
            }
        },
            el('span', { class: `test-badge ${run.ok === true ? 'ok' : run.ok === false ? 'failed' : ''}` }, recording ? '●' : run.ok === true ? '✓' : run.ok === false ? '✗' : '·'),
            el('span', { class: 'test-tree-when' }, when),
            el('span', { class: 'test-tree-how' }, recording ? 'recording' : HOW[run.how] ?? run.how));
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
    _checkRow(scenario, check, inPlace = false) {
        const remove = el('button', { type: 'button', class: 'test-check-remove', title: 'Remove this check',
            onclick: () => { scenario.checks.splice(scenario.checks.indexOf(check), 1); this._editing.delete(check); this._scheduleSave(); this.render(); } }, '✕');
        if (!this._editing.has(check)) {
            const where = inPlace ? '' : check.at === 'after' ? `After ${this._label(check.step)}: ` : check.at === 'start' ? 'At the start: ' : 'At the end: ';
            return el('div', { class: 'test-check-row test-check-read' },
                el('span', { class: 'test-check-icon', title: 'A check', 'aria-hidden': 'true' }),
                el('span', { class: 'test-check-prose' }, where, this._checkInWords(check)),
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
            el('span', { class: 'test-check-icon', title: 'A check', 'aria-hidden': 'true' }),
            el('select', { class: 'test-check-at', 'aria-label': 'When', onchange: e => {
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

    /** What checks found: a step's, in a run in progress. */
    _checkResults(checks) {
        return checks?.length ? el('ul', { class: 'test-checks test-step-checks' }, checks.map(c =>
            el('li', { class: c.ok ? 'ok' : 'failed' }, `${c.ok ? '✓' : '✗'} ${c.what}`, !c.ok && c.actual !== undefined ? ` (is ${JSON.stringify(c.actual)})` : ''))) : null;
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
                return el('div', { class: `test-step pending${live.failed === item.elementId ? ' failed' : ''}`, 'data-element-id': item.elementId },
                    el('span', { class: 'test-step-name' }, this._elementIcon(item.elementId), this._label(item.elementId, item.name)),
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
        const position = this._runPosition(scenario, instance, live);
        const sameState = item => instance.items.filter(i => i.elementId === item.elementId && i.status === item.status).length;
        // how many times it is in this state: 1, or more in a loop; a flow too, as any item
        const itemCheck = item => ({ kind: 'node', node: item.elementId, status: item.status, count: sameState(item), ...position });
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
                    el('td', { class: 'test-item-commands' }, this._addCheckButton(scenario, itemCheck(item)), restartable(item) ? el('button', { type: 'button', class: 'test-item-restart',
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
