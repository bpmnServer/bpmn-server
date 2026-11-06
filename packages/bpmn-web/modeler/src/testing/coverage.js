// How much of a model its scenarios have run: its nodes and flows, from the instances of the scenarios' last runs. A scenario counts
// once it has an instance: only the engine knows what comes next, so steps written down prove nothing until they run.

/** An item's status when it really ran. A boundary event's or an event gateway's that never fired ends cancelled or discarded. */
const RAN = new Set(['start', 'wait', 'end', 'error']);

/**
 * The elements a run's items reached. A listener (a boundary event, an event sub-process's start: `listeners`, by id, its
 * flows out) is there from the start and can end without firing: it ran only if a flow left it.
 */
export function reachedIn(items, listeners = new Map()) {
    const ran = (items ?? []).filter(item => RAN.has(item.status)).map(item => item.elementId);
    const all = new Set(ran);
    return new Set(ran.filter(id => !listeners.has(id) || listeners.get(id).some(flow => all.has(flow))));
}

const RANK = { reached: 1, generated: 2, tested: 3 };

/**
 * tested: reached in a run that passed. generated: the same, but only by scenarios Test all paths saved and nobody has
 * reviewed; they count as tested, and are told apart. reached: only in runs that failed or did not finish. untested: in none.
 *
 * @param elements  the model's elements, by id: { nodes: [id], flows: [id] }
 * @param runs      the last run of each scenario that has one: { ok, items, generated }
 * @param listeners what reachedIn asks
 */
export function coverageOf({ nodes, flows }, runs, listeners) {
    const state = new Map();
    for (const { ok, items, generated } of runs)
        for (const id of reachedIn(items, listeners)) {
            const now = ok !== true ? 'reached' : generated ? 'generated' : 'tested';
            if ((RANK[state.get(id)] ?? 0) < RANK[now]) state.set(id, now);
        }
    const count = ids => {
        const of = ids.map(id => ({ id, state: state.get(id) ?? 'untested' }));
        const inState = which => of.filter(e => e.state === which).length;
        return { total: ids.length, tested: inState('tested') + inState('generated'), generated: inState('generated'), reached: inState('reached'), elements: of };
    };
    return { nodes: count(nodes), flows: count(flows) };
}
