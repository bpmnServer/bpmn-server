/**
 * The lists' columns, chosen by the person looking at them (docs/docs/list-columns.md): a value the models' case
 * labels name (`Client`: each model's own path, engine/Labels.ts labelFields), or any field of a case's data
 * (`data.amount`). A list shows each column's value as text, and may be sorted by one.
 *
 * Nothing is stored here: the columns come with each request (a page's URL, API v3's ?columns=).
 */
import { pathProblem, pathValue, valueText } from './LabelTemplate.js';
import type { ILabelField } from './Labels.js';

/** At most this many columns in a list. */
export const MAX_COLUMNS = 12;

/** A column: its key (a named value's name, or a data path), its title, and the path it reads in each model. */
export interface IListColumn {
    key: string;
    title: string;
    /** A data path's: the same path in every model. */
    path?: string;
    /** A named value's: its path in each model that names it. */
    paths?: Map<string, string>;
}

/** A column that can not be shown or sorted by: 400, with its code. */
export class ListColumnError extends Error {
    readonly status = 400;
    constructor(message: string, readonly code: string) { super(message); }
}

/** The keys asked, as a list: `Client,data.amount` or an array; each once, empty ones left out. */
export function columnKeys(asked: unknown): string[] {
    const list = Array.isArray(asked) ? asked : typeof asked === 'string' ? asked.split(',') : [];
    return [...new Set(list.map(k => String(k).trim()).filter(Boolean))];
}

/**
 * The columns for these keys: a data path (`data.…`), or a name the case labels give (`Client`), within `model` when
 * one is chosen. A key that is neither is a 400 BAD_COLUMN.
 */
export function listColumns(fields: ILabelField[], keys: string[], model?: string): IListColumn[] {
    if (keys.length > MAX_COLUMNS)
        throw new ListColumnError(`at most ${MAX_COLUMNS} columns`, 'BAD_COLUMN');
    return keys.map(key => {
        if (key.startsWith('data.')) {
            const problem = pathProblem(key);
            if (problem) throw new ListColumnError(problem, 'BAD_COLUMN');
            return { key, title: key.slice('data.'.length), path: key };
        }
        const named = fields.filter(f => f.name === key && (!model || f.model === model));
        if (!named.length)
            throw new ListColumnError(`'${key}' is not a value the cases' labels name${model ? ` in ${model}` : ''}, nor a data path (data.…)`, 'BAD_COLUMN');
        return { key, title: key, paths: new Map(named.map(f => [f.model, f.path])) };
    });
}

/** The path a column reads in a model's case; undefined when that model doesn't name it. */
export function columnPath(column: IListColumn, model: string | undefined): string | undefined {
    return column.path ?? (model === undefined ? undefined : column.paths?.get(model));
}

/** The one path a column reads in every case, so a database can sort by it; undefined when models differ. */
export function columnSortPath(column: IListColumn): string | undefined {
    if (column.path) return column.path;
    const paths = new Set(column.paths?.values() ?? []);
    return paths.size === 1 ? [...paths][0] : undefined;
}

/** A case's value of a column (its model, its data), as it is. */
export function columnRaw(column: IListColumn, model: string | undefined, data: unknown): unknown {
    const path = columnPath(column, model);
    return path === undefined ? undefined : pathValue({ data }, path);
}

/** A case's columns as text, by key: `{ Client: 'acme', 'data.amount': '1200' }`. */
export function columnValues(columns: IListColumn[], model: string | undefined, data: unknown): Record<string, string> {
    return Object.fromEntries(columns.map(c => [c.key, valueText(columnRaw(c, model, data))]));
}

/** Whether a data path is one the models' case labels read: shown in every list already (a label is public by design). */
export function isLabelPath(fields: ILabelField[], path: string): boolean {
    return fields.some(f => f.path === path);
}

/** Two values in a sort's order: none last, numbers as numbers, dates by time, text by its letters. */
export function compareValues(a: unknown, b: unknown): number {
    const none = (v: unknown) => v == null || v === '';
    if (none(a) || none(b)) return none(a) === none(b) ? 0 : none(a) ? 1 : -1;
    const time = (v: unknown) => (v instanceof Date ? v.getTime() : undefined);
    if (time(a) !== undefined && time(b) !== undefined) return time(a)! - time(b)!;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return valueText(a).localeCompare(valueText(b), undefined, { numeric: true, sensitivity: 'base' });
}

/** Records sorted by a value, in `direction`; those without one last either way; `tie` orders equal ones. */
export function sortRecords<T>(records: T[], valueOf: (r: T) => unknown, direction: 1 | -1, tie: (a: T, b: T) => number = () => 0): T[] {
    const none = (v: unknown) => v == null || v === '';
    return [...records].sort((a, b) => {
        const va = valueOf(a), vb = valueOf(b);
        if (none(va) !== none(vb)) return none(va) ? 1 : -1;
        return (none(va) ? 0 : compareValues(va, vb) * direction) || tie(a, b);
    });
}

const formFieldsCache = new Map<string, { id: string; label: string }[]>();
const ATTRIBUTE = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const unescapeXml = (text: string) => text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

/**
 * A model's form fields, each once, in the order the model has them: their ids (each a field of the case's data,
 * `data.<id>`) and labels. What a person knows a case's data by, to choose a list's columns.
 */
export function modelFormFields(source: string | undefined): { id: string; label: string }[] {
    if (!source) return [];
    const cached = formFieldsCache.get(source);
    if (cached) return cached;
    const fields = new Map<string, string>();
    for (const [tag] of source.matchAll(/<camunda:formField\b[^>]*>/g)) {
        const id = ATTRIBUTE(tag, 'id');
        if (!id || pathProblem(id) || fields.has(id)) continue;
        fields.set(id, unescapeXml(ATTRIBUTE(tag, 'label') || id));
    }
    const found = [...fields].map(([id, label]) => ({ id, label }));
    if (formFieldsCache.size > 50) formFieldsCache.clear();
    formFieldsCache.set(source, found);
    return found;
}

/** The order asked: asc or desc (a 400 BAD_SORT otherwise); `fallback` when none. */
export function sortOrder(order: unknown, fallback: 1 | -1): 1 | -1 {
    if (order === undefined || order === '') return fallback;
    if (order === 'asc') return 1;
    if (order === 'desc') return -1;
    throw new ListColumnError(`order is asc or desc, not ${String(order)}`, 'BAD_SORT');
}
