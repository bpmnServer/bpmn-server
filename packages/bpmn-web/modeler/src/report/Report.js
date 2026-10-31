// The Report view: the whole process as one document, from the model being edited. Each process, then its
// elements in flow order (start to end, sub-processes inside their parent), with their documentation, how
// bpmn-server reads them (the engine's own description, as the instance page's Model documentation shows it)
// and their problems; then the flows that have conditions. Clicking an element goes back to the diagram with
// it selected. It is rebuilt with each check of the model (Problems), so it follows unsaved edits.
import { is, isAny, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { dataObjectName, dataField, loadersOf } from '../properties/DataObjectGroup.jsx';

const DATA_REFERENCES = ['bpmn:DataObjectReference', 'bpmn:DataStoreReference'];

/** The data objects an element loads (connected to it either way), by name. */
function loadedBy(bo) {
    const refs = [...(bo.get('dataInputAssociations') || []).flatMap(a => a.get('sourceRef') || []),
        ...(bo.get('dataOutputAssociations') || []).map(a => a.get('targetRef')).filter(Boolean)];
    return [...new Set(refs.map(dataObjectName))];
}

const SEVERITY_ORDER = { error: 0, warning: 1, info: 2 };

/** 'bpmn:UserTask' -> 'User task' */
function typeLabel(type) {
    const name = String(type || '').replace(/^bpmn:/, '').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function documentationOf(bo) {
    return (bo?.get('documentation') || []).map(d => d.get('text')).filter(Boolean).join('\n');
}

/**
 * A container's flow nodes in flow order: each after the elements that lead into it (a join after all its
 * branches), from the start events; a loop back is entered where it is first reached. Boundary events follow
 * the task they sit on; elements not reached from a start come last.
 */
function inFlowOrder(container) {
    const elements = (container.get('flowElements') || []).filter(e => !is(e, 'bpmn:SequenceFlow') && !isAny(e, DATA_REFERENCES));
    const flows = (container.get('flowElements') || []).filter(e => is(e, 'bpmn:SequenceFlow') && e.get('sourceRef') && e.get('targetRef'));
    const attached = new Map();
    for (const element of elements)
        if (is(element, 'bpmn:BoundaryEvent') && element.get('attachedToRef'))
            attached.set(element.get('attachedToRef'), [...(attached.get(element.get('attachedToRef')) || []), element]);
    const incoming = new Map(elements.map(e => [e, flows.filter(f => f.get('targetRef') === e).length]));
    const ordered = [], seen = new Set();
    const ready = elements.filter(e => is(e, 'bpmn:StartEvent'));
    const waiting = [];          // reached, but not by all their incoming flows yet
    const place = element => {
        if (seen.has(element)) return;
        seen.add(element);
        ordered.push(element);
        for (const next of [element, ...(attached.get(element) || [])]) {
            if (next !== element) { seen.add(next); ordered.push(next); }
            for (const flow of flows.filter(f => f.get('sourceRef') === next)) {
                const target = flow.get('targetRef');
                incoming.set(target, incoming.get(target) - 1);
                if (incoming.get(target) <= 0) ready.push(target);
                else if (!waiting.includes(target)) waiting.push(target);
            }
        }
    };
    while (ready.length || waiting.some(e => !seen.has(e))) {
        if (ready.length) place(ready.shift());
        else place(waiting.find(e => !seen.has(e)));     // a loop: enter it where it was first reached
    }
    for (const element of elements)
        if (!seen.has(element) && !is(element, 'bpmn:BoundaryEvent')) place(element);
    for (const element of elements)
        if (!seen.has(element)) place(element);
    return ordered;
}

function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === null || value === false) continue;
        if (key === 'class') node.className = value;
        else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
        else node.setAttribute(key, value);
    }
    for (const child of children.flat(Infinity))
        if (child !== undefined && child !== null && child !== false)
            node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    return node;
}

export default class Report {
    constructor(config, eventBus, bpmnjs, elementRegistry, canvas, selection, problems, injector) {
        this._config = config || {};
        this._eventBus = eventBus;
        this._bpmnjs = bpmnjs;
        this._elementRegistry = elementRegistry;
        this._canvas = canvas;
        this._selection = selection;
        this._problems = problems;
        this._decisions = injector.get('decisions', false);
        this._root = document.querySelector(this._config.container);
        this._visible = false;
        if (!this._root)
            return;
        eventBus.on('problems.changed', () => { if (this._visible) this.render(); });
        eventBus.on('import.done', () => { if (this._visible) this.render(); });
        eventBus.on('decisions.changed', () => { if (this._visible) this.render(); });
    }

