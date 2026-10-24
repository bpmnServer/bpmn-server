import { BpmnModdle } from 'bpmn-moddle';

import { moddleOptions as defaultModdleOptions } from './js-bpmn-moddle.js';
import { Definition } from './Definition.js';
import { Behaviour_names } from './behaviours/BehaviourLoader.js';
import { ServiceTask, BusinessRuleTask, CallActivity } from './Tasks.js';
import { ScriptHandler } from '../engine/ScriptHandler.js';
import { Cron } from '../server/Cron.js';
import type { IBPMNServer } from '../interfaces/server.js';

/**
 * Static verification of a BPMN model: reports what would stop the engine from loading or
 * running it (errors) and what is likely a modelling mistake (warnings), without starting it.
 *
 * ```ts
 *  const result = await verifyModel(xml, server);
 *  if (!result.valid) result.issues.filter(i => i.severity == 'error').forEach(i => console.log(i.message));
 * ```
 */

type ModelIssueSeverity = 'error' | 'warning' | 'info';

interface IModelIssue {
    severity: ModelIssueSeverity;
    /** stable identifier of the check, e.g. 'no-start-event' */
    code: string;
    message: string;
    elementId?: string;
    elementName?: string;
    processId?: string;
}

interface IModelVerification {
    /** true when there are no errors; warnings do not make a model invalid */
    valid: boolean;
    errors: number;
    warnings: number;
    issues: IModelIssue[];
}

const SEVERITY_ORDER = { error: 0, warning: 1, info: 2 };

class ModelVerifier {
    issues: IModelIssue[] = [];
    processId: string;

    constructor(private server?: IBPMNServer) { }

    add(severity: ModelIssueSeverity, code: string, message: string, element?) {
        const issue: IModelIssue = { severity, code, message };
        if (element && element.id) issue.elementId = element.id;
        if (element && element.name) issue.elementName = element.name;
        if (this.processId) issue.processId = this.processId;
        this.issues.push(issue);
    }

    result(): IModelVerification {
        this.issues.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
        const errors = this.issues.filter(i => i.severity == 'error').length;
        const warnings = this.issues.filter(i => i.severity == 'warning').length;
        return { valid: errors == 0, errors, warnings, issues: this.issues };
    }

    get moddleOptions() {
        return (this.server && this.server.appDelegate && this.server.appDelegate.moddleOptions) || defaultModdleOptions;
    }

    async verify(source: string, name: string): Promise<IModelVerification> {
        if (!source || !source.trim()) {
            this.add('error', 'empty-model', 'The model source is empty.');
            return this.result();
        }

        // 1. XML and BPMN schema, parsed the same way Definition parses it
        let parsed;
        try {
            parsed = await new BpmnModdle({ moddleOptions: this.moddleOptions }).fromXML(source);
        }
        catch (exc) {
            this.add('error', 'invalid-xml', 'The model is not valid BPMN XML: ' + (exc && exc.message || exc));
            return this.result();
        }
        (parsed.warnings || []).forEach(w => {
            const message = String(w && w.message || w);
            if (/unresolved reference/i.test(message))
                this.add('error', 'unresolved-reference', message, w.element);
            else if (/duplicate ID/i.test(message))
                this.add('error', 'duplicate-id', message, w.element);
            else
                this.add('warning', 'xml-warning', message, w.element);
        });

        const root = parsed.rootElement;
        const processes = (root.rootElements || []).filter(e => is(e, 'bpmn:Process'));
        if (!processes.length)
            this.add('error', 'no-process', 'The model does not define any process.');

        // 2. structure of every process and subprocess
        for (const proc of processes) {
            this.processId = proc.id;
            this.verifyContainer(proc);
        }
        this.processId = undefined;

        // 3. diagram information, needed by the modeler and the previews
        this.verifyDiagram(root, processes);

        // 4. load it as the engine does, then check what only the engine knows how to read
        if (!this.issues.some(i => i.severity == 'error' && (i.code == 'unresolved-reference' || i.code == 'duplicate-id'))) {
            const definition = await this.loadDefinition(name, source);
            if (definition)
                await this.verifyExecutables(definition);
        }
        return this.result();
    }

