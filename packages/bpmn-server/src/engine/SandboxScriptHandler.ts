import { ScriptHandler } from './ScriptHandler.js';
import { scriptOf } from './Expressions.js';
import type { Item } from './Item.js';
import type { Token } from './Token.js';
import type { Execution } from './Execution.js';

/**
 * Runs a model's scripts and expressions in a sandbox: QuickJS (a JavaScript engine compiled to WebAssembly), with
 * no access to Node.js, the file system, the network or the server's objects, a memory limit and a time limit.
 * For servers that run models written by people they do not trust (a public demo):
 *
 *     scriptHandler: () => new SandboxScriptHandler()
 *
 * A script gets copies of what the server's scripts get (`data`, `item`, `input`, `output`, `instance`; `this` is
 * `item`) as plain JSON values. What it changes in `data`, `input`, `output` and the item's assignment fields
 * (assignee, candidateUsers, ...) is copied back. `appServices` and `appUtils` are there, but calling one of their
 * methods runs nothing: it returns undefined and the run's decisions say so. There is no `appDelegate`, no
 * `require`, no `process`, no timers; `$py` scripts are refused.
 */
export class SandboxScriptHandler extends ScriptHandler {
    /** Milliseconds a script or expression may run. */
    timeLimit = 200;
    /** Bytes a script may use. */
    memoryLimit = 32 * 1024 * 1024;

    constructor(options: { timeLimit?: number; memoryLimit?: number } = {}) {
        super();
        Object.assign(this, options);
    }

    async evaluateExpression(scope: Item | Token, expression, label = 'expression') {
        if (!expression)
            return;
        return this.run(scope, `return (${scriptOf(expression)});`, label);
    }

    async executeScript(scope: Item | Execution, script, label = 'script') {
        if (script.startsWith('$py'))
            throw new Error(`${ScriptHandler.scriptName(scope, label)}: Python scripts do not run on this server`);
        return this.run(scope, script.replace('#', ''), label);
    }

    /** Runs a function body against copies of the scope's values; copies back what it changed; returns its value. */
    async run(scope, body: string, label: string) {
        const name = ScriptHandler.scriptName(scope, label);
        const view = scopeView(scope);
        const { result, back, calls } = await runSandboxed(view.values, body, {
            name, timeLimit: this.timeLimit, memoryLimit: this.memoryLimit, log: text => scope.log?.(text),
            self: 'item ?? instance',
            prelude: 'if (item) { item.data = data; item.input = input; item.output = output; }',
            returned: '{ data: item ? item.data : data, input: item ? item.input : input, output: item ? item.output : output, item, instance }',
        });
        view.copyBack(back);
        for (const service of new Set(calls))
            decide(scope, `${service}: not called. A real server runs the service; this demo does not, so the script got undefined.`);
        return result;
    }
}

/**
 * Runs a function body in QuickJS with `values` as its variables (JSON copies). `appServices` and `appUtils` are
 * there too: calling one of their methods returns undefined and is listed in `calls`. Returns the body's value and
 * `returned` (an expression over the variables, default all of them) as JSON. Throws the script's error, or a
 * time-limit error.
 */
export async function runSandboxed(values: Record<string, any>, body: string, options: {
    name?: string; timeLimit?: number; memoryLimit?: number; log?: (text: string) => void;
    /** an expression: `this` in the body */ self?: string;
    /** statements run before the body */ prelude?: string;
    /** an expression: what comes back of the variables */ returned?: string;
} = {}): Promise<{ result: any; back: any; calls: string[] }> {
    const { name = 'script', timeLimit = 200, memoryLimit = 32 * 1024 * 1024 } = options;
    const keys = Object.keys(values).filter(key => /^[A-Za-z_$][\w$]*$/.test(key));
    const state = JSON.stringify(values, jsonValue);
    const calls: string[] = [];

    const QuickJS = await quickJS();
    const runtime = QuickJS.newRuntime();
    runtime.setMemoryLimit(memoryLimit);
    runtime.setMaxStackSize(512 * 1024);
    const deadline = Date.now() + timeLimit;
    runtime.setInterruptHandler(() => Date.now() > deadline);
    const vm = runtime.newContext();
    const failed = (error) => sandboxError(name, error, Date.now() > deadline ? timeLimit : 0);
    try {
        // the host's two functions: a service called (recorded, not run) and console.log
        const called = vm.newFunction('__called', nameHandle => { calls.push(vm.getString(nameHandle)); });
        const log = vm.newFunction('__log', textHandle => { options.log?.(vm.getString(textHandle)); });
        vm.setProp(vm.global, '__called', called);
        vm.setProp(vm.global, '__log', log);
        called.dispose();
        log.dispose();

        const code = `(async () => {
            const __s = JSON.parse(${JSON.stringify(state)});
            const services = (path) => new Proxy(function () {}, {
                get: (_, key) => typeof key === 'string' ? services(path ? path + '.' + key : key) : undefined,
                apply: () => { __called(path); return undefined; },
            });
            const console = { log: (...args) => __log(args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ')) };
            const appServices = services('appServices'), appUtils = services('appUtils');
            let { ${keys.join(', ')} } = __s;
            ${options.prelude ?? ''}
            const __result = await (async function () {
${body}
}).call(${options.self ?? 'undefined'});
            return JSON.stringify({ result: __result === undefined ? null : __result, back: ${options.returned ?? `{ ${keys.join(', ')} }`} });
        })()`;
        let outcome;
        try {
            const promise = vm.unwrapResult(vm.evalCode(code, name));
            const settled = vm.resolvePromise(promise);
            promise.dispose();
            runtime.executePendingJobs();
            outcome = await settled;
        }
        catch (error) {
            // a syntax error, or one QuickJS raised outside the script (out of memory, interrupted)
            throw failed(error);
        }
        if (outcome.error) {
            const error = vm.dump(outcome.error);
            outcome.error.dispose();
            throw failed(error);
        }
        const parsed = JSON.parse(vm.getString(outcome.value));
        outcome.value.dispose();
        return { result: parsed.result === null ? undefined : parsed.result, back: parsed.back, calls };
    }
    finally {
        vm.dispose();
        runtime.dispose();
    }
}

