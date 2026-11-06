// How much of a model its scenarios have run: its nodes and flows, from the instances of the scenarios' last runs. A scenario counts
// once it has an instance: only the engine knows what comes next, so steps written down prove nothing until they run.

/** An item's status when it really ran. A boundary event's or an event gateway's that never fired ends cancelled or discarded. */
const RAN = new Set(['start', 'wait', 'end', 'error']);

/**
 * tested: reached in a run that passed. reached: only in runs that failed or did not finish. untested: in none.
 *
 * @param elements  the model's elements, by id: { nodes: [id], flows: [id] }
 * @param runs      the last run of each scenario that has one: { ok, items }
 */
export function coverageOf({ nodes, flows }, runs) {
    const state = new Map();
    for (const { ok, items } of runs)
        for (const item of items ?? [])
            if (RAN.has(item.status) && state.get(item.elementId) !== 'tested')
                state.set(item.elementId, ok === true ? 'tested' : 'reached');
    const count = ids => {
        const of = ids.map(id => ({ id, state: state.get(id) ?? 'untested' }));
        return { total: ids.length, tested: of.filter(e => e.state === 'tested').length, reached: of.filter(e => e.state === 'reached').length, elements: of };
    };
    return { nodes: count(nodes), flows: count(flows) };
}
