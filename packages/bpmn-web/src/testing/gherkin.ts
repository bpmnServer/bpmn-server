/*
 * Tests as Gherkin (docs/design/gherkin-testing.md), run whole in the engine: runFeature is what its call runs.
 *
 * A step is [subject] @command [arguments] [as :name], with a data table or a doc string. An element is the model's, an item
 * the instance's. What a scenario holds by name is the thing, not a copy: a :name is read again whenever it is looked at.
 * Results are in Cucumber's JSON format.
 */
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';
import { AstBuilder, compile, GherkinClassicTokenMatcher, Parser } from '@cucumber/gherkin';
import { IdGenerator } from '@cucumber/messages';
import { runSandboxed, SandboxScriptHandler, SecureUser, type StubSet } from 'bpmn-server';
import { matched, outputAt } from './decisionTests.js';
import { compare, valueAt } from './scenarios.js';

const NAME = '("[^"]+"|\\S+)';
const unquoted = (name: string) => name.replace(/^"|"$/g, '');
const WAIT = { within: 30_000, every: 200 };
const SECONDS = { second: 1, minute: 60, hour: 3600 };
const STUB_FAILED = '@stub-failed:';
const clone = value => JSON.parse(JSON.stringify(value ?? null));
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** JavaScript statements with copies of `values`, under the server's script handler; its `return` is the answer. */
async function runCode(server, values: Record<string, any>, body: string, name: string) {
    if (server.scriptHandler instanceof SandboxScriptHandler)
        return (await runSandboxed(values, body, { name, timeLimit: 1000 })).result;
    return vm.runInNewContext(`(async () => {\n${body}\n})()`, clone(values), { timeout: 1000, filename: name });
}

class Scenario {
    names: Record<string, { instanceId?: string; itemId?: string; model?: string; result?: any; evaluated?: boolean }> = {};
    context = {};
    user: { userName: string; secure: any } | null = null;
    stubs: StubSet = { services: {}, timers: {} };
    /** a stub's fail(): the scenario failed, whatever the model did with it */
    stubFailure: string | null = null;
    current: { instance?: string; item?: string } = {};

    constructor(private readonly server) { }

    async instanceOf(name: string) {
        const held = this.names[name];
        if (!held) throw new Error(`nothing is named :${name}`);
        const [instance] = await this.server.dataStore.findInstances({ id: held.instanceId }, 'full');
        if (!instance) throw new Error(`the instance of :${name} is not there`);
        return { held, instance };
    }

    /** What a :name is now: an instance, or an item of its instance. */
    async read(name: string) {
        const { held, instance } = await this.instanceOf(name);
        if (!held.itemId) return instance;
        const item = instance.items.find(i => i.id === held.itemId);
        if (!item) throw new Error(`the item of :${name} is not there`);
        return item;
    }

    /** What expressions can read: copies. */
    async values() {
        const instance = this.current.instance ? await this.read(this.current.instance) : null;
        const item = this.current.item ? await this.read(this.current.item) : null;
        return clone({ data: instance?.data ?? {}, instance, item, context: this.context, now: new Date().toISOString() });
    }

    async expression(text: string) {
        return runCode(this.server, await this.values(), `return (${text});`, 'expression');
    }

    /** A value in a step or a table: an expression, a quoted string, or what it reads as. */
    async value(text: string) {
        const value = text.trim();
        const expression = /^\$\{([\s\S]*)\}$/.exec(value);
        if (expression) return this.expression(expression[1]);
        try { return JSON.parse(value); }
        catch { return /^".*"$/.test(value) ? value.slice(1, -1) : value; }
    }

    async table(rows): Promise<Record<string, any>> {
        const answer = {};
        for (const { cells } of rows ?? []) {
            if (cells.length !== 2) throw new Error('a table here has two columns: a name and its value');
            answer[cells[0].value] = await this.value(cells[1].value);
        }
        return answer;
    }

