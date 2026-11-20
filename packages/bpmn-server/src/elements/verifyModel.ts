import { moddleOptions as defaultModdleOptions } from './js-bpmn-moddle.js';
import { Definition } from './Definition.js';
import { Behaviour_names } from './behaviours/BehaviourLoader.js';
import { ServiceTask, BusinessRuleTask, CallActivity } from './Tasks.js';
import { ScriptHandler } from '../engine/ScriptHandler.js';
import { expressionScript, scriptOf, templateParts, isEvaluated, freeNames, isFeel, conditionScript } from '../engine/Expressions.js';
import { feelParses } from '../dmn/DMNParser.js';
import { Cron } from '../server/Cron.js';
import { owfAttribute, legacyAttributes } from './owfAttributes.js';
import { registrationsOf, addOnsOf } from '../engine/AddOns.js';
import type { IAddOn, IAddOnModelCheck, IAddOnDecisionFile, IModelCheck, IAddOnManifest } from '../engine/AddOns.js';
import fs from 'node:fs';
import path from 'node:path';
import type { IBPMNServer } from '../interfaces/server.js';
import { DMNEngine } from '../dmn/DMNEngine.js';
import { DMNParser } from '../dmn/DMNParser.js';
import { roleNames } from '../engine/Roles.js';
import { contractNames, readAppContract, APP_CONTRACT_FILE } from '../engine/AppContract.js';
import type { IAppContract } from '../engine/AppContract.js';

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

interface IVerifyOptions {
    /** the folder of the decision files (`<name>.dmn.xml`) business rule tasks name; the server's definitionsPath by default */
    decisionsFolder?: string;
    /** the add-ons whose checks run too (engine/AddOns.ts); the server's by default, none without a server */
    addOns?: IAddOn[];
    /** every add-on's manifest, on or off, for a model that uses one that is off; the server configuration's by default */
    manifests?: IAddOnManifest[];
}

interface IModelVerification {
    /** true when there are no errors; warnings do not make a model invalid */
    valid: boolean;
    errors: number;
    warnings: number;
    issues: IModelIssue[];
}

const SEVERITY_ORDER = { error: 0, warning: 1, info: 2 };

/** The names an expression has (data, item, instance, ...): those ScriptHandler declares for an item. */
const EXPRESSION_SCOPE = new Set([...ScriptHandler.getJSvars({}).matchAll(/var\s+(\w+)\s*=/g)].map(m => m[1]));

/** JUEL's word operators, and what JavaScript writes instead. */
const JUEL_OPERATORS = {
    eq: '===', ne: '!==', lt: '<', gt: '>', le: '<=', ge: '>=',
    and: '&&', or: '||', not: '!', div: '/', mod: '%', empty: '!value (or value == null)',
};

class ModelVerifier {
    issues: IModelIssue[] = [];
    processId: string;
    /** the application's services provider, when it can be had without a running execution */
    services: any = null;

    constructor(private server?: IBPMNServer, private options: IVerifyOptions = {}) { }

    /**
     * A model that uses an add-on that is off: its attributes (the add-on's manifest says which) are kept, and the
     * engine doesn't read them. One warning for each such add-on, naming where.
     */
    verifyAddOnsOff(definition) {
        const manifests: IAddOnManifest[] = this.options.manifests ?? this.server?.configuration?.addOnManifests?.() ?? [];
        if (!manifests.length) return;
        const on = new Set((this.options.addOns ?? addOnsOf(this.server)).map(a => a.name));
        const elements = [...definition.processes.values()].map(p => p.def || p).concat([...definition.nodes.values()].map(n => n.def));
        for (const manifest of manifests.filter(m => !on.has(m.name))) {
            const uses = elements.flatMap(def => Object.keys(def?.$attrs ?? {}).filter(k => manifest.attributes.includes(k))
                .map(k => `${k.replace(/^\w+:/, '')} on ${def.name || def.id}`));
            for (const element of manifest.elements ?? [])
                if (this.source?.includes(`<${element}`)) uses.push(element.replace(/^\w+:/, ''));
            if (!uses.length) continue;
            const shown = uses.slice(0, 3).join(', ') + (uses.length > 3 ? `, and ${uses.length - 3} more` : '');
            this.processId = undefined;
            this.add('warning', 'add-on-off', `This model uses ${manifest.title} (${shown}), which is off; the engine ignores it.`);
        }
    }

