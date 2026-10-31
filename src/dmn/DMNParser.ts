/**
 * Reads a DMN file (DMN 1.1 to 1.5, as dmn-js and Camunda Modeler save it) into its decisions: decision tables
 * and literal expressions, and the decisions each one requires.
 *
 * Cells are kept as their FEEL text; DMNEngine evaluates them.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';
import { parseExpression, parseUnaryTests } from 'feelin';

type InputClause = { id: string; label: string; expression: string; typeRef: string; values?: string };
type OutputClause = { id: string; name: string; label: string; typeRef: string; values?: string };
type Rule = { id: string; description: string; inputEntries: string[]; outputEntries: string[] };

type DecisionTable = {
    hitPolicy: string;          // UNIQUE (the default), FIRST, PRIORITY, ANY, COLLECT, RULE ORDER, OUTPUT ORDER
    aggregation?: string;       // COLLECT only: SUM, MIN, MAX, COUNT
    inputs: InputClause[];
    outputs: OutputClause[];
    rules: Rule[];
};

type Decision = {
    id: string;
    name: string;
    requires: string[];         // ids of the decisions it requires
    table?: DecisionTable;
    literal?: { text: string; variable: string; typeRef: string };
};

type DMNDefinitions = { id: string; name: string; decisions: Decision[] };

/** A problem found in a DMN file: where it is and what is wrong. */
type DMNIssue = { decisionId?: string; ruleId?: string; ruleIndex?: number; message: string };

const HIT_POLICIES = ['UNIQUE', 'FIRST', 'PRIORITY', 'ANY', 'COLLECT', 'RULE ORDER', 'OUTPUT ORDER'];
const AGGREGATIONS = ['SUM', 'MIN', 'MAX', 'COUNT'];

const list = (v) => v === undefined ? [] : Array.isArray(v) ? v : [v];
const attr = (node, name: string) => (node && node.$ && node.$[name]) || '';
const text = (node) => {
    const t = list(node && node.text)[0];
    return (typeof t === 'string' ? t : (t && t._) || '').trim();
};

class DMNParser {
    private static cache = new Map<string, { mtimeMs: number; definitions: DMNDefinitions }>();