/** The QuickJS engine, loaded once (its WebAssembly module) and only when a sandboxed script first runs. */
let loading: Promise<any> | undefined;
function quickJS() {
    loading ??= (async () => {
        const { newQuickJSWASMModuleFromVariant } = await import('quickjs-emscripten-core');
        const variant = (await import('@jitl/quickjs-wasmfile-release-sync')).default;
        return newQuickJSWASMModuleFromVariant(variant as any);
    })();
    return loading;
}

/** The item's fields a script may change; the rest of `item` is read-only. */
const ITEM_WRITABLE = ['assignee', 'candidateUsers', 'candidateGroups', 'dueDate', 'followUpDate', 'priority', 'vars'];
const ITEM_READABLE = ['id', 'elementId', 'name', 'type', 'status', 'seq', 'userName', 'startedAt', 'messageId', 'signalId', 'timeDue', ...ITEM_WRITABLE];

/** What a script sees of its scope (an item, a token or an execution), and how its changes go back. */
function scopeView(scope) {
    const isExecution = Object.prototype.hasOwnProperty.call(scope, 'tokens');
    const isToken = Object.prototype.hasOwnProperty.call(scope, 'startNodeId');
    const execution = isExecution ? scope : isToken ? scope.execution : scope.token?.execution;
    const instance = execution?.instance ?? {};
    const instanceView = { id: instance.id, name: instance.name, status: instance.status, startedAt: instance.startedAt, data: instance.data };

    if (isExecution) {
        return {
            values: { instance: instanceView },
            copyBack(back) { mergeChanges(instance.data, back.instance?.data); },
        };
    }
    const item = isToken ? undefined : Object.fromEntries(ITEM_READABLE.map(key => [key, scope[key]]));
    return {
        values: { data: scope.data ?? {}, input: scope.input ?? {}, output: scope.output ?? {}, item, instance: { ...instanceView, data: undefined } },
        copyBack(back) {
            mergeChanges(scope.data, back.data);
            if (isToken)
                return;
            scope.input = replaced(scope.input, back.input);
            scope.output = replaced(scope.output, back.output);
            for (const key of ITEM_WRITABLE)
                if (back.item && JSON.stringify(back.item[key], jsonValue) !== JSON.stringify(scope[key], jsonValue))
                    scope[key] = back.item[key];
        },
    };
}

/** Writes into target only the keys the script changed, added or removed: values it left alone keep their types (Dates). */
function mergeChanges(target, changed) {
    if (!target || typeof target !== 'object' || !changed || typeof changed !== 'object')
        return;
    for (const key of Object.keys(target))
        if (!(key in changed))
            delete target[key];
    for (const [key, value] of Object.entries(changed))
        if (JSON.stringify(target[key], jsonValue) !== JSON.stringify(value))
            target[key] = value;
}

/** input/output: the script may replace them with a value of another kind (an output that is a number). */
function replaced(current, changed) {
    if (current && typeof current === 'object' && changed && typeof changed === 'object' && !Array.isArray(changed)) {
        mergeChanges(current, changed);
        return current;
    }
    return changed;
}

/** JSON for the sandbox: functions and the server's objects left out, cycles cut. */
function jsonValue(this: any, key: string, value: any) {
    if (typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint')
        return undefined;
    return value;
}

function decide(scope, message: string) {
    const execution = scope?.token?.execution ?? scope?.execution ?? scope;
    execution?.decision?.(message);
}

function sandboxError(name: string, error, timedOut: number) {
    if (timedOut)
        return new Error(`${name}: stopped after ${timedOut} ms (scripts on this server have a time limit)`);
    const message = typeof error === 'object' && error ? (error.message ?? JSON.stringify(error)) : String(error);
    const result = new Error(`${name}: ${message}`);
    if (error?.name) result.name = error.name;
    return result;
}
