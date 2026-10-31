// The Test tab: scenarios of the model, run on the saved model (src/testing/scenarios.ts on the server).
//
// Start opens the start form (the start event, its form fields or start data); starting it shows the user tasks
// and events that wait as the next steps, each with its data (prefilled from the scenario, else from the
// element's form fields) and the instance page's button for it: Execute for a user task, Force for an event.
// Running a step completes it; what waits after it shows as the next steps, and so on until nothing waits. The
// data chooses the branches; which step is run first chooses between elements that wait together. The steps run
// are the scenario's steps, saved as they are run, so Run (and Run all) can repeat them without stopping: a new
// instance each time. Checks run after a step or at the end: a node (how often, in what status), a data value, the
// instance's status. Simulate shows the last run on the diagram one change at a time (Back, Step, Play).
// Debug shows the instance's variables: change them before the next step, or go back to a step done (Restart
// here: the engine's restart, from the save point the test instance keeps) with the variables as they are to be
// there, and run it again. The outcome lists why the engine took its path (the log's decisions).
// Each scenario keeps its runs (the latest RUNS_KEPT): when, how, the result and the instance, which stays in
// the database; an earlier run can be opened again, its items, data and log shown and simulated.
import { is } from 'bpmn-js/lib/util/ModelUtil';

const STATUSES = ['', 'end', 'wait', 'running', 'terminated'];
/** The steps, as the instance page offers them (src/testing/scenarios.ts isStep): user tasks and events. */
const isStep = item => item.status === 'wait' && (item.type === 'bpmn:UserTask' || String(item.type).includes('Event'));
/** The instance page's names for completing them. */
const stepAction = item => item.type === 'bpmn:UserTask' ? 'Execute' : 'Force';
const MARKERS = ['test-started', 'test-passed', 'test-waiting', 'test-failed'];
const SIMULATION_STEP = 450;    // ms between the elements a simulation shows
const RUNS_KEPT = 20;
const HOW = { start: 'Start', run: 'Run', all: 'Run all' };

function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === null || value === false) continue;
        if (key === 'class') node.className = value;
        else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
        else if (key === 'value') node.value = value;
        else node.setAttribute(key, value === true ? '' : value);
    }
    for (const child of children.flat(Infinity))
        if (child !== undefined && child !== null && child !== false)
            node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    return node;
}

/** Short JSON on one line, longer pretty-printed. */
const json = value => {
    const line = JSON.stringify(value ?? {});
    return line.length <= 80 ? line : JSON.stringify(value ?? {}, null, 2);
};
function parse(text) {
    if (!text.trim()) return { value: {} };
    try {
        const value = JSON.parse(text);
        if (!value || typeof value !== 'object' || Array.isArray(value)) return { error: 'Must be an object: { "field": value }' };
        return { value };
    } catch (err) {
        return { error: err.message };
    }
}
const sameSteps = (a, b) => a.length <= b.length && a.every((step, i) => step.element === b[i].element);
const clone = value => JSON.parse(JSON.stringify(value ?? {}));