    /** Parse a DMN file; a parsed file is kept until it changes. */
    static async loadFile(filePath: string): Promise<DMNDefinitions> {
        const mtimeMs = fs.statSync(filePath).mtimeMs;
        const cached = DMNParser.cache.get(filePath);
        if (cached && cached.mtimeMs === mtimeMs)
            return cached.definitions;
        let definitions: DMNDefinitions;
        try {
            definitions = await DMNParser.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        catch (exc) {
            throw new Error(`The decision file ${path.basename(filePath)} can not be read: ${exc.message}`);
        }
        DMNParser.cache.set(filePath, { mtimeMs, definitions });
        return definitions;
    }

    static async parse(xml: string): Promise<DMNDefinitions> {
        const parser = new xml2js.Parser({ explicitArray: false, tagNameProcessors: [xml2js.processors.stripPrefix] });
        const doc = await parser.parseStringPromise(xml);
        const root = doc && doc.definitions;
        if (!root)
            throw new Error('not a DMN file: no <definitions>');
        const decisions = list(root.decision).map(d => DMNParser.decision(d));
        if (!decisions.length)
            throw new Error('the file has no decision');
        return { id: attr(root, 'id'), name: attr(root, 'name'), decisions };
    }

    private static decision(node): Decision {
        const requires = list(node.informationRequirement)
            .map(r => attr(r.requiredDecision, 'href').replace(/^.*#/, ''))
            .filter(Boolean);
        const decision: Decision = { id: attr(node, 'id'), name: attr(node, 'name') || attr(node, 'id'), requires };
        if (node.decisionTable) {
            const t = node.decisionTable;
            const inputs: InputClause[] = list(t.input).map(i => ({
                id: attr(i, 'id'),
                label: attr(i, 'label'),
                expression: text(i.inputExpression) || attr(i, 'label'),
                typeRef: attr(i.inputExpression, 'typeRef'),
                values: text(i.inputValues) || undefined
            }));
            const outputs: OutputClause[] = list(t.output).map((o, index) => ({
                id: attr(o, 'id'),
                name: attr(o, 'name') || attr(o, 'label') || `output${index + 1}`,
                label: attr(o, 'label'),
                typeRef: attr(o, 'typeRef'),
                values: text(o.outputValues) || undefined
            }));
            const rules: Rule[] = list(t.rule).map(r => ({
                id: attr(r, 'id'),
                description: typeof r.description === 'string' ? r.description.trim() : '',
                inputEntries: list(r.inputEntry).map(text),
                outputEntries: list(r.outputEntry).map(text)
            }));
            let hitPolicy = (attr(t, 'hitPolicy') || 'UNIQUE').toUpperCase();
            let aggregation = attr(t, 'aggregation').toUpperCase() || undefined;
            if (AGGREGATIONS.includes(hitPolicy)) {     // hitPolicy="SUM", as bpmn-server's earlier evaluator read it
                aggregation = hitPolicy;
                hitPolicy = 'COLLECT';
            }
            decision.table = { hitPolicy, aggregation, inputs, outputs, rules };
        }
        else if (node.literalExpression) {
            decision.literal = {
                text: text(node.literalExpression),
                variable: attr(node.variable, 'name') || decision.name,
                typeRef: attr(node.variable, 'typeRef')
            };
        }
        return decision;
    }

    /** What is wrong with a file's decisions: hit policies, rule sizes and FEEL that does not parse. */
    static check(definitions: DMNDefinitions): DMNIssue[] {
        const issues: DMNIssue[] = [];
        const ids = new Set(definitions.decisions.map(d => d.id));
        for (const d of definitions.decisions) {
            const at = (message: string, rule?: Rule, ruleIndex?: number) =>
                issues.push({ decisionId: d.id, ruleId: rule && rule.id, ruleIndex, message });
            for (const r of d.requires)
                if (!ids.has(r)) at(`Decision '${d.name}' requires '${r}', which is not in the file.`);
            if (d.literal) {
                if (!feelParses(d.literal.text, false)) at(`Decision '${d.name}': the expression does not parse as FEEL: ${d.literal.text}`);
                continue;
            }
            if (!d.table) {
                at(`Decision '${d.name}' is neither a decision table nor a literal expression; bpmn-server does not evaluate it.`);
                continue;
            }
            const t = d.table;
            if (!HIT_POLICIES.includes(t.hitPolicy))
                at(`Decision '${d.name}': unknown hit policy '${t.hitPolicy}'.`);
            if (t.aggregation && (t.hitPolicy !== 'COLLECT' || !AGGREGATIONS.includes(t.aggregation)))
                at(`Decision '${d.name}': aggregation '${t.aggregation}' is only for the COLLECT hit policy (SUM, MIN, MAX, COUNT).`);
            if ((t.hitPolicy === 'PRIORITY' || t.hitPolicy === 'OUTPUT ORDER') && !t.outputs.some(o => o.values))
                at(`Decision '${d.name}': the ${t.hitPolicy} hit policy needs the output values listed, in order of priority.`);
            t.inputs.forEach(i => {
                if (!feelParses(i.expression, false)) at(`Decision '${d.name}': input '${i.label || i.expression}' does not parse as FEEL: ${i.expression}`);
            });
            t.rules.forEach((rule, index) => {
                const n = `Decision '${d.name}' rule ${index + 1}`;
                if (rule.inputEntries.length !== t.inputs.length || rule.outputEntries.length !== t.outputs.length)
                    at(`${n} has ${rule.inputEntries.length} input and ${rule.outputEntries.length} output cells; the table has ${t.inputs.length} and ${t.outputs.length}.`, rule, index);
                rule.inputEntries.forEach((cell, c) => {
                    if (!feelParses(cell, true)) at(`${n}: '${cell}' (${columnName(t.inputs[c])}) is not a FEEL test.`, rule, index);
                });
                rule.outputEntries.forEach((cell, c) => {
                    if (cell && !feelParses(cell, false)) at(`${n}: '${cell}' (${t.outputs[c] ? t.outputs[c].name : 'output ' + (c + 1)}) does not parse as FEEL.`, rule, index);
                });
            });
        }
        return issues;
    }
}

/** An input column as a person reads it. */
function columnName(input: InputClause) {
    return input ? (input.label || input.expression) : 'an extra cell';
}

/** The FEEL text parses: as unary tests (an input cell) or as an expression. */
function feelParses(source: string, unary: boolean): boolean {
    const s = legacyTest(source);
    if (unary && (s === '' || s === '-'))
        return true;
    try {
        const tree = unary ? parseUnaryTests(s, {}, undefined) : parseExpression(s, {}, undefined);
        let ok = true;
        tree.iterate({ enter: n => { if (n.type.isError) ok = false; } });
        return ok;
    }
    catch {
        return false;
    }
}

/** Input cells written for bpmn-server's earlier evaluator: `== 5` and `!= 5` are FEEL `5` and `not(5)`. */
function legacyTest(source: string): string {
    const s = (source || '').trim();
    if (s.startsWith('=='))
        return s.substring(2).trim();
    if (s.startsWith('!='))
        return `not(${s.substring(2).trim()})`;
    return s;
}

export { DMNParser, legacyTest, HIT_POLICIES };
export type { DMNDefinitions, Decision, DecisionTable, InputClause, OutputClause, Rule, DMNIssue };
