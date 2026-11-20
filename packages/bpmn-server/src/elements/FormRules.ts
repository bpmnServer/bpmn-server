/**
 * A user task's form rules, checked when it is completed, in its validate step (Node.validate, with the validate
 * event's scripts; docs/design/form-rules.md). A start event's fields are not checked. The model says them, on each camunda:formField:
 *
 * - `type`: `long` (a whole number), `boolean` (true or false, yes or no), `date`, `enum` (one of its camunda:value ids); `string` and others:
 *   anything.
 * - camunda:validation's constraints: `required`, `readonly`, `minlength`, `maxlength`, `min`, `max` (their limit in
 *   `config`). `validator` (Camunda's custom code) is not run: there is nothing in bpmn-server to run.
 * - `<owf:list>`: the value is one of the source's choices. An `<owf:lookup>`'s is not checked: its sources search by
 *   text, and have no way to find one key.
 *
 * A field's value is the one sent, else the case's (a value set before, at the start or by an earlier task). The rules
 * of a value that is absent are not checked, but `required`. Values from a drawn form are text: "12" is a long.
 */
import { registrationsOf } from '../engine/AddOns.js';

export interface IFormProblem {
    field: string;
    rule: string;
    message: string;
}

/** A form refused: what each field breaks. `status` 400: the caller's data, not the model. */
export class FormInvalidError extends Error {
    readonly code = 'FORM_INVALID';
    readonly status = 400;
    constructor(readonly elementId: string, readonly details: IFormProblem[]) {
        super(`The form of '${elementId}' is not valid: ` + details.map(d => d.message).join('; '));
        this.name = 'FormInvalidError';
    }
}

const CONSTRAINTS = ['required', 'readonly', 'minlength', 'maxlength', 'min', 'max', 'validator'];

/** A field's constraints, as { name: config }: from the parsed model, or the editor's moddle object. */
export function constraintsOf(field): Record<string, string | true> {
    const children = field?.$children ?? [];
    const list = field?.validation?.constraints
        ?? children.filter(c => c.$type === 'camunda:validation').flatMap(v => v.$children ?? []);
    const constraints = {};
    for (const c of list) {
        const name = String(c?.name ?? '').toLowerCase();
        if (CONSTRAINTS.includes(name)) constraints[name] = c.config ?? true;
    }
    return constraints;
}

/** An enum's value ids. */
function enumValues(field): string[] {
    const values = field?.values ?? (field?.$children ?? []).filter(c => c.$type === 'camunda:value');
    return values.map(v => String(v.id));
}

const isEmpty = value => value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
const asNumber = value => typeof value === 'number' ? value : (typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN);

/** The problems of one field's value (`value`) by its type and constraints, but its list's. */
export function fieldProblems(field, value, { sent, current }: { sent: boolean, current?: any } = { sent: true }): IFormProblem[] {
    const id = field.id;
    const label = field.label || id;
    const problems: IFormProblem[] = [];
    const problem = (rule, message) => problems.push({ field: id, rule, message: `${label}: ${message}` });
    const constraints = constraintsOf(field);

    if (constraints.readonly && sent && !isEmpty(value) && String(value) !== String(current ?? ''))
        problem('readonly', 'it is read-only');
    if (isEmpty(value)) {
        if (constraints.required) problem('required', 'a value is required');
        return problems;
    }
    switch (field.type) {
        case 'long':
            if (!Number.isInteger(asNumber(value))) problem('type', `"${value}" is not a whole number`);
            break;
        case 'boolean':
            // true or false; yes or no, as models often hold it (any case)
            if (!(value === true || value === false || /^(true|false|yes|no)$/i.test(String(value)))) problem('type', `"${value}" is not true or false (or yes or no)`);
            break;
        case 'date':
            if (!(value instanceof Date ? !isNaN(value.getTime()) : !isNaN(Date.parse(String(value))))) problem('type', `"${value}" is not a date`);
            break;
        case 'enum': {
            const values = enumValues(field);
            if (values.length && !values.includes(String(value))) problem('enum', `"${value}" is not one of ${values.join(', ')}`);
            break;
        }
    }
    const length = String(value).length;
    const limit = name => asNumber(constraints[name]);
    if (constraints.minlength !== undefined && length < limit('minlength')) problem('minlength', `at least ${constraints.minlength} characters`);
    if (constraints.maxlength !== undefined && length > limit('maxlength')) problem('maxlength', `at most ${constraints.maxlength} characters`);
    const number = asNumber(value);
    if (constraints.min !== undefined && !(number >= limit('min'))) problem('min', `at least ${constraints.min}`);
    if (constraints.max !== undefined && !(number <= limit('max'))) problem('max', `at most ${constraints.max}`);
    return problems;
}

/**
 * The problems of a form's values: `sent`, the data of the call; `current`, the case's. A list's value is checked
 * against its source's choices (as `context` asks); a source that fails refuses the value, which cannot be checked.
 */
export async function formProblems(server, fields: any[], sent: Record<string, any> = {}, current: Record<string, any> = {}, context: Record<string, any> = {}): Promise<IFormProblem[]> {
    const problems: IFormProblem[] = [];
    const data = { ...current, ...sent };
    for (const field of fields ?? []) {
        if (!field?.id) continue;
        const wasSent = Object.prototype.hasOwnProperty.call(sent, field.id);
        const value = wasSent ? sent[field.id] : current[field.id];
        const own = fieldProblems(field, value, { sent: wasSent, current: current[field.id] });
        problems.push(...own);
        if (own.length || isEmpty(value)) continue;
        // only a value sent: one the case has was checked when it was sent
        if (!wasSent || String(value) === String(current[field.id] ?? '')) continue;
        // the add-ons' rules (engine/AddOns.ts): the Forms add-on's, a list's value one of its choices
        for (const rule of registrationsOf(server).fieldRules) {
            try {
                const problem = await rule.check(server, field, value, { data, current: current[field.id] }, context);
                if (problem) problems.push(problem);
            }
            catch (error) {
                problems.push({ field: field.id, rule: rule.name, message: `${field.label || field.id}: ${error?.message ?? error}` });
            }
        }
    }
    return problems;
}

/** Throws FormInvalidError when the values break the form's rules. */
export async function checkForm(server, elementId: string, fields: any[], sent: Record<string, any>, current: Record<string, any>, context: Record<string, any> = {}) {
    if (!fields?.length) return;
    const problems = await formProblems(server, fields, sent ?? {}, current ?? {}, context);
    if (problems.length) throw new FormInvalidError(elementId, problems);
}