const CHECK_KINDS = [['node', 'Node'], ['data', 'Data'], ['status', 'Instance status']];
const CHECK_OPS = ['=', '<>', '>', '<', '>=', '<='];
const ITEM_STATUSES = ['', 'end', 'wait', 'start', 'terminated'];
/** A value typed in: JSON when it reads as JSON (5, true, "x", {..}), else the text itself. */
function parseValue(text) {
    try { return JSON.parse(text); } catch { return text; }
}
const showValue = value => typeof value === 'string' ? value : JSON.stringify(value ?? '');

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

    async _request(method, url, body, options = {}) {
        const response = await fetch(url, {
            method, headers: body ? { 'Content-Type': 'application/json' } : {},
            body: body ? JSON.stringify(body) : undefined, ...options
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const error = new Error(data.error || `${response.status} ${response.statusText}`);
            error.instance = data.instance;
            error.reported = Boolean(data.error);      // the route answered (not a 404 for a route the server lacks)
            throw error;
        }
        return data;
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

    /** The saved model is what runs: save the editor's changes first. */
    async _modelSaved() {
        if (this._config.save)
            await this._config.save();
    }

    // ---- the scenario's runs

    /** Keep a run with the scenario, newest first. */
    _recordRun(scenario, run) {
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
        this._results.delete(scenario);
        try {
            await this._modelSaved();
            const { instance } = await this._request('POST', '/model/test/start', {
                processName: this._config.processName, startNodeId: scenario.start?.startNodeId, data: scenario.start?.data ?? {}
            });
            this._live = { scenario, instance, done: [], checks: null, stepChecks: [], failed: null, startData: clone(instance.data),
                run: { instanceId: instance.id, at: new Date().toISOString(), how: 'start', ok: null } };
            this._recordRun(scenario, this._live.run);
            await this._save();
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
            // saved steps beyond the end of this run are not part of it
            live.scenario.steps = [...live.done];
            await this._save();
            const failed = checks.filter(c => !c.ok).length;
            this._status(failed ? `Finished: ${failed} of ${checks.length} checks failed` : `Finished${checks.length ? ': all checks passed' : ''}`, failed > 0);
        } catch (err) {
            this._status(err.message, true);
        }
    }

    stop() {
        // the run stays the scenario's last: its result and items are shown, and Simulate replays it
        const live = this._live;
        if (live?.instance)
            this._results.set(live.scenario, { ...live.run, ok: live.checks ? live.checks.every(c => c.ok) : null,
                checks: live.checks ?? [], steps: [], instance: live.instance });
        this._live = null;
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
            live.stepChecks = live.done.flatMap(d => d.checks ?? []);
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
            this._status(`Simulation done (${sim.frames.length} changes): blue started, green done, orange still waiting; the numbers are the order they started in`);
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
        if (sim?.index) this._status(`${sim.index} of ${sim.frames.length}: ${sim.frames[sim.index - 1].text}`);
    }

    /** The simulation's buttons as it stands: Simulate, or Back, Step, Play/Pause and Stop. */
    _simulationControls() {
        const sim = this._simulation;
        const button = this._root?.querySelector('.test-simulate');
        if (button) button.textContent = !sim ? 'Simulate' : sim.paused ? 'Play' : 'Pause';
        for (const [selector, shown, enabled] of [
            ['.test-sim-back', sim, sim?.index > 1],
            ['.test-sim-step', sim, sim && sim.index < sim.frames.length],
            ['.test-sim-stop', sim, true]]) {
            const node = this._root?.querySelector(selector);
            if (!node) continue;
            node.hidden = !shown;
            node.disabled = !enabled;
        }
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
        this._root.replaceChildren(el('div', { class: 'test-panel' },
            this._renderList(),
            el('div', { class: 'test-main' },
                el('div', { class: `test-status${keep[1] ? ' error' : ''}`, role: 'status' }, keep[0]),
                this._current ? [this._renderEditor(this._current), this._renderOutcome()] :
                    el('p', { class: 'test-hint' }, 'A scenario runs the process step by step: add one with New, then Start.'))));
    }

    _select(scenario) {
        this._stopSimulation();
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
        return el('div', { class: 'test-list' },
            el('div', { class: 'test-list-actions' },
                el('button', { type: 'button', class: 'test-new', onclick: add }, 'New'),
                el('button', { type: 'button', class: 'test-run-all', onclick: () => this.runAll(), disabled: !this._scenarios.length,
                    title: 'Run every scenario\'s saved steps' }, 'Run all')),
            el('ul', {}, this._scenarios.map(scenario => {
                // this session's result, else the last kept run's (a step-by-step run not finished has none)
                const ok = this._results.has(scenario) ? this._results.get(scenario).ok : scenario.runs?.[0]?.ok;
                return el('li', { class: scenario === this._current ? 'selected' : '', onclick: () => this._select(scenario) },
                    el('span', { class: `test-badge ${ok === true ? 'ok' : ok === false ? 'failed' : ''}`, title: ok === true ? 'passed' : ok === false ? 'failed' : 'not run' },
                        ok === true ? '✓' : ok === false ? '✗' : '·'),
                    scenario.name);
            })));
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

    _renderEditor(scenario) {
        const changed = () => this._scheduleSave();
        const live = this._live?.scenario === scenario ? this._live : null;
        const starts = this._elements(['bpmn:StartEvent']).filter(e => is(e.$parent, 'bpmn:Process'));
        scenario.steps ??= [];

        return el('div', { class: 'test-editor' },
            el('div', { class: 'test-editor-actions' },
                el('input', { class: 'test-name', 'aria-label': 'Scenario name', value: scenario.name, oninput: e => { scenario.name = e.target.value; changed(); } }),
                el('button', { type: 'button', class: `test-run primary${this._starting === scenario ? ' active' : ''}`, onclick: () => this.openStart(scenario),
                    title: 'The start event and its data, then start the process and run it step by step' }, live ? 'Start again' : 'Start'),
                el('button', { type: 'button', class: 'test-replay', onclick: () => this.replay(scenario), disabled: !scenario.steps.length,
                    title: 'Run the saved steps on a new instance without stopping, and check what is expected' }, 'Run'),
                el('button', { type: 'button', class: 'test-sim-back', hidden: !this._simulation, disabled: !(this._simulation?.index > 1),
                    onclick: () => this._backSimulation(), title: 'Back one change' }, '◀ Back'),
                el('button', { type: 'button', class: 'test-sim-step', hidden: !this._simulation,
                    onclick: () => { this._pauseSimulation(); this._stepSimulation(); }, title: 'The next change' }, 'Step ▶'),
                el('button', { type: 'button', class: 'test-simulate', onclick: () => this.simulate(), disabled: !this._lastRun(scenario),
                    title: 'Show the last run on the diagram one change at a time, numbered in the order they ran: Step, Back, or Play the rest' },
                    !this._simulation ? 'Simulate' : this._simulation.paused ? 'Play' : 'Pause'),
                el('button', { type: 'button', class: 'test-sim-stop', hidden: !this._simulation, onclick: () => this._stopSimulation(),
                    title: 'End the simulation' }, 'Stop'),
                el('button', { type: 'button', class: `test-debug${this._debug ? ' active' : ''}`, 'aria-pressed': String(this._debug),
                    onclick: () => { this._debug = !this._debug; this._restarting = null; this.render(); },
                    title: 'Show the variables while running step by step: change them, or go back to a step and run it again' }, 'Debug'),
                el('button', { type: 'button', onclick: () => {
                    const copy = JSON.parse(JSON.stringify(scenario));
                    copy.name = `${scenario.name} (copy)`;
                    delete copy.runs;       // the runs are the original's
                    this._scenarios.splice(this._scenarios.indexOf(scenario) + 1, 0, copy);
                    changed(); this._select(copy);
                } }, 'Duplicate'),
                el('button', { type: 'button', class: 'test-delete', onclick: () => {
                    if (!confirm(`Delete the scenario '${scenario.name}'?`)) return;
                    this._scenarios.splice(this._scenarios.indexOf(scenario), 1);
                    if (this._live?.scenario === scenario) this._live = null;
                    changed(); this._select(this._scenarios[0] ?? null);
                } }, 'Delete')),

            this._starting === scenario ? this._renderStart(scenario, starts) : null,

            live ? this._renderLiveSteps(live) : this._renderSavedSteps(scenario),
            this._renderRuns(scenario),
            this._renderChecks(scenario));
    }

    /** The start form: the start event (when there are several), its form fields or the start data, and Start. */
    _renderStart(scenario, starts) {
        const changed = () => this._scheduleSave();
        const startId = scenario.start?.startNodeId || starts[0]?.id;
        const fields = startId ? this._formFields(startId) : [];
        let read;
        let input;
        if (fields.length) {
            const form = this._stepForm({ id: 'start', elementId: startId }, scenario.start?.data ?? {});
            input = form.node;
            read = () => form.read();
        } else {
            input = this._jsonField('Start data', scenario.start?.data, () => { }, { class: 'test-json test-start-data' });
            read = () => parse(input.querySelector('textarea').value);
        }
        const go = () => {
            const { value, error } = read();
            if (error) return this._status(`The start data is not valid JSON: ${error}`, true);
            scenario.start = { ...scenario.start, data: value };
            changed();
            this.start(scenario);
        };
        return el('fieldset', { class: 'test-start' }, el('legend', {}, 'Start'),
            starts.length > 1 ? el('label', { class: 'test-field' }, el('span', {}, 'Start event'),
                el('select', { class: 'test-start-event', onchange: e => { scenario.start = { ...scenario.start, startNodeId: e.target.value || undefined }; changed(); this.render(); } },
                    starts.map(s => el('option', { value: s.id, selected: s.id === startId }, s.get('name') || s.id)))) : null,
            input,
            el('div', { class: 'test-start-actions' },
                el('button', { type: 'button', class: 'test-start-go primary', onclick: go }, 'Start the process'),
                el('button', { type: 'button', class: 'test-start-cancel', onclick: () => { this._starting = null; this.render(); } }, 'Cancel')));
    }

    /**
     * The checks: each at the end or after a step; a node (by id or name: how many times it ran, in what status), a
     * data value compared, the instance's status.
     */
    _renderChecks(scenario) {
        scenario.checks ??= [];
        const changed = () => this._scheduleSave();
        const steps = this._elements(['bpmn:UserTask', 'bpmn:ReceiveTask', 'bpmn:Event']).filter(e => !is(e, 'bpmn:StartEvent') && !is(e, 'bpmn:EndEvent'));
        const nodes = this._elements().filter(e => !is(e, 'bpmn:SequenceFlow') && !is(e, 'bpmn:DataObjectReference') && !is(e, 'bpmn:DataStoreReference') && !is(e, 'bpmn:DataObject'));
        const option = (value, label, selected) => el('option', { value, selected: selected === value }, label);
        const row = (check, i) => {
            const set = (patch, again = false) => { Object.assign(check, patch); changed(); if (again) this.render(); };
            const when = check.at === 'after' ? `after:${check.step}` : 'end';
            const fields = check.kind === 'node' ? [
                el('select', { class: 'test-check-node', 'aria-label': 'Node', onchange: e => set({ node: e.target.value }) },
                    option('', '(choose a node)', check.node ?? ''),
                    nodes.map(n => option(n.id, this._label(n.id), check.node))),
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
                el('select', { class: 'test-check-at', 'aria-label': 'When', onchange: e => {
                    const value = e.target.value;
                    set(value === 'end' ? { at: undefined, step: undefined } : { at: 'after', step: value.slice(6) });
                } },
                    option('end', 'At the end', when),
                    steps.map(s => option(`after:${s.id}`, `After ${this._label(s.id)}`, when))),
                el('select', { class: 'test-check-kind', 'aria-label': 'What', onchange: e => set({ kind: e.target.value }, true) },
                    CHECK_KINDS.map(([value, label]) => option(value, label, check.kind))),
                fields,
                el('button', { type: 'button', class: 'test-check-remove', title: 'Remove this check',
                    onclick: () => { scenario.checks.splice(i, 1); changed(); this.render(); } }, '✕'));
        };
        return el('fieldset', { class: 'test-checks-editor' }, el('legend', {}, 'Checks'),
            scenario.checks.length ? scenario.checks.map(row) : el('p', { class: 'test-hint' }, 'No checks: a run passes when its steps can be done.'),
            el('button', { type: 'button', class: 'test-check-add', onclick: () => {
                scenario.checks.push({ kind: 'node' });
                changed(); this.render();
            } }, 'Add check'));
    }

    /** The scenario's kept runs, newest first; one opens its instance here. */
    _renderRuns(scenario) {
        if (!scenario.runs?.length) return null;
        const shown = this._live?.scenario === scenario ? this._live.run?.instanceId : this._results.get(scenario)?.instance?.id;
        const when = at => new Date(at).toLocaleString();
        return el('details', { class: 'test-runs', open: true }, el('summary', {}, `Runs (${scenario.runs.length})`),
            el('table', {}, el('tbody', {}, scenario.runs.map(run => el('tr', {
                class: run.instanceId === shown ? 'shown' : '', 'data-instance-id': run.instanceId,
                title: 'Show this run: its result, items, data and log; Simulate plays it', onclick: () => this.showRun(scenario, run)
            },
                el('td', {}, el('span', { class: `test-badge ${run.ok === true ? 'ok' : run.ok === false ? 'failed' : ''}` }, run.ok === true ? '✓' : run.ok === false ? '✗' : '·')),
                el('td', {}, when(run.at)),
                el('td', {}, HOW[run.how] ?? run.how),
                el('td', {}, el('a', { href: `/instanceDetails?id=${encodeURIComponent(run.instanceId)}`, target: '_blank', onclick: e => e.stopPropagation() }, 'instance')))))));
    }

    /** A run in progress: the steps done, then what waits now, each with its data and Run. */
    _renderLiveSteps(live) {
        const pending = this._waiting(live.instance);
        const checkList = checks => checks?.length ? el('ul', { class: 'test-checks test-step-checks' }, checks.map(c =>
            el('li', { class: c.ok ? 'ok' : 'failed' }, `${c.ok ? '✓' : '✗'} ${c.what}`, !c.ok && c.actual !== undefined ? ` (is ${JSON.stringify(c.actual)})` : ''))) : null;
        return el('fieldset', { class: 'test-steps live' }, el('legend', {}, 'Steps'),
            live.done.map((step, i) => el('div', { class: 'test-step done', 'data-element-id': step.element },
                el('span', { class: 'test-step-name' }, '✓ ', this._label(step.element)),
                el('code', { class: 'test-step-data' }, JSON.stringify(step.data ?? {})),
                checkList(step.checks),
                this._debug ? this._renderDoneDebug(live, step, i) : null)),
            this._debug ? this._renderVariables(live) : null,
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
                    el('span', { class: 'test-step-name' }, this._label(item.elementId, item.name)),
                    input,
                    el('button', { type: 'button', class: 'test-step-run primary', onclick: () => {
                        const value = read();
                        if (value !== null) this.runStep(item, value);
                    } }, stepAction(item)));
            }) : el('p', { class: 'test-finished' }, `No more steps: the instance is ${live.instance.status}. `,
                el('button', { type: 'button', class: 'test-stop', onclick: () => this.stop() }, 'Close')),
            this._waitingInside(live.instance).length ? el('p', { class: 'test-hint test-inside' }, 'Also waiting, not a step here: ',
                this._waitingInside(live.instance).map(i => this._label(i.elementId, i.name)).join(', ')) : null);
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
        const before = i === 0 ? live.startData : live.done[i - 1].after;
        const label = this._label(step.element);
        return el('div', { class: 'test-step-debug' },
            el('details', {}, el('summary', {}, 'Variables after this step'), el('pre', { class: 'test-data' }, JSON.stringify(step.after ?? {}, null, 2))),
            this._restarting === i
                ? el('div', { class: 'test-restart-form' },
                    el('p', { class: 'test-hint' }, `Back to ${label}: the variables as they are to be when it runs again (as they were before it, to start from).`),
                    this._variablesTable(before, data => this.restartAt(step.itemId, data, label), 'Restart here'),
                    el('button', { type: 'button', class: 'test-restart-cancel', onclick: () => { this._restarting = null; this.render(); } }, 'Cancel'))
                : el('button', { type: 'button', class: 'test-restart', disabled: !step.itemId,
                    title: 'Go back to this step (the engine restarts the instance there) and run it again',
                    onclick: () => { this._restarting = i; this.render(); } }, 'Restart here'));
    }

    /** Not running: the saved steps, which Run repeats; Start goes through them step by step. */
    _renderSavedSteps(scenario) {
        return el('fieldset', { class: 'test-steps' }, el('legend', {}, 'Steps'),
            scenario.steps.length ? scenario.steps.map((step, i) => el('div', { class: 'test-step saved' },
                el('span', { class: 'test-step-name' }, this._label(step.element)),
                el('code', { class: 'test-step-data' }, JSON.stringify(step.data ?? {})),
                el('button', { type: 'button', title: 'Remove this step and the ones after it',
                    onclick: () => { scenario.steps.splice(i); this._scheduleSave(); this.render(); } }, '✕')))
                : el('p', { class: 'test-hint' }, 'Start the scenario: the user tasks and events that wait show here as steps, one at a time.'));
    }

    /** The outcome: of the run in progress, or of the last Run. */
    _renderOutcome() {
        const live = this._live?.scenario === this._current ? this._live : null;
        const result = live ? { ok: live.checks ? live.checks.every(c => c.ok) : null, checks: live.checks ?? [], steps: [], instance: live.instance }
            : this._results.get(this._current);
        if (!result) return null;
        const instance = result.instance;
        const title = result.ok === null ? `Instance ${instance?.status}` : result.ok ? '✓ Passed' : '✗ Failed';
        return el('div', { class: `test-result ${result.ok === null ? '' : result.ok ? 'ok' : 'failed'}` },
            el('h4', {}, title, instance ? el('a', { href: `/instanceDetails?id=${encodeURIComponent(instance.id)}`, target: '_blank' }, ' open the instance') : null),
            result.error ? el('p', { class: 'test-error' }, result.error) : null,
            result.steps?.length ? el('ol', { class: 'test-steps-result' }, result.steps.map(s =>
                el('li', { class: s.ok ? 'ok' : 'failed' }, `${s.ok ? '✓' : '✗'} ${s.element}`, s.error ? el('span', { class: 'test-error' }, ` — ${s.error}`) : null))) : null,
            result.checks?.length ? el('ul', { class: 'test-checks' }, result.checks.map(c =>
                el('li', { class: c.ok ? 'ok' : 'failed' }, `${c.ok ? '✓' : '✗'} ${c.what}`, !c.ok && c.actual !== undefined ? ` (is ${JSON.stringify(c.actual)})` : ''))) : null,
            instance ? [
                el('details', { open: true }, el('summary', {}, 'Data'), el('pre', { class: 'test-data' }, JSON.stringify(instance.data ?? {}, null, 2))),
                instance.decisions?.length ? el('details', { class: 'test-decisions', open: true }, el('summary', {}, `Why: the engine's decisions (${instance.decisions.length})`),
                    el('ol', {}, instance.decisions.map(d => el('li', {}, d)))) : null,
                this._renderItems(instance, live),
                el('details', {}, el('summary', {}, `Log (${instance.logs?.length ?? 0} lines)`), el('pre', { class: 'test-log' }, (instance.logs || []).join('\n')))
            ] : null);
    }

    /**
     * The run's items in the order they ran, numbered as Simulate numbers them; a row selects its element. Debugging a
     * run step by step, an element done can be restarted (it runs again, with the variables as they are now).
     */
    _renderItems(instance, live = null) {
        const restartable = item => live && this._debug && item.status === 'end' && !this._flowIds().has(item.elementId);
        const items = [...(instance.items || [])].sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
        const time = value => value ? new Date(value).toLocaleTimeString() : '';
        const select = elementId => {
            const element = this._elementRegistry.get(elementId);
            if (!element) return;
            this._canvas.scrollToElement(element);
            this._selection.select(element);
        };
        return el('details', { class: 'test-items', open: true }, el('summary', {}, `Items (${items.length})`),
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
                    el('td', {}, restartable(item) ? el('button', { type: 'button', class: 'test-item-restart',
                        title: 'Go back to this element and run it again, with the variables as they are now',
                        onclick: e => { e.stopPropagation(); this.restartAt(item.id, live.instance.data, this._label(item.elementId, item.name)); } }, 'Restart') : null))))));
    }

    /** The model's sequence flows' ids (an item of one is not restarted). */
    _flowIds() {
        return new Set(this._elements(['bpmn:SequenceFlow']).map(f => f.id));
    }
}

TestPanel.$inject = ['config.test', 'eventBus', 'bpmnjs', 'elementRegistry', 'canvas', 'overlays', 'selection'];