    get visible() {
        return this._visible;
    }

    show() {
        this._visible = true;
        this.render();
    }

    hide() {
        this._visible = false;
    }

    /** Back to the diagram, with the element selected and in view. */
    reveal(id) {
        this._eventBus.fire('report.reveal', { id });
        const element = this._elementRegistry.get(id)
            || this._elementRegistry.find(e => is(e, 'bpmn:Participant') && getBusinessObject(e).get('processRef')?.id === id);
        if (!element)
            return;
        if (element !== this._canvas.getRootElement())
            this._canvas.scrollToElement(element);
        this._selection.select(element);
    }

    render() {
        if (!this._root)
            return;
        const definitions = this._bpmnjs.getDefinitions();
        const descriptions = this._problems?.descriptions || {};
        const issues = this._problems?.issues || [];
        const issuesOf = id => issues.filter(i => i.elementId === id)
            .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
        const processes = (definitions?.get('rootElements') || []).filter(e => is(e, 'bpmn:Process'));

        const issueList = list => list.length ? el('ul', { class: 'report-issues' },
            list.map(i => el('li', { class: `severity-${i.severity}` }, el('span', { class: 'severity' }, i.severity), ' ', i.message))) : null;

        const description = id => {
            const lines = descriptions[id] || [];
            return lines.length ? el('dl', { class: 'report-description' },
                lines.map(([label, value]) => [el('dt', {}, label), el('dd', {}, value)])) : null;
        };

        const elementSection = (bo, depth) => {
            const documentation = documentationOf(bo);
            const children = is(bo, 'bpmn:SubProcess') ? inFlowOrder(bo) : [];
            return [
                el('section', { class: 'report-element', 'data-element-id': bo.id, style: depth ? `margin-left:${depth * 24}px` : null },
                    el('h3', {},
                        el('a', { href: '#', onclick: event => { event.preventDefault(); this.reveal(bo.id); } }, bo.get('name') || bo.id),
                        el('span', { class: 'report-type' }, typeLabel(bo.$type), bo.get('name') ? ` · ${bo.id}` : '')),
                    documentation ? el('p', { class: 'report-documentation' }, documentation) : null,
                    loadedBy(bo).length ? el('p', { class: 'report-loads' }, 'Loads ', loadedBy(bo).map(n => el('code', {}, dataField(n))).flatMap((c, i) => i ? [', ', c] : [c])) : null,
                    description(bo.id),
                    is(bo, 'bpmn:BusinessRuleTask') ? this.decisionSection(bo) : null,
                    issueList(issuesOf(bo.id))),
                ...children.flatMap(child => elementSection(child, depth + 1))
            ];
        };

        const conditionalFlows = container => {
            const all = [];
            const walk = c => (c.get('flowElements') || []).forEach(e => {
                if (is(e, 'bpmn:SequenceFlow') && (e.get('conditionExpression') || descriptions[e.id]?.length || issuesOf(e.id).length))
                    all.push(e);
                if (is(e, 'bpmn:SubProcess')) walk(e);
            });
            walk(container);
            return all;
        };

        const flowRow = flow => {
            const from = flow.get('sourceRef'), to = flow.get('targetRef');
            const source = from?.get('default') === flow ? ' (default)' : '';
            return el('tr', { 'data-element-id': flow.id },
                el('td', {}, el('a', { href: '#', onclick: event => { event.preventDefault(); this.reveal(flow.id); } }, flow.get('name') || flow.id)),
                el('td', {}, `${from?.get('name') || from?.id || '?'} → ${to?.get('name') || to?.id || '?'}${source}`),
                el('td', {}, flow.get('conditionExpression')?.get('body') || ''),
                el('td', {}, issueList(issuesOf(flow.id))));
        };

        const modelIssues = issues.filter(i => !i.elementId);
        const content = el('article', { class: 'report-document' },
            el('header', { class: 'report-title' },
                el('h1', {}, this._config.processName || 'Model'),
                el('p', { class: 'report-summary' }, summary(issues))),
            issueList(modelIssues),
            processes.map(process => el('section', { class: 'report-process', 'data-element-id': process.id },
                el('h2', {}, process.get('name') || process.id, el('span', { class: 'report-type' }, `Process · ${process.id}`)),
                documentationOf(process) ? el('p', { class: 'report-documentation' }, documentationOf(process)) : null,
                description(process.id),
                issueList(issuesOf(process.id)),
                (() => {
                    const refs = [];
                    const walk = c => (c.get('flowElements') || []).forEach(e => { if (isAny(e, DATA_REFERENCES)) refs.push(e); if (is(e, 'bpmn:SubProcess')) walk(e); });
                    walk(process);
                    return refs.length ? [
                        el('h3', { class: 'report-flows-title' }, 'Data objects'),
                        el('table', { class: 'report-flows report-data-objects' },
                            el('thead', {}, el('tr', {}, el('th', {}, 'Data object'), el('th', {}, 'In the data'), el('th', {}, 'Loaded when these run'))),
                            el('tbody', {}, refs.map(ref => el('tr', { 'data-element-id': ref.id },
                                el('td', {}, el('a', { href: '#', onclick: event => { event.preventDefault(); this.reveal(ref.id); } }, dataObjectName(ref))),
                                el('td', {}, dataField(dataObjectName(ref))),
                                el('td', {}, loadersOf(ref).map(e => e.get('name') || e.id).join(', ') || 'nothing: never loaded')))))
                    ] : null;
                })(),
                inFlowOrder(process).flatMap(element => elementSection(element, 0)),
                (() => {
                    const flows = conditionalFlows(process);
                    return flows.length ? [
                        el('h3', { class: 'report-flows-title' }, 'Conditions'),
                        el('table', { class: 'report-flows' },
                            el('thead', {}, el('tr', {}, el('th', {}, 'Flow'), el('th', {}, 'From → to'), el('th', {}, 'Condition'), el('th', {}, ''))),
                            el('tbody', {}, flows.map(flowRow)))
                    ] : null;
                })())));
        this._root.replaceChildren(content);
    }
}

