// The Report view: the whole process as one outline, from the model being edited, as its XML reads:
//
//   process: insuranceClaim, Insurance Claim Processing
//       serviceTask: validate, Validate Claim
//           implementation: validateClaim
//           sequenceFlow: flow2
//               targetRef: decision
//
// First the model's globals (its messages, signals, errors and escalations, with what uses each) and its pools
// and lanes (each pool's process, each lane's elements, the message flows between pools). Then each process, then
// its elements in flow order (start to end), each with its documentation, its settings
// (`key: value`), the data objects it loads and its problems; nested under it: the boundary events attached to
// it, a sub-process's elements (an event sub-process's, a loop's body), then its outgoing flows with their
// targets and conditions. Clicking an id goes back to the diagram with it selected. It is rebuilt with each
// check of the model (Problems), so it follows unsaved edits.
import { is, isAny, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { dataObjectName, dataField, loadersOf } from '../properties/dataObjects.js';

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
        // what else the event definition sets (a service on a message event, ...)
        for (const [key, value] of otherSettings(definition, kind, new Set(['id', 'timeDuration', 'timeCycle', 'timeDate',
            'messageRef', 'signalRef', 'errorRef', 'escalationRef', 'condition'])))
            lines.push([key, value]);
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
            for (const p of extension.get('inputParameters') || []) lines.push([`input ${p.get('name')}`, p.get('value') ?? valueOf(p.get('definition')) ?? '']);
            for (const p of extension.get('outputParameters') || []) lines.push([`output ${p.get('name')}`, p.get('value') ?? valueOf(p.get('definition')) ?? '']);
        }
        else if (is(extension, 'camunda:FormData'))
            for (const f of extension.get('fields') || [])
                add('formField', `${f.get('id')} (${f.get('type') || 'string'})${f.get('label') && f.get('label') !== f.get('id') ? ` ${f.get('label')}` : ''}`);
        else if (is(extension, 'camunda:ExecutionListener') || is(extension, 'camunda:TaskListener')) {
            const script = extension.get('script');
            add(`on ${extension.get('event')}${script?.get('scriptFormat') ? ` (${script.get('scriptFormat')})` : ''}`,
                script ? (script.get('value') ?? script.get('resource') ?? '') : extension.get('expression') ?? extension.get('class') ?? extension.get('delegateExpression'));
        }
        else if (is(extension, 'camunda:Properties'))
            for (const p of extension.get('values') || []) add(`property ${p.get('name')}`, p.get('value'));
        else if (is(extension, 'camunda:Connector')) {
            add('connector', extension.get('connectorId') || '(none named)');
            const io = extension.get('inputOutput');
            for (const p of io?.get('inputParameters') || []) add(`connector input ${p.get('name')}`, p.get('value') ?? valueOf(p.get('definition')) ?? '');
            for (const p of io?.get('outputParameters') || []) add(`connector output ${p.get('name')}`, p.get('value') ?? valueOf(p.get('definition')) ?? '');
        }
        else
            for (const [key, value] of otherSettings(extension, localName(extension.$type))) lines.push([key, value]);
    }
    // the form fields' details, and whatever else the element sets that the lines above do not say
    for (const extension of bo.get('extensionElements')?.get('values') || [])
        if (is(extension, 'camunda:FormData'))
            for (const f of extension.get('fields') || [])
                for (const [key, value] of otherSettings(f, `formField ${f.get('id')}`, FORM_FIELD_SAID)) lines.push([key, value]);
    for (const [key, value] of otherSettings(bo, '', SAID)) lines.push([key, value]);
    return lines;
}

/** What the report says of an element in its own words (its head, settingsOf, its sections), so not again as-is. */
const SAID = new Set(['id', 'name', 'documentation', 'flowElements', 'artifacts', 'laneSets', 'incoming', 'outgoing',
    'sourceRef', 'targetRef', 'conditionExpression', 'default', 'eventDefinitions', 'loopCharacteristics', 'extensionElements',
    'dataInputAssociations', 'dataOutputAssociations', 'attachedToRef', 'cancelActivity', 'triggeredByEvent', 'script',
    'lanes', 'flowNodeRef', 'childLaneSet', 'participants', 'messageFlows', 'processRef', 'rootElements', 'diagrams',
    'categoryValueRef', 'di', 'ioSpecification', 'properties',
    ...SETTINGS]);
