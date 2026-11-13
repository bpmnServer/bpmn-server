/**
 * Evaluates DMN decisions as the standard describes them: input expressions and cells are FEEL (feelin), with
 * the hit policies UNIQUE, FIRST, PRIORITY, ANY, COLLECT (with SUM, MIN, MAX or COUNT), RULE ORDER and OUTPUT ORDER,
 * literal expression decisions, and decisions that require others.
 *
 * Results:
 *  - a single-hit table (UNIQUE, FIRST, PRIORITY, ANY): the matching rule's outputs, { name: value }, or null
 *  - a multi-hit table (COLLECT, RULE ORDER, OUTPUT ORDER): a list of them, [] when none match
 *  - COLLECT with an aggregation: { name: value } of the first output, aggregated
 *  - a literal expression: { variable: value }
 */
import * as fs from 'fs';
import * as path from 'path';
import { evaluate as feelEvaluate, unaryTest } from 'feelin';
import { DMNParser, legacyTest } from './DMNParser.js';
import type { DMNDefinitions, Decision, DecisionTable } from './DMNParser.js';

type DMNOptions = {
    debug?: boolean;
    log?: (message: string) => void;
    /** an output cell to keep as its text, not evaluated as FEEL (an assignment policy's `$(...)`: engine/AssignmentPolicy.ts) */
    keepOutput?: (cell: string) => boolean;
    /** an input whose value is a list matches a rule's test when the list or one of its values does (every decision: engine/DecisionContext.ts) */
    listInputs?: boolean;
};

/** Where a decision was found. */
type FoundDecision = { filePath: string; definitions: DMNDefinitions; decision: Decision };

const DMN_FILE = /\.dmn(\.xml)?$/i;
const BARE_WORD = /^[A-Za-z_][\w ]*$/;
const NUMBER_TYPES = ['number', 'integer', 'long', 'double'];

class DMNEngine {
    definitions: DMNDefinitions;
    decision: Decision;
    private options: DMNOptions;
    /** the rules the last table evaluated matched, numbered from 1 */
    matched: number[] = [];
    /** input expressions that call an async function, their values awaited first: evaluateAsync */
    private called = new Map<string, any>();

    constructor(options: DMNOptions = { debug: false }) {
        this.options = options;
    }

    private log(message: string) {
        if (this.options.log) this.options.log(message);
        else if (this.options.debug) console.log(message);
    }

    /** The decision a model names (camunda:decisionRef) in a folder: a file `<ref>.dmn.xml`, or a decision with that id. */
    static async find(folder: string, ref: string): Promise<FoundDecision> {
        let files: string[];
        try {
            files = fs.readdirSync(folder).filter(f => DMN_FILE.test(f));
        }
        catch {
            throw new Error(`Decision '${ref}' not found: the folder ${folder} can not be read.`);
        }
        const base = (f: string) => f.replace(DMN_FILE, '');
        const load = async (f: string) => ({ filePath: path.join(folder, f), definitions: await DMNParser.loadFile(path.join(folder, f)) });
        for (const same of [(a: string, b: string) => a === b, (a: string, b: string) => a.toLowerCase() === b.toLowerCase()]) {
            const file = files.find(f => same(base(f), ref));
            if (file) {
                const found = await load(file);
                const decision = found.definitions.decisions.find(d => same(d.id, ref)) || DMNEngine.topDecision(found.definitions);
                return { ...found, decision };
            }
            for (const f of files) {
                let found;
                try { found = await load(f); } catch { continue; }    // a file that does not parse does not hold it
                const decision = found.definitions.decisions.find(d => same(d.id, ref));
                if (decision) return { ...found, decision };
            }
        }
        throw new Error(`Decision '${ref}' not found: no ${ref}.dmn.xml and no decision with that id in ${folder}.`);
    }

    /** The decision a file is for: the first one no other decision of the file requires. */
    static topDecision(definitions: DMNDefinitions): Decision {
        const required = new Set(definitions.decisions.flatMap(d => d.requires));
        return definitions.decisions.find(d => !required.has(d.id)) || definitions.decisions[0];
    }

    /** Load a DMN file: its decision `decisionId`, or the decision the file is for. */
    async load(filePath: string, decisionId?: string) {
        this.definitions = await DMNParser.loadFile(filePath);
        this.decision = (decisionId && this.definitions.decisions.find(d => d.id === decisionId)) || DMNEngine.topDecision(this.definitions);
        this.log(`..decision ${this.decision.name} loaded from ${path.basename(filePath)}`);
        return this;
    }

