import { moddleOptions as defaultModdleOptions } from './js-bpmn-moddle.js';
import { Definition } from './Definition.js';
import { Behaviour_names } from './behaviours/BehaviourLoader.js';
import { ServiceTask, BusinessRuleTask, CallActivity } from './Tasks.js';
import { ScriptHandler } from '../engine/ScriptHandler.js';
import { expressionScript, scriptOf, templateParts, isEvaluated, freeNames, isFeel, conditionScript } from '../engine/Expressions.js';
import { feelParses } from '../dmn/DMNParser.js';
import { Cron } from '../server/Cron.js';
import { templateProblems } from '../engine/Labels.js';
import type { IBPMNServer } from '../interfaces/server.js';
import { DMNEngine } from '../dmn/DMNEngine.js';
import { DMNParser } from '../dmn/DMNParser.js';
import { policyFile, roleNames, POLICY_FIELDS, POLICIES_FOLDER } from '../engine/AssignmentPolicy.js';

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

    get decisionsFolder(): string {
        return this.options.decisionsFolder
            || (this.server && this.server.configuration && this.server.configuration.definitionsPath) || null;
    }

    /** Label templates (camunda:label, camunda:endLabel): data paths, names once (engine/Labels.ts). */
    checkLabel(def) {
        for (const attr of ['camunda:label', 'camunda:endLabel']) {
            const template = def?.$attrs?.[attr];
            if (template == null) continue;
            for (const problem of templateProblems(template))
                this.add('error', 'label-template', `Label '${template}': ${problem}.`, def);
        }
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

    async verify(source: string, name: string): Promise<IModelVerification> {
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
                await this.verifyApplication(name, source, definition);
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
        const connectors = this.server?.connectors;
        if (!connectors)
            return;
        const id = ref.slice(0, slash), operationId = ref.slice(slash + 1);
        const found = await connectors.get(id).catch(() => undefined);
        if (!found) {
            this.add('error', 'connector-unknown', `The server has no connector '${id}': an administrator adds it (Administration, Connectors).`, def);
            return;
        }
        if (!found.enabled)
            this.add('warning', 'connector-disabled', `The connector '${id}' is disabled: the task fails until an administrator enables it.`, def);
        let operation;
        try {
            operation = (await connectors.operations(id)).find(op => op.operationId === operationId);
        }
        catch (exc) {
            this.add('error', 'connector-unreadable', `The connector '${id}' can not be read: ${exc.message}`, def);
            return;
        }
        if (!operation) {
            this.add('error', 'connector-operation-unknown', `The connector '${id}' has no operation '${operationId}'.`, def);
            return;
        }
        if (!operation.enabled)
            this.add('warning', 'connector-operation-disabled', `The operation '${ref}' is disabled: the task fails until an administrator enables it.`, def);
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

    async verifyExecutables(definition: Definition) {
        const handler = this.server && this.server.scriptHandler;
        // scripts and expressions are only checked for the built-in JavaScript handler
        const checkScripts = !handler || handler instanceof ScriptHandler;
        const knownModels = await this.knownModels();
        const services = await this.servicesProvider();
        this.services = services;

        definition.processes.forEach(proc => {
            this.processId = proc.id;
            this.checkLabel(proc.def || proc);
            if (checkScripts) proc.scripts?.forEach((scripts, event) => scripts.forEach(s => this.checkScript(s, `process '${event}' script`, proc.def || proc)));
        });

        const lanes = new Map<string, any>();
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

            const policy = def.$attrs?.['camunda:assignmentPolicy'];
            if (typeof policy == 'string' && policy.trim())
                await this.checkPolicy(policy.trim(), def);
            if (node.lane) lanes.set(node.lane, def);

            if (node instanceof CallActivity && node.calledElement && knownModels && !knownModels.has(node.calledElement))
                this.add('warning', 'called-model-missing', `Called process '${node.calledElement}' is not a saved model.`, def);
        }
        // a lane is a role: one roles.json doesn't name
        const roles = this.roles();
        if (roles)
            for (const [lane, def] of lanes)
                if (!roles.includes(lane))
                    this.add('warning', 'role-unknown', `Lane '${lane}' is not a role of roles.json (${roles.join(', ')}).`, def);

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

    /** The roles of the models folder's roles.json; null without one (or a folder); a bad file is an error. */
    roles(): string[] | null {
        if (this.#roles !== undefined) return this.#roles;
        try { this.#roles = this.decisionsFolder ? roleNames(this.decisionsFolder) : null; }
        catch (exc) { this.add('error', 'roles-invalid', exc.message); this.#roles = null; }
        return this.#roles;
    }
    #roles: string[] | null | undefined = undefined;

    /**
     * A user task's assignment policy (engine/AssignmentPolicy.ts): in policies/, a readable decision whose outputs
     * are the assignment's fields; the groups it names, roles of roles.json (when there is one).
     */
    async checkPolicy(policy: string, def) {
        const folder = this.decisionsFolder;
        if (!folder) return;
        const file = policyFile(folder, policy);
        if (!file) {
            this.add('error', 'assignment-policy-not-found', `Assignment policy '${policy}': there is no ${POLICIES_FOLDER}/${policy}.dmn.xml.`, def);
            return;
        }
        let definitions;
        try { definitions = await DMNParser.loadFile(file); }
        catch (exc) {
            this.add('error', 'assignment-policy-invalid', `Assignment policy '${policy}': ${exc.message}`, def);
            return;
        }
        for (const issue of DMNParser.check(definitions))
            this.add('error', 'assignment-policy-invalid', `Assignment policy '${policy}': ${issue.message}`, def);
        const table = DMNEngine.topDecision(definitions)?.table;
        if (!table) return;
        const fields: readonly string[] = POLICY_FIELDS;
        for (const output of table.outputs)
            if (!fields.includes(output.name))
                this.add('warning', 'assignment-policy-output', `Assignment policy '${policy}': output '${output.name}' is not ${POLICY_FIELDS.join(', ')}; it is not used.`, def);
        const roles = this.roles();
        const groups = table.outputs.findIndex(o => o.name === 'candidateGroups');
        if (!roles || groups < 0) return;
        for (const [r, rule] of table.rules.entries()) {
            const cell = (rule.outputEntries[groups] ?? '').trim();
            // a literal: "Director", or "A,B"; an expression is known only when it runs
            const literal = /^"([^"]*)"$/.exec(cell);
            for (const group of literal ? literal[1].split(',').map(g => g.trim()).filter(Boolean) : [])
                if (!roles.includes(group))
                    this.add('warning', 'role-unknown', `Assignment policy '${policy}', rule ${r + 1}: '${group}' is not a role of roles.json (${roles.join(', ')}).`, def);
        }
    }

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
