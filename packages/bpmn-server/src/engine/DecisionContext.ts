/**
 * One set of names for every expression (docs/design/expressions.md): a model's JavaScript ($(...), scripts, input
 * parameters) and its FEEL (conditions, a business rule task's decision, the assignment and security policies) see the
 * same names, built here:
 *
 *   data          the item's data, in its scope (a multi-instance's branch); at the top, the instance's
 *   instance      the instance: instance.data (all of it), instance.name (its process), instance.id
 *   item, this    the item: item.element (its BPMN element), item.status, item.userName
 *   input, output the item's prepared inputs and its outputs
 *   user          who acts or asks, as the application defines it (IUserInfo: userName, userGroups, ...)
 *   (add-ons')    the names an add-on registers (engine/AddOns.ts): the Policies add-on's `actors`, who did what
 *   task          the element a decision is about
 *   decision      what is deciding: { kind, name }
 *   appServices   the application's functions
 *
 * A decision table also reads the data's fields by name (`amount`) and its task's prepared inputs by name, under the
 * names above, which the data can't set. Then the application's facts: appDelegate.decisionContext(context, about).
 */
import { appVarsFor } from './AppContract.js';
import { decisionContextOf } from './Context.js';
import { registrationsOf } from './AddOns.js';
import type { IExpressionPlace } from './AddOns.js';

/** What is deciding: a business rule task's decision, an assignment, security or notification policy. */
export type DecisionKind = 'decision' | 'assignment' | 'security' | 'notification';

/** The user acting (the operation's) or asking (a security policy's): the application's (IUserInfo), or a name only. */
export interface IDecisionUser {
    userName?: string | null;
    userGroups?: string[];
    [more: string]: any;
}

/** What a decision is about, as the application's hook is told. */
export interface IDecisionAbout {
    kind: DecisionKind;
    /** the decision's or the policy's name */
    name?: string;
    user: IDecisionUser;
    instance?: any;
    task?: string;
}

/** The names the protocol sets: the data and the prepared inputs can't. */
export const DECISION_KEYS = ['data', 'user', 'actors', 'task', 'decision', 'item', 'this', 'instance', 'appServices'] as const;

/** An item's data path (its scope): a running item's token's, else its saved token's ('' at the top). */
export function dataPathOf(item: any, tokens?: any[]): string {
    if (item?.token && typeof item.token.dataPath === 'string') return item.token.dataPath;
    if (Array.isArray(tokens) && item?.tokenId !== undefined) {
        const token = tokens.find(t => t?.id === item.tokenId) ?? tokens[item.tokenId];
        if (typeof token?.dataPath === 'string') return token.dataPath;
    }
    return '';
}

/** Whether an item at `path` is in the scope `scope`: the same branch, one inside it, or one it is inside. */
export function inScope(path: string, scope: string | null | undefined): boolean {
    if (scope == null || path === scope || path === '' || scope === '') return true;
    return path.startsWith(scope + '.') || scope.startsWith(path + '.');
}

export const elementType = (item: any) => item?.type ?? item?.element?.type ?? item?.node?.type;
export const elementIdOf = (item: any) => item?.elementId ?? item?.element?.id ?? item?.node?.id;
/**
 * An object's functions as FEEL can call them: a plain object of plain functions (FEEL reads an object's own
 * properties, and can't call a class's methods or `x => x`), its objects' too, two levels down.
 */
const views = new WeakMap<object, any>();
export function feelView(target: any, depth = 2): any {
    if (!target || typeof target !== 'object' && typeof target !== 'function' || depth < 0) return undefined;
    if (depth === 2 && views.has(target)) return views.get(target);
    const view: Record<string, any> = {};
    const names = new Set<string>();
    for (let o = target; o && o !== Object.prototype && o !== Function.prototype; o = Object.getPrototypeOf(o))
        Object.getOwnPropertyNames(o).forEach(n => names.add(n));
    for (const name of names) {
        if (name === 'constructor' || name.startsWith('_') || name in view) continue;
        let value;
        try { value = target[name]; } catch { continue; }
        if (typeof value === 'function')
            view[name] = function (a, b, c, d, e) {
                const args = [a, b, c, d, e];
                while (args.length && (args[args.length - 1] === undefined || args[args.length - 1] === null)) args.pop();
                return value.apply(target, args);
            };
        else if (value && typeof value === 'object' && !Array.isArray(value) && depth > 0) {
            const nested = feelView(value, depth - 1);
            if (nested && Object.keys(nested).length) view[name] = nested;
        }
    }
    if (depth === 2) views.set(target, view);
    return view;
}

/** An item as an expression reads it: its own fields and its element, not the engine's objects. */
export function itemView(item: any, data?: any) {
    if (!item) return null;
    const element = item.element ?? item.node;
    return {
        id: item.id, elementId: elementIdOf(item), name: item.name ?? element?.name, type: elementType(item),
        status: item.status, userName: item.userName ?? null, assignee: item.assignee ?? null, seq: item.seq,
        element: { id: elementIdOf(item), name: element?.name ?? item.name, type: elementType(item) },
        data: data ?? item.data, input: item.input ?? {}, output: item.output ?? {},
    };
}

