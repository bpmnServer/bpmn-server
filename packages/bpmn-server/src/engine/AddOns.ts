/**
 * Add-ons: what is built on the engine and plugs into it here (docs/design/add-ons.md). The engine runs BPMN and knows
 * nothing of any add-on: it calls these hooks at its points, and an add-on does its work in them. The policies
 * (assignment, notification, security: src/policies/) are add-ons; so is anything an application adds.
 *
 * The rule: an add-on depends on the engine and on nothing else of ours, no other add-on; the engine imports nothing
 * from an add-on (test/add-ons.test.mjs checks both). Which add-ons a server has is its configuration's: `addOns(server)`,
 * by default the policies (common/DefaultConfiguration.ts).
 *
 * A hook that throws is logged and the process goes on: an add-on never fails a process.
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

    /** A user task starts, before it waits and is saved: the add-on may decide who works on it (ASSIGNMENT_FIELDS). */
    taskStarting?(item: any, node: any): Promise<void> | void;
    /** A user task is waiting for someone, its assignment decided. */
    taskWaiting?(item: any, node: any): Promise<void> | void;
    /** A user task was completed (not cancelled). */
    taskCompleted?(item: any, node: any): Promise<void> | void;
    /** A person changed who works on a waiting task (Execution.assign): its fields before, and the ones given. */
    taskReassigned?(execution: any, item: any, before: Record<string, any>, changed: Record<string, any>, userName: string): Promise<void> | void;
    /** An instance ended. */
    executionEnded?(execution: any): Promise<void> | void;

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

/**
 * Each add-on's hook called in turn, awaited. One that throws is logged (`log`) and the next is called: an add-on
 * never fails the engine's work.
 */
export async function callAddOns(addOns: IAddOn[], hook: keyof IAddOn, args: any[], log?: (message: string) => void): Promise<void> {
    for (const addOn of addOns) {
        const fn = addOn[hook];
        if (typeof fn !== 'function') continue;
        try { await (fn as Function).apply(addOn, args); }
        catch (error) { log?.(`add-on ${addOn.name} (${String(hook)}): ${error?.message ?? error}`); }
    }
}