    /** The one item a query finds, as this scenario's user can see it; none, or several, is the step's failure. */
    async findItem(element: string, name: string, fields: Record<string, any>) {
        const { held } = await this.instanceOf(name);
        const query: any = { id: held.instanceId, 'items.elementId': element };
        for (const [field, value] of Object.entries(fields)) {
            if (!field.startsWith('item.')) throw new Error(`'${field}': a field of the query starts with item.`);
            query['items.' + field.slice('item.'.length)] = value;
        }
        const found = await this.server.dataStore.findItems(this.user ? this.user.secure.qualifyItems(query) : query);
        if (found.length === 1) return found[0];
        const seen = found.map(i => `${i.elementId} ${i.status}${i.itemKey ? ` key ${i.itemKey}` : ''}`).join(', ');
        throw new Error(`${element} in :${name}: found ${found.length} items, not one${seen ? `: ${seen}` : ''}${this.user ? ` (as ${this.user.userName})` : ''}`);
    }

    /** A stub that names nothing in the model, or in what the model calls, would leave the real one running. */
    async checkStubs(model: string) {
        const sources = [];
        const add = async (name: string) => {
            if (sources.some(s => s.name === name)) return;
            const source = await this.server.definitions.getSource(name);
            sources.push({ name, source });
            for (const [, called] of source.matchAll(/calledElement="([^"]+)"/g)) await add(called);
        };
        await add(model);
        const has = (pattern: string) => sources.some(({ source }) => new RegExp(pattern).test(source));
        const quoted = (name: string) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        for (const name of Object.keys(this.stubs.services))
            if (!has(`(?:implementation|delegateExpression)="${quoted(name)}"`)) throw new Error(`@stub service:${name}: no task of ${model} calls it`);
        for (const name of Object.keys(this.stubs.timers))
            if (!has(`\\bid="${quoted(name)}"`)) throw new Error(`@stub timer:${name}: no such timer in ${model}`);
    }

    /** Whether a statement of @check or @wait holds, and what it read. */
    async holds(statement: string): Promise<{ ok: boolean; said: string }> {
        const expression = /^\$\{([\s\S]*)\}$/.exec(statement);
        if (expression) {
            const value = await this.expression(expression[1]);
            return { ok: !!value, said: `${expression[1]} is ${JSON.stringify(value)}` };
        }
        const passed = new RegExp(`^:(\\w+) passed element:${NAME}(?: (\\d+) times?)?(?: with status (".*"))?$`).exec(statement);
        if (passed) {
            const { instance } = await this.instanceOf(passed[1]);
            const element = unquoted(passed[2]);
            const status = passed[4] && JSON.parse(passed[4]);
            const runs = instance.items.filter(i => (i.elementId === element || i.name === element) && (!status || i.status === status)).length;
            return { ok: passed[3] !== undefined ? runs === Number(passed[3]) : runs > 0, said: `${element} ran ${runs} times` };
        }
        const compared = /^:(\w+) ((?:[\w.]|"[^"]*")+) (is not|is|<>|>=|<=|=|>|<) (.+)$/.exec(statement);
        if (!compared) throw new Error(`can not read '${statement}'`);
        const [, name, written, words, text] = compared;
        const path = written.replace(/"/g, '');
        const op = { is: '=', 'is not': '<>' }[words] ?? words;
        const held = this.names[name];
        const actual = held?.evaluated
            ? path === 'rules' ? matched(held.result) : outputAt(held.result, path.replace(/^output\./, ''))
            : valueAt(await this.read(name), path);
        return { ok: compare(actual, op, await this.value(text)), said: `${path} is ${JSON.stringify(actual)}` };
    }
}

type Step = { subject: string; rest: string; rows: any[] | undefined; doc: string | undefined };

/** The commands, each with what it does to the scenario, by way of the engine's calls. */
const COMMANDS: Record<string, (server, scenario: Scenario, step: Step) => Promise<void>> = {
    /** Who the next steps act as. Not a sign-in: there is no session; the engine's rules for that user apply. */
    async login(_server, scenario, { subject, rest }) {
        const who = /^user:(\S+)$/.exec(subject);
        const roles = /^with role of "([^"]*)"$/.exec(rest);
        if (!who || !roles) throw new Error('@login: user:<name> @login with role of "<role>"');
        scenario.user = { userName: who[1], secure: new SecureUser({ userName: who[1], userGroups: [roles[1]], tenantId: null }, { enforceSecurity: true }) };
    },