const FORM_FIELD_SAID = new Set(['id', 'type', 'label']);

/**
 * Every setting of a model part the report does not say in its own words, as `key: value` lines (a part inside
 * it as `key.part: value`): so that the report holds the whole model. Settings at their default are left out.
 */
function otherSettings(part, prefix, said = new Set(['id'])) {
    const lines = [];
    const join = key => prefix ? `${prefix} ${key}` : key;
    if (part.$descriptor?.isGeneric) {
        for (const [key, value] of Object.entries(part))
            if (!key.startsWith('$') && value !== undefined && value !== null && typeof value !== 'object')
                lines.push([join(key), String(value)]);
        if (part.$body)
            lines.push([join('body'), part.$body]);
        for (const child of part.$children || [])
            lines.push(...otherSettings(child, join(localName(child.$type)), new Set()));
        return lines;
    }
    for (const property of part.$descriptor?.properties || []) {
        // camunda:assignee is `assignee` in its descriptor, and in the lines
        const key = property.name.replace(/^camunda:/, '');
        const full = property.ns?.prefix && property.ns.prefix !== 'bpmn' ? `${property.ns.prefix}:${key}` : key;
        if (said.has(property.name) || said.has(key) || said.has(full) || property.isVirtual)
            continue;
        const value = part.get(property.name);
        if (value === undefined || value === null || value === '' || value === property.default || (Array.isArray(value) && !value.length))
            continue;
        if (property.isReference)
            lines.push([join(key), (Array.isArray(value) ? value : [value]).map(v => v?.id ?? String(v)).join(', ')]);
        else if (Array.isArray(value) || (typeof value === 'object' && value.$type)) {
            const parts = Array.isArray(value) ? value : [value];
            parts.forEach((v, n) => {
                if (typeof v !== 'object' || !v.$type)
                    lines.push([join(key), String(v)]);
                else if (v.id && /^bpmn:/.test(v.$type))
                    lines.push([join(key), v.id]);          // an element of its own, in its own section
                else if (is(v, 'bpmn:Expression') || is(v, 'bpmn:FormalExpression'))
                    lines.push([join(key), v.get('body') ?? '']);
                else {
                    // a part of another namespace keeps its id (a camunda:Value's id is the value)
                    const inner = otherSettings(v, join(`${key}${parts.length > 1 ? `[${n + 1}]` : ''}`), /^bpmn:/.test(v.$type) ? undefined : new Set());
                    lines.push(...(inner.length ? inner : [[join(key), localName(v.$type)]]));
                }
            });
        }
        else
            lines.push([join(key), String(value)]);
    }
    for (const [name, value] of Object.entries(part.$attrs || {}))
        if (!name.startsWith('xmlns') && !said.has(name))
            lines.push([join(name), String(value)]);
    return lines;
}

/** A process's text annotations and the associations that tie them to elements (in its sub-processes too). */
function annotationsOf(container) {
    const artifacts = container.get('artifacts') || [];
    return [...artifacts.filter(a => is(a, 'bpmn:TextAnnotation')).map(a => `${a.id}: ${a.get('text') ?? ''}`),
        ...artifacts.filter(a => is(a, 'bpmn:Association')).map(a => `association: ${a.get('sourceRef')?.id ?? '?'} → ${a.get('targetRef')?.id ?? '?'}`
            + (a.get('associationDirection') && a.get('associationDirection') !== 'None' ? ` (${a.get('associationDirection')})` : '')),
        ...(container.get('flowElements') || []).filter(e => is(e, 'bpmn:SubProcess')).flatMap(annotationsOf)];
}

/**
 * The report as plain text: one line per heading, setting, list item and table row (its cells joined by ' | '),
 * what an element holds indented under it by four spaces; a value of several lines (a script) indented under its
 * key.
 */
