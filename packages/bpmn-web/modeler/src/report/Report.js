// The Report view: the whole process as one outline, from the model being edited, as its XML reads:
//
//   process: insuranceClaim, Insurance Claim Processing
//       serviceTask: validate, Validate Claim
//           implementation: validateClaim
//           sequenceFlow: flow2
//               targetRef: decision
//
// Each process, then its elements in flow order (start to end), each with its documentation, its settings
// (`key: value`), the data objects it loads and its problems; nested under it: the boundary events attached to
// it, a sub-process's elements (an event sub-process's, a loop's body), then its outgoing flows with their
// targets and conditions. Clicking an id goes back to the diagram with it selected. It is rebuilt with each
// check of the model (Problems), so it follows unsaved edits.
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

/** 'bpmn:UserTask' -> 'userTask', as the model's XML names it */
const localName = type => { const name = String(type || '').replace(/^\w+:/, ''); return name.charAt(0).toLowerCase() + name.slice(1); };

/** A setting's value in words: a reference by its name (or id), an expression by its body. */
function valueOf(value) {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value !== 'object') return String(value);
    if (is(value, 'bpmn:Expression') || is(value, 'bpmn:FormalExpression')) return value.get('body');
    return value.get?.('name') || value.id;
}

const SETTINGS = ['implementation', 'camunda:delegateExpression', 'camunda:expression', 'camunda:class', 'camunda:topic',
    'camunda:initiator', 'camunda:assignee', 'camunda:candidateUsers', 'camunda:candidateGroups', 'camunda:dueDate',
    'camunda:followUpDate', 'camunda:priority', 'camunda:formKey', 'calledElement', 'camunda:decisionRef',
    'camunda:resultVariable', 'camunda:mapDecisionResult', 'messageRef', 'instantiate', 'scriptFormat'];

