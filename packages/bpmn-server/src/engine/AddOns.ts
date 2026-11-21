/**
 * Add-ons: what is built on the engine (docs/design/add-ons.md). The engine runs BPMN and knows nothing of any add-on.
 * An add-on registers, as the server is built (`register(server)`): for the engine's own events
 * (`server.listener.subscribe`: `start`, `assign`, `wait`, `end`, `process.end`, ...), and, for what has no event, in
 * the server's registrations (`server.registrations`: its model checks, its decisions by their tests' name). The
 * engine runs what is registered and names no add-on. The policies (assignment, notification, security: src/addons/)
 * are add-ons; so is anything an application adds.
 *
 * The rule: an add-on depends on the engine and on nothing else of ours, no other add-on; the engine imports nothing
 * from an add-on (test/add-ons.test.mjs checks both). Which add-ons a server has is its configuration's: `addOns(server)`,
 * by default the policies (common/DefaultConfiguration.ts). Each is registered as the server is built.
 *
 * An event's subscriber that throws is reported and the process goes on (server/Listener.ts): an add-on never fails a process.
 */
import type { IModelIssue } from '../elements/verifyModel.js';

/** The fields that say who works on a user task: its assignee and its candidates. The engine's, an add-on may set them. */
export const ASSIGNMENT_FIELDS = ['assignee', 'candidateUsers', 'candidateGroups'] as const;

/** What a model check gives an add-on: where the models are, the roles, and a way to report. */
export interface IAddOnModelCheck {
    /** the models folder (decision files, policies), or null when the model is checked alone */
    folder: string | null;
    /** the roles (roles.json and the application's contract), or null when there are none */
    roles(): string[] | null;
    /** an issue about this element (its process is the one being checked) */
    add(severity: IModelIssue['severity'], code: string, message: string, element?: any): void;
    /** whether the application has a service (`billing.charge`); undefined when its services can't be known here */
    hasService(name: string): boolean | undefined;
    /** a connector's operation (`connector/operationId`), the issues of one that isn't there reported; null then */
    connectorOperation(ref: string, element: any, fails: string): Promise<any | null>;
}

/** A decision file a model uses through an add-on (a policy), for the checks of what decisions read and call. */
export interface IAddOnDecisionFile {
    /** what it is, in words: `assignment policy Approval` */
    what: string;
    file: string;
    /** whether the actors it reads are checked against the model's (default true) */
    actors?: boolean;
    /** whether the functions it calls are checked against the application's contract (default true) */
    calls?: boolean;
}

/**
 * An add-on's manifest (`addon.json` in its folder): its name, its title, and the model attributes it reads. Read for
 * every add-on bpmn-server comes with, on or off, so a model using one that's off is told (verifyModel's add-on-off),
 * and the model report and the Settings page show its attributes.
 */
export interface IAddOnManifest {
    name: string;
    title: string;
    description?: string;
    /** the model attributes it reads: `camunda:candidateGroups`, `owf:assignmentPolicy` */
    attributes: string[];
    /** the model elements it reads: `owf:list`, `owf:lookup` */
    elements?: string[];
}

/** A model check an add-on registers: of each element, of each process, and the decision files the model uses through it. */
export interface IModelCheck {
    /** whose, for a check that fails */
    name: string;
    /** Checks of a process's element (`node` the engine's, `def` its model element) when a model is verified. */
    verifyNode?(check: IAddOnModelCheck, node: any, def: any): Promise<void> | void;
    /** Checks of a process (`proc` the engine's, `def` its model element). */
    verifyProcess?(check: IAddOnModelCheck, proc: any, def: any): Promise<void> | void;
    /** The decision files a model uses through it. */
    decisionFiles?(definition: any, folder: string): Promise<IAddOnDecisionFile[]> | IAddOnDecisionFile[];
    /**
     * Checks of the whole model, once: its source, its definition, and the decision files it uses (its business rule
     * tasks' and the add-ons'), each with its text, those whose actors are read.
     */
    verifyModel?(check: IAddOnModelCheck, model: { source: string; definition: any; decisions: { what: string; text: string }[] }): Promise<void> | void;
}

/**
 * What a user sees, narrowed by an add-on: the query of the tasks (`items`), the cases (`instances`) or the processes
 * they may start (`startEvents`), changed for this user (who is not an administrator). Each registered one is applied
 * in turn (SecureUser.qualify*).
 */
export interface IQueryFilter {
    name: string;
    filter(kind: 'items' | 'instances' | 'startEvents', user: { userName: string; userGroups: string[] }, query: Record<string, any>): Record<string, any>;
}

/** A place in an instance, where an expression or a decision is evaluated: for the names an add-on gives it. */
export interface IExpressionPlace {
    instance: any;
    /** the instance's items (a running instance's); `instance.items` when not given */
    items?: any[];
    /** its model: a loaded definition, or its XML */
    definition?: any;
    /** the data path of the branch (a multi-instance's), '' at the top; null: all of them */
    scope?: string | null;
    /** plain values (a decision's, the sandbox's), not worked out when read */
    materialized?: boolean;
}

/** A name every expression and decision sees, an add-on's: `actors` (the Policies add-on). */
export interface IExpressionName {
    name: string;
    of(at: IExpressionPlace): any;
}

/** A form field's value refused by an add-on's rule: which field, the rule, why. */
export interface IFieldProblem { field: string; rule: string; message: string; }

/**
 * A rule a form field's value is held to when a user task is completed (elements/FormRules.ts), an add-on's: a list's
 * value one of its choices. `value`: the value sent; `data`: the case's data with what was sent. Null: nothing to say.
 */
