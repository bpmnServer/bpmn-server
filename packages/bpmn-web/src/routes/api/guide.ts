/*
 * A process explained, for the people who work in it (docs/docs/process-guide.md): what it is for, its diagram, its
 * steps (who does each, what its form asks, which way it goes next), the policies that decide who works on it and who
 * is told, and its examples: the scenarios of its .feature in plain words, each with its test case (testing/
 * testCases.ts). Read from the model and its files; nothing runs. Scripts, expressions, connectors and keys are left out.
 *
 * Who may read it: whoever may start the process, or works in it (a task offered to one of their groups, or a lane
 * of theirs), and designers and administrators. Anyone else: the same 404 as no such process.
 */
import fs from 'node:fs';
import path from 'node:path';
import { AstBuilder, GherkinClassicTokenMatcher, Parser } from '@cucumber/gherkin';
import { IdGenerator } from '@cucumber/messages';
import { BPMNAPI, SecureUser, owfAttribute } from '../../index.js';
import { canDesign, isAdminGroups } from '../../userAccess/roles.js';
import { modelDescription } from '../../testing/modelCoverage.js';
import { listTestCases } from '../../testing/testCases.js';

export class GuideError extends Error {
    constructor(readonly status: number, message: string, readonly code: string) { super(message); }
}
const notFound = (name: string) => new GuideError(404, `No process ${name}`, 'PROCESS_NOT_FOUND');

