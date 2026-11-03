// The decision editor's Test tab: tests of the decisions of the file, run on the saved file
// (src/testing/decisionTests.ts on the server), as the model editor's Test tab is for a process (TestPanel.js).
//
// A test gives a decision's inputs (its table's input columns, and the inputs of the decisions it requires) and
// checks what it decides: an output compared (= <> > < >= <=), or how many rules matched (0: none). Run evaluates
// it; Run all, every test. Each test keeps its runs (the latest RUNS_KEPT): when, how, the result, the checks and
// why (the rules each decision matched); an earlier run can be shown again.
import { el, json, parse, parseValue, showValue, request, CHECK_OPS, RUNS_KEPT } from './common.js';

const CHECK_KINDS = [['output', 'Output'], ['matches', 'Rules matched']];
const HOW = { run: 'Run', all: 'Run all' };

export default class DecisionTestPanel {
    /**
     * @param root     the tab's element
     * @param config   { name: the decision file's name, modeler: dmn-js, save: () => Promise<boolean> (saves the file when changed) }
     */
    constructor(root, config) {
        this._root = root;
        this._config = config;
        this._tests = [];
        this._current = null;
        this._shown = new Map();        // test -> the run shown in Runs
        this._section = 'design';       // the test's section shown: 'design' or 'runs'
        this._opened = new Set(['result', 'why']);
        this._visible = false;
        this._loaded = false;
        // an edit not saved yet goes with the page
        window.addEventListener('pagehide', () => { if (this._saveTimer) this._save({ keepalive: true }); });
    }

    get url() { return `/model/decision/${encodeURIComponent(this._config.name)}/tests`; }

    /** Edits not saved yet. */
    get pending() { return Boolean(this._saveTimer); }

    async show() {
        this._visible = true;
        if (!this._loaded) {
            this._loaded = true;
            await this._load();
        }
        this.render();
    }

    hide() {
        this._visible = false;
    }

    /** The file's decisions changed (a decision added, an input renamed): what the tab offers follows. */
    refresh() {
        if (this._visible) this.render();
    }

    // ---- the server

    async _load() {
        try {
            const { tests } = await request('GET', this.url);
            this._tests = tests;
            this._current = tests[0] ?? null;
        } catch (err) {
            this._status(`Could not load the tests: ${err.message}`, true);
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
            await request('PUT', this.url, { tests: this._tests }, options);
        } catch (err) {
            this._status(`Tests not saved: ${err.message}`, true);
        }
    }

    // ---- running

    /** Keep a run with the test, newest first, and show it. */
    _recordRun(test, result, how) {
        const run = {
            at: new Date().toISOString(), how, ok: result.ok, error: result.error ?? undefined,
            decision: result.decision, data: test.data ?? {}, result: result.result ?? null, checks: result.checks, log: result.log
        };
        test.runs = [run, ...(test.runs ?? [])].slice(0, RUNS_KEPT);
        this._shown.set(test, run);
    }

    async _run(tests, how) {
        this._section = 'runs';
        this._status(how === 'all' ? 'Running all tests…' : 'Running…');
        try {
            // the saved file is what runs
            if (this._config.save && !(await this._config.save()))
                return this._status('Save the decision first: it does not save', true);
            const { results } = await request('POST', this.url + '/run', { tests: tests.map(({ runs, ...test }) => test) });
            results.forEach((result, i) => this._recordRun(tests[i], result, how));
            await this._save();
            const failed = results.filter(r => !r.ok).length;
            this._status(failed ? `${failed} of ${results.length} failed` : results.length === 1 ? 'Passed' : `All ${results.length} passed`, failed > 0);
        } catch (err) {
            this._status(err.message, true);
        }
        this.render();
    }

    run(test = this._current) { return this._run([test], 'run'); }
    runAll() { return this._run(this._tests, 'all'); }

    async clearAll() {
        const runs = this._tests.reduce((n, t) => n + (t.runs?.length ?? 0), 0);
        if (!runs) return this._status('No runs to clear');
        if (!confirm(`Delete all ${runs} runs of these tests?`)) return;
        for (const test of this._tests) test.runs = [];
        this._shown.clear();
        await this._save();
        this._status(`${runs} runs cleared`);
        this.render();
    }

    // ---- the file's decisions