export interface IFieldRule {
    name: string;
    check(server: any, field: any, value: any, at: { data: Record<string, any>; current: any }, context: Record<string, any>): Promise<IFieldProblem | null> | IFieldProblem | null;
}

/** A form field's choices, asked as the form is filled (a list, a lookup): an add-on's; null when the field has none it knows. */
export interface IFieldChoices {
    name: string;
    choices(server: any, field: any, criteria: Record<string, any>, context: Record<string, any>): Promise<any[] | null> | any[] | null;
}

/** A decision found by its tests' name (`LeaveApproval.policy`): its folder and name, or null when it isn't this one's. */
export type DecisionLookup = (ref: string, folder: string) => { folder: string; name: string } | null;

/**
 * What the add-ons registered where the engine has no event: the engine runs them, and knows no add-on. One for each
 * server (`server.registrations`), filled as its add-ons are registered.
 */
export class Registrations {
    readonly modelChecks: IModelCheck[] = [];
    readonly decisionLookups: DecisionLookup[] = [];
    readonly queryFilters: IQueryFilter[] = [];
    readonly expressionNames: IExpressionName[] = [];
    readonly fieldRules: IFieldRule[] = [];
    readonly fieldChoices: IFieldChoices[] = [];
    addFieldRule(rule: IFieldRule) { this.fieldRules.push(rule); }
    addFieldChoices(choices: IFieldChoices) { this.fieldChoices.push(choices); }
    addExpressionName(name: IExpressionName) { this.expressionNames.push(name); }
    addModelCheck(check: IModelCheck) { this.modelChecks.push(check); }
    addQueryFilter(filter: IQueryFilter) { this.queryFilters.push(filter); }
    addDecisionLookup(lookup: DecisionLookup) { this.decisionLookups.push(lookup); }
    /** The API's events' listeners of add-ons registered apart (a launched server): `pre-query`, `pre-action`. */
    readonly apiListeners = new Map<string, ((context: any) => any)[]>();
    addApiListener(event: string, listener: (context: any) => any) {
        this.apiListeners.set(event, [...(this.apiListeners.get(event) ?? []), listener]);
    }
}

/**
 * The API's own events (docs/design/context-object.md): fired before a read (`pre-query`, a context of kind query: a
 * listener adds conditions to `context.conditions`, never widens) and before an action (`pre-action`: a listener may
 * refuse, by throwing). An add-on listens as to any event, `server.listener.on('pre-query', (context) => ...)`.
 */
export const API_EVENTS = ['pre-query', 'pre-action'] as const;
export type ApiEvent = typeof API_EVENTS[number];

/** The listeners of an API event: the server's own (its listener's), or its add-ons' registered apart. */
function apiListenersOf(server: any, event: ApiEvent): ((context: any) => any)[] {
    if (server?.registrations instanceof Registrations && typeof server?.listener?.listeners === 'function')
        return server.listener.listeners(event);
    if (!server || (typeof server?.configuration?.addOns !== 'function' && !Array.isArray(server?.addOns))) return [];
    return registrationsOf(server).apiListeners.get(event) ?? [];
}

/** Whether anything listens to an API event: with none, the API's built-in rules apply. */
export function listensTo(server: any, event: ApiEvent): boolean {
    return apiListenersOf(server, event).length > 0;
}

/** An API event, to each listener in turn, awaited. A listener that throws refuses: the error goes to the caller. */
export async function fireApiEvent(server: any, event: ApiEvent, context: any): Promise<void> {
    for (const listener of apiListenersOf(server, event)) await listener(context);
}

export interface IAddOn {
    /** its name, for the log */
    name: string;

    /**
     * Registers what it brings, as the server is built: for the engine's events (`server.listener.subscribe`), and in
     * `server.registrations` (model checks, decision lookups). Its subscriptions end with the server.
     */
    register(server: { listener: { subscribe(listener: any): () => void; on?(event: string, listener: (...args: any[]) => any): any }; registrations: Registrations; [more: string]: any }): void;
}

/** A server's add-ons registered: the server's own registrations, else (a launched server, none) these add-ons' made apart, once. */
const apart = new WeakMap<object, Registrations>();

/**
 * What a server's add-ons registered. A server built with them has its own; else (a launched server, an object of the
 * application's, a model checked alone) they are registered apart, their events going nowhere: `addOns`, else the
 * server's configuration's.
 */
export function registrationsOf(server: any, addOns?: IAddOn[]): Registrations {
    if (!addOns && server?.registrations instanceof Registrations) return server.registrations;
    const key = addOns ?? server;
    if (key && typeof key === 'object' && apart.has(key)) return apart.get(key);
    const registrations = new Registrations();
    // the engine's events go nowhere; the API's (pre-query, pre-action) are kept, the API here fires them
    const host = { listener: { subscribe: () => () => undefined, on: (event: string, fn: any) => registrations.addApiListener(event, fn) }, registrations, configuration: server?.configuration };
    for (const addOn of addOns ?? addOnsOf(server)) addOn.register?.(host);
    if (key && typeof key === 'object') apart.set(key, registrations);
    return registrations;
}

/**
 * A server's add-ons: what it was built with; a server that wasn't (a launched one, an object of the application's), its
 * configuration's; none when there is neither.
 */
export function addOnsOf(server: any): IAddOn[] {
    if (Array.isArray(server?.addOns)) return server.addOns;
    const make = server?.configuration?.addOns;
    return typeof make === 'function' ? (make.call(server.configuration, server) ?? []) : [];
}