/** An instance as an expression reads it. */
export function instanceView(instance: any) {
    if (!instance) return null;
    return { id: instance.id, name: instance.name, status: instance.status, data: instance.data ?? {},
        startedAt: instance.startedAt, endedAt: instance.endedAt ?? null };
}

/**
 * The context a decision table reads (see above). `data`: the item's data (in its scope); `input`: its prepared
 * inputs; `names`: the names the add-ons give (namesAt: the Policies add-on's `actors`); `appServices`: the
 * application's functions.
 */
export async function decisionContext({ data, input, user, instance, task, kind, name, appDelegate, appServices, item,
    names, log }: {
    data?: Record<string, any>; input?: Record<string, any>; user?: IDecisionUser; instance?: any; task?: string;
    kind: DecisionKind; name?: string; appDelegate?: any; appServices?: any; item?: any;
    names?: Record<string, any>; log?: (message: string) => void;
}): Promise<Record<string, any>> {
    const scoped = data && typeof data === 'object' ? data : {};
    const person: IDecisionUser = { ...(user ?? {}), userName: user?.userName ?? null, userGroups: user?.userGroups ?? [] };
    const itemSeen = itemView(item, scoped);
    const context: Record<string, any> = {
        ...scoped,
        ...(input && typeof input === 'object' ? input : {}),
        data: scoped,
        user: person,
        ...(names ?? {}),
        task: task ?? '',
        decision: { kind, name: name ?? '' },
        item: itemSeen,
        this: itemSeen,
        instance: instanceView(instance),
        appServices: feelView(appServices) ?? {},
    };
    // a reserved name no one gave (`actors` without the Policies add-on) is not the data's either
    for (const key of DECISION_KEYS) if (!(key in (names ?? {})) && context[key] === scoped[key] && key !== 'data') delete context[key];
    // the application's variables (appVars.<name>, docs/design/app-contract.md §2.1): its variables class's, worked
    // out before the table is asked, for this decision (evaluatingSource)
    if (appDelegate && (appDelegate.appVarsClass || typeof appDelegate.getAppVars === 'function')) {
        try {
            const evaluatingSource = { type: 'decision', id: name ?? '', ...(kind !== 'decision' ? { policy: kind } : {}) };
            // source: where it was made (docs/design/context-object.md); evaluatingSource, before 3.7.5, deprecated
            // the context (docs/design/context-object.md), kind dmn: the live case and item, as a script's; the table's
            // names (its views of them, `decision` as before) besides
            const of = decisionContextOf(name ?? '', input, { user: person as any, instance, item, data: scoped }, kind !== 'decision' ? kind : undefined);
            context.appVars = await appVarsFor(appDelegate, { ...context, ...of, decision: context.decision, evaluatingSource });
        }
        catch (error) {
            log?.(`appVars failed (${kind} ${name ?? ''}): ${error?.message ?? error}`);
            context.appVars = {};
        }
    }
    if (typeof appDelegate?.decisionContext === 'function') {
        try {
            const facts = await appDelegate.decisionContext(context, { kind, name, user: person, instance, task } as IDecisionAbout);
            if (facts && typeof facts === 'object') Object.assign(context, facts);
            // the user's groups, said by the application: where a rule reads them
            if (Array.isArray(facts?.userGroups)) context.user = { ...context.user, userGroups: facts.userGroups };
        }
        catch (error) {
            log?.(`decisionContext failed (${kind} ${name ?? ''}): ${error?.message ?? error}; decided without the application's facts`);
        }
    }
    return context;
}

/**
 * The names the add-ons give expressions and decisions (engine/AddOns.ts, addExpressionName) for a place in a running
 * instance: its items, its model, the data path of the branch (`scope`).
 */
export function namesAt(server: any, at: IExpressionPlace): Record<string, any> {
    const names: Record<string, any> = {};
    for (const provider of registrationsOf(server).expressionNames) {
        try { names[provider.name] = provider.of(at); }
        catch { /* a provider that fails gives no name: the expression says what it misses */ }
    }
    return names;
}

/**
 * The context for a decision about a running item (a business rule task's, a user task's assignment policy): its
 * data in its scope, its prepared inputs, the operation's user, and the add-ons' names for its place (actors).
 */
export function runningDecisionContext(item: any, { kind, name, task }: { kind: DecisionKind; name?: string; task?: string }) {
    const token = item.token;
    const execution = token.execution;
    return decisionContext({
        kind, name, data: token.data, input: item.input, task: task ?? item.elementId ?? item.node?.id, item,
        user: { userName: execution.userName ?? null }, instance: execution.instance,
        names: namesAt(execution.server, { instance: execution.instance, definition: execution.definition, scope: token.dataPath ?? '', materialized: true,
            items: typeof execution.getItems === 'function' ? execution.getItems() : undefined }),
        appServices: execution.servicesProvider, appDelegate: execution.appDelegate,
        log: message => token.log(message),
    });
}