    /** Evaluate the loaded decision with these values (or, for a table, its inputs' values in order). */
    evaluate(input: Record<string, any> | any[]): any {
        if (!this.decision)
            throw new Error('Must load a decision first');
        let context: Record<string, any> = (input as Record<string, any>) || {};
        if (Array.isArray(input) && this.decision.table) {
            context = {};
            this.decision.table.inputs.forEach((col, i) => { context[col.expression] = input[i]; });
        }
        return this.evaluateDecision(this.decision, context, []);
    }

    /**
     * Evaluate it, an input expression that calls a function (`appServices.crm.tierOf(customerId)`) awaited first:
     * once each, with these values. A call inside a larger expression (`f(x) = 1`) is not awaited.
     */
    async evaluateAsync(input: Record<string, any>): Promise<any> {
        if (!this.decision)
            throw new Error('Must load a decision first');
        this.called = new Map();
        for (const decision of this.definitions.decisions)
            for (const column of decision.table?.inputs ?? []) {
                if (!column.expression.includes('(') || this.called.has(column.expression)) continue;
                let value;
                try { value = feelEvaluate(column.expression, input || {}).value; }
                catch { continue; }
                if (!(value instanceof Promise)) continue;     // worked out where it is, as any other
                try { this.called.set(column.expression, await value); }
                catch (error) { throw new Error(`Decision '${decision.name}' input '${column.expression}': ${error?.message ?? error}`); }
            }
        try { return this.evaluate(input); }
        finally { this.called = new Map(); }
    }

    private evaluateDecision(decision: Decision, context: Record<string, any>, path: string[]): any {
        if (path.includes(decision.id))
            throw new Error(`Decision '${decision.name}' requires itself: ${[...path, decision.id].join(' > ')}`);
        context = { ...context };
        for (const id of decision.requires) {
            const required = this.definitions.decisions.find(d => d.id === id);
            if (!required)
                throw new Error(`Decision '${decision.name}' requires '${id}', which is not in the file.`);
            // its result by the decision's id and name, and a single result's outputs by their names
            const result = this.evaluateDecision(required, context, [...path, decision.id]);
            context[required.id] = result;
            if (required.name) context[required.name] = result;
            if (result && typeof result === 'object' && !Array.isArray(result))
                Object.assign(context, result);
        }
        if (decision.literal) {
            const value = this.value(decision.literal.text, context);
            this.log(`..decision ${decision.name}: ${decision.literal.variable} = ${JSON.stringify(value)}`);
            return { [decision.literal.variable]: value };
        }
        if (!decision.table)
            throw new Error(`Decision '${decision.name}' is neither a decision table nor a literal expression.`);
        return this.evaluateTable(decision, decision.table, context);
    }

    private evaluateTable(decision: Decision, table: DecisionTable, context: Record<string, any>): any {
        const values = table.inputs.map(input => {
            const value = this.called.has(input.expression) ? this.called.get(input.expression) : this.value(input.expression, context, false);
            if (value instanceof Promise)
                throw new Error(`Decision '${decision.name}' input '${input.expression}' calls an async function: evaluated with evaluateAsync`);
            return coerce(value, input.typeRef);
        });
        // output cells see an input named by its expression as its column's type
        context = { ...context };
        table.inputs.forEach((input, c) => { if (/^[A-Za-z_]\w*$/.test(input.expression)) context[input.expression] = values[c]; });
        const matched: number[] = [];
        for (let r = 0; r < table.rules.length; r++) {
            const rule = table.rules[r];
            const passes = (cell: string, c: number) => {
                try {
                    return this.test(cell, values[c], context);
                }
                catch (exc) {
                    throw new Error(`Decision '${decision.name}' rule ${r + 1}: '${cell}' is not a FEEL test: ${exc.message}`);
                }
            };
            if (rule.inputEntries.every(passes)) {
                matched.push(r);
                if (table.hitPolicy === 'FIRST') break;
            }
        }
        const outputs = (r: number) => {
            const record = {};
            table.outputs.forEach((o, c) => {
                const cell = table.rules[r].outputEntries[c];
                if (this.options.keepOutput?.(cell)) { record[o.name] = cell.trim(); return; }
                try {
                    record[o.name] = coerce(this.value(cell, context), o.typeRef);
                }
                catch (exc) {
                    throw new Error(`Decision '${decision.name}' rule ${r + 1}: output '${o.name}' '${cell}' does not parse as FEEL: ${exc.message}`);
                }
            });
            return record;
        };
        this.matched = matched.map(r => r + 1);
        const inputsText = table.inputs.map((i, c) => `${i.expression}=${JSON.stringify(values[c])}`).join(', ');
        this.log(`..decision ${decision.name} (${table.hitPolicy}${table.aggregation ? ' ' + table.aggregation : ''}): ${inputsText}; rules matched: ${matched.length ? matched.map(r => r + 1).join(', ') : 'none'}`);

        switch (table.hitPolicy) {
            case 'UNIQUE':
                if (matched.length > 1)
                    throw new Error(`Decision '${decision.name}' (UNIQUE): rules ${matched.map(r => r + 1).join(', ')} all match; only one may.`);
                return matched.length ? outputs(matched[0]) : null;
            case 'FIRST':
                return matched.length ? outputs(matched[0]) : null;
            case 'ANY': {
                const results = matched.map(outputs);
                if (results.some(r => JSON.stringify(r) !== JSON.stringify(results[0])))
                    throw new Error(`Decision '${decision.name}' (ANY): rules ${matched.map(r => r + 1).join(', ')} match with different outputs.`);
                return results.length ? results[0] : null;
            }
            case 'PRIORITY': {
                const results = this.byPriority(table, matched.map(outputs), context);
                return results.length ? results[0] : null;
            }
            case 'OUTPUT ORDER':
                return this.byPriority(table, matched.map(outputs), context);
            case 'RULE ORDER':
                return matched.map(outputs);
            case 'COLLECT': {
                const results = matched.map(outputs);
                if (!table.aggregation)
                    return results;
                const name = table.outputs[0] && table.outputs[0].name;
                const numbers = results.map(r => r[name]).filter(v => typeof v === 'number');
                const aggregated = {
                    SUM: () => numbers.reduce((a, b) => a + b, 0),
                    MIN: () => numbers.length ? Math.min(...numbers) : null,
                    MAX: () => numbers.length ? Math.max(...numbers) : null,
                    COUNT: () => new Set(results.map(r => JSON.stringify(r[name]))).size
                }[table.aggregation];
                if (!aggregated)
                    throw new Error(`Decision '${decision.name}': unknown aggregation '${table.aggregation}'.`);
                return { [name]: aggregated() };
            }
            default:
                throw new Error(`Decision '${decision.name}': unknown hit policy '${table.hitPolicy}'.`);
        }
    }

