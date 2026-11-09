/*
 * What of a model its scenarios have reached, on the server: the Design dashboard's column, and the report of `npm run test:coverage`.
 * The rules are the Test tab's (coverage.js). Each run keeps what it reached (the tag on its test instance), so its coverage outlasts its
 * instance; a run from before that is read from its instance while there is one.
 */
import { Definition } from 'bpmn-server';
import { coverageOf, reachedIn } from './coverage.js';
import { findTest } from './scenarios.js';

const is = (element, type: string) => element.$instanceOf(type);

function allElements(root) {
    const found = [];
    const walk = container => (container.flowElements ?? []).forEach(element => {
        found.push(element);
        if (is(element, 'bpmn:SubProcess')) walk(element);
    });
    (root.rootElements ?? []).filter(e => is(e, 'bpmn:Process')).forEach(walk);
    return found;
}

const parse = async (source: string) => (await Definition.moddleFor(undefined).fromXML(source)).rootElement;

/** The model's elements as the Test tab counts them, by id; its listeners (see reachedIn). */
export async function modelElements(source: string) {
    const found = allElements(await parse(source));
    const ids = type => found.filter(e => is(e, type) && !e.triggeredByEvent).map(e => e.id);   // an event sub-process has no item: what is inside counts
    const flows = found.filter(e => is(e, 'bpmn:SequenceFlow'));
    const listeners = new Map(found
        .filter(e => is(e, 'bpmn:BoundaryEvent') || (is(e, 'bpmn:StartEvent') && e.$parent.triggeredByEvent))
        .map(e => [e.id, flows.filter(f => f.sourceRef === e).map(f => f.id)]));
    return { elements: { nodes: ids('bpmn:FlowNode'), flows: ids('bpmn:SequenceFlow') }, listeners };
}

/** The model's description: the documentation of what the editor shows with nothing selected (with pools, the collaboration), else its process's. */
export async function modelDescription(source: string): Promise<string> {
    const root = await parse(source);
    const text = element => (element?.documentation ?? []).map(d => d.text).find(t => String(t ?? '').trim());
    const owners = [...(root.rootElements ?? []).filter(e => is(e, 'bpmn:Collaboration')), ...(root.rootElements ?? []).filter(e => is(e, 'bpmn:Process')), root];
    // a line break written as the two characters \n, as some models have it, reads as one
    return String(owners.map(text).find(Boolean) ?? '').replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim();
}

/** What a scenario's run reached: its instance's, when it has one still; else what the run kept. */
async function reachedBy(server, run, listeners): Promise<string[] | undefined> {
    const instance = run.instanceId ? await findTest(server, run.instanceId).catch(() => null) : null;
    return instance ? [...reachedIn(instance.items, listeners)] : run.reached;
}

/** The scenarios' last runs, each with what it reached, to be saved with them. A model that can not be read leaves them as they are. */
export async function withReached(server, model: string, scenarios: any[]) {
    let listeners;
    try {
        ({ listeners } = await modelElements(await server.definitions.getSource(model)));
    }
    catch {
        return scenarios;
    }
    for (const scenario of scenarios)
        for (const run of scenario.runs ?? []) {
            const reached = await reachedBy(server, run, listeners);
            if (reached) run.reached = reached;
        }
    return scenarios;
}

/** The coverage the scenarios' saved runs give: nodes and flows, what no run has reached, how many have not run, and whether the model changed since. */
export async function savedCoverage(server, source: string, scenarios: any[], modelSaved?: Date) {
    const { elements, listeners } = await modelElements(source);
    const lastRuns = scenarios.filter(s => s.runs?.length).map(s => ({ scenario: s, run: s.runs[0] }));
    const runs = [];
    for (const { scenario, run } of lastRuns) {
        const reached = run.reached ?? await reachedBy(server, run, listeners);
        if (reached) runs.push({ ok: run.ok, generated: !!scenario.generated, items: reached.map(elementId => ({ elementId, status: 'end' })) });
    }
    const { nodes, flows } = coverageOf(elements, runs, listeners);
    const total = nodes.total + flows.total, tested = nodes.tested + flows.tested;
    const oldest = lastRuns.map(({ run }) => new Date(run.at).getTime()).sort((a, b) => a - b)[0];
    return {
        percent: total ? Math.round(100 * tested / total) : 0, tested, total,
        nodes: { tested: nodes.tested, total: nodes.total }, flows: { tested: flows.tested, total: flows.total },
        notRun: scenarios.length - lastRuns.length,
        outOfDate: !!modelSaved && oldest !== undefined && modelSaved.getTime() > oldest,
    };
}
