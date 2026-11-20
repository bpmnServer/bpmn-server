/**
 * Add-ons: what is built on the engine (docs/design/add-ons.md). The engine runs BPMN and knows nothing of any add-on.
 * An add-on registers for the engine's own events (`server.listener.subscribe`: `wait`, `assigned`, `assign`, `end`,
 * `process.end`, ...) and does its work there; for what has no event (checking a model, a decision by its tests' name)
 * it says what it adds here. The policies (assignment, notification, security: src/addons/) are add-ons; so is anything
 * an application adds.
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

export interface IAddOn {
    /** its name, for the log */
    name: string;

    /**
     * Registers for what it needs, as the server is built: its events (`server.listener.subscribe`). Its subscriptions
     * end with the server.
     */
    register?(server: any): void;

    /** Checks of a process's element (`node` the engine's, `def` its model element) when a model is verified. */
    verifyNode?(check: IAddOnModelCheck, node: any, def: any): Promise<void> | void;
    /** Checks of a process (`proc` the engine's, `def` its model element). */
    verifyProcess?(check: IAddOnModelCheck, proc: any, def: any): Promise<void> | void;
    /** The decision files a model uses through this add-on. */
    decisionFiles?(definition: any, folder: string): Promise<IAddOnDecisionFile[]> | IAddOnDecisionFile[];
    /** A decision of the add-on's by its tests' name (`LeaveApproval.policy`): its folder and name, or null if not its. */
    decisionByName?(ref: string, folder: string): { folder: string; name: string } | null;
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
