// The Problems list: checks the model with bpmn-server (POST config.problems.url, verifyModel) as it is
// edited, adds the Camunda settings bpmn-server does not run (unsupported.js), lists the issues, marks their
// elements on the canvas and their fields in the properties panel, and takes the user to the element and
// field when an issue is clicked.
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { fieldsFor } from './fields.js';
import { findUnsupported } from './unsupported.js';

const CHECK_DELAY = 800;
const SEVERITIES = ['error', 'warning', 'info'];

export default class Problems {
    constructor(config, eventBus, bpmnjs, canvas, elementRegistry, selection, overlays) {
        this._config = config || {};
        this._eventBus = eventBus;
        this._bpmnjs = bpmnjs;
        this._canvas = canvas;
        this._elementRegistry = elementRegistry;
        this._selection = selection;
        this._overlays = overlays;
        this._issues = [];
        this._marked = [];
        this._run = 0;
        this._timer = null;

        this._root = document.querySelector(this._config.container);
        if (!this._root || !this._config.url)
            return;
        this._renderShell();

        eventBus.on('import.done', () => this.check());
        eventBus.on('commandStack.changed', () => this._schedule());
        eventBus.on(['selection.changed', 'propertiesPanel.updated'], () => this._showDiagnostics());
    }

    /** The current issues, as verifyModel returned them. */
    get issues() {
        return this._issues;
    }