    /** The model checks the add-ons registered: the server's, else those of the add-ons given. */
    get modelChecks(): IModelCheck[] {
        return registrationsOf(this.server, this.options.addOns).modelChecks;
    }

    /** What an add-on's checks are given: the folder, the roles, and a way to report (engine/AddOns.ts). */
    get addOnCheck(): IAddOnModelCheck {
        return {
            folder: this.decisionsFolder, roles: () => this.roles(), add: (severity, code, message, element) => this.add(severity, code, message, element),
            hasService: name => this.services ? resolvePath(this.services, name) : undefined,
            connectorOperation: (ref, element, fails) => this.operationOf(ref, element, fails),
        };
    }

    /** Each add-on's model check, in turn; one that throws is a warning. */
    async addOnChecks(hook: 'verifyNode' | 'verifyProcess', ...args: any[]) {
        for (const check of this.modelChecks) {
            if (typeof check[hook] !== 'function') continue;
            try { await (check[hook] as Function).call(check, this.addOnCheck, ...args); }
            catch (exc) { this.add('warning', 'add-on-check-failed', `The ${check.name} add-on's check failed: ${exc?.message ?? exc}`); }
        }
    }

    /** The decision files the model uses through its add-ons (its policies). */
    async addOnDecisionFiles(definition): Promise<IAddOnDecisionFile[]> {
        const folder = this.decisionsFolder;
        if (!folder) return [];
        const files: IAddOnDecisionFile[] = [];
        for (const check of this.modelChecks)
            try { files.push(...(await check.decisionFiles?.(definition, folder) ?? [])); } catch { /* its own checks say why */ }
        return files;
    }

    get decisionsFolder(): string {
        return this.options.decisionsFolder
            || (this.server && this.server.configuration && this.server.configuration.definitionsPath) || null;
    }

    /**
     * Label templates (owf:label, owf:endLabel): data paths, names once (addons/labels/Labels.ts). And OWF's attributes
     * still under their old camunda: names (elements/owfAttributes.ts).
     */
    checkLabel(def) {
        for (const name of legacyAttributes(def))
            this.add('warning', 'owf-attribute-legacy', `camunda:${name} is OWF's, not Camunda's: it is read, and the model editor saves it as owf:${name}.`, def);
    }

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

    /** the model's XML, as it was given */
    source: string;

