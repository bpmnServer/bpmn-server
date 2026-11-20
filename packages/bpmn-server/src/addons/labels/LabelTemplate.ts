/**
 * Label templates (docs/docs/labels.md): parsing, checking and filling in, with no other dependency, so the model
 * editor checks a label as the engine reads it.
 *
 * A label is parts separated by `;`. A part is text with at most one value, `${path}`:
 *
 *     Client: ${data.clientId}; Order: ${data.orderNo}       →  Client: abc · Order: 1234
 *
 * - the parts shown are joined with ` · `;
 * - a part whose value is missing is left out, its text too: `Order: 1234`;
 * - a part with a value is one of the label's values, a column of the lists: its name is the part's text without the
 *   value, trimmed, with a trailing `:` dropped (`Client`); with no text, its path's last name;
 * - a part with no value is always shown, and is not a value.
 *
 * A label with no `;` is one part, or, written before 3.7.5 with several values, each value with the text before it:
 * `Client: ${Client = data.clientId} · Order: ${Order = data.orderNo}` is still read, `Name =` naming its value.
 */

/** A value of a label: its name, the path it reads, and what it found. */
export interface ILabelValue {
    name: string;
    path: string;
    value: unknown;
}

/** A label: its text, and its values. */
export interface ILabel {
    text: string;
    values: ILabelValue[];
}

/** A part of a label: its text around its value, the value's path, and the name the value is known by. */
export interface ILabelPart {
    before: string;
    after: string;
    path?: string;
    /** the value's name: given (`${Name = path}`, as before 3.7.5), else from the part's text, else from its path */
    name?: string;
}

import { pathProblem, pathValue, valueText } from '../../engine/DataPaths.js';

const NAME = /^[\p{L}_][\p{L}\p{N}_ ]*$/u;
const PLACEHOLDER = /\$\{([^}]*)\}/g;
/** what is trimmed from a part's text to make its value's name, and from a label's ends */
const EDGES = /^[\s·,;:|—–-]+|[\s·,;:|—–-]+$/g;

/** A placeholder's inside: its path, and the name given before 3.7.5 (`Name = path`). */
function placeholder(inside: string): { path: string; given?: string } {
    const eq = inside.indexOf('=');
    return eq >= 0 ? { given: inside.slice(0, eq).trim(), path: inside.slice(eq + 1).trim() } : { path: inside.trim() };
}

/** Its value's name: the one given, else its text trimmed, else its path's last name. */
function nameOf(given: string | undefined, before: string, after: string, path: string): string {
    if (given) return given;
    const text = `${before} ${after}`.replace(/\s+/g, ' ').replace(EDGES, '');
    return text || path.slice(path.lastIndexOf('.') + 1);
}

/** Whether a template is written in parts (`;`), outside its values. */
const inParts = (template: string) => template.replace(PLACEHOLDER, '').includes(';');

/**
 * A template's parts, in order. In parts (`;`): each part, with at most one value (a second is reported by
 * templateProblems, and read as part of its text). Else, as before 3.7.5: each value with the text before it, and the
 * text after the last one a part of its own.
 */
export function labelParts(template: string): ILabelPart[] {
    template = template ?? '';
    const parts: ILabelPart[] = [];
    if (inParts(template)) {
        for (const piece of template.split(/;(?![^{]*\})/)) {
            const m = [...piece.matchAll(PLACEHOLDER)];
            if (!m.length) { if (piece.trim()) parts.push({ before: piece, after: '' }); continue; }
            const { path, given } = placeholder(m[0][1]);
            const before = piece.slice(0, m[0].index), after = piece.slice(m[0].index + m[0][0].length);
            parts.push({ before, after, path, name: nameOf(given, before, after.replace(PLACEHOLDER, ''), path) });
        }
        return parts;
    }
    let at = 0;
    for (const m of template.matchAll(PLACEHOLDER)) {
        const { path, given } = placeholder(m[1]);
        const before = template.slice(at, m.index);
        parts.push({ before, after: '', path, name: nameOf(given, before, '', path) });
        at = m.index + m[0].length;
    }
    if (at < template.length) parts.push({ before: template.slice(at), after: '' });
    return parts;
}

/** A template's values: their names and the paths they read, in order. */
export function namedValues(template: string): { name: string; path: string }[] {
    return labelParts(template).filter(p => p.path && !pathProblem(p.path)).map(p => ({ name: p.name, path: p.path }));
}

/** A template's problems: each value a path, at most one in a part, a name given a name, no name twice. */
export function templateProblems(template: unknown): string[] {
    if (typeof template !== 'string') return [`'${template}' is not text`];
    const problems: string[] = [];
    if (inParts(template))
        for (const piece of template.split(/;(?![^{]*\})/))
            if ([...piece.matchAll(PLACEHOLDER)].length > 1) problems.push(`'${piece.trim()}' has more than one value: one to a part, the parts separated by ;`);
    for (const m of template.matchAll(PLACEHOLDER)) {
        const { path, given } = placeholder(m[1]);
        const p = pathProblem(path);
        if (p) problems.push(p);
        if (given !== undefined && !NAME.test(given)) problems.push(`'${given}' is not a name`);
    }
    const names = new Set<string>();
    for (const part of labelParts(template)) {
        if (!part.path) continue;
        if (names.has(part.name)) problems.push(`'${part.name}' is named twice`);
        names.add(part.name);
    }
    return problems;
}

/**
 * A template filled in from `scope`. A part whose value is missing (none, null, '', only spaces) is left out, its text
 * too, so a label never shows a name with nothing after it. In parts, the parts are joined with ` · `; separators left
 * at either end are trimmed.
 */
export function fillTemplate(template: string, scope: Record<string, unknown>): ILabel {
    const parted = inParts(template ?? '');
    const shown: string[] = [];
    const values: ILabelValue[] = [];
    for (const part of labelParts(template)) {
        if (!part.path) { shown.push(part.before); continue; }
        const value = pathProblem(part.path) ? undefined : pathValue(scope, part.path);
        const text = valueText(value);
        if (text.trim() === '') continue;
        shown.push(part.before + text + part.after);
        values.push({ name: part.name, path: part.path, value });
    }
    const joined = parted ? shown.map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' · ') : shown.join('');
    return { text: joined.replace(/\s+/g, ' ').replace(EDGES, ''), values };
}