export function outlineText(root) {
    const lines = [];
    const pad = depth => '    '.repeat(depth);
    const flat = node => node.textContent.replace(/\s+/g, ' ').trim();
    // a section's heading at its depth, everything else in it one deeper: each line under the lines it belongs to
    const emit = (node, depth) => {
        if (node.matches('section')) {
            for (const child of node.children)
                emit(child, child.matches('h1, h2, h3, .report-head') ? depth : depth + 1);
        }
        else if (node.matches('article, header, .report-body, div.report-settings, ul, table, thead, tbody, div.report-decision'))
            for (const child of node.children)
                emit(child, depth);
        else if (node.matches('tr'))
            lines.push(pad(depth) + [...node.children].map(flat).join(' | '));
        else if (node.matches('.report-line') && node.querySelector('pre')) {
            lines.push(pad(depth) + flat(node.querySelector('.report-key')));
            for (const line of node.querySelector('pre').textContent.split('\n'))
                lines.push(pad(depth + 1) + line.trimEnd());
        }
        else if (flat(node))
            lines.push(pad(depth) + flat(node));
    };
    emit(root, 0);
    return lines.join('\n') + '\n';
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
        this._root.replaceChildren(this.document(this._bpmnjs.getDefinitions(), true));
    }

    /**
     * The model (any version of it: `definitions` read by moddle) as plain text, an outline of indented lines: the
     * report without the editor's problems and the decisions' tables (they are not in the model). History compares
     * two versions by this text.
     */
    text(definitions) {
        return outlineText(this.document(definitions, false));
    }

    /**
     * The report of `definitions`, as an element. `live`: the model in the editor, with its problems, its title and
     * its decisions' tables.
     */
    document(definitions, live) {
        const issues = live ? this._problems?.issues || [] : [];
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
            if (condition) lines.push([`conditionExpression${condition.get('language') ? ` (${condition.get('language')})` : ''}`, valueOf(condition) ?? '']);
            if (from?.get('default') === flow) lines.push(['default', 'yes: taken when no other flow\'s condition holds']);
            lines.push(...settingsOf(flow));        // its scripts, and anything else it sets
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
                    live && is(bo, 'bpmn:BusinessRuleTask') ? this.decisionSection(bo) : null,
                    issueList(issuesOf(bo.id)),
                    boundary.map(b => elementSection(b, placed)),
                    children.map(child => elementSection(child, placed)),
                    outgoing.map(flow => flowSection(flow, placed))));
        };

        const modelIssues = issues.filter(i => !i.elementId);
        const content = el('article', { class: 'report-document' },
            live ? el('header', { class: 'report-title' },
                el('h1', {}, this._config.processName || 'Model'),
                el('p', { class: 'report-summary' }, summary(issues))) : null,
            issueList(modelIssues),
            // a model with pools: what the editor shows with nothing selected
            (definitions?.get('rootElements') || []).filter(root => is(root, 'bpmn:Collaboration') && documentationOf(root))
                .map(root => el('p', { class: 'report-documentation' }, documentationOf(root))),
            this.globalsSection(definitions),
            this.poolsSection(definitions),
            this.otherSection(definitions),
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
                annotationsOf(process).length ? [
                    el('h3', { class: 'report-flows-title' }, 'Annotations'),
                    el('ul', { class: 'report-annotations' }, annotationsOf(process).map(a => el('li', {}, a)))
                ] : null,
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
        return content;
    }
}

/** The model-wide definitions an element names: [type, kind, the reference to it, its code]. */
const GLOBALS = [
    ['bpmn:Message', 'message', 'messageRef'],
    ['bpmn:Signal', 'signal', 'signalRef'],
    ['bpmn:Error', 'error', 'errorRef', 'errorCode'],
    ['bpmn:Escalation', 'escalation', 'escalationRef', 'escalationCode']
];

/** Every flow element of a container, those of its sub-processes too. */
function allFlowElements(container) {
    return (container.get('flowElements') || []).flatMap(e => [e, ...(is(e, 'bpmn:SubProcess') ? allFlowElements(e) : [])]);
}

/** What an element does with a message, signal, error or escalation it names. */
function useOf(bo) {
    if (is(bo, 'bpmn:MessageFlow')) return 'message flow';
    if (is(bo, 'bpmn:SendTask')) return 'sends';
    if (is(bo, 'bpmn:ReceiveTask')) return 'receives';
    if (is(bo, 'bpmn:ThrowEvent')) return 'throws';
    if (is(bo, 'bpmn:CatchEvent')) return 'catches';
    return 'uses';
}

