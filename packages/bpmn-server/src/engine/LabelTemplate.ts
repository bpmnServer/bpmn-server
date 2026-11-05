/**
 * Label templates (docs/design/labels.md): parsing, checking and filling in, with no other dependency, so the model
 * editor checks a label as the engine reads it. `${Name = path}` is a named value; `${path}` is text.
 */

/** A named value of a label: its name, the path it reads, and what it found. */
export interface ILabelValue {
    name: string;
    path: string;
    value: unknown;
}

/** A label: its text, and its named values. */
export interface ILabel {
    text: string;
    values: ILabelValue[];
}

export type LabelPart = { text: string } | { name?: string; path: string };

const PATH = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/;
const NAME = /^[\p{L}_][\p{L}\p{N}_ ]*$/u;
const FORBIDDEN = new Set(['__proto__', 'prototype', 'constructor']);
const PLACEHOLDER = /\$\{([^}]*)\}/g;

/** Why a path can't be used, or null: names separated by dots, none of them __proto__, prototype, constructor. */
export function pathProblem(path: unknown): string | null {
    if (typeof path !== 'string' || !PATH.test(path))
        return `'${path}' is not a path (names separated by dots, e.g. data.customer.name)`;
    if (path.split('.').some(part => FORBIDDEN.has(part)))
        return `'${path}' names a field that can not be read`;
    return null;
}

/** The value at a path, own fields only; undefined when it is not there. */
export function pathValue(scope: unknown, path: string): any {
    let value: any = scope;
    for (const part of path.split('.')) {
        if (value == null || typeof value !== 'object' || !Object.hasOwn(value, part)) return undefined;
        value = value[part];
    }
    return value;
}

/** A value as text: '' for none, ISO for a date, lists joined, objects as JSON. */
export function valueText(value: unknown): string {
    if (value == null) return '';
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) return value.map(v => (v != null && typeof v === 'object' ? JSON.stringify(v) : String(v ?? ''))).join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

/** A template's parts, in order: text, and placeholders (named or not). */
export function parseTemplate(template: string): LabelPart[] {
    const parts: LabelPart[] = [];
    let at = 0;
    for (const m of template.matchAll(PLACEHOLDER)) {
        if (m.index > at) parts.push({ text: template.slice(at, m.index) });
        const inside = m[1];
        const eq = inside.indexOf('=');
        parts.push(eq >= 0 ? { name: inside.slice(0, eq).trim(), path: inside.slice(eq + 1).trim() } : { path: inside.trim() });
        at = m.index + m[0].length;
    }
    if (at < template.length) parts.push({ text: template.slice(at) });
    return parts;
}

/** A template's problems: each placeholder a path, each name a name, no name twice. */
export function templateProblems(template: unknown): string[] {
    if (typeof template !== 'string') return [`'${template}' is not text`];
    const problems: string[] = [];
    const names = new Set<string>();
    for (const part of parseTemplate(template)) {
        if ('text' in part) continue;
        const p = pathProblem(part.path);
        if (p) problems.push(p);
        if (part.name !== undefined) {
            if (!NAME.test(part.name)) problems.push(`'${part.name}' is not a name`);
            else if (names.has(part.name)) problems.push(`'${part.name}' is named twice`);
            names.add(part.name);
        }
    }
    return problems;
}

/**
 * A template filled in from `scope`. A missing value (none, null, '') takes the text just before it along, so a
 * label never shows a name with nothing after it; separators left at either end are trimmed.
 */
export function fillTemplate(template: string, scope: Record<string, unknown>): ILabel {
    const parts = parseTemplate(template);
    const out: string[] = [];
    const values: ILabelValue[] = [];
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if ('text' in part) { out.push(part.text); continue; }
        const value = pathProblem(part.path) ? undefined : pathValue(scope, part.path);
        const text = valueText(value);
        if (text === '') {
            if (i > 0 && 'text' in parts[i - 1]) out.pop();      // its name goes with it
            continue;
        }
        out.push(text);
        if (part.name !== undefined) values.push({ name: part.name, path: part.path, value });
    }
    const text = out.join('').replace(/\s+/g, ' ').replace(/^[\s·,;:|—–-]+|[\s·,;:|—–-]+$/g, '');
    return { text, values };
}