    verifyContainer(container) {
        const elements = container.flowElements || [];
        const isAdHoc = is(container, 'bpmn:AdHocSubProcess');
        const isEventSubProcess = !!container.triggeredByEvent;
        const nodes = elements.filter(e => is(e, 'bpmn:FlowNode'));
        const flows = elements.filter(e => is(e, 'bpmn:SequenceFlow'));
        const label = is(container, 'bpmn:Process') ? 'Process' : 'Subprocess';

        if (!nodes.length) {
            this.add('warning', 'empty-process', `${label} has no elements.`, container);
            return;
        }
        const starts = nodes.filter(n => is(n, 'bpmn:StartEvent'));
        if (!starts.length && !isAdHoc)
            this.add('error', 'no-start-event', `${label} has no start event, so it can not be started.`, container);
        if (!isAdHoc && !isEventSubProcess && !nodes.some(n => is(n, 'bpmn:EndEvent')))
            this.add('warning', 'no-end-event', `${label} has no end event.`, container);

        for (const flow of flows) {
            if (!flow.sourceRef || !flow.targetRef)
                this.add('error', 'flow-missing-endpoint', `Sequence flow is missing its ${!flow.sourceRef ? 'source' : 'target'}.`, flow);
            if (flow.conditionExpression && !String(flow.conditionExpression.body || '').trim())
                this.add('error', 'empty-condition', 'Sequence flow has an empty condition.', flow);
        }

        // connections come from the flows' source and target, as the engine reads them;
        // a node's own incoming/outgoing lists are optional in BPMN
        const incomingOf = new Map(), outgoingOf = new Map();
        for (const flow of flows) {
            if (flow.sourceRef) outgoingOf.set(flow.sourceRef, [...(outgoingOf.get(flow.sourceRef) || []), flow]);
            if (flow.targetRef) incomingOf.set(flow.targetRef, [...(incomingOf.get(flow.targetRef) || []), flow]);
        }

        for (const node of nodes) {
            const incoming = incomingOf.get(node) || [];
            const outgoing = outgoingOf.get(node) || [];
            const isLink = hasEventDefinition(node, 'bpmn:LinkEventDefinition');
            const isCompensation = !!node.isForCompensation;
            const isBoundary = is(node, 'bpmn:BoundaryEvent');
            const isStart = is(node, 'bpmn:StartEvent');
            const isEnd = is(node, 'bpmn:EndEvent');
            const isEventSub = is(node, 'bpmn:SubProcess') && node.triggeredByEvent;

            if (isStart && incoming.length)
                this.add('warning', 'start-event-incoming', 'Start event has incoming sequence flows.', node);
            if (isEnd && outgoing.length)
                this.add('warning', 'end-event-outgoing', 'End event has outgoing sequence flows.', node);
            if (!isAdHoc && !incoming.length && !isStart && !isBoundary && !isLink && !isCompensation && !isEventSub)
                this.add('warning', 'unreachable', 'Element has no incoming sequence flow and will never be reached.', node);
            if (!isAdHoc && !outgoing.length && !isEnd && !isLink && !isCompensation && !isEventSub && !is(node, 'bpmn:Gateway')
                && !(isBoundary && hasEventDefinition(node, 'bpmn:CompensateEventDefinition')))
                this.add('warning', 'no-outgoing', 'Element has no outgoing sequence flow; the path ends here without an end event.', node);

            if (is(node, 'bpmn:Gateway')) this.verifyGateway(node, incoming, outgoing);
            if (is(node, 'bpmn:Event')) this.verifyEventDefinitions(node);
            if (is(node, 'bpmn:CallActivity') && !node.calledElement)
                this.add('error', 'call-activity-no-target', 'Call activity does not name the process it calls (calledElement).', node);
            if (is(node, 'bpmn:ScriptTask') && !String(node.script || '').trim())
                this.add('info', 'empty-script', 'Script task has no script.', node);
            if (is(node, 'bpmn:SubProcess'))
                this.verifyContainer(node);
        }
    }