/** The report's link to an element: its name (or id), selecting it on the diagram. */
Report.prototype.link = function (bo, text) {
    return el('a', { href: '#', class: 'report-id', onclick: event => { event.preventDefault(); this.reveal(bo.id); } }, text ?? (bo.get('name') || bo.id));
};

/**
 * Globals: the messages, signals, errors and escalations of the model, each with its code and the elements that
 * throw, catch, send or receive it (a message flow carrying a message too).
 */
Report.prototype.globalsSection = function (definitions) {
    const roots = definitions?.get('rootElements') || [];
    const globals = roots.filter(r => GLOBALS.some(([type]) => is(r, type)));
    if (!globals.length)
        return null;
    const users = new Map(globals.map(g => [g, []]));
    const note = (bo, ref) => { if (ref && users.has(ref)) users.get(ref).push(bo); };
    const elements = [
        ...roots.filter(r => is(r, 'bpmn:Process')).flatMap(allFlowElements),
        ...roots.filter(r => is(r, 'bpmn:Collaboration')).flatMap(c => c.get('messageFlows') || [])
    ];
    for (const bo of elements) {
        if (bo.$descriptor?.propertiesByName?.messageRef) note(bo, bo.get('messageRef'));
        for (const definition of bo.get?.('eventDefinitions') || [])
            for (const [, , ref] of GLOBALS)
                if (definition.$descriptor?.propertiesByName?.[ref]) note(bo, definition.get(ref));
    }
    return el('section', { class: 'report-process report-globals' },
        el('h2', {}, 'Globals'),
        el('table', { class: 'report-flows' },
            el('thead', {}, el('tr', {}, el('th', {}, 'Kind'), el('th', {}, 'Name'), el('th', {}, 'Code'), el('th', {}, 'Used by'))),
            el('tbody', {}, GLOBALS.flatMap(([type, kind, , code]) => globals.filter(g => is(g, type)).map(g => {
                const used = users.get(g);
                return el('tr', { 'data-global-id': g.id },
                    el('td', {}, kind),
                    el('td', {}, g.get('name') || g.id, g.get('name') && g.get('name') !== g.id ? [' ', el('span', { class: 'report-type' }, `(${g.id})`)] : null),
                    el('td', {}, code ? g.get(code) ?? '' : ''),
                    el('td', {}, used.length
                        ? used.flatMap((bo, i) => [i ? ', ' : '', this.link(bo), ` ${useOf(bo)}`])
                        : 'not used'));
            })))));
};

/**
 * Pools and lanes: each pool (participant) with its process, each process's lanes with the elements in them, and
 * the message flows between pools.
 */
