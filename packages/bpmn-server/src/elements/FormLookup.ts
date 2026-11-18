/**
 * A form field's choices from a source (docs/design/form-lookups.md): a list (a drop-down, every choice read at once)
 * or a lookup (searched as the person types). The model says it all, on the field, with no application contract
 * needed (the model is self-contained: docs/design/app-contract.md §2):
 *
 *   <camunda:formField id="department" label="Department" type="string">
 *     <owf:list source="service:departments" key="code" display="title" />
 *   </camunda:formField>
 *   <camunda:formField id="approver" label="Approver" type="string">
 *     <owf:lookup source="connector:hr/searchEmployees" text="q" key="id" display="name" filter="${data.department}" filterInput="dept" />
 *   </camunda:formField>
 *
 * - `source`: `service:<name>`, a function of the application's services, called with `{ text, filter }`; or
 *   `connector:<connector>/<operationId>`, a connector's operation, called with the text as its input `text` and the
 *   filter as its input `filterInput`.
 * - `key`: the row's field saved as the field's value (default `id`); `display`: the one shown (default the key). The
 *   label is saved too, as `<field id>Display`.
 * - `filter`: more criteria, a case's data path (`${data.department}`), read from the case's data and the form's values.
 * - `items`: where the rows are in the answer (default: the answer, when it is a list, else its first list).
 *
 * Choices are asked for on demand, as the person filling the form; nothing but the chosen value is saved.
 */

/** At most this many choices are answered. */
export const LOOKUP_LIMIT = 50;

export type LookupKind = 'list' | 'lookup';

export interface IFormLookup {
    kind: LookupKind;
    /** where the choices come from */
    source: { type: 'service', name: string } | { type: 'connector', operation: string };
    /** as written in the model */
    sourceText: string;
    /** a connector's input that takes the text typed (a lookup's) */
    text?: string;
    key: string;
    display: string;
    /** more criteria: a data path, `${data.department}` */
    filter?: string;
    /** a connector's input that takes the filter */
    filterInput?: string;
    /** the rows' path in the answer */
    items?: string;
}

export interface ILookupChoice {
    key: string;
    display: string;
}

/** The criteria a source is given: the text typed (a lookup's), and the filter's value. */
export interface ILookupCriteria {
    text?: string;
    filter?: any;
}

/** A source as written: `service:<name>` or `connector:<connector>/<operationId>`; undefined when it is neither. */
export function parseLookupSource(text: string | undefined): IFormLookup['source'] | undefined {
    const match = /^\s*(service|connector)\s*:\s*(\S+)\s*$/.exec(text ?? '');
    if (!match)
        return undefined;
    return match[1] === 'service' ? { type: 'service', name: match[2] } : { type: 'connector', operation: match[2] };
}

const attributeOf = (element, name: string): string | undefined => {
    const value = element?.$attrs?.[name] ?? element?.[name];
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
};

/** A form field's `<owf:list>` or `<owf:lookup>` element (the first, when it has more). */
export function lookupElement(field): any {
    return (field?.$children ?? []).find(c => c.$type === 'owf:list' || c.$type === 'owf:lookup');
}

/** The lookup elements of a field: more than one is a model's mistake (verifyModel). */
export function lookupElements(field): any[] {
    return (field?.$children ?? []).filter(c => c.$type === 'owf:list' || c.$type === 'owf:lookup');
}

/** A form field's list or lookup, read from its `<owf:list>` or `<owf:lookup>`; undefined when it has none or no valid source. */
export function formFieldLookup(field): IFormLookup | undefined {
    const element = lookupElement(field);
    if (!element)
        return undefined;
    const kind: LookupKind = element.$type === 'owf:lookup' ? 'lookup' : 'list';
    const sourceText = attributeOf(element, 'source');
    const source = parseLookupSource(sourceText);
    if (!source)
        return undefined;
    const key = attributeOf(element, 'key') ?? 'id';
    const optional = (name: string, value = attributeOf(element, name)) => value ? { [name]: value } : {};
    return {
        kind, source, sourceText, key, display: attributeOf(element, 'display') ?? key,
        ...(kind === 'lookup' ? optional('text') : {}),
        ...optional('filter'), ...optional('filterInput'), ...optional('items'),
    };
}