/** An element's settings as `key: value` lines, from the model being edited: what bpmn-server reads of it. */
function settingsOf(bo) {
    const lines = [];
    const add = (key, value) => {
        const text = valueOf(value);
        if (text !== undefined && !String(text).startsWith('##')) lines.push([key, String(text)]);
    };
    for (const key of SETTINGS)
        if (bo.$descriptor?.propertiesByName?.[key] || bo.$attrs?.[key] !== undefined) add(key.replace(/^camunda:/, ''), bo.get(key));
    if (is(bo, 'bpmn:ScriptTask')) add('script', bo.get('script'));
    if (is(bo, 'bpmn:BoundaryEvent')) {
        add('attachedToRef', bo.get('attachedToRef')?.id);
        if (bo.get('cancelActivity') === false) add('cancelActivity', 'false (non-interrupting)');
    }
    for (const definition of bo.get('eventDefinitions') || []) {
        const kind = localName(definition.$type).replace(/EventDefinition$/, '');
        if (kind === 'timer') {
            for (const [key, label] of [['timeDuration', 'duration'], ['timeCycle', 'cycle'], ['timeDate', 'date']])
                if (definition.get(key)) add('timer', `${label} ${valueOf(definition.get(key))}`);
            if (!['timeDuration', 'timeCycle', 'timeDate'].some(k => definition.get(k))) add('timer', '(no duration, cycle or date)');
        }
        else if (kind === 'message') add('message', definition.get('messageRef') || '(none named)');
        else if (kind === 'signal') add('signal', definition.get('signalRef') || '(none named)');
        else if (kind === 'error') add('error', definition.get('errorRef') ? `${valueOf(definition.get('errorRef'))}${definition.get('errorRef').get('errorCode') ? ` (code ${definition.get('errorRef').get('errorCode')})` : ''}` : '(any)');
        else if (kind === 'escalation') add('escalation', definition.get('escalationRef') || '(any)');
        else if (kind === 'conditional') add('condition', definition.get('condition'));
        else add('event', kind);
    }
    const loop = bo.get('loopCharacteristics');
    if (loop) {
        if (is(loop, 'bpmn:MultiInstanceLoopCharacteristics')) {
            add('loop', `multi-instance, ${loop.get('isSequential') ? 'one after another' : 'in parallel'}`);
            add('collection', loop.get('camunda:collection'));
            add('elementVariable', loop.get('camunda:elementVariable'));
            add('loopCardinality', loop.get('loopCardinality'));
            add('completionCondition', loop.get('completionCondition'));
        }
        else add('loop', 'standard');
    }
    for (const extension of bo.get('extensionElements')?.get('values') || []) {
        if (is(extension, 'camunda:InputOutput')) {
            for (const p of extension.get('inputParameters') || []) add(`input ${p.get('name')}`, p.get('value') ?? valueOf(p.get('definition')) ?? '');
            for (const p of extension.get('outputParameters') || []) add(`output ${p.get('name')}`, p.get('value') ?? valueOf(p.get('definition')) ?? '');
        }
        else if (is(extension, 'camunda:FormData'))
            for (const f of extension.get('fields') || [])
                add('formField', `${f.get('id')} (${f.get('type') || 'string'})${f.get('label') && f.get('label') !== f.get('id') ? ` ${f.get('label')}` : ''}`);
        else if (is(extension, 'camunda:ExecutionListener') || is(extension, 'camunda:TaskListener')) {
            const script = extension.get('script');
            add(`on ${extension.get('event')}`, script ? (script.get('value') ?? script.get('resource') ?? '') : extension.get('expression') ?? extension.get('class') ?? extension.get('delegateExpression'));
        }
        else if (is(extension, 'camunda:Properties'))
            for (const p of extension.get('values') || []) add(`property ${p.get('name')}`, p.get('value'));
    }
    return lines;
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
        const issues = this._problems?.issues || [];
        const issuesOf = id => issues.filter(i => i.elementId === id)
            .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
        const processes = (definitions?.get('rootElements') || []).filter(e => is(e, 'bpmn:Process'));

        const issueList = list => list.length ? el('ul', { class: 'report-issues' },
            list.map(i => el('li', { class: `severity-${i.severity}` }, el('span', { class: 'severity' }, i.severity), ' ', i.message))) : null;

        const link = bo => el('a', { href: '#', class: 'report-id', onclick: event => { event.preventDefault(); this.reveal(bo.id); } }, bo.id);
        /** `type: id, name` */
        const head = (tag, bo, extra = null) => el(tag, { class: 'report-head' },
            el('span', { class: 'report-key' }, `${localName(bo.$type)}:`), ' ', link(bo),
            bo.get('name') ? el('span', { class: 'report-name' }, `, ${bo.get('name')}`) : null, extra);
        /** `key: value` lines; a value of several lines (a script) as a block */
        const settings = lines => lines.length ? el('div', { class: 'report-settings' },
            lines.map(([key, value]) => el('div', { class: 'report-line' },
                el('span', { class: 'report-key' }, `${key}:`), ' ',
                value.includes('\n') ? el('pre', { class: 'report-value' }, value) : el('span', { class: 'report-value' }, value)))) : null;

        /** An element's outgoing sequence flow: its target, its condition, whether it is the default; one back to an element placed before it is a loop. */
        const flowSection = (flow, placed) => {
            const from = flow.get('sourceRef'), to = flow.get('targetRef');
            const lines = [['targetRef', `${to?.id ?? '?'}${placed.has(to) ? ' (back to an earlier element: a loop)' : ''}`]];
            const condition = flow.get('conditionExpression');
            if (condition) lines.push(['conditionExpression', valueOf(condition) ?? '']);
            if (from?.get('default') === flow) lines.push(['default', 'yes: taken when no other flow\'s condition holds']);
            return el('section', { class: 'report-flow', 'data-element-id': flow.id },
                head('div', flow), el('div', { class: 'report-body' }, settings(lines), issueList(issuesOf(flow.id))));
        };

        /**
         * An element and what it holds, indented under it: its settings, the boundary events attached to it, the elements
         * of a sub-process (an event sub-process too, and the body of a loop), then its outgoing flows.
         */
        const elementSection = (bo, placed) => {
            placed.add(bo);
            const documentation = documentationOf(bo);
            const boundary = (bo.$parent?.get?.('flowElements') || []).filter(e => is(e, 'bpmn:BoundaryEvent') && e.get('attachedToRef') === bo);
            const children = is(bo, 'bpmn:SubProcess') ? inFlowOrder(bo).filter(e => !is(e, 'bpmn:BoundaryEvent')) : [];
            // the flows that leave it, by their sourceRef (a model need not list them as the element's outgoing)
            const outgoing = (bo.$parent?.get?.('flowElements') || []).filter(f => is(f, 'bpmn:SequenceFlow') && f.get('sourceRef') === bo);
            return el('section', { class: 'report-element', 'data-element-id': bo.id },
                head('h3', bo, bo.get('triggeredByEvent') ? el('span', { class: 'report-type' }, 'event sub-process') : null),
                el('div', { class: 'report-body' },
                    documentation ? el('p', { class: 'report-documentation' }, documentation) : null,
                    settings(settingsOf(bo)),
                    loadedBy(bo).length ? el('p', { class: 'report-loads' }, 'Loads ', loadedBy(bo).map(n => el('code', {}, dataField(n))).flatMap((c, i) => i ? [', ', c] : [c])) : null,
                    is(bo, 'bpmn:BusinessRuleTask') ? this.decisionSection(bo) : null,
                    issueList(issuesOf(bo.id)),
                    boundary.map(b => elementSection(b, placed)),
                    children.map(child => elementSection(child, placed)),
                    outgoing.map(flow => flowSection(flow, placed))));
        };

        const modelIssues = issues.filter(i => !i.elementId);
        const content = el('article', { class: 'report-document' },
            el('header', { class: 'report-title' },
                el('h1', {}, this._config.processName || 'Model'),
                el('p', { class: 'report-summary' }, summary(issues))),
            issueList(modelIssues),
            processes.map(process => el('section', { class: 'report-process', 'data-element-id': process.id },
                head('h2', process),
                documentationOf(process) ? el('p', { class: 'report-documentation' }, documentationOf(process)) : null,
                settings(settingsOf(process)),
                issueList(issuesOf(process.id)),
                (() => {
                    const placed = new Set();
                    return el('div', { class: 'report-body report-elements' },
                        inFlowOrder(process).filter(e => !is(e, 'bpmn:BoundaryEvent') || !e.get('attachedToRef')).map(element => elementSection(element, placed)));
                })(),
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