    _schedule() {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => this.check(), CHECK_DELAY);
    }

    /** Check the model now; a check started later wins over one still running. */
    async check() {
        clearTimeout(this._timer);
        const run = ++this._run;
        this._setStatus('Checking…');
        try {
            const { xml } = await this._bpmnjs.saveXML();
            const response = await fetch(this._config.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bpmn: xml, processName: this._config.processName })
            });
            if (!response.ok)
                throw new Error(`${response.status} ${response.statusText}`);
            const result = await response.json();
            if (run !== this._run)
                return;
            const rank = { error: 0, warning: 1, info: 2 };
            this._issues = [...(result.issues || []), ...findUnsupported(this._bpmnjs.getDefinitions())]
                .sort((a, b) => rank[a.severity] - rank[b.severity]);
            this._render();
            this._eventBus.fire('problems.changed', { issues: this._issues });
        } catch (err) {
            if (run === this._run)
                this._setStatus('Could not check the model: ' + err.message, true);
        }
    }

    /** The diagram element an issue is about: its own shape, the pool of its process, or the root. */
    _elementOf(issue) {
        const id = issue.elementId;
        if (!id)
            return null;
        const element = this._elementRegistry.get(id);
        if (element)
            return element;
        const pool = this._elementRegistry.find(e => e.type === 'bpmn:Participant' && getBusinessObject(e).processRef?.id === id);
        if (pool)
            return pool;
        const root = this._canvas.getRootElement();
        return getBusinessObject(root)?.id === id ? root : null;
    }

    /** Select the issue's element, bring it into view and open the field it is about. */
    reveal(issue) {
        const element = this._elementOf(issue);
        if (!element)
            return;
        this._eventBus.fire('problems.reveal', { issue, element });
        if (element !== this._canvas.getRootElement())
            this._canvas.scrollToElement(element);
        this._selection.select(element);
        // after the panel shows the element; of fields that are alternatives (a condition as an expression
        // or as a script) only the one shown answers
        const fields = fieldsFor(issue, element);
        if (fields.length)
            setTimeout(() => fields.forEach(id => this._eventBus.fire('propertiesPanel.showEntry', { id, focus: true })), 0);
    }

    // ---- the panel: issues of the selected element, on their fields

    _showDiagnostics() {
        const [element] = this._selection.get();
        const current = element || this._canvas.getRootElement();
        const diagnostics = {};
        for (const issue of this._issues) {
            if (this._elementOf(issue) !== current)
                continue;
            for (const id of fieldsFor(issue, current))
                (diagnostics[id] ||= []).push({ severity: issue.severity, message: issue.message });
        }
        const key = JSON.stringify(diagnostics);
        if (key === this._lastDiagnostics)    // setDiagnostics re-renders the panel, which calls back here
            return;
        this._lastDiagnostics = key;
        this._eventBus.fire('propertiesPanel.setDiagnostics', { diagnostics });
    }

    // ---- the list and the canvas

    _renderShell() {
        this._root.classList.add('problems');
        this._root.innerHTML = `
            <button type="button" class="problems-header" aria-expanded="true">
                <span class="problems-title">Problems</span>
                <span class="problems-counts"></span>
                <span class="problems-status" role="status"></span>
            </button>
            <ul class="problems-list"></ul>`;
        this._header = this._root.querySelector('.problems-header');
        this._list = this._root.querySelector('.problems-list');
        this._header.addEventListener('click', () => this.toggle());
        this._list.addEventListener('click', event => this._onItem(event));
        this._list.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this._onItem(event);
            }
        });
    }

    toggle(open = this._root.classList.contains('collapsed')) {
        this._root.classList.toggle('collapsed', !open);
        this._header.setAttribute('aria-expanded', String(open));
        this._eventBus.fire('problems.toggled', { open });
    }

    _onItem(event) {
        const item = event.target.closest('.problem');
        if (item)
            this.reveal(this._issues[Number(item.dataset.index)]);
    }

    _setStatus(text, isError = false) {
        const status = this._root.querySelector('.problems-status');
        status.textContent = text;
        status.classList.toggle('error', isError);
    }

    _render() {
        const counts = SEVERITIES.map(severity => [severity, this._issues.filter(i => i.severity === severity).length]);
        this._root.querySelector('.problems-counts').innerHTML = counts
            .filter(([, n]) => n > 0)
            .map(([severity, n]) => `<span class="count severity-${severity}" title="${n} ${severity}${n === 1 ? '' : 's'}">${n}</span>`)
            .join('');
        this._setStatus(this._issues.length ? '' : 'No problems found');

        this._list.replaceChildren(...this._issues.map((issue, index) => {
            const item = document.createElement('li');
            item.className = `problem severity-${issue.severity}`;
            item.dataset.index = index;
            item.dataset.code = issue.code;
            const element = this._elementOf(issue);
            if (element)
                item.tabIndex = 0;
            const where = issue.elementName || issue.elementId || '';
            item.innerHTML = '<span class="severity"></span><span class="message"></span><span class="where"></span>';
            item.querySelector('.severity').textContent = issue.severity;
            item.querySelector('.message').textContent = issue.message;
            item.querySelector('.where').textContent = where;
            return item;
        }));
        this._mark();
        this._lastDiagnostics = null;
        this._showDiagnostics();
    }

    /** Outline the elements with issues and badge them with their count. */
    _mark() {
        for (const element of this._marked)
            SEVERITIES.forEach(severity => this._canvas.removeMarker(element, `problem-${severity}`));
        this._overlays.remove({ type: 'problems' });
        this._marked = [];

        const byElement = new Map();
        for (const issue of this._issues) {
            const element = this._elementOf(issue);
            if (element && element !== this._canvas.getRootElement())
                byElement.set(element, [...(byElement.get(element) || []), issue]);
        }
        for (const [element, issues] of byElement) {
            const worst = SEVERITIES.find(severity => issues.some(i => i.severity === severity));
            this._canvas.addMarker(element, `problem-${worst}`);
            this._marked.push(element);
            const badge = document.createElement('div');
            badge.className = `problem-badge severity-${worst}`;
            badge.textContent = issues.length;
            badge.title = issues.map(i => i.message).join('\n');
            badge.addEventListener('click', () => this.reveal(issues[0]));
            this._overlays.add(element, 'problems', { position: { top: -10, right: 10 }, html: badge });
        }
    }
}

Problems.$inject = ['config.problems', 'eventBus', 'bpmnjs', 'canvas', 'elementRegistry', 'selection', 'overlays'];