Report.prototype.poolsSection = function (definitions) {
    const roots = definitions?.get('rootElements') || [];
    const participants = roots.filter(r => is(r, 'bpmn:Collaboration')).flatMap(c => c.get('participants') || []);
    const messageFlows = roots.filter(r => is(r, 'bpmn:Collaboration')).flatMap(c => c.get('messageFlows') || []);
    const processes = roots.filter(r => is(r, 'bpmn:Process'));
    const lanesOf = (laneSet, path = []) => (laneSet?.get('lanes') || []).flatMap(lane => {
        const name = [...path, lane.get('name') || lane.id];
        return [{ lane, name: name.join(' / ') }, ...lanesOf(lane.get('childLaneSet'), name)];
    });
    const lanes = processes.flatMap(p => (p.get('laneSets') || []).flatMap(set => lanesOf(set)).map(l => ({ ...l, process: p })));
    if (!participants.length && !lanes.length)
        return null;
    const named = bo => bo.get('name') ? `${bo.get('name')} (${bo.id})` : bo.id;
    const pool = participant => participant ? this.link(participant, named(participant)) : '?';
    const collaborations = roots.filter(r => is(r, 'bpmn:Collaboration') && r.get('name'));
    const ownerOf = bo => participants.find(p => p === bo || p.get('processRef') === bo || p.get('processRef') === bo?.$parent);
    return el('section', { class: 'report-process report-pools' },
        el('h2', {}, 'Pools and lanes'),
        collaborations.map(c => el('p', {}, `collaboration: ${c.get('name')}`)),
        participants.length ? [
            el('h3', { class: 'report-flows-title' }, 'Pools'),
            el('table', { class: 'report-flows' },
                el('thead', {}, el('tr', {}, el('th', {}, 'Pool'), el('th', {}, 'Process'))),
                el('tbody', {}, participants.map(p => el('tr', { 'data-element-id': p.id },
                    el('td', {}, pool(p)),
                    el('td', {}, p.get('processRef')
                        ? [p.get('processRef').get('name') || p.get('processRef').id, p.get('processRef').get('isExecutable') ? '' : ' (not executable)']
                        : 'none: a pool with no process (another party)')))))
        ] : null,
        lanes.length ? [
            el('h3', { class: 'report-flows-title' }, 'Lanes'),
            el('table', { class: 'report-flows' },
                el('thead', {}, el('tr', {}, el('th', {}, 'Lane'), el('th', {}, 'Process'), el('th', {}, 'Elements'))),
                el('tbody', {}, lanes.map(({ lane, name, process }) => el('tr', { 'data-element-id': lane.id },
                    el('td', {}, this.link(lane, `${name} (${lane.id})`)),
                    el('td', {}, process.get('name') || process.id),
                    el('td', {}, (lane.get('flowNodeRef') || []).length
                        ? lane.get('flowNodeRef').flatMap((bo, i) => [i ? ', ' : '', this.link(bo)])
                        : 'none')))))
        ] : null,
        messageFlows.length ? [
            el('h3', { class: 'report-flows-title' }, 'Message flows'),
            el('table', { class: 'report-flows' },
                el('thead', {}, el('tr', {}, el('th', {}, 'Flow'), el('th', {}, 'From'), el('th', {}, 'To'), el('th', {}, 'Message'))),
                el('tbody', {}, messageFlows.map(flow => {
                    const from = flow.get('sourceRef'), to = flow.get('targetRef');
                    const end = bo => !bo ? '?' : is(bo, 'bpmn:Participant') ? pool(bo) : [this.link(bo), ownerOf(bo) ? ` (${ownerOf(bo).get('name') || ownerOf(bo).id})` : ''];
                    return el('tr', { 'data-element-id': flow.id },
                        el('td', {}, this.link(flow, named(flow))), el('td', {}, end(from)), el('td', {}, end(to)),
                        el('td', {}, flow.get('messageRef') ? flow.get('messageRef').get('name') || flow.get('messageRef').id : 'none named'));
                })))
        ] : null);
};

/** The model's other definitions (data stores, item definitions, ...): each with its settings. */
Report.prototype.otherSection = function (definitions) {
    const shown = ['bpmn:Process', 'bpmn:Collaboration', ...GLOBALS.map(([type]) => type)];
    const others = (definitions?.get('rootElements') || []).filter(r => !shown.some(type => is(r, type)));
    const own = otherSettings(definitions || { $descriptor: { properties: [] } }, '',
        new Set(['id', 'rootElements', 'diagrams', 'exporter', 'exporterVersion', 'targetNamespace', 'expressionLanguage', 'typeLanguage']));
    if (!others.length && !own.length)
        return null;
    return el('section', { class: 'report-process report-other' },
        el('h2', {}, 'Definitions'),
        own.length ? el('div', { class: 'report-settings' }, own.map(([key, value]) =>
            el('div', { class: 'report-line' }, el('span', { class: 'report-key' }, `${key}:`), ' ', el('span', { class: 'report-value' }, value)))) : null,
        others.map(o => el('section', { class: 'report-element', 'data-element-id': o.id },
            el('h3', { class: 'report-head' }, el('span', { class: 'report-key' }, `${localName(o.$type)}:`), ' ', o.id,
                o.get('name') ? el('span', { class: 'report-name' }, `, ${o.get('name')}`) : null),
            el('div', { class: 'report-body' }, el('div', { class: 'report-settings' },
                otherSettings(o, '', new Set(['id', 'name'])).map(([key, value]) =>
                    el('div', { class: 'report-line' }, el('span', { class: 'report-key' }, `${key}:`), ' ', el('span', { class: 'report-value' }, value))))))));
};

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