    /** Results ordered by their outputs' places in the outputs' value lists (the first listed is the highest). */
    private byPriority(table: DecisionTable, results: Record<string, any>[], context: Record<string, any>) {
        const lists = table.outputs.map(o => o.values ? this.value(`[${o.values}]`, context) : null);
        const rank = (r: Record<string, any>) => table.outputs.map((o, i) => {
            const at = Array.isArray(lists[i]) ? lists[i].indexOf(r[o.name]) : -1;
            return at < 0 ? Number.MAX_SAFE_INTEGER : at;
        });
        const compare = (a: number[], b: number[]) => {
            for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
            return 0;
        };
        return results.map(r => ({ r, rank: rank(r) })).sort((a, b) => compare(a.rank, b.rank)).map(x => x.r);
    }

    /** An input cell's test of the input's value. */
    private test(cell: string, value: any, context: Record<string, any>): boolean {
        const source = legacyTest(cell);
        if (source === '' || source === '-')
            return true;
        // an input whose value is a list (a person's groups, their relations to a case): a test holds when it holds for
        // the list (count(?) > 1), or for one of its values ("HR" matches ["Employee", "HR"]), with listInputs
        if (this.options.listInputs && Array.isArray(value))
            return this.testValue(source, value, context) || value.some(one => this.testValue(source, one, context));
        return this.testValue(source, value, context);
    }

    private testValue(source: string, value: any, context: Record<string, any>): boolean {
        const result = unaryTest(source, { ...context, '?': value });
        // a bare word no data names: a string, as bpmn-server's earlier evaluator read it
        if (BARE_WORD.test(source) && !(source in context) && missingVariable(result.warnings))
            return value === source;
        return result.value === true;
    }

    /** A FEEL expression's value. */
    private value(source: string, context: Record<string, any>, bareWordIsText = true): any {
        if (source === undefined || source === null || String(source).trim() === '')
            return null;
        const result = feelEvaluate(source, context);
        if (bareWordIsText && BARE_WORD.test(source.trim()) && !(source.trim() in context) && missingVariable(result.warnings))
            return source.trim();
        return result.value === undefined ? null : result.value;
    }
}

const missingVariable = (warnings: { type: string }[]) => (warnings || []).some(w => w.type === 'NO_VARIABLE_FOUND');

/** A value as its column's type: form fields arrive as text. */
function coerce(value: any, typeRef: string) {
    const type = (typeRef || '').toLowerCase();
    if (typeof value === 'string' && NUMBER_TYPES.includes(type) && value.trim() !== '' && !isNaN(Number(value)))
        return Number(value);
    if (typeof value === 'string' && type === 'boolean' && /^(true|false)$/i.test(value))
        return value.toLowerCase() === 'true';
    return value;
}

export { DMNEngine };
export type { FoundDecision, DMNOptions };
