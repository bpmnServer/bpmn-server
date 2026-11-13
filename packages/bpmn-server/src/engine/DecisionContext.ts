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
 *   actors        who did what in the instance: actors.initiator, actors.<name> (owf:actor), actors.assignee, actors.candidate
 *   task          the element a decision is about
 *   decision      what is deciding: { kind, name }
 *   appServices   the application's functions
 *
 * A decision table also reads the data's fields by name (`amount`) and its task's prepared inputs by name, under the
 * names above, which the data can't set. Then the application's facts: appDelegate.decisionContext(context, about).
 */

/** What is deciding: a business rule task's decision, an assignment policy, a security policy. */
export type DecisionKind = 'decision' | 'assignment' | 'security';

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

/** The actors every instance has; a model names its own with owf:actor. */
export const BUILT_IN_ACTORS = ['initiator', 'assignee', 'candidate'] as const;

/** The names the protocol sets: the data and the prepared inputs can't. */
export const DECISION_KEYS = ['data', 'user', 'actors', 'task', 'decision', 'item', 'this', 'instance', 'appServices'] as const;

/** An actor: a user's name, several (latest first), or none. */
export type Actor = string | string[] | null;

const asList = (value): string[] => (Array.isArray(value) ? value : value == null || value === '' ? [] : String(value).split(','))
    .map(v => String(v ?? '').trim()).filter(Boolean);
const attr = (tag: string, name: string) => new RegExp(`\\s(?:[\\w.-]+:)?${name}\\s*=\\s*"([^"]*)"`).exec(tag)?.[1];

const elementsOfSource = new Map<string, Map<string, string>>();

/**
 * The elements a model names as actors (`owf:actor="approver"`), by element id. `model`: its XML, or a loaded
 * definition (its nodes).
 */
export function actorElements(model: any): Map<string, string> {
    if (!model) return new Map();
    if (typeof model === 'string') {
        let found = elementsOfSource.get(model);
        if (found) return found;
        found = new Map();
        for (const [tag] of model.matchAll(/<(?:[\w.-]+:)?\w+\b[^>]*\sowf:actor\s*=\s*"[^"]*"[^>]*>/g)) {
            const id = attr(tag, 'id'), name = attr(tag, 'actor')?.trim();
            if (id && name) found.set(id, name);
        }
        if (elementsOfSource.size > 200) elementsOfSource.delete(elementsOfSource.keys().next().value);
        elementsOfSource.set(model, found);
        return found;
    }
    const found = new Map<string, string>();
    const nodes = model.nodes instanceof Map ? [...model.nodes.values()] : [];
    for (const node of nodes) {
        const name = node?.def?.$attrs?.['owf:actor'] ?? node?.def?.actor;
        if (name && String(name).trim()) found.set(node.id, String(name).trim());
    }
    return found;
}

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

/** Who started an instance: its start event's item's user, else its first item's, else the instance's. */
export function initiatorOf(instance: any, items: any[] = instance?.items ?? []): string | null {
    const start = items.find(i => elementType(i) === 'bpmn:StartEvent' && i.userName);
    const first = [...items].sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0))[0];
    return start?.userName ?? first?.userName ?? instance?.userName ?? null;
}

const elementType = (item: any) => item?.type ?? item?.element?.type ?? item?.node?.type;
const elementIdOf = (item: any) => item?.elementId ?? item?.element?.id ?? item?.node?.id;
const one = (names: string[]): Actor => {
    const unique = [...new Set(names.filter(Boolean))];
    return unique.length === 0 ? null : unique.length === 1 ? unique[0] : unique;
};

/**
 * An instance's actors, worked out from its items: who started it, who completed each element the model names
 * (`elements`, from actorElements), the waiting user tasks' assignees and candidates (users and groups). With
 * `scope` (an item's data path), only the items of its branch count, as its `data` does; without, all of them.
 */
