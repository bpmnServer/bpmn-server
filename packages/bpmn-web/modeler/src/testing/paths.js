// What the Test tab works out about a model's paths: the values its conditions turn on, the way to an element, and
// trying the paths on real runs (Test all paths). Plain data in, plain data out: the panel gives it the model and the runs.
const LITERAL = String.raw`'[^']*'|"[^"]*"|-?\d+(?:\.\d+)?|true|false`;
const COMPARED = new RegExp(String.raw`([A-Za-z_]\w*(?:\.\w+)*)\s*(===|!==|==|!=|>=|<=|>|<|=)\s*(${LITERAL})`, 'g');
const TRUTHY = /(!?)\s*\b((?:item\.)?data\.\w+(?:\.\w+)*)/g;
const NOT = { '=': '!=', '==': '!=', '===': '!=', '!=': '=', '!==': '=', '>': '<=', '>=': '<', '<': '>=', '<=': '>' };

const variable = name => name.replace(/^(item\.)?data\./, '');
const literal = text => /^['"]/.test(text) ? text.slice(1, -1) : JSON.parse(text);

const different = value => typeof value === 'number' ? value + 1 : typeof value === 'boolean' ? !value
    : value === 'true' ? 'false' : value === 'false' ? 'true' : `not ${value}`;

/** A value for which `op value` holds. */
function satisfying(op, value) {
    switch (op) {
        case '>': return value + 1;
        case '<': return value - 1;
        case '!=': case '!==': return different(value);
        default: return value;
    }
}

/**
 * The values a condition turns on: [{ path, when, otherwise }], a value that makes that part of it true and one that
 * makes it false. Only what can be read off it (data.a == 1, amount > 5, !data.b): a call or a calculation gives nothing.
 */
export function conditionValues(text) {
    const found = [];
    const rest = String(text ?? '').replace(COMPARED, (_, name, op, value) => {
        const parsed = literal(value);
        found.push({ path: variable(name), when: satisfying(op, parsed), otherwise: satisfying(NOT[op], parsed) });
        return '';
    });
    for (const [, not, name] of rest.matchAll(TRUTHY))
        found.push({ path: variable(name), when: !not, otherwise: !!not });
    return found;
}

/** A copy of data with a value at a path (a.b.c). */
export function withValue(data, path, value) {
    const copy = JSON.parse(JSON.stringify(data ?? {}));
    const keys = path.split('.');
    let at = copy;
    for (const key of keys.slice(0, -1))
        at = at[key] && typeof at[key] === 'object' ? at[key] : (at[key] = {});
    at[keys.at(-1)] = value;
    return copy;
}

/**
 * The model as a graph, from a list of { id, source, target, condition, parent, attachedTo, isStart, triggered, throws,
 * catches }. `sure` holds what the model says runs next. `may` adds an event sub-process, which any element beside it may
 * trigger: so what `may` cannot reach from here truly cannot be reached.
 */
export function modelGraph(elements) {
    const sure = new Map(), may = new Map();
    const link = (edges, from, to) => { if (from && to) edges.set(from, [...(edges.get(from) ?? []), to]); };
    const both = (from, to) => { link(sure, from, to); link(may, from, to); };
    for (const e of elements) {
        both(e.source, e.id);
        both(e.id, e.target);
        both(e.attachedTo, e.id);
        both(e.id, e.parent);       // what ends inside ends the sub-process
        if (e.isStart) both(e.parent, e.id);
        if (e.triggered)
            for (const other of elements)
                if (other !== e && other.parent === e.parent) link(may, other.id, e.id);
        for (const thrown of e.throws ?? [])
            for (const other of elements)
                if ((other.catches ?? []).some(caught => caught === thrown || caught === `${thrown.split(':')[0]}:`))
                    both(e.id, other.id);
    }
    const reach = (edges, from) => {
        const seen = new Set(from);
        for (const id of seen)
            for (const next of edges.get(id) ?? []) seen.add(next);
        return seen;
    };
    /** The shortest way from any of `from` to `target`: the ids on it, or null. */
    const shortest = (edges, from, target) => {
        const before = new Map(from.map(id => [id, null]));
        for (const id of before.keys()) {
            if (id === target) {
                const way = [];
                for (let at = id; at; at = before.get(at)) way.unshift(at);
                return way;
            }
            for (const next of edges.get(id) ?? [])
                if (!before.has(next)) before.set(next, id);
        }
        return null;
    };
    const byId = new Map(elements.map(e => [e.id, e]));
    return {
        canReach: (from, target) => reach(may, from).has(target),
        way: (from, target) => shortest(sure, from, target) ?? shortest(may, from, target),
        /** What the conditions on a way ask: { path: value }. */
        valuesOn: way => Object.fromEntries((way ?? []).flatMap(id => conditionValues(byId.get(id)?.condition).map(v => [v.path, v.when]))),
    };
}

/** Where a run stands, for what can still change its path: what it reached, what waits, the values the conditions read. */
function stateOf(instance, reached, waiting, variables) {
    const values = [];
    const walk = (value, prefix) => {
        for (const [key, v] of Object.entries(value ?? {})) {
            const path = `${prefix}${key}`;
            if (variables.has(key)) values.push(`${path}=${JSON.stringify(v)}`);
            if (v && typeof v === 'object') walk(v, `${path}.`);
        }
    };
    walk(instance.data, '');
    return JSON.stringify([[...reached].sort(), [...waiting].sort(), values.sort()]);
}

/** The fewest of `found` that reach what `goal` asks: the finished ones first, the one that adds most each time. */
export function coveringPaths(found, goal) {
    const left = new Set(goal);
    const chosen = [];
    const candidates = [...found].sort((a, b) => Number(b.finished) - Number(a.finished));
    for (; ;) {
        const adds = one => [...one.reached].filter(id => left.has(id)).length;
        const best = candidates.reduce((top, one) => !top || adds(one) > adds(top) ? one : top, null);
        if (!best || !adds(best)) return chosen;
        chosen.push({ ...best, adds: [...best.reached].filter(id => left.has(id)) });
        best.reached.forEach(id => left.delete(id));
    }
}

/**
 * Test all paths: try the model on real runs, breadth first. A path is a start and its steps. Each is run from the
 * beginning (`run`, which returns { error, instance }), and what waits then gives the next paths to try, one for each of
 * `options(element)`. Paths that bring a run to where another already was are not followed, which also ends loops.
 * `reachedBy(items)` says what a run reached. It stops when `goal` is reached, at `maxTries`, or when `stopped()` says so.
 * Returns the paths to keep, each finished when it can be, what it tried and what failed.
 */
export async function explore({ starts, options, isStep, reachedBy, variables, goal, run, stopped = () => false, progress = () => { }, maxTries = 200, maxSteps = 30 }) {
    const queue = starts.map(start => ({ start, steps: [] }));
    const seen = new Set(), found = [], failures = [];
    const left = new Set(goal);
    let tries = 0;
    const attempt = async path => {
        tries++;
        const result = await run(path);
        progress({ tries, left: left.size });
        if (!result.instance || result.error) {
            failures.push({ path, error: result.steps?.find(s => !s.ok)?.error ?? result.error ?? 'It did not run' });
            return null;
        }
        const waiting = [...new Set(result.instance.items.filter(isStep).map(i => i.elementId))];
        return { instance: result.instance, reached: reachedBy(result.instance.items), waiting };
    };
    while (queue.length && left.size && tries < maxTries && !stopped()) {
        const path = queue.shift();
        const outcome = await attempt(path);
        if (!outcome) continue;
        const state = stateOf(outcome.instance, outcome.reached, outcome.waiting, variables);
        if (seen.has(state)) continue;
        seen.add(state);
        found.push({ path, reached: outcome.reached, finished: !outcome.waiting.length });
        outcome.reached.forEach(id => left.delete(id));
        if (path.steps.length < maxSteps)
            for (const element of outcome.waiting)
                for (const data of options(element))
                    queue.push({ ...path, steps: [...path.steps, { element, data }] });
    }
    const chosen = coveringPaths(found, goal);
    // one still waiting is taken to its end, the plain way, if it gets there
    for (const one of chosen) {
        let path = one.path;
        while (!one.finished && path.steps.length < maxSteps && !stopped()) {
            const next = await attempt(path);
            if (!next) break;
            if (!next.waiting.length) Object.assign(one, { path, finished: true });
            else path = { ...path, steps: [...path.steps, { element: next.waiting[0], data: options(next.waiting[0])[0] }] };
        }
    }
    return { paths: chosen, left: goal.filter(id => !found.some(one => one.reached.has(id))), tries, failures,
        ended: stopped() ? 'stopped' : left.size && tries >= maxTries ? 'limit' : 'done' };
}