    /** The decisions of the file: id, name, their input expressions and output names, and what they require. */
    _decisions() {
        const definitions = this._config.modeler.getDefinitions?.();
        return (definitions?.drgElement ?? []).filter(e => e.$type === 'dmn:Decision').map(d => ({
            id: d.id,
            name: d.name || d.id,
            inputs: (d.decisionLogic?.input ?? []).map(i => i.inputExpression?.text?.trim()).filter(Boolean),
            outputs: d.decisionLogic?.output
                ? d.decisionLogic.output.map(o => o.name).filter(Boolean)
                : [d.variable?.name ?? d.decisionLogic?.variable?.name].filter(Boolean),
            requires: (d.informationRequirement ?? []).map(r => r.requiredDecision?.href?.replace(/^#/, '')).filter(Boolean)
        }));
    }

    /** The decision a test runs: the one it names, else the file's top one (that no other requires). */
    _decisionOf(test) {
        const decisions = this._decisions();
        const required = new Set(decisions.flatMap(d => d.requires));
        return decisions.find(d => d.id === test.decision) ?? decisions.find(d => !required.has(d.id)) ?? decisions[0];
    }

    /** The inputs a decision reads: its own and those of the decisions it requires, less what those decide. */
    _inputsOf(decision) {
        const decisions = new Map(this._decisions().map(d => [d.id, d]));
        const inputs = new Set(), decided = new Set(), seen = new Set();
        const visit = d => {
            if (!d || seen.has(d.id)) return;
            seen.add(d.id);
            d.inputs.forEach(i => inputs.add(i));
            d.requires.forEach(id => {
                const required = decisions.get(id);
                if (required) { decided.add(required.id); decided.add(required.name); required.outputs.forEach(o => decided.add(o)); }
                visit(required);
            });
        };
        visit(decision);
        return [...inputs].filter(i => !decided.has(i));
    }

    // ---- rendering

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
                this._current ? this._renderTest(this._current) :
                    el('p', { class: 'test-hint' }, 'A test gives the decision\'s inputs and checks what it decides: add one with New, then Run.'))));
    }

    _select(test) {
        this._current = test;
        this.render();
    }

    _renderList() {
        const add = () => {
            const decision = this._decisionOf({});
            const data = Object.fromEntries(this._inputsOf(decision).map(input => [input, null]));
            const test = { name: `Test ${this._tests.length + 1}`, data, checks: [] };
            this._tests.push(test);
            this._section = 'design';
            this._scheduleSave();
            this._select(test);
        };
        return el('div', { class: 'test-list' },
            el('div', { class: 'test-list-actions' },
                el('button', { type: 'button', class: 'test-new', onclick: add }, 'New'),
                el('button', { type: 'button', class: 'test-run-all', onclick: () => this.runAll(), disabled: !this._tests.length,
                    title: 'Run every test' }, 'Run all'),
                el('button', { type: 'button', class: 'test-clear-all', onclick: () => this.clearAll(),
                    disabled: !this._tests.some(t => t.runs?.length), title: 'Delete every run of these tests' }, 'Clear all')),
            el('ul', {}, this._tests.map(test => {
                const ok = test.runs?.[0]?.ok;
                return el('li', { class: test === this._current ? 'selected' : '', onclick: () => this._select(test) },
                    el('span', { class: `test-badge ${ok === true ? 'ok' : ok === false ? 'failed' : ''}`, title: ok === true ? 'passed' : ok === false ? 'failed' : 'not run' },
                        ok === true ? '✓' : ok === false ? '✗' : '·'),
                    test.name);
            })));
    }

    /** A test: its name, Duplicate and Delete; then its Design (decision, inputs, checks) or its Runs. */
    _renderTest(test) {
        const changed = () => this._scheduleSave();
        const runs = test.runs?.length ?? 0;
        const tab = (name, label) => el('button', {
            type: 'button', role: 'tab', class: `test-section-tab test-tab-${name}${this._section === name ? ' selected' : ''}`,
            'aria-selected': String(this._section === name),
            onclick: () => { this._section = name; this.render(); }
        }, label);
        return el('div', { class: 'test-editor' },
            el('div', { class: 'test-editor-actions' },
                el('input', { class: 'test-name', 'aria-label': 'Test name', value: test.name, oninput: e => { test.name = e.target.value; changed(); this._renderListOnly(); } }),
                el('button', { type: 'button', class: 'test-duplicate', onclick: () => {
                    const copy = JSON.parse(JSON.stringify(test));
                    copy.name = `${test.name} (copy)`;
                    delete copy.runs;       // the runs are the original's
                    this._tests.splice(this._tests.indexOf(test) + 1, 0, copy);
                    changed(); this._section = 'design'; this._select(copy);
                } }, 'Duplicate'),
                el('button', { type: 'button', class: 'test-delete', onclick: () => {
                    if (!confirm(`Delete the test '${test.name}'?`)) return;
                    this._tests.splice(this._tests.indexOf(test), 1);
                    changed(); this._select(this._tests[0] ?? null);
                } }, 'Delete')),
            el('div', { class: 'test-sections', role: 'tablist' }, tab('design', 'Design'), tab('runs', `Runs (${runs})`)),
            this._section === 'runs' ? this._renderRunsSection(test) : this._renderDesign(test));
    }

    /** The list's names follow the name typed, without rendering the field typed in. */
    _renderListOnly() {
        const list = this._root.querySelector('.test-list');
        if (list) list.replaceWith(this._renderList());
    }

    /** Design: Run; the decision (when the file has several), its inputs, the checks. */
    _renderDesign(test) {
        const changed = () => this._scheduleSave();
        const decisions = this._decisions();
        const decision = this._decisionOf(test);
        return el('div', { class: 'test-design' },
            el('div', { class: 'test-design-actions' },
                el('button', { type: 'button', class: 'test-replay primary', onclick: () => this.run(test),
                    title: 'Evaluate the decision with these inputs, and check what it decides' }, 'Run')),
            decisions.length > 1 ? el('label', { class: 'test-field' }, el('span', {}, 'Decision'),
                el('select', { class: 'test-decision', onchange: e => { test.decision = e.target.value || undefined; changed(); this.render(); } },
                    el('option', { value: '' }, 'The file\'s top decision'),
                    decisions.map(d => el('option', { value: d.id, selected: d.id === test.decision }, d.name)))) : null,
            this._renderInputs(test, decision),
            this._renderChecks(test, decision));
    }

    /** The inputs: one row each (the decision's, then any other the data holds), and all of them as JSON. */
    _renderInputs(test, decision) {
        test.data ??= {};
        const changed = () => this._scheduleSave();
        const names = [...new Set([...this._inputsOf(decision), ...Object.keys(test.data)])];
        const rows = names.map(name => el('div', { class: 'test-check-row test-input-row' },
            el('span', { class: 'test-input-name' }, name),
            el('input', { class: 'test-input-value', 'aria-label': name, placeholder: 'value (JSON, or text)',
                value: test.data[name] === undefined || test.data[name] === null ? '' : showValue(test.data[name]),
                oninput: e => { test.data[name] = e.target.value === '' ? null : parseValue(e.target.value); changed(); } })));
        const area = el('textarea', { class: 'test-json', rows: 3, spellcheck: 'false', 'aria-label': 'Inputs as JSON' });
        area.value = json(test.data);
        const message = el('div', { class: 'test-json-error' });
        area.addEventListener('change', () => {
            const { value, error } = parse(area.value);
            area.classList.toggle('invalid', Boolean(error));
            message.textContent = error || '';
            if (!error) { test.data = value; changed(); this.render(); }
        });
        return el('fieldset', { class: 'test-inputs' }, el('legend', {}, 'Inputs'),
            rows.length ? rows : el('p', { class: 'test-hint' }, 'The decision reads no inputs.'),
            this._part('json', 'As JSON', el('label', { class: 'test-field' }, area, message)));
    }

    /** The checks: an output compared, or how many rules matched. */
    _renderChecks(test, decision) {
        test.checks ??= [];
        const changed = () => this._scheduleSave();
        const option = (value, label, selected) => el('option', { value, selected: selected === value }, label);
        const listId = 'decision-test-outputs';
        const row = (check, i) => {
            const set = (patch, again = false) => { Object.assign(check, patch); changed(); if (again) this.render(); };
            const fields = check.kind === 'matches' ? [] : [
                el('input', { class: 'test-check-path', list: listId, placeholder: 'output', 'aria-label': 'Output', value: check.path ?? '',
                    oninput: e => set({ path: e.target.value }) })
            ];
            return el('div', { class: 'test-check-row' },
                el('select', { class: 'test-check-kind', 'aria-label': 'What', onchange: e => set({ kind: e.target.value }, true) },
                    CHECK_KINDS.map(([value, label]) => option(value, label, check.kind))),
                fields,
                el('select', { class: 'test-check-op', 'aria-label': 'Comparison', onchange: e => set({ op: e.target.value }) },
                    CHECK_OPS.map(op => option(op, op, check.op ?? '='))),
                el('input', { class: 'test-check-value', placeholder: check.kind === 'matches' ? 'rules (0: none)' : 'value', 'aria-label': 'Value',
                    value: check.value === undefined ? '' : showValue(check.value), oninput: e => set({ value: parseValue(e.target.value) }) }),
                el('button', { type: 'button', class: 'test-check-remove', title: 'Remove this check',
                    onclick: () => { test.checks.splice(i, 1); changed(); this.render(); } }, '✕'));
        };
        return el('fieldset', { class: 'test-checks-editor' }, el('legend', {}, 'Checks'),
            el('datalist', { id: listId }, (decision?.outputs ?? []).map(o => el('option', { value: o }))),
            test.checks.length ? test.checks.map(row) : el('p', { class: 'test-hint' }, 'No checks: a run passes when the decision evaluates.'),
            el('button', { type: 'button', class: 'test-check-add', onclick: () => {
                test.checks.push({ kind: 'output', path: decision?.outputs?.[0], op: '=' });
                changed(); this.render();
            } }, 'Add check'));
    }

    /** Runs: the kept runs, newest first; the one shown, with Delete and Use as checks, then its outcome. */
    _renderRunsSection(test) {
        const shown = this._shown.get(test) ?? test.runs?.[0];
        if (!test.runs?.length)
            return el('div', { class: 'test-runs-section' }, el('p', { class: 'test-hint' }, 'No runs yet: Run the test in Design.'));
        const when = at => new Date(at).toLocaleString();
        return el('div', { class: 'test-runs-section' },
            el('table', { class: 'test-runs' }, el('tbody', {}, test.runs.map(run => el('tr', {
                class: run === shown ? 'shown' : '', title: 'Show this run',
                onclick: () => { this._shown.set(test, run); this.render(); }
            },
                el('td', {}, el('span', { class: `test-badge ${run.ok ? 'ok' : 'failed'}` }, run.ok ? '✓' : '✗')),
                el('td', {}, when(run.at)),
                el('td', {}, HOW[run.how] ?? run.how),
                el('td', { class: 'test-run-state' }, run.decision ?? ''))))),
            shown ? el('div', { class: 'test-run-actions' },
                !shown.error && shown.result !== undefined ? el('button', { type: 'button', class: 'test-use-result',
                    title: 'Check that the decision keeps deciding this: its outputs (or that no rule matches) as the test\'s checks',
                    onclick: () => this._useAsChecks(test, shown) }, 'Use as checks') : null,
                el('button', { type: 'button', class: 'test-run-delete', title: 'Delete this run', onclick: () => {
                    test.runs = test.runs.filter(r => r !== shown);
                    this._shown.delete(test);
                    this._scheduleSave(); this.render();
                } }, 'Delete')) : null,
            shown ? this._renderOutcome(shown) : null);
    }

    /** A run's result as the test's checks: each output (=), or no rule matched; a list's size and first rule. */
    _useAsChecks(test, run) {
        const result = run.result;
        const first = Array.isArray(result) ? result[0] : result;
        const outputs = first && typeof first === 'object' ? Object.entries(first) : [];
        test.checks = [
            ...(result == null || Array.isArray(result) ? [{ kind: 'matches', op: '=', value: result == null ? 0 : result.length }] : []),
            ...outputs.map(([path, value]) => ({ kind: 'output', path: Array.isArray(result) ? `0.${path}` : path, op: '=', value }))
        ];
        this._section = 'design';
        this._scheduleSave();
        this._status('The checks now ask for this result');
        this.render();
    }

    _renderOutcome(run) {
        return el('div', { class: `test-result ${run.ok ? 'ok' : 'failed'}` },
            el('h4', {}, run.ok ? '✓ Passed' : '✗ Failed'),
            run.error ? el('p', { class: 'test-error' }, run.error) : null,
            run.checks?.length ? el('ul', { class: 'test-checks' }, run.checks.map(c =>
                el('li', { class: c.ok ? 'ok' : 'failed' }, `${c.ok ? '✓' : '✗'} ${c.what}`, !c.ok && c.actual !== undefined ? ` (is ${JSON.stringify(c.actual)})` : ''))) : null,
            run.error ? null : this._part('result', 'Result', el('pre', { class: 'test-data' }, JSON.stringify(run.result, null, 2)), { class: 'test-data-part' }),
            run.log?.length ? this._part('why', `Why: the rules matched (${run.log.length})`, el('ol', {}, run.log.map(line => el('li', {}, line))), { class: 'test-decisions' }) : null,
            this._part('inputs', 'Inputs', el('pre', { class: 'test-data' }, JSON.stringify(run.data ?? {}, null, 2))));
    }

    /** A part of the run shown (Result, Why, ...), open or closed as last left. */
    _part(key, summary, content, attrs = {}) {
        const details = el('details', { ...attrs, open: this._opened.has(key) }, el('summary', {}, summary), content);
        details.addEventListener('toggle', () => { if (details.open) this._opened.add(key); else this._opened.delete(key); });
        return details;
    }
}