const list = (v): string[] => (Array.isArray(v) ? v : typeof v === 'string' ? v.split(',') : []).map(s => String(s).trim()).filter(Boolean);
/** A value an expression makes when the task runs: not shown as a name. */
const isExpression = (v: string) => /^\$|\$\{|\(/.test(v);
const STEP_TYPES: Record<string, string> = {
    'bpmn:UserTask': 'task', 'bpmn:StartEvent': 'start', 'bpmn:EndEvent': 'end',
    'bpmn:ExclusiveGateway': 'decision', 'bpmn:InclusiveGateway': 'decision', 'bpmn:EventBasedGateway': 'decision',
};

export class GuideOperations {
    readonly api: BPMNAPI;
    constructor(readonly server) {
        this.api = new BPMNAPI(server);
    }

    /** Whether this user may read the process's guide (and see its test cases): the definition, or a 404. */
    async access(user: SecureUser, name: string) {
        if (typeof name !== 'string' || !name) throw notFound(String(name));
        const definition = await this.server.definitions.load(name).catch(() => null);
        if (!definition) throw notFound(name);
        if (user.isAdmin() || isAdminGroups(user.userGroups) || canDesign({ userGroups: user.userGroups })) return definition;
        const mine = new Set(user.userGroups ?? []);
        const works = nodesOf(definition).some(node => node.type === 'bpmn:UserTask' && (
            (node.lane && mine.has(node.lane))
            || list(owfAttribute(node.def, 'candidateGroups')).some(g => mine.has(g))
            || list(owfAttribute(node.def, 'candidateUsers')).includes(user.userName)
            || owfAttribute(node.def, 'assignee') === user.userName));
        if (works) return definition;
        const starts = await this.api.model.findStartEvents({}, user).catch(() => []);
        if (starts.some(event => event.modelName === name)) return definition;
        throw notFound(name);
    }

    /** The process explained: { name, description, steps, policies, examples }. */
    async guide(user: SecureUser, name: string) {
        const definition = await this.access(user, name);
        const source = await this.server.definitions.getSource(name).catch(() => '');
        const nodes = nodesOf(definition);
        const fieldLabels = new Map<string, string>();
        const steps = this.ordered(nodes).filter(node => STEP_TYPES[node.type] || /Task$/.test(node.type)).map(node => {
            const kind = STEP_TYPES[node.type] ?? 'automatic';
            const fields = kind === 'task' || kind === 'start' ? (definition.getNodeInfo(node.id).fields ?? []).map(f => {
                const label = f.label ?? f.id;
                fieldLabels.set(f.id, label);
                const constraints = f.validation?.constraints ?? (f.$children ?? []).filter(c => c.$type === 'camunda:validation').flatMap(v => v.$children ?? []);
                return { id: f.id, label, type: f.type, required: constraints.some(c => c.name === 'required') };
            }) : [];
            const groups = list(owfAttribute(node.def, 'candidateGroups')), users = list(owfAttribute(node.def, 'candidateUsers'));
            const assignee = owfAttribute(node.def, 'assignee');
            const policy = owfAttribute(node.def, 'assignmentPolicy');
            const who = kind === 'task' ? {
                lane: node.lane ?? null,
                groups: groups.filter(g => !isExpression(g)), users: users.filter(u => !isExpression(u)),
                assignee: assignee && !isExpression(String(assignee)) ? String(assignee) : null,
                decidedWhenItRuns: [...groups, ...users, ...(assignee ? [String(assignee)] : [])].some(isExpression) || !!policy,
                ...(policy ? { policy } : {}),
            } : undefined;
            return {
                id: node.id, name: node.name || node.id, kind, documentation: docs(node.def),
                ...(who ? { who } : {}), ...(fields.length ? { fields } : {}),
                next: (node.outbounds ?? []).filter(f => f.to).map(f => ({ name: f.name || null, to: f.to.name || f.to.id })),
            };
        });
        const attribute = (attr: string) => [...new Set([...String(source).matchAll(new RegExp(`\\s(?:[\\w.-]+:)?${attr}\\s*=\\s*"([^"]+)"`, 'g'))].map(m => m[1]))];
        const names = new Map<string, string>(nodes.map(n => [n.id, n.name || n.id]));
        return {
            name,
            description: await modelDescription(source).catch(() => ''),
            steps,
            policies: { assignment: attribute('assignmentPolicy'), notification: attribute('notificationPolicy'), security: attribute('securityPolicy') },
            examples: this.examples(name, names, fieldLabels),
        };
    }

    /** The diagram, as a picture (its .svg, else drawn), for whoever may read the guide. */
    async diagram(user: SecureUser, name: string) {
        await this.access(user, name);
        return this.server.definitions.getSVG(name).catch(() => null);
    }

    /** Its nodes from its start events on, each once, in the order a case meets them; the rest after. */
    private ordered(nodes: any[]) {
        const seen = new Set(), out = [];
        const queue = nodes.filter(n => n.type === 'bpmn:StartEvent' && !n.subProcess);
        while (queue.length) {
            const node = queue.shift();
            if (seen.has(node.id)) continue;
            seen.add(node.id);
            out.push(node);
            for (const flow of node.outbounds ?? []) if (flow.to && !seen.has(flow.to.id)) queue.push(flow.to);
        }
        return [...out, ...nodes.filter(n => !seen.has(n.id))];
    }

    /** Its .feature's scenarios, in plain words, each with its test case when there is one. */
    private examples(model: string, names: Map<string, string>, fieldLabels: Map<string, string>) {
        const folder = this.server.configuration.definitionsPath;
        const file = path.join(folder, `${model}.feature`);
        if (!fs.existsSync(file)) return { description: '', scenarios: [] };
        let feature;
        try { ({ feature } = new Parser(new AstBuilder(IdGenerator.uuid()), new GherkinClassicTokenMatcher()).parse(fs.readFileSync(file, 'utf8'))); }
        catch { return { description: '', scenarios: [] }; }
        if (!feature) return { description: '', scenarios: [] };
        const cases = new Map(listTestCases(folder, model).map(c => [c.scenario, c]));
        const scenarios = (feature.children ?? []).flatMap(child => child.scenario ? [child.scenario] : (child.rule?.children ?? []).filter(c => c.scenario).map(c => c.scenario));
        return {
            description: String(feature.description ?? '').split('\n').map(l => l.trim()).join('\n').trim(),
            scenarios: scenarios.map(s => {
                const testCase = cases.get(s.name);
                return {
                    name: s.name,
                    description: String(s.description ?? '').split('\n').map(l => l.trim()).join('\n').trim(),
                    steps: plainSteps(s.steps ?? [], names, fieldLabels),
                    ...(testCase ? { testCase: { file: testCase.file, ok: testCase.ok, ranAt: testCase.ranAt, current: testCase.current } } : {}),
                };
            }),
        };
    }
}

/** A definition's nodes, as a list (the definition keeps them by id). */
const nodesOf = (definition): any[] => definition.nodes instanceof Map ? [...definition.nodes.values()] : [...(definition.nodes ?? [])];

/** An element's documentation, as text. */
function docs(def): string {
    return (def?.documentation ?? []).map(d => d.text).filter(Boolean).join('\n').replace(/\\n/g, '\n').trim();
}

/**
 * A scenario's steps in plain words (docs/docs/testing.md's steps): who signs in, starts, completes a task with what,
 * and what is checked; a simulated service said so; anything else as written.
 */
export function plainSteps(steps: any[], names: Map<string, string>, fieldLabels: Map<string, string>) {
    const el = (id: string) => `“${names.get(id) ?? id}”`;
    const field = (path: string) => { const f = path.replace(/^data\./, ''); return fieldLabels.get(f) ?? f; };
    const unquote = (s: string) => s.replace(/^"(.*)"$/, '$1');
    let who: string | null = null;
    const out: { kind: string; text: string; values?: [string, string][] }[] = [];
    for (const step of steps) {
        const text = String(step.text ?? '').trim();
        const rows: [string, string][] = (step.dataTable?.rows ?? []).map(r => r.cells.map(c => c.value)).filter(r => r.length >= 2)
            .map(([k, v]) => [fieldLabels.get(k) ?? k, unquote(String(v))]);
        let m;
        const subject = who ?? 'Someone';
        if ((m = /^user:(\S+)\s+@login(?:\s+with role of\s+"([^"]+)")?/.exec(text))) {
            who = m[2] ? `${m[1]} (${m[2]})` : m[1];
            continue;
        }
        if ((m = /^@stub service:(\S+)/.exec(text))) out.push({ kind: 'setup', text: `The service ${m[1]} is simulated: nothing is sent or recorded.` });
        else if (/^@stub timer:/.test(text)) out.push({ kind: 'setup', text: 'A timer is simulated: it falls due at once.' });
        else if ((m = /^@start process:("[^"]+"|\S+)/.exec(text)))
            out.push({ kind: 'action', text: /is refused\s*$/.test(text) ? `${subject} tries to start ${unquote(m[1])}: refused.` : `${subject} starts ${unquote(m[1])}.`, ...(rows.length ? { values: rows } : {}) });
        else if ((m = /^@invoke element:(\S+)/.exec(text)))
            out.push({ kind: 'action', text: /is refused\s*$/.test(text) ? `${subject} tries to complete ${el(m[1])}: the form refuses it.` : `${subject} completes ${el(m[1])}.`, ...(rows.length ? { values: rows } : {}) });
        else if (/^@invoke\b/.test(text)) out.push({ kind: 'action', text: `${subject} completes the task.`, ...(rows.length ? { values: rows } : {}) });
        else if (/^@assign\b/.test(text)) out.push({ kind: 'action', text: `${subject} gives the task to someone else.`, ...(rows.length ? { values: rows } : {}) });
        else if (/^@restart\b/.test(text)) out.push({ kind: 'action', text: `${subject} runs a step again.` });
        else if ((m = /^@startEvent element:(\S+)/.exec(text))) out.push({ kind: 'action', text: `${subject} triggers ${el(m[1])}.` });
        else if ((m = /^@check :\S+ status is "([^"]+)"/.exec(text))) out.push({ kind: 'result', text: m[1] === 'end' ? 'The case ends.' : `The case is ${m[1]}.` });
        else if ((m = /^@check :\S+ (data\.[\w.]+) is (.+)$/.exec(text))) out.push({ kind: 'result', text: `${field(m[1])} is ${unquote(m[2].trim())}.` });
        else if ((m = /^@check :\S+ passed element:(\S+)(?: (\d+) times?)?/.exec(text))) out.push({ kind: 'result', text: `It goes through ${el(m[1])}${m[2] && m[2] !== '1' ? ` ${m[2]} times` : ''}.` });
        else if ((m = /^@check :\S+ has (\d+) items? of element:(\S+) with status "wait"( for me)?/.exec(text)))
            out.push({ kind: 'result', text: m[1] === '0' ? `${el(m[2])} doesn't wait${m[3] ? ` for ${subject}` : ''}.` : `${el(m[2])} waits${m[3] ? ` for ${subject}` : ''}.` });
        else if ((m = /^@check :\S+ notified (.+)$/.exec(text))) out.push({ kind: 'result', text: `Notified: ${m[1]}.` });
        else out.push({ kind: /^@check|^@wait/.test(text) ? 'result' : 'action', text });
    }
    return out;
}