    async start(server, scenario, { rest, rows }) {
        const match = new RegExp(`^process:${NAME}(?: at element:${NAME})?( only)?(?: as :(\\w+))?$`).exec(rest);
        if (!match) throw new Error('@start: @start process:<name> as :<name>');
        const model = unquoted(match[1]);
        const at = match[2] ? unquoted(match[2]) : null;
        await scenario.checkStubs(model);
        const instanceId = `test-${randomUUID()}`;
        server.testStubs.add(instanceId, scenario.stubs);
        await server.engine.start(model, await scenario.table(rows), at, scenario.user?.userName ?? null, { instanceId, flags: { savePoints: true, saveLogs: true, ...(match[3] ? { only: at } : {}) } });
        const name = match[4] ?? `start-${instanceId}`;
        scenario.names[name] = { instanceId, model };
        scenario.current.instance = name;
    },

    /** A decision evaluated with the table as its input; what it answered is kept by name, for @check. */
    async evaluate(server, scenario, { rest, rows }) {
        const match = new RegExp(`^decision:${NAME} as :(\\w+)$`).exec(rest);
        if (!match) throw new Error('@evaluate: @evaluate decision:<name> as :<name>');
        const { result } = await server.engine.invokeDecision(unquoted(match[1]), await scenario.table(rows));
        scenario.names[match[2]] = { result, evaluated: true };
    },

    async find(_server, scenario, { rest, rows }) {
        const match = new RegExp(`^element:${NAME} in :(\\w+) as :(\\w+)$`).exec(rest);
        if (!match) throw new Error('@find: @find element:<id> in :<instance> as :<name>');
        const item = await scenario.findItem(unquoted(match[1]), match[2], await scenario.table(rows));
        scenario.names[match[3]] = { instanceId: scenario.names[match[2]].instanceId, itemId: item.id };
        scenario.current.item = match[3];
    },

    /** An item found before; or the short form, which finds an element's waiting item. */
    async invoke(server, scenario, { rest, rows }) {
        const data = await scenario.table(rows);
        const named = /^:(\w+)$/.exec(rest);
        const short = new RegExp(`^element:${NAME} in :(\\w+)(?: as :(\\w+))?$`).exec(rest);
        let target;
        if (named) {
            const held = scenario.names[named[1]];
            if (!held?.itemId) throw new Error(`:${named[1]} is not an item`);
            target = held;
        }
        else if (short) {
            const item = await scenario.findItem(unquoted(short[1]), short[2], { 'item.status': 'wait' });
            target = { instanceId: scenario.names[short[2]].instanceId, itemId: item.id };
            if (short[3]) {
                scenario.names[short[3]] = target;
                scenario.current.item = short[3];
            }
        }
        else throw new Error('@invoke: @invoke :<item>, or @invoke element:<id> in :<instance> as :<name>');
        const query: any = { id: target.instanceId, 'items.id': target.itemId };
        await server.engine.invoke(scenario.user ? scenario.user.secure.qualifyItems(query) : query, data, scenario.user?.userName ?? null);
    },

    async check(_server, scenario, { rest }) {
        const { ok, said } = await scenario.holds(rest);
        if (!ok) throw new Error(`${rest}: ${said}`);
    },

    async wait(_server, scenario, { rest }) {
        const within = /^(.*) within (\d+) (second|minute|hour)s?$/.exec(rest);
        const statement = within ? within[1] : rest;
        const limit = within ? Number(within[2]) * SECONDS[within[3]] * 1000 : WAIT.within;
        const deadline = Date.now() + limit;
        for (;;) {
            const { ok, said } = await scenario.holds(statement);
            if (ok) return;
            if (Date.now() > deadline) throw new Error(`${statement}: still ${said} after ${limit / 1000} seconds`);
            await sleep(WAIT.every);
        }
    },

