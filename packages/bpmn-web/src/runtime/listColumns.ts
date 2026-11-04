/**
 * Extra columns in the pages' instance list and pending-task table: fields of the instance data an application
 * wants to see at a glance (an order number, a customer, a reference), shown after Case Id.
 *
 * Set in .env as `Label:field` pairs, comma-separated, where field is a path in the instance data:
 *
 *     INSTANCE_COLUMNS=Order:orderNo, Customer:customer.name
 *     TASK_COLUMNS=Order:orderNo
 *
 * or in code with start({ listColumns: { instances: [...], tasks: [...] } }), which wins for a table it names.
 * Without either, the tables are as before.
 */
export interface IListColumn {
	/** the column's heading */
	label: string;
	/** a path in the instance data, e.g. `orderNo` or `customer.name` */
	field: string;
}

export interface IListColumns {
	/** the instance list (Instances) */
	instances?: IListColumn[];
	/** the pending-task table (Pending Tasks); the values come from each task's instance data */
	tasks?: IListColumn[];
}

const FIELD = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/;
const FORBIDDEN = new Set(['__proto__', 'prototype', 'constructor']);

function fieldProblem(field: unknown): string | null {
	if (typeof field !== 'string' || !FIELD.test(field))
		return `'${field}' is not a field path (names separated by dots, e.g. customer.name)`;
	if (field.split('.').some(part => FORBIDDEN.has(part)))
		return `'${field}' names a field that can not be shown`;
	return null;
}

/** `Label:field, Label:field` → columns; an entry that is not one is left out and reported. */
export function parseListColumns(text: string | undefined, setting = 'columns'): { columns: IListColumn[]; invalid: string[] } {
	const columns: IListColumn[] = [];
	const invalid: string[] = [];
	for (const entry of (text ?? '').split(',').map(e => e.trim()).filter(Boolean)) {
		const at = entry.lastIndexOf(':');
		const label = at > 0 ? entry.slice(0, at).trim() : '';
		const field = at > 0 ? entry.slice(at + 1).trim() : '';
		const problem = !label ? `'${entry}' is not Label:field` : fieldProblem(field);
		if (problem) invalid.push(`${setting}: ${problem}; left out`);
		else columns.push({ label, field });
	}
	return { columns, invalid };
}

/** Columns given in code: each one checked as the .env ones are. */
function checked(columns: IListColumn[], setting: string, invalid: string[]): IListColumn[] {
	return columns.filter(column => {
		const problem = !column?.label ? `a column without a label` : fieldProblem(column.field);
		if (problem) invalid.push(`${setting}: ${problem}; left out`);
		return !problem;
	});
}

/** The tables' extra columns: start()'s listColumns for a table it names, else INSTANCE_COLUMNS / TASK_COLUMNS. */
export function resolveListColumns(options: IListColumns = {}, env: Record<string, string | undefined> = process.env):
	{ instances: IListColumn[]; tasks: IListColumn[]; invalid: string[] } {
	const invalid: string[] = [];
	const table = (given: IListColumn[] | undefined, setting: string) => {
		if (given) return checked(given, `listColumns.${setting === 'INSTANCE_COLUMNS' ? 'instances' : 'tasks'}`, invalid);
		const parsed = parseListColumns(env[setting], setting);
		invalid.push(...parsed.invalid);
		return parsed.columns;
	};
	return { instances: table(options.instances, 'INSTANCE_COLUMNS'), tasks: table(options.tasks, 'TASK_COLUMNS'), invalid };
}

/** The text a column shows for a field of the data: '' when it is not there. */
export function columnValue(data: unknown, field: string): string {
	let value: any = data;
	for (const part of field.split('.')) {
		if (value == null || typeof value !== 'object' || !Object.hasOwn(value, part)) return '';
		value = value[part];
	}
	if (value == null) return '';
	if (value instanceof Date) return value.toISOString();
	if (Array.isArray(value)) return value.map(v => (v != null && typeof v === 'object' ? JSON.stringify(v) : String(v ?? ''))).join(', ');
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}
