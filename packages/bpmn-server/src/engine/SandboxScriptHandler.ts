import { ScriptHandler, type ScriptContext } from './ScriptHandler.js';
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
 *
 * With `callServices`, calling a method of `appServices` or `appUtils` runs it, in the server, with JSON copies of
 * its arguments, and the script gets a JSON copy of what it returns. Whoever writes a model can then call every one
 * of those methods with any arguments, so they must be safe to be called so. Only methods are reached, and only
 * through plain objects: not a service's other objects (its appDelegate), nor what every object inherits.
 */
export class SandboxScriptHandler extends ScriptHandler {
    /** Milliseconds a script or expression may run. */
    timeLimit = 200;
    /** Bytes a script may use. */
    memoryLimit = 32 * 1024 * 1024;
    /** Calling a method of appServices or appUtils runs it (else it runs nothing, and the run's decisions say so). */
    callServices = false;

    constructor(options: { timeLimit?: number; memoryLimit?: number; callServices?: boolean; context?: ScriptContext } = {}) {
        super(options);
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
        const { result, back, calls } = await runSandboxed({ ...view.values, ...this.contextValues(scope) }, body, {
            name, timeLimit: this.timeLimit, memoryLimit: this.memoryLimit, log: text => scope.log?.(text),
            services: this.callServices ? view.services : undefined,
            self: 'item ?? instance',
            prelude: 'if (item) { item.data = data; item.input = input; item.output = output; }',
            returned: '{ data: item ? item.data : data, input: item ? item.input : input, output: item ? item.output : output, item, instance }',
        });
        view.copyBack(back);
        for (const service of new Set(calls))
            decide(scope, `${service}: not called. This server does not let scripts call services, so the script got undefined.`);
        return result;
    }
}

/**
 * Runs a function body in QuickJS with `values` as its variables (JSON copies). `appServices` and `appUtils` are
 * there too: calling one of their methods returns undefined and is listed in `calls`, or, given `services`, runs it.
 * Returns the body's value and `returned` (an expression over the variables, default all of them) as JSON. Throws the
 * script's error, or a time-limit error. The time limit is the script's own: not what it waits for a service.
 */
export async function runSandboxed(values: Record<string, any>, body: string, options: {
    name?: string; timeLimit?: number; memoryLimit?: number; log?: (text: string) => void;
    /** an expression: `this` in the body */ self?: string;
    /** statements run before the body */ prelude?: string;
    /** an expression: what comes back of the variables */ returned?: string;
    /** what calling appServices.x and appUtils.x runs */ services?: { appServices?: any; appUtils?: any };
} = {}): Promise<{ result: any; back: any; calls: string[] }> {
    const { name = 'script', timeLimit = 200, memoryLimit = 32 * 1024 * 1024 } = options;
    const keys = Object.keys(values).filter(key => /^[A-Za-z_$][\w$]*$/.test(key));
    const state = JSON.stringify(values, jsonValue);
    const calls: string[] = [];

    const QuickJS = await quickJS();
    const runtime = QuickJS.newRuntime();
    runtime.setMemoryLimit(memoryLimit);
    runtime.setMaxStackSize(512 * 1024);
    let deadline = Date.now() + timeLimit;
    runtime.setInterruptHandler(() => Date.now() > deadline);
    const vm = runtime.newContext();
    const failed = (error) => sandboxError(name, error, Date.now() > deadline ? timeLimit : 0);
    // the calls still running, and the script's jobs: run again when one comes back; not the script's time while it waits
    const running = new Set<any>();
    let closed = false, waitingSince = 0, stop: (error) => void;
    const stopped = new Promise<never>((_, reject) => { stop = reject; });
    const runJobs = () => {
        const jobs = runtime.executePendingJobs();
        if (jobs.error) {
            const error = vm.dump(jobs.error);
            jobs.error.dispose();
            stop(error);
        }
        else
            jobs.dispose();
    };
    const cameBack = (settle: () => void) => {
        if (closed) return;     // the script ended without waiting for it
        deadline += Date.now() - waitingSince;
        settle();
        runJobs();
        waitingSince = Date.now();
    };
    const asError = (error) => vm.newError({ name: String(error?.name ?? 'Error'), message: String(error?.message ?? error) });
    const callService = (path: string, args: string) => {
        const started = Date.now();
        try {
            const result = serviceMethod(options.services, path)(JSON.parse(args));
            if (typeof result?.then !== 'function')
                return vm.newString(asJson(result));
            const promise = vm.newPromise();
            running.add(promise);
            result.then(
                value => cameBack(() => { running.delete(promise); vm.newString(asJson(value)).consume(text => promise.resolve(text)); }),
                error => cameBack(() => { running.delete(promise); asError(error).consume(handle => promise.reject(handle)); }));
            return promise.handle;
        }
        catch (error) {
            return { error: asError(error) };
        }
        finally {
            deadline += Date.now() - started;
        }
    };
    try {
        // the host's two functions: a service called (recorded, or run) and console.log
        const called = vm.newFunction('__called', (nameHandle, argsHandle) => {
            const path = vm.getString(nameHandle);
            if (options.services) return callService(path, vm.getString(argsHandle));
            calls.push(path);
        });
        const log = vm.newFunction('__log', textHandle => { options.log?.(vm.getString(textHandle)); });
        vm.setProp(vm.global, '__called', called);
        vm.setProp(vm.global, '__log', log);
        called.dispose();
        log.dispose();

        const code = `(async () => {
            const __s = JSON.parse(${JSON.stringify(state)});
            const services = (path) => new Proxy(function () {}, {
                get: (_, key) => typeof key === 'string' ? services(path ? path + '.' + key : key) : undefined,
                apply: (_, __, args) => {
                    const back = __called(path, JSON.stringify(args));
                    const value = text => JSON.parse(text).value;
                    return back === undefined ? undefined : typeof back === 'string' ? value(back) : back.then(value);
                },
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
            runJobs();
            waitingSince = Date.now();
            outcome = await Promise.race([settled, stopped]);
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
        closed = true;
        for (const promise of running) promise.dispose();
        vm.dispose();
        runtime.dispose();
    }
}

/** What a service returned, for the sandbox. */
const asJson = (value) => JSON.stringify({ value }, jsonValue);

/**
 * `appServices.a.b` as a function of its arguments' list: a method, reached through plain objects only (a service's
 * other objects are the server's), and none of what every object or function inherits (constructor, __proto__, call).
 */
function serviceMethod(services, path: string) {
    const [root, ...keys] = path.split('.');
    let owner = services?.[root], value = owner;
    for (const key of keys) {
        const plain = value === services?.[root] || Object.getPrototypeOf(value ?? 0) === Object.prototype || Object.getPrototypeOf(value ?? 0) === null;
        if (!plain || key in Object.prototype)
            throw new TypeError(`${path} is not a service`);
        owner = value;
        value = value[key];
    }
    if (typeof value !== 'function' || !keys.length)
        throw new TypeError(`${path} is not a function`);
    return (args: any[]) => value.apply(owner, args);
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
    const services = { appServices: execution?.servicesProvider, appUtils: execution?.appDelegate?.appUtils };

    if (isExecution) {
        return {
            services,
            // a process's own script has no item; the sandbox's own code reads these whatever the scope
            values: { instance: instanceView, item: undefined, data: undefined, input: undefined, output: undefined },
            copyBack(back) { mergeChanges(instance.data, back.instance?.data); },
        };
    }
    const item = isToken ? undefined : Object.fromEntries(ITEM_READABLE.map(key => [key, scope[key]]));
    return {
        services,
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