    /** A service's code or a timer's time, for this scenario's instances alone. */
    async stub(server, scenario, { rest, doc }) {
        const service = new RegExp(`^service:${NAME} with$`).exec(rest);
        const timer = new RegExp(`^timer:${NAME} with (\\d+) (second|minute|hour)s?$`).exec(rest);
        if (timer) {
            scenario.stubs.timers[unquoted(timer[1])] = Number(timer[2]) * SECONDS[timer[3]];
            return;
        }
        if (!service || doc === undefined) throw new Error('@stub: @stub service:<name> with, and its code as a doc string; or @stub timer:<id> with 5 seconds');
        const code = `const fail = message => { throw new Error(${JSON.stringify(STUB_FAILED)} + message); };\n${doc}`;
        scenario.stubs.services[unquoted(service[1])] = async (input, data) => {
            try {
                return await runCode(server, { input: input ?? {}, data: data ?? {} }, code, `stub ${unquoted(service[1])}`);
            }
            catch (error) {
                const message = String(error?.message ?? error);
                const at = message.indexOf(STUB_FAILED);
                if (at < 0) throw error;
                scenario.stubFailure = message.slice(at + STUB_FAILED.length);
                throw new Error(scenario.stubFailure);
            }
        };
    },

    /** Statements, for what a table can not say: `context` is what stays for the next steps. */
    async script(server, scenario, { doc }) {
        if (doc === undefined) throw new Error('@script: its code is a doc string');
        scenario.context = await runCode(server, await scenario.values(), `${doc}\nreturn context;`, 'script');
    },
};

function parseStep(text: string, argument): Step & { command: string } {
    const match = /^(.*?)@(\w+)\s*(.*)$/s.exec(text);
    if (!match) throw new Error(`no @command in '${text}'`);
    return { subject: match[1].trim(), command: match[2], rest: match[3].trim(), rows: argument?.dataTable?.rows, doc: argument?.docString?.content };
}

function parse(source: string, uri: string) {
    const document = new Parser(new AstBuilder(IdGenerator.uuid()), new GherkinClassicTokenMatcher()).parse(source);
    const keywords = new Map<string, string>();
    const collect = steps => (steps ?? []).forEach(step => keywords.set(step.id, step.keyword));
    for (const child of document.feature?.children ?? []) {
        collect(child.background?.steps);
        collect(child.scenario?.steps);
        for (const inner of child.rule?.children ?? []) {
            collect(inner.background?.steps);
            collect(inner.scenario?.steps);
        }
    }
    return { feature: document.feature, pickles: compile(document, uri, IdGenerator.uuid()), keywords };
}

/**
 * Runs a feature's scenarios, one after another: Cucumber's JSON for one feature. In here, a test goes by the engine's calls
 * and JSON copies (`server.engine`), as anyone outside does; what is in the steps, stubs and expressions runs in the handler
 * of the server's scripts.
 */
export async function runFeature(server, source: string, uri = 'feature') {
    const { feature, pickles, keywords } = parse(source, uri);
    const elements = [];
    for (const pickle of pickles) {
        const scenario = new Scenario(server);
        const steps = [];
        let failed = false;
        try {
            for (const pickleStep of pickle.steps) {
                const report: any = { keyword: keywords.get(pickleStep.astNodeIds[0]) ?? '', name: pickleStep.text, result: { status: 'skipped', duration: 0 } };
                steps.push(report);
                if (failed) continue;
                const began = process.hrtime.bigint();
                try {
                    const step = parseStep(pickleStep.text, pickleStep.argument);
                    const command = Object.hasOwn(COMMANDS, step.command) ? COMMANDS[step.command] : null;
                    if (!command) throw new Error(`no command @${step.command}`);
                    await command(server, scenario, step);
                    if (scenario.stubFailure) throw new Error(scenario.stubFailure);
                    report.result.status = 'passed';
                }
                catch (error) {
                    failed = true;
                    report.result.status = 'failed';
                    report.result.error_message = String(scenario.stubFailure ?? error?.message ?? error);
                }
                report.result.duration = Number(process.hrtime.bigint() - began);
            }
        }
        finally {
            server.testStubs.remove(scenario.stubs);
        }
        elements.push({
            keyword: 'Scenario', type: 'scenario', name: pickle.name, tags: pickle.tags.map(tag => ({ name: tag.name })),
            instances: Object.values(scenario.names).filter(held => held.instanceId && !held.itemId).map(held => held.instanceId), steps,
        });
    }
    return [{ keyword: feature?.keyword ?? 'Feature', name: feature?.name ?? '', uri, tags: (feature?.tags ?? []).map(tag => ({ name: tag.name })), elements }];
}