    verifyGateway(gateway, incoming, outgoing) {
        if (!outgoing.length) {
            this.add('warning', 'no-outgoing', 'Gateway has no outgoing sequence flow.', gateway);
            return;
        }
        if (incoming.length > 1 && outgoing.length > 1)
            this.add('warning', 'mixed-gateway', 'Gateway both joins and splits flows; use two gateways to make the behaviour explicit.', gateway);

        if (gateway.default && !outgoing.includes(gateway.default))
            this.add('error', 'default-flow-not-outgoing', 'The gateway\'s default flow is not one of its outgoing flows.', gateway);

        if ((is(gateway, 'bpmn:ExclusiveGateway') || is(gateway, 'bpmn:InclusiveGateway')) && outgoing.length > 1) {
            const unconditioned = outgoing.filter(f => !f.conditionExpression && f !== gateway.default);
            if (unconditioned.length)
                this.add('warning', 'flow-without-condition',
                    `Gateway splits into flows without a condition (${unconditioned.map(f => f.name || f.id).join(', ')}); they are always taken. Add conditions or mark one as the default flow.`, gateway);
            else if (!gateway.default)
                this.add('info', 'no-default-flow', 'Gateway has no default flow; when no condition is true the process can not continue.', gateway);
        }
        if (is(gateway, 'bpmn:EventBasedGateway')) {
            for (const flow of outgoing) {
                const target = flow.targetRef;
                if (target && !is(target, 'bpmn:IntermediateCatchEvent') && !is(target, 'bpmn:ReceiveTask'))
                    this.add('error', 'event-gateway-target', `Event-based gateway leads to '${target.name || target.id}', which is not a catching event or receive task.`, gateway);
            }
        }
    }

    verifyEventDefinitions(event) {
        for (const def of event.eventDefinitions || []) {
            if (is(def, 'bpmn:TimerEventDefinition') && !def.timeDuration && !def.timeCycle && !def.timeDate)
                this.add('error', 'timer-not-defined', 'Timer event has no duration, cycle or date.', event);
        }
    }

    verifyDiagram(root, processes) {
        const plane = root.diagrams && root.diagrams[0] && root.diagrams[0].plane;
        const items = (plane && plane.planeElement) || [];
        if (!items.length) {
            this.add('warning', 'no-diagram', 'The model has no diagram information (BPMN DI); the modeler can not display it.');
            return;
        }
        const drawn = new Set(items.map(i => i.bpmnElement && i.bpmnElement.id).filter(Boolean));
        const walk = (container) => {
            for (const el of container.flowElements || []) {
                if ((is(el, 'bpmn:FlowNode') || is(el, 'bpmn:SequenceFlow')) && !drawn.has(el.id))
                    this.add('warning', 'not-in-diagram', 'Element is not drawn in the diagram.', el);
                if (is(el, 'bpmn:SubProcess') && drawn.has(el.id))
                    walk(el);
            }
        };
        processes.forEach(walk);
    }

    async loadDefinition(name: string, source: string): Promise<Definition> {
        // the engine's loader, without the server's side effects (no process_loaded event)
        const host = {
            logger: this.server && this.server.logger,
            appDelegate: { moddleOptions: this.moddleOptions },
            listener: { emit: async () => { } },
        };
        try {
            const definition = new Definition(name, source, host as unknown as IBPMNServer);
            await definition.load();
            return definition;
        }
        catch (exc) {
            this.add('error', 'engine-load-failed', 'The engine can not load the model: ' + (exc && exc.message || exc));
            return null;
        }
    }

    async verifyExecutables(definition: Definition) {
        const handler = this.server && this.server.scriptHandler;
        // scripts and expressions are only checked for the built-in JavaScript handler
        const checkScripts = !handler || handler instanceof ScriptHandler;
        const knownModels = await this.knownModels();
        const services = await this.servicesProvider();

        definition.processes.forEach(proc => {
            this.processId = proc.id;
            if (checkScripts) proc.scripts.forEach((scripts, event) => scripts.forEach(s => this.checkScript(s, `process '${event}' script`, proc.def || proc)));
        });

        definition.nodes.forEach(node => {
            this.processId = node.processId;
            const def = node.def || {};
            if (checkScripts) {
                node.scripts.forEach((scripts, event) => scripts.forEach(s => this.checkScript(s, `'${event}' script`, def)));
                if (node.type == 'bpmn:ScriptTask' && def.script)
                    this.checkScript(def.script, 'script', def);
                const attrs = def.$attrs || {};
                for (const attr of ['assignee', 'candidateGroups', 'candidateUsers', 'dueDate', 'followUpDate', 'priority']) {
                    const exp = attrs['camunda:' + attr];
                    if (typeof exp == 'string' && exp.startsWith('$'))
                        this.checkExpression(exp, attr, def);
                    else if (typeof exp == 'string' && exp.startsWith('#'))
                        this.checkScript('return ' + exp.substring(1), attr, def);
                }
            }

            const timer = node.getBehaviour(Behaviour_names.TimerEventDefinition);
            if (timer) this.checkTimer(timer, def, checkScripts);

            if (node instanceof ServiceTask && !(node instanceof BusinessRuleTask)) {
                const serviceName = node.serviceName;
                if (!serviceName)
                    this.add('info', 'service-not-named', 'Service task does not name a service (implementation or delegateExpression); appDelegate.serviceCalled will handle it.', def);
                else if (services && !resolvePath(services, serviceName))
                    this.add('info', 'service-not-found', `Service '${serviceName}' is not provided by the application's services; appDelegate.serviceCalled will handle it.`, def);
            }

            if (node instanceof CallActivity && node.calledElement && knownModels && !knownModels.has(node.calledElement))
                this.add('warning', 'called-model-missing', `Called process '${node.calledElement}' is not a saved model.`, def);
        });

        if (checkScripts) {
            definition.flows.forEach(flow => {
                const def = flow.def;
                const body = def && def.conditionExpression && def.conditionExpression.body;
                this.processId = flow.from && flow.from.processId;
                if (body && String(body).trim())
                    this.checkExpression(String(body), 'condition', def);
            });
        }
        this.processId = undefined;
    }