const valueAt = (value, path: string) => path.split('.').reduce((v, name) => v?.[name], value);

/** A filter's data path: `${data.department}` reads `department`; anything else is not one. */
export function filterPath(filter: string | undefined): string | undefined {
    return /^\s*\$\{\s*data\.([\w$]+(?:\.[\w$]+)*)\s*\}\s*$/.exec(filter ?? '')?.[1];
}

/** A filter's value, from the form's values first, then the case's data. */
export function filterValue(lookup: IFormLookup, data: Record<string, any> = {}): any {
    const path = filterPath(lookup.filter);
    return path === undefined ? undefined : valueAt(data, path);
}

/** The choices in a source's answer: its rows' key and display, those with a key; searched when the source did not. */
export function choicesOf(output, lookup: IFormLookup, text = ''): ILookupChoice[] {
    const rows = lookup.items ? valueAt(output, lookup.items)
        : Array.isArray(output) ? output
        : output && typeof output === 'object' ? Object.values(output).find(Array.isArray) : undefined;
    if (!Array.isArray(rows))
        return [];
    const search = text.trim().toLowerCase();
    // a service is given the text, and a connector its input `text`: they search; a list, or a connector without one, is searched here
    const searched = lookup.kind === 'lookup' && (lookup.source.type === 'service' || !!lookup.text);
    const choices: ILookupChoice[] = [];
    for (const row of rows) {
        const key = valueAt(row, lookup.key);
        if (key === undefined || key === null || typeof key === 'object')
            continue;
        const display = valueAt(row, lookup.display);
        const choice = { key: String(key), display: display === undefined || display === null ? String(key) : String(display) };
        if (search && !searched && !choice.display.toLowerCase().includes(search) && !choice.key.toLowerCase().includes(search))
            continue;
        choices.push(choice);
        if (choices.length === LOOKUP_LIMIT)
            break;
    }
    return choices;
}

/** A service by its name, a dotted path in the application's services, with what it is called on. */
function serviceOf(services, name: string): { fn: Function, self: any } | undefined {
    const parts = name.split('.');
    let self = services;
    for (const part of parts.slice(0, -1))
        self = self?.[part];
    const fn = self?.[parts.at(-1)];
    return typeof fn === 'function' ? { fn, self } : undefined;
}

/**
 * A field's choices, asked for now: its source called with the criteria (the text typed, the filter's value), and
 * its answer's rows as choices. `server`: its `appDelegate` for a service (`getServicesProvider`), its `connectors`
 * for a connector (their keys stay with the server). `context`: who is asking and from where, given to a service as
 * its second argument. A source that is missing or fails throws.
 */
export async function lookupChoices(server, lookup: IFormLookup, criteria: ILookupCriteria = {}, context: Record<string, any> = {}): Promise<ILookupChoice[]> {
    const text = criteria.text ?? '';
    const asked: ILookupCriteria = { ...(lookup.kind === 'lookup' ? { text } : {}), ...(criteria.filter !== undefined ? { filter: criteria.filter } : {}) };
    let output;
    if (lookup.source.type === 'service') {
        const delegate = server?.appDelegate;
        const services = typeof delegate?.getServicesProvider === 'function' ? await delegate.getServicesProvider(null) : undefined;
        const service = serviceOf(services, lookup.source.name);
        if (!service)
            throw new Error(`The application's services have no '${lookup.source.name}'`);
        output = await service.fn.call(service.self, asked, context);
    }
    else {
        if (!server?.connectors)
            throw new Error('This server has no connectors');
        const input: Record<string, any> = {};
        if (lookup.kind === 'lookup' && lookup.text) input[lookup.text] = text;
        if (lookup.filterInput && asked.filter !== undefined) input[lookup.filterInput] = asked.filter;
        const answer = await server.connectors.call(lookup.source.operation, input);
        if (answer.status >= 400)
            throw new Error(`'${lookup.source.operation}' answered ${answer.status}`);
        output = answer.output;
    }
    return choicesOf(output, lookup, text);
}