    async verify(source: string, name: string): Promise<IModelVerification> {
        this.source = source;
        if (!source || !source.trim()) {
            this.add('error', 'empty-model', 'The model source is empty.');
            return this.result();
        }

        // 1. XML and BPMN schema, parsed the same way Definition parses it
        let parsed;
        try {
            parsed = await Definition.moddleFor(this.moddleOptions).fromXML(source);
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
        this.verifyDataObjects(processes);

        // 3. diagram information, needed by the modeler and the previews
        this.verifyDiagram(root, processes);

        // 4. load it as the engine does, then check what only the engine knows how to read
        if (!this.issues.some(i => i.severity == 'error' && (i.code == 'unresolved-reference' || i.code == 'duplicate-id'))) {
            const definition = await this.loadDefinition(name, source);
            if (definition) {
                await this.verifyExecutables(definition);
                await this.verifyWholeModel(source, definition);
                await this.verifyContract(source, definition);
                await this.verifyApplication(name, source, definition);
                this.verifyAddOnsOff(definition);
            }
        }
        return this.result();
    }

    /**
     * 5. the application's own checks (appDelegate.verifyModel), reported with these. A check that throws is
     * reported as a warning: it never stops the model being verified.
     */
    async verifyApplication(name: string, source: string, definition) {
        const delegate = this.server && this.server.appDelegate;
        if (!delegate || typeof delegate.verifyModel !== 'function') return;
        try {
            const issues = await delegate.verifyModel({ name, source, definition });
            for (const issue of issues || []) {
                if (!issue || !issue.code || !issue.message) continue;
                const severity: ModelIssueSeverity = ['error', 'warning', 'info'].includes(issue.severity) ? issue.severity : 'error';
                this.issues.push({ ...issue, severity, ...(this.processId ? { processId: this.processId } : {}) });
            }
        }
        catch (exc) {
            this.add('warning', 'application-check-failed', `The application's model check failed: ${exc && exc.message || exc}`);
        }
    }

    /**
     * Data objects are loaded by the application (appDelegate.loadDataObject) when an element connected to them
     * runs: one connected to nothing is never loaded, and an application without loadDataObject loads none.
     */
    verifyDataObjects(processes) {
        const refs = [], connected = new Set();
        const walk = container => (container.flowElements || []).forEach(e => {
            if (is(e, 'bpmn:DataObjectReference') || is(e, 'bpmn:DataStoreReference'))
                refs.push(e);
            for (const a of e.dataInputAssociations || [])
                (a.sourceRef || []).forEach(ref => connected.add(ref));
            for (const a of e.dataOutputAssociations || [])
                if (a.targetRef) connected.add(a.targetRef);
            if (is(e, 'bpmn:SubProcess')) walk(e);
        });
        processes.forEach(walk);
        const nameOf = ref => {
            const target = ref.dataObjectRef || ref.dataStoreRef || ref;
            return ref.name || target.name || target.id || ref.id;
        };
        for (const ref of refs)
            if (!connected.has(ref))
                this.add('warning', 'data-object-not-loaded', `Data object '${nameOf(ref)}' is not connected to an element, so it is never loaded.`, ref);
        const delegate = this.server && this.server.appDelegate;
        if (connected.size && delegate && typeof delegate.loadDataObject !== 'function')
            this.add('warning', 'no-data-object-loader',
                `The model uses data objects (${[...new Set([...connected].map(nameOf))].join(', ')}), but the application has no appDelegate.loadDataObject: they are not loaded.`);
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

    /**
     * A task that calls a connector (docs/docs/connectors.md): it names `<connector>/<operationId>`, and no service; with a
     * server, the connector and the operation are there and enabled, the operation's required inputs are given, and
     * every input is one of the operation's.
     */
    private async checkConnector(node: ServiceTask, connector, def) {
        const ref = connector.connectorId;
        if (node.serviceName)
            this.add('error', 'connector-and-service', `The task calls the connector '${ref}' and names the service '${node.serviceName}': it calls the connector; remove the service.`, def);
        const slash = ref.indexOf('/');
        if (slash <= 0 || slash === ref.length - 1) {
            this.add('error', 'connector-not-named', ref
                ? `'${ref}' does not name a connector's operation: <connector>/<operationId>.`
                : 'The task calls a connector but does not name it: choose the connector and its operation.', def);
            return;
        }
        const operation = await this.operationOf(ref, def, 'the task fails');
        if (!operation)
            return;
        const given = new Set(((connector.io?.parameters ?? []) as any[]).filter(p => p.isInput()).map(p => p.name));
        const bodyFields = operation.body?.schema?.properties ? Object.keys(operation.body.schema.properties) : [];
        const inputs = [
            ...operation.parameters.map(p => ({ name: p.name, required: p.required })),
            ...(operation.body ? (bodyFields.length
                ? bodyFields.map(f => ({ name: `body.${f}`, required: (operation.body.schema.required ?? []).includes(f) && !given.has('body') }))
                : [{ name: 'body', required: operation.body.required }]) : []),
        ];
        for (const input of inputs)
            if (input.required && !given.has(input.name))
                this.add('error', 'connector-input-missing', `The operation '${ref}' needs the input '${input.name}': the call fails without it.`, def);
        // a body the operation requires: given whole (body), or by at least one of its fields (body.<field>)
        if (operation.body?.required && !given.has('body') && ![...given].some(n => n.startsWith('body.'))
            && !inputs.some(i => i.required && i.name.startsWith('body.')))
            this.add('error', 'connector-input-missing', `The operation '${ref}' needs a request body: the input 'body', or its fields (body.<field>).`, def);
        const known = new Set([...inputs.map(i => i.name), ...(operation.body ? ['body'] : [])]);
        for (const name of given)
            if (!known.has(name))
                this.add('warning', 'connector-input-unknown', `'${name}' is not an input of '${ref}': it is not sent.`, def);
    }

    /**
     * A connector's operation a model names, `<connector>/<operationId>` (already checked to be one), with the server's
     * connectors: the connector and the operation there and enabled. `fails`: what happens when one is disabled.
     * Undefined, with the error added, when it is not there; and when the server has no connectors.
     */
    async operationOf(ref: string, def, fails: string) {
        const connectors = this.server?.connectors;
        if (!connectors)
            return undefined;
        const slash = ref.indexOf('/');
        const id = ref.slice(0, slash), operationId = ref.slice(slash + 1);
        const found = await connectors.get(id).catch(() => undefined);
        if (!found) {
            this.add('error', 'connector-unknown', `The server has no connector '${id}': an administrator adds it (Administration, Connectors).`, def);
            return undefined;
        }
        if (!found.enabled)
            this.add('warning', 'connector-disabled', `The connector '${id}' is disabled: ${fails} until an administrator enables it.`, def);
        let operation;
        try {
            operation = (await connectors.operations(id)).find(op => op.operationId === operationId);
        }
        catch (exc) {
            this.add('error', 'connector-unreadable', `The connector '${id}' can not be read: ${exc.message}`, def);
            return undefined;
        }
        if (!operation) {
            this.add('error', 'connector-operation-unknown', `The connector '${id}' has no operation '${operationId}'.`, def);
            return undefined;
        }
        if (!operation.enabled)
            this.add('warning', 'connector-operation-disabled', `The operation '${ref}' is disabled: ${fails} until an administrator enables it.`, def);
        return operation;
    }

    async verifyExecutables(definition: Definition) {
        const handler = this.server && this.server.scriptHandler;
        // scripts and expressions are only checked for the built-in JavaScript handler
        const checkScripts = !handler || handler instanceof ScriptHandler;
        const knownModels = await this.knownModels();
        const services = await this.servicesProvider();
        this.services = services;

        for (const proc of definition.processes.values()) {
            this.processId = proc.id;
            await this.addOnChecks('verifyProcess', proc, proc.def || proc);
        }
        definition.processes.forEach(proc => {
            this.processId = proc.id;
            this.checkLabel(proc.def || proc);
            if (checkScripts) proc.scripts?.forEach((scripts, event) => scripts.forEach(s => this.checkScript(s, `process '${event}' script`, proc.def || proc)));
        });

        for (const node of definition.nodes.values()) {
            this.processId = node.processId;
            const def = node.def || {};
            this.checkLabel(def);
            if (checkScripts) {
                node.scripts?.forEach((scripts, event) => scripts.forEach(s => this.checkScript(s, `'${event}' script`, def)));
                if (node.type == 'bpmn:ScriptTask' && def.script)
                    this.checkScript(def.script, 'script', def);
                const attrs = def.$attrs || {};
                for (const attr of ['assignee', 'candidateGroups', 'candidateUsers', 'dueDate', 'followUpDate', 'priority']) {
                    const exp = attrs['camunda:' + attr];
                    if (typeof exp == 'string' && isEvaluated(exp))
                        this.checkValue(exp, attr, def);
                    else if (typeof exp == 'string' && exp.startsWith('#'))
                        this.checkScript('return ' + exp.substring(1), attr, def);
                }
                // a multi-instance loop's collection is always evaluated as an expression (engine/Loop.ts)
                const loop = def.loopCharacteristics;
                const collection = loop && (loop.collection || (loop.$attrs && loop.$attrs['camunda:collection']));
                if (typeof collection == 'string' && collection.trim())
                    this.checkExpression(collection, 'collection', def);
            }

            const timer = node.getBehaviour(Behaviour_names.TimerEventDefinition);
            if (timer) this.checkTimer(timer, def, checkScripts);


            const connector = node instanceof ServiceTask ? node.connector : undefined;
            if (connector)
                await this.checkConnector(node as ServiceTask, connector, def);
            else if (node instanceof ServiceTask && !(node instanceof BusinessRuleTask)) {
                const serviceName = node.serviceName;
                if (!serviceName)
                    this.add('info', 'service-not-named', 'Service task does not name a service (implementation or delegateExpression); appDelegate.serviceCalled will handle it.', def);
                else if (services && !resolvePath(services, serviceName))
                    this.add('info', 'service-not-found', `Service '${serviceName}' is not provided by the application's services; appDelegate.serviceCalled will handle it.`, def);
            }

            // a parameter is an expression only with a leading $; without it, it is the text as written
            const io = node.getBehaviour(Behaviour_names.CamundaIO) as any;
            for (const p of [...((io && io.parameters) || []), ...((connector?.io as any)?.parameters || [])]) {
                if (typeof p.value == 'string' && /^\s*(data|item|input|output)\.[\w.]+\s*$/.test(p.value))
                    this.add('warning', 'parameter-is-text', `Parameter '${p.name}' is the text '${p.value.trim()}', not its value: write $${p.value.trim()} to read it.`, def);
                // an input parameter's text is evaluated as an expression, or its ${...} parts filled in
                else if (checkScripts && typeof p.value == 'string' && !p.subType && p.isInput && p.isInput())
                    this.checkValue(p.value, `parameter '${p.name}'`, def);
            }

            if (node instanceof BusinessRuleTask)
                await this.checkDecision(node, def);

            await this.addOnChecks('verifyNode', node, def);

            if (node instanceof CallActivity && node.calledElement && knownModels && !knownModels.has(node.calledElement))
                this.add('warning', 'called-model-missing', `Called process '${node.calledElement}' is not a saved model.`, def);
        }

        if (checkScripts) {
            definition.flows.forEach(flow => {
                const def = flow.def;
                const body = def && def.conditionExpression && def.conditionExpression.body;
                this.processId = flow.from && flow.from.processId;
                const language = def && def.conditionExpression && def.conditionExpression.language;
                if (body && String(body).trim()) {
                    if (!isFeel(language))
                        this.checkExpression(conditionScript(String(body), language), 'condition', def);
                    else if (!feelParses(scriptOf(String(body).trim()), false))
                        this.add('error', 'expression-syntax', 'The condition expression is not valid FEEL.', def);
                }
            });
        }
        this.processId = undefined;
    }

    /**
     * The whole model, once, by the add-ons' checks (engine/AddOns.ts, verifyModel): with its source, its definition,
     * and the decision files it uses (its business rule tasks' and the add-ons' whose actors are read), each its text.
     */
    async verifyWholeModel(source: string, definition) {
        const checks = this.modelChecks.filter(c => typeof c.verifyModel === 'function');
        if (!checks.length) return;
        const decisions: { what: string; text: string }[] = [];
        const folder = this.decisionsFolder;
        const read = (file: string | null) => { try { return file ? fs.readFileSync(file, 'utf8') : null; } catch { return null; } };
        if (folder) {
            const named = new Map<string, string>();     // a file, and what it is
            for (const { what, file, actors } of await this.addOnDecisionFiles(definition))
                if (actors !== false) named.set(file, what);
            for (const node of definition.nodes.values())
                if (node instanceof BusinessRuleTask && node.decisionRef)
                    try { named.set((await DMNEngine.find(folder, node.decisionRef)).filePath, `decision ${node.decisionRef}`); } catch { }
            for (const [file, what] of named) {
                const text = read(file);
                if (text) decisions.push({ what, text });
            }
        }
        this.processId = undefined;
        for (const check of checks) {
            try { await check.verifyModel(this.addOnCheck, { source, definition, decisions }); }
            catch (exc) { this.add('warning', 'add-on-check-failed', `The ${check.name} add-on's check failed: ${exc?.message ?? exc}`); }
        }
    }

    /**
     * The roles: the models folder's roles.json and the application's contract (app-contract.json), together; null with
     * neither. A bad roles.json is an error.
     */
    roles(): string[] | null {
        if (this.#roles !== undefined) return this.#roles;
        let fromFile: string[] | null = null;
        try { fromFile = this.decisionsFolder ? roleNames(this.decisionsFolder) : null; }
        catch (exc) { this.add('error', 'roles-invalid', exc.message); }
        const declared = this.contract()?.roles?.map(r => r.name) ?? null;
        this.#roles = fromFile || declared ? [...new Set([...(fromFile ?? []), ...(declared ?? [])])] : null;
        return this.#roles;
    }

    /** The application's contract (its delegate's describe(): app-contract.json), or null. */
    contract(): IAppContract | null {
        if (this.#contract !== undefined) return this.#contract;
        const delegate = this.server && (this.server as any).appDelegate;
        // the delegate's describe(); with no delegate (the command line's verify), the application folder's file
        try { this.#contract = typeof delegate?.describe === 'function' ? delegate.describe() ?? null : readAppContract(path.resolve(APP_CONTRACT_FILE)).contract; }
        catch (exc) { this.add('warning', 'contract-unreadable', `The application's contract can not be read: ${exc.message}`); this.#contract = null; }
        return this.#contract;
    }
    #contract: IAppContract | null | undefined = undefined;

    /**
     * The model against the application's contract (docs/design/app-contract.md §5), when it has one: each
     * appServices.<name> a function it declares, with as many arguments as it takes; each appVars.<name> a variable it
     * declares; each app:<page> form key one of its pages; and no decision the model uses (its business rule tasks',
     * its policies) calling a function that changes things (effect write). Warnings, but the last: the contract is
     * guidance; the model runs as it is.
     */
    async verifyContract(source: string, definition?) {
        const contract = this.contract();
        if (!contract) return;
        const names = contractNames(contract);
        const text = decodeXml(source);
        const reported = new Set<string>();
        const once = (key: string, report: () => void) => { if (!reported.has(key)) { reported.add(key); report(); } };
        if (contract.expressions) {
            for (const call of appServicesCalls(text)) {
                const fn = names.functions.get(call.name);
                if (!fn) once('f:' + call.name, () => this.add('warning', 'function-unknown', `appServices.${call.name}: ${APP_CONTRACT_FILE} declares no such function (${[...names.functions.keys()].join(', ') || 'none'}).`));
                else if (call.args !== null && fn.params && call.args !== fn.params.length)
                    once(`a:${call.name}:${call.args}`, () => this.add('warning', 'function-arguments', `appServices.${call.name} is called with ${call.args} argument${call.args === 1 ? '' : 's'}; it takes ${fn.params.length} (${fn.params.map(p => p.name).join(', ')}).`));
            }
            for (const [, name] of text.matchAll(/\bappVars\s*\.\s*([A-Za-z_$][\w$]*)/g))
                if (!names.vars.has(name)) once('v:' + name, () => this.add('warning', 'variable-unknown', `appVars.${name}: ${APP_CONTRACT_FILE} declares no such variable (${[...names.vars.keys()].join(', ') || 'none'}).`));
        }
        if (contract.pages)
            for (const [, page] of text.matchAll(/\bformKey\s*=\s*"app:([^"]+)"/g))
                if (!names.pages.includes(page)) once('p:' + page, () => this.add('warning', 'page-unknown', `Form key app:${page}: ${APP_CONTRACT_FILE} has no page '${page}' (${names.pages.join(', ') || 'none'}).`));
        // the decisions it uses: none may call a function that changes things
        const writes = [...names.functions.values()].filter(f => f.effect === 'write').map(f => f.name);
        if (!writes.length || !this.decisionsFolder) return;
        for (const { what, file } of await this.decisionFilesUsed(text, definition)) {
            let table: string;
            try { table = decodeXml(fs.readFileSync(file, 'utf8')); } catch { continue; }
            for (const call of appServicesCalls(table))
                if (writes.includes(call.name))
                    once(`w:${what}:${call.name}`, () => this.add('error', 'function-write-in-decision', `${what} calls appServices.${call.name}, which changes things (effect write): a decision may only read.`));
        }
    }

    /** The decision files a model uses: its business rule tasks' decisions and its add-ons' (the policies it names). */
    async decisionFilesUsed(text: string, definition?): Promise<{ what: string; file: string }[]> {
        const folder = this.decisionsFolder, out = [];
        const add = (what: string, file: string | null) => { if (file && fs.existsSync(file)) out.push({ what, file }); };
        for (const [, ref] of text.matchAll(/\bdecisionRef\s*=\s*"([^"]+)"/g))
            add(`Decision '${ref}'`, [path.join(folder, ref), path.join(folder, ref + '.dmn'), path.join(folder, ref + '.dmn.xml')].find(f => fs.existsSync(f)) ?? null);
        if (definition)
            for (const { what, file, calls } of await this.addOnDecisionFiles(definition))
                if (calls !== false) add(what.charAt(0).toUpperCase() + what.slice(1), file);
        return out;
    }
    #roles: string[] | null | undefined = undefined;

    /**
     * A business rule task's decision: named, found in the decisions folder, readable and valid, and its result
     * saved (a result variable or output parameters).
     */
    async checkDecision(node: BusinessRuleTask, def) {
        const ref = node.decisionRef;
        if (!ref) {
            this.add('warning', 'decision-not-named', 'Business rule task does not name a decision (camunda:decisionRef); nothing is evaluated.', def);
            return;
        }
        const io = node.getBehaviour(Behaviour_names.CamundaIO) as any;
        const params = (io && io.parameters) || [];
        if (!node.resultVariable && !params.some(p => p.isOutput()))
            this.add('warning', 'decision-result-not-saved', `The result of decision '${ref}' is not saved: set a result variable or output parameters.`, def);
        const folder = this.decisionsFolder;
        if (!folder)
            return;
        let found;
        try {
            found = await DMNEngine.find(folder, ref);
        }
        catch (exc) {
            const unreadable = /can not be read/.test(exc.message) && !/folder/.test(exc.message);
            this.add('error', unreadable ? 'decision-invalid' : 'decision-not-found', exc.message, def);
            return;
        }
        const file = found.filePath.split(/[\\/]/).pop();
        for (const issue of DMNParser.check(found.definitions))
            this.add('error', 'decision-invalid', `${file}: ${issue.message}`, def);
        // with input parameters, a table input they do not set is read from the instance data
        const inputs = params.filter(p => p.isInput()).map(p => p.name);
        const table = found.decision.table;
        if (inputs.length && table)
            for (const input of table.inputs)
                if (/^[A-Za-z_]\w*$/.test(input.expression) && !inputs.includes(input.expression))
                    this.add('info', 'decision-input-from-data', `Decision input '${input.expression}' is not an input parameter of the task; it is read from the instance data.`, def);
    }

    checkScript(script: string, what: string, element) {
        if (!script || script.startsWith('$py')) return;
        this.checkServiceReferences(script, what, element);
        try {
            Function(ScriptHandler.getJSvars({}) + script.replace('#', '') + ';');
        }
        catch (exc) {
            this.add('error', 'script-syntax', `The ${what} does not compile: ${exc.message}`, element);
        }
    }

    /**
     * `appServices.name` in a script or expression must be something the application's services provide:
     * calling one that is not there fails when the process runs; reading one gives undefined, which fails
     * as soon as it is used (Object.keys(appServices.rules)).
     */
    checkServiceReferences(code: string, what: string, element) {
        if (!this.services) return;
        const seen = new Set<string>();
        for (const [, name, call] of code.matchAll(/\bappServices\s*\.\s*([A-Za-z_$][\w$]*)(\s*\()?/g)) {
            if (seen.has(name) || name in Object(this.services)) continue;
            seen.add(name);
            if (call)
                this.add('error', 'unknown-app-service', `The ${what} calls appServices.${name}(), which the application's services do not provide.`, element);
            else
                this.add('warning', 'unknown-app-service', `The ${what} reads appServices.${name}, which the application's services do not have: it is undefined when the process runs.`, element);
        }
    }

    checkExpression(expression: string, what: string, element) {
        const script = scriptOf(expression);
        this.checkServiceReferences(script, what, element);
        // the handler's context is in scope too
        const context = this.server?.scriptHandler?.context ?? {};
        const names = freeNames(script).filter(name => !EXPRESSION_SCOPE.has(name) && !(name in globalThis) && !(name in context));
        // Camunda's JUEL (${amount gt 100 and approved}): its operators are not JavaScript
        const juel = names.filter(name => JUEL_OPERATORS[name]);
        if (juel.length) {
            const use = juel.map(op => `'${op}' with ${JUEL_OPERATORS[op]}`).join(', ');
            this.add('error', 'expression-juel', `The ${what} expression is written in JUEL (Camunda); expressions here are JavaScript: replace ${use}.`, element);
            return;
        }
        try {
            Function(...Object.keys(context), ScriptHandler.getJSvars({}) + `return (${script});`);
        }
        catch (exc) {
            this.add('error', 'expression-syntax', `The ${what} expression does not compile: ${exc.message}`, element);
            return;
        }
        // Camunda reads process variables by name (${amount}); here they are in data (data.amount)
        for (const name of names)
            this.add('warning', 'expression-unknown-name', `The ${what} expression reads '${name}', which expressions do not have: process data is data.${name}; `
                + `expressions also see ${[...EXPRESSION_SCOPE].join(', ')}.`, element);
    }

    /** A text with ${...} parts: each part is an expression. */
    checkTemplate(text: string, what: string, element) {
        for (const part of templateParts(text) || [])
            if (typeof part != 'string')
                this.checkExpression('${' + part.script + '}', what, element);
    }

    /** A value evaluated only when it is an expression ($js, ${js}) or has ${...} parts; any other text is as written. */
    checkValue(value: string, what: string, element) {
        if (expressionScript(value) !== null)
            this.checkExpression(value, what, element);
        else if (templateParts(value))
            this.checkTemplate(value, what, element);
        else if (value.includes('${'))
            this.add('warning', 'template-not-closed', `The ${what} has a '\${' without its '}': it is the text as written, not filled in.`, element);
    }

    checkTimer(timer, element, checkScripts: boolean) {
        const checks = [['duration', timer.duration], ['cycle', timer.timeCycle], ['date', timer.timeDate]];
        for (const [kind, value] of checks) {
            if (!value) continue;
            const text = String(value).trim();
            if (isEvaluated(text)) {      // $js, ${js}, or a text with ${...} parts (PT${data.days}D)
                if (checkScripts) this.checkValue(text, `timer ${kind}`, element);
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
async function verifyModel(source: string, server?: IBPMNServer, name = 'model', options?: IVerifyOptions): Promise<IModelVerification> {
    return await new ModelVerifier(server, options).verify(source, name);
}

export { verifyModel, ModelVerifier };
export type { IModelIssue, IModelVerification, ModelIssueSeverity, IVerifyOptions };

/** A model's or a table's text as its expressions read: XML's entities decoded. */
function decodeXml(text: string): string {
    return String(text ?? '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#10;/g, '\n').replace(/&amp;/g, '&');
}

/** Each appServices.<name> a text reads, and how many arguments it is called with (null: not called there). */
function appServicesCalls(text: string): { name: string; args: number | null }[] {
    const calls = [];
    for (const m of text.matchAll(/\bappServices\s*\.\s*([A-Za-z_$][\w$]*)\s*(\()?/g)) {
        if (!m[2]) { calls.push({ name: m[1], args: null }); continue; }
        // its arguments: the commas at its own depth, up to its closing parenthesis
        let depth = 0, args = 0, any = false, quote: string | null = null;
        for (let i = m.index + m[0].length; i < text.length; i++) {
            const c = text[i];
            if (quote) { if (c === '\\') i++; else if (c === quote) quote = null; continue; }
            if (c === '"' || c === "'" || c === '`') { quote = c; any = true; continue; }
            if (c === '(' || c === '[' || c === '{') { depth++; any = true; continue; }
            if (c === ')' || c === ']' || c === '}') { if (depth === 0) break; depth--; continue; }
            if (c === ',' && depth === 0) { args++; continue; }
            if (!/\s/.test(c)) any = true;
        }
        calls.push({ name: m[1], args: any ? args + 1 : 0 });
    }
    return calls;
}
