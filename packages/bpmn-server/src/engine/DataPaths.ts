/**
 * Data paths (`data.customer.name`): checked, read and shown as text. What labels and the lists' columns read, and
 * nothing else of the data: own fields only, never internals.
 */
const PATH = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/;
const FORBIDDEN = new Set(['__proto__', 'prototype', 'constructor']);

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