    checkScript(script: string, what: string, element) {
        if (!script || script.startsWith('$py')) return;
        try {
            Function(ScriptHandler.getJSvars({}) + script.replace('#', '') + ';');
        }
        catch (exc) {
            this.add('error', 'script-syntax', `The ${what} does not compile: ${exc.message}`, element);
        }
    }

    checkExpression(expression: string, what: string, element) {
        const script = expression.startsWith('$') ? expression.substring(1) : expression;
        try {
            Function(ScriptHandler.getJSvars({}) + `return (${script});`);
        }
        catch (exc) {
            this.add('error', 'expression-syntax', `The ${what} expression does not compile: ${exc.message}`, element);
        }
    }

    checkTimer(timer, element, checkScripts: boolean) {
        const checks = [['duration', timer.duration], ['cycle', timer.timeCycle], ['date', timer.timeDate]];
        for (const [kind, value] of checks) {
            if (!value) continue;
            const text = String(value).trim();
            if (text.startsWith('$')) {
                if (checkScripts) this.checkExpression(text, `timer ${kind}`, element);
            }
            else if (kind == 'date' ? isNaN(new Date(text).getTime()) : Cron.timeDue(text, null) == null)
                this.add('error', 'timer-invalid', `Timer ${kind} '${text}' is not a valid ${kind == 'date' ? 'ISO 8601 date' : 'ISO 8601 duration or cron expression'}.`, element);
        }
    }

    async knownModels(): Promise<Set<string>> {
        if (!this.server || !this.server.definitions) return null;
        try {
            const list = await this.server.definitions.getList({});
            return new Set((list || []).map(m => typeof m == 'string' ? m : m && m['name']));
        }
        catch (exc) {
            return null;
        }
    }

    async servicesProvider() {
        const delegate = this.server && this.server.appDelegate;
        if (!delegate || typeof delegate.getServicesProvider !== 'function') return null;
        try {
            return await delegate.getServicesProvider(null);
        }
        catch (exc) {
            return null;    // providers that need a running execution can not be checked
        }
    }
}

function is(element, type: string): boolean {
    return !!element && typeof element.$instanceOf === 'function' && element.$instanceOf(type);
}

function hasEventDefinition(node, type: string): boolean {
    return (node.eventDefinitions || []).some(d => is(d, type));
}

/** Resolves a dotted service name the way ServiceTask does. */
function resolvePath(provider, serviceName: string): boolean {
    let obj = provider;
    for (const part of serviceName.split('.')) {
        if (obj && typeof obj[part] === 'function') return true;
        if (obj && typeof obj[part] === 'object') obj = obj[part];
        else return false;
    }
    return false;
}

/**
 * Verifies a BPMN model's XML. Pass the server to also check services and called models
 * against the application; without it only the model itself is checked.
 */
async function verifyModel(source: string, server?: IBPMNServer, name = 'model'): Promise<IModelVerification> {
    return await new ModelVerifier(server).verify(source, name);
}

export { verifyModel, ModelVerifier };
export type { IModelIssue, IModelVerification, ModelIssueSeverity };