/** A business rule task's decision: its table (hit policy, inputs, outputs, rules) or expression, and where the result goes. */
Report.prototype.decisionSection = function (bo) {
    const ref = bo.get('camunda:decisionRef');
    const result = bo.get('camunda:resultVariable');
    const saved = result ? el('p', { class: 'report-loads' }, 'Result saved in ', el('code', {}, `data.${result}`),
        bo.get('camunda:mapDecisionResult') ? ` (${bo.get('camunda:mapDecisionResult')})` : '') : null;
    if (!ref)
        return el('div', { class: 'report-decision' }, el('p', {}, 'No decision named.'));
    const found = this._decisions?.find(ref);
    if (!found || !found.decision)
        return el('div', { class: 'report-decision' }, el('p', {}, 'Decision ', el('code', {}, ref),
            this._decisions?.loaded ? ': not found in the models folder.' : '.'), saved);
    const { file, decision } = found;
    const title = el('p', { class: 'report-decision-title' }, 'Decision ', el('strong', {}, decision.name), ` · ${file.file}`);
    if (decision.literal)
        return el('div', { class: 'report-decision' }, title, el('p', {}, el('code', {}, `${decision.literal.variable} = ${decision.literal.text}`)), saved);
    const t = decision.table;
    if (!t)
        return el('div', { class: 'report-decision' }, title, saved);
    return el('div', { class: 'report-decision' }, title,
        el('table', { class: 'report-flows report-decision-table' },
            el('caption', {}, `${t.hitPolicy}${t.aggregation ? ' ' + t.aggregation : ''}`),
            el('thead', {}, el('tr', {}, el('th', {}, '#'),
                t.inputs.map(i => el('th', { class: 'decision-input' }, i.label && i.label !== i.expression ? `${i.label} (${i.expression})` : i.expression)),
                t.outputs.map(o => el('th', { class: 'decision-output' }, o.name)),
                el('th', {}, ''))),
            el('tbody', {}, t.rules.map((r, n) => el('tr', {}, el('td', {}, String(n + 1)),
                t.inputs.map((_, c) => el('td', { class: 'decision-input' }, r.inputs[c] ?? '')),
                t.outputs.map((_, c) => el('td', { class: 'decision-output' }, r.outputs[c] ?? '')),
                el('td', {}, r.description))))),
        saved);
};

function summary(issues) {
    const count = severity => issues.filter(i => i.severity === severity).length;
    const parts = [['error', count('error')], ['warning', count('warning')]].filter(([, n]) => n)
        .map(([s, n]) => `${n} ${s}${n === 1 ? '' : 's'}`);
    return parts.length ? `Problems: ${parts.join(', ')}` : 'No problems found';
}

Report.$inject = ['config.report', 'eventBus', 'bpmnjs', 'elementRegistry', 'canvas', 'selection', 'problems', 'injector'];
