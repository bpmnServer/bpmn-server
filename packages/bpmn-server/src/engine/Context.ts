/**
 * The context (docs/design/context-object.md): one object, made for each call, handed to the application's code and
 * the add-ons wherever they are called: services, the delegate's hooks, listeners, the API's checks. It lives in the
 * engine's process only. Five kinds, said by its `source`:
 *
 *   item      an item that exists: its scripts, a service it calls, an event about it, an action on it
 *   element   an element with no item yet: a flow's condition, a start's permission, the process starting or ending
 *   dmn       a decision: a policy or a business-rule task
 *   query     a read: the API's `pre-query`
 *   form      a form field's rules and choices
 *
 * What it holds is the engine's own objects (the instance, the item, their data), not copies; code that acts on the
 * process reaches the execution through them. For 3.x it also forwards what it doesn't have to the execution
 * (`context.tokens`, `context.save()`), as the execution was what code was handed before; that is deprecated.
 */
import type { ISecureUser } from '../interfaces/User.js';

export type ContextKind = 'item' | 'element' | 'dmn' | 'query' | 'form';

/** Where a context was made. */
export interface IContextSource {
    kind: ContextKind;
    /** the element (item, element, form) */
    elementId?: string;
    /** what of it: a script's event, an attribute, a service's name, an event's name, a flow, a field */
    what?: string;
    /** a decision's name, and which policy (assignment, security, notification) when it is one */
    decision?: string;
    policy?: string;
    /** a query's kind, a pre-action's action */
    query?: string;
    action?: string;
    field?: string;
}

export interface IContext {
    source: IContextSource;
    /** who acts: the user object (its userName, userGroups) */
    user?: ISecureUser | { userName: string | null; userGroups?: string[] };
    /** the case; its actors are instance.actors */
    instance?: any;
    /** the model's element */
    element?: any;
    /** the item of this call: fixed for it */
    item?: any;
    /** the item's data (its scope of the instance's), else the instance's */
    data?: any;
    /** what is passed in: a service's input, a message's, a form's values */
    input?: any;
    /** an event's name and details (a listener's context) */
    event?: string;
    details?: any;
    /** kind dmn: the decision; kind query: the query, which a listener narrows; kind form: the field */
    decision?: string;
    query?: Record<string, any>;
    field?: string;
    /** kind query, pre-action: the conditions listeners added (ANDed), the action */
    conditions?: Record<string, any>[];
    action?: string;
    /** the application's terms and functions */
    appVars?: any;
    appServices?: any;
    [more: string]: any;
}

const warned = new Set<string>();

/**
 * A context of these fields. With `execution`, what it doesn't have is read from the execution, and written there
 * (deprecated: the context was the execution before 3.7.5); `execution` itself is there too, not enumerable.
 */
export function makeContext(fields: IContext, execution?: any): IContext {
    const context: IContext = { ...fields };
    if (!execution) return context;
    Object.defineProperty(context, 'execution', { value: execution, enumerable: false, configurable: true, writable: true });
    return new Proxy(context, {
        get(target, prop, receiver) {
            if (prop in target || typeof prop === 'symbol') return Reflect.get(target, prop, receiver);
            if (prop in execution) {
                if (!warned.has(String(prop))) {
                    warned.add(String(prop));
                    execution.logger?.log?.(`deprecated: context.${String(prop)} reads the execution: use context.instance, context.item (docs/design/context-object.md)`);
                }
                const value = execution[prop];
                return typeof value === 'function' ? value.bind(execution) : value;
            }
            return undefined;
        },
        set(target, prop, value) {
            if (!(prop in target) && typeof prop === 'string' && prop in execution) execution[prop] = value;
            else target[prop as any] = value;
            return true;
        },
        has(target, prop) { return prop in target || prop in execution; },
    });
}

/** The user an execution acts as: its user object when it was given one, else its user's name. */
function userOf(execution): IContext['user'] {
    return execution?.user ?? { userName: execution?.userName ?? null, userGroups: [] };
}

/** The application's functions of an execution, when it has them at hand. */
function servicesOf(execution) {
    return execution?.servicesProvider ?? execution?.appServices;
}

/** Kind item: an item that exists. */
export function itemContext(item, extra: Partial<IContext> & { what?: string } = {}): IContext {
    const execution = item?.token?.execution;
    const { what, ...rest } = extra;
    return makeContext({
        source: { kind: 'item', elementId: item?.elementId ?? item?.element?.id, ...(what ? { what } : {}) },
        user: userOf(execution),
        instance: execution?.instance,
        element: item?.element ?? item?.node,
        item,
        data: item?.data ?? execution?.instance?.data,
        input: item?.input,
        appServices: servicesOf(execution),
        ...rest,
    }, execution);
}

/** Kind element: an element with no item yet (or the process itself, with none given). */
export function elementContext(execution, element?, extra: Partial<IContext> & { what?: string } = {}): IContext {
    const { what, ...rest } = extra;
    return makeContext({
        source: { kind: 'element', elementId: element?.id, ...(what ? { what } : {}) },
        user: userOf(execution),
        ...(execution?.instance ? { instance: execution.instance, data: execution.instance.data } : {}),
        element,
        appServices: servicesOf(execution),
        ...rest,
    }, execution);
}

/** Kind dmn: a decision, from the context it was called from (an item's, an instance's), with its input. */
export function decisionContextOf(decision: string, input, from?: Partial<IContext>, policy?: string): IContext {
    return makeContext({
        source: { kind: 'dmn', decision, ...(policy ? { policy } : {}) },
        user: from?.user,
        instance: from?.instance,
        item: from?.item,
        element: from?.element,
        data: from?.data ?? from?.instance?.data,
        input,
        decision,
    });
}

/** Kind query: a read, its query and the conditions the `pre-query` listeners add. */
export function queryContext(query: string, user, filter: Record<string, any>): IContext {
    return makeContext({ source: { kind: 'query', query }, user, query: filter, conditions: [] });
}

/** Kind form: a form field, with the form's values. */
export function formContext(field: string, input, from: Partial<IContext> = {}): IContext {
    return makeContext({
        source: { kind: 'form', field, elementId: from.item?.elementId ?? from.element?.id },
        user: from.user, instance: from.instance, item: from.item, element: from.element,
        data: from.data ?? from.instance?.data, input, field,
    });
}

/**
 * Kind item or element, for a `pre-action`: the action, who asks, and what it is on (an item and its instance, or a
 * model's element; a model's name for a model's change).
 */
export function actionContext(action: string, user, on: { item?: any; instance?: any; element?: any; model?: string; input?: any; assignment?: any } = {}): IContext {
    return makeContext({
        source: { kind: on.item ? 'item' : 'element', action, elementId: on.item?.elementId ?? on.element?.id },
        user, action, ...on,
    });
}

/**
 * Adds the listeners' conditions to a query, all of them holding (narrowing, never widening): each one's keys merged
 * where they are new, the query and the condition both kept (`$and`) where they say the same key.
 */
export function narrowed(query: Record<string, any>, conditions: Record<string, any>[] = []): Record<string, any> {
    let out = { ...query };
    for (const condition of conditions) {
        if (!condition || typeof condition !== 'object') continue;
        const clash = Object.keys(condition).some(k => k in out);
        out = clash ? { $and: [out, condition] } : { ...out, ...condition };
    }
    return out;
}