export function actorsOf({ instance, items = instance?.items ?? [], tokens = instance?.tokens, elements = new Map(), scope }:
    { instance?: any; items?: any[]; tokens?: any[]; elements?: Map<string, string>; scope?: string | null }): Record<string, Actor> {
    const latestFirst = [...items].sort((a, b) => (b.seq ?? 0) - (a.seq ?? 0))
        .filter(item => inScope(dataPathOf(item, tokens), scope));
    const actors: Record<string, Actor> = { initiator: initiatorOf(instance, items) };
    const byName = new Map<string, string[]>();
    for (const name of new Set(elements.values())) byName.set(name, []);
    for (const item of latestFirst) {
        const name = elements.get(elementIdOf(item));
        if (name && item.status === 'end' && item.userName) byName.get(name)!.push(item.userName);
    }
    for (const [name, users] of byName)
        if (!(BUILT_IN_ACTORS as readonly string[]).includes(name)) actors[name] = one(users);
    const waiting = latestFirst.filter(i => elementType(i) === 'bpmn:UserTask' && i.status === 'wait');
    actors.assignee = one(waiting.map(i => i.assignee).filter(Boolean));
    actors.candidate = one(waiting.filter(i => !i.assignee).flatMap(i => [...asList(i.candidateUsers), ...asList(i.candidateGroups)]));
    return actors;
}

/** The actors a user is: the names whose value is them (or, for a candidate, one of their groups). */
export function actorNamesOf(user: IDecisionUser, actors: Record<string, Actor>): string[] {
    const me = user?.userName;
    const groups = user?.userGroups ?? [];
    return Object.entries(actors).filter(([name, value]) => {
        const values = value == null ? [] : Array.isArray(value) ? value : [value];
        return values.some(v => (me && v === me) || (name === 'candidate' && groups.includes(v)));
    }).map(([name]) => name);
}

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
 * inputs; `items`: the instance's items, when they aren't `instance.items` (a running instance's); `elements`: the
 * model's actors (actorElements); `scope`: the item's data path; `appServices`: the application's functions.
 */
export async function decisionContext({ data, input, user, instance, task, kind, name, appDelegate, appServices, item,
    items, elements, scope, log }: {
    data?: Record<string, any>; input?: Record<string, any>; user?: IDecisionUser; instance?: any; task?: string;
    kind: DecisionKind; name?: string; appDelegate?: any; appServices?: any; item?: any; items?: any[];
    elements?: Map<string, string>; scope?: string | null; log?: (message: string) => void;
}): Promise<Record<string, any>> {
    const scoped = data && typeof data === 'object' ? data : {};
    const person: IDecisionUser = { ...(user ?? {}), userName: user?.userName ?? null, userGroups: user?.userGroups ?? [] };
    const itemSeen = itemView(item, scoped);
    const context: Record<string, any> = {
        ...scoped,
        ...(input && typeof input === 'object' ? input : {}),
        data: scoped,
        user: person,
        actors: actorsOf({ instance, items: items ?? instance?.items ?? [], elements, scope }),
        task: task ?? '',
        decision: { kind, name: name ?? '' },
        item: itemSeen,
        this: itemSeen,
        instance: instanceView(instance),
        appServices: feelView(appServices) ?? {},
    };
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
 * The context for a decision about a running item (a business rule task's, a user task's assignment policy): its
 * data in its scope, its prepared inputs, the operation's user, the running instance's items and its model's actors.
 */
export function runningDecisionContext(item: any, { kind, name, task }: { kind: DecisionKind; name?: string; task?: string }) {
    const token = item.token;
    const execution = token.execution;
    return decisionContext({
        kind, name, data: token.data, input: item.input, task: task ?? item.elementId ?? item.node?.id, item,
        user: { userName: execution.userName ?? null }, instance: execution.instance,
        items: typeof execution.getItems === 'function' ? execution.getItems() : undefined,
        elements: actorElements(execution.definition), scope: token.dataPath ?? '',
        appServices: execution.servicesProvider, appDelegate: execution.appDelegate,
        log: message => token.log(message),
    });
}
