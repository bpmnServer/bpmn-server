/**
 * Actors (docs/design/expressions.md): who did what in an instance, as expressions and decisions read it, `actors`:
 * actors.initiator (who started it), actors.<name> (who completed an element the model names, `owf:actor`),
 * actors.assignee and actors.candidate (who a waiting task is for). The policies' add-ons': they register `actors` as a
 * name every expression sees (engine/AddOns.ts, addExpressionName).
 */
import { dataPathOf, inScope, elementType, elementIdOf } from '../../engine/DecisionContext.js';
import type { IDecisionUser } from '../../engine/DecisionContext.js';
import type { IExpressionName } from '../../engine/AddOns.js';

/** The elements that may name an actor: the user who completes a user task, or starts the process at a start event. */
export const ACTOR_ELEMENTS = ['bpmn:UserTask', 'bpmn:StartEvent'];

/** The actors every instance has; a model names its own with owf:actor. */
export const BUILT_IN_ACTORS = ['initiator', 'assignee', 'candidate'] as const;

/** An actor: a user's name, several (latest first), or none. */
export type Actor = string | string[] | null;

const asList = (value): string[] => (Array.isArray(value) ? value : value == null || value === '' ? [] : String(value).split(','))
    .map(v => String(v ?? '').trim()).filter(Boolean);
const attr = (tag: string, name: string) => new RegExp(`\\s(?:[\\w.-]+:)?${name}\\s*=\\s*"([^"]*)"`).exec(tag)?.[1];

const elementsOfSource = new Map<string, Map<string, string>>();

/**
 * The elements a model names as actors (`owf:actor="approver"`), by element id: an actor is the name for the user who
 * completes a user task, or starts the process at a start event; on any other element it means nothing (verifyModel
 * warns). `model`: its XML, or a loaded definition (its nodes).
 */
export function actorElements(model: any): Map<string, string> {
    if (!model) return new Map();
    if (typeof model === 'string') {
        let found = elementsOfSource.get(model);
        if (found) return found;
        found = new Map();
        for (const [tag] of model.matchAll(/<(?:[\w.-]+:)?(?:userTask|startEvent)\b[^>]*\sowf:actor\s*=\s*"[^"]*"[^>]*>/g)) {
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
        if (!ACTOR_ELEMENTS.includes(node?.type)) continue;
        const name = node?.def?.$attrs?.['owf:actor'] ?? node?.def?.actor;
        if (name && String(name).trim()) found.set(node.id, String(name).trim());
    }
    return found;
}

/** Who started an instance: its start event's item's user, else its first item's, else the instance's. */
export function initiatorOf(instance: any, items: any[] = instance?.items ?? []): string | null {
    const start = items.find(i => elementType(i) === 'bpmn:StartEvent' && i.userName);
    const first = [...items].sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0))[0];
    return start?.userName ?? first?.userName ?? instance?.userName ?? null;
}

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
    // a user task starting is about to wait (its assignment set: a notification policy's `assigned`)
    const waiting = latestFirst.filter(i => elementType(i) === 'bpmn:UserTask' && (i.status === 'wait' || i.status === 'start'));
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
 * `actors`, the name every expression sees: for a place in an instance, worked out when read (a script's), or at once
 * (`materialized`: a decision's, the sandbox's).
 */
export const actorsName: IExpressionName = {
    name: 'actors',
    of({ instance, items, definition, scope, materialized }) {
        const elements = actorElements(definition);
        let computed: Record<string, Actor>;
        const compute = () => computed ??= actorsOf({ instance, items: items ?? instance?.items ?? [], elements, scope });
        if (materialized) return { ...compute() };
        const actors: Record<string, any> = {};
        for (const name of new Set([...BUILT_IN_ACTORS, ...elements.values()]))
            Object.defineProperty(actors, name, { get: () => compute()[name], enumerable: true });
        return actors;
    },
};
