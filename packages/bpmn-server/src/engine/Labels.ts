/**
 * Labels (docs/design/labels.md): a case's and an activity's label is a display template in the model, its values
 * named in their placeholders:
 *
 *     camunda:label="Client: ${Client = data.clientId} · Order: ${Order = data.orderNo}"
 *     camunda:endLabel="Approved by ${completedBy}"
 *
 * `${Name = path}` is a named value (shown, and offered by the lists under its name, querying its path); `${path}`
 * is text. A label is filled in when it is shown, from the case's data and its own model's templates: nothing is
 * stored. Placeholders are data, never scripts, so filling one in for any viewer runs no model code.
 *
 * The path checks and the way values are shown come from PR #281 (bpmn-web's list columns).
 */
import { Definition } from '../elements/Definition.js';
import { moddleOptions as defaultModdleOptions } from '../elements/js-bpmn-moddle.js';
import { DataHandler } from './DataHandler.js';
import { fillTemplate, parseTemplate, pathProblem } from './LabelTemplate.js';
import type { ILabel, ILabelValue } from './LabelTemplate.js';
export * from './LabelTemplate.js';

/** A model's label templates: the process's, and each element's (by id). */
export interface IModelLabels {
    process?: string;
    elements: Map<string, { label?: string; endLabel?: string }>;
}

const ENDED = ['end', 'terminated', 'cancelled', 'discard'];

// ---- the model's templates, read from its XML (cached per source)

const cache = new Map<string, Promise<IModelLabels>>();
const CACHE_SIZE = 50;

/** The label templates of a model's source: its process's, and every element's, sub-processes included. */
export function modelLabels(source: string, moddleOptions = defaultModdleOptions): Promise<IModelLabels> {
    let found = cache.get(source);
    if (!found) {
        found = readLabels(source, moddleOptions);
        cache.set(source, found);
        if (cache.size > CACHE_SIZE) cache.delete(cache.keys().next().value);
    }
    return found;
}

async function readLabels(source: string, moddleOptions): Promise<IModelLabels> {
    const labels: IModelLabels = { elements: new Map() };
    try {
        const { rootElement } = await Definition.moddleFor(moddleOptions).fromXML(source);
        const walk = container => {
            for (const e of container.flowElements ?? []) {
                const attrs = e.$attrs ?? {};
                if (attrs['camunda:label'] || attrs['camunda:endLabel'])
                    labels.elements.set(e.id, { label: attrs['camunda:label'], endLabel: attrs['camunda:endLabel'] });
                if (e.flowElements) walk(e);
            }
        };
        for (const root of rootElement.rootElements ?? [])
            if (root.$type === 'bpmn:Process') {
                labels.process ??= root.$attrs?.['camunda:label'];
                walk(root);
            }
    }
    catch { /* a model that can't be read has no labels: the defaults apply */ }
    return labels;
}

// ---- labels of cases and tasks, for the pages and the APIs

/** A model's source for labels: the case's own (it keeps the source it started with), else the model's current. */
async function sourceOf(server, name: string, source?: string): Promise<string | undefined> {
    if (source) return source;
    try { return await server.definitions.getSource(name); }
    catch { return undefined; }
}

/** A case's label: its model's template, else the application's instanceLabel hook, else `<model> #<caseId>`. */
export async function caseLabel(server, instance, labels?: IModelLabels): Promise<ILabel> {
    const data = instance.data ?? {};
    if (labels?.process) {
        const filled = fillTemplate(labels.process, { data, model: instance.name });
        if (filled.text) return filled;
    }
    const hook = server?.appDelegate?.instanceLabel;
    const fromHook = typeof hook === 'function' ? await hook.call(server.appDelegate, instance) : undefined;
    if (fromHook) return { text: String(fromHook), values: [] };
    const caseId = data.caseId;
    return { text: caseId != null && caseId !== '' ? `${instance.name} #${caseId}` : instance.name, values: [] };
}

/**
 * An activity's own label: once it has ended, its endLabel; else (or when that says nothing) its label. The
 * template sees the item's data (a loop round's or a sub-process's own), its fields, and its case's named values
 * as `instance.<Name>`. Undefined when the element has none.
 */
export function activityLabel(item, labels: IModelLabels | undefined, caseValues: ILabelValue[], instance?): ILabel | undefined {
    const templates = labels?.elements.get(item.elementId);
    if (!templates) return undefined;
    const ended = ENDED.includes(item.status);
    const scope = {
        data: item.data ?? instance?.data ?? {},
        name: item.name, elementId: item.elementId, status: item.status, assignee: item.assignee,
        // an API's task has completedBy in place of userName
        userName: item.userName, completedBy: item.completedBy ?? (item.status === 'end' && item.endedAt ? item.userName : undefined),
        startedAt: item.startedAt, endedAt: item.endedAt, model: instance?.name ?? item.processName,
        instance: Object.fromEntries(caseValues.map(v => [v.name, v.value])),
    };
    for (const template of [ended ? templates.endLabel : undefined, templates.label]) {
        if (!template) continue;
        const filled = fillTemplate(template, scope);
        if (filled.text) return filled;
    }
    return undefined;
}

/** A case's item data: its token's (a loop round's or a sub-process's), else the case's. */
function itemData(instance, item) {
    const token = (instance.tokens ?? []).find?.(t => t.id === item.tokenId) ?? instance.tokens?.[item.tokenId];
    return token?.dataPath ? DataHandler.getData(instance.data, token.dataPath) : instance.data;
}

/**
 * Cases labeled for display, from their own model's templates: `instance.label` (text), `instance.labelValues`
 * (its named values), and each item's `label` and `labelValues` when its element has a label. Nothing is saved.
 */
export async function labelInstances(server, instances: any[]): Promise<any[]> {
    const moddleOptions = server?.appDelegate?.moddleOptions ?? defaultModdleOptions;
    // cases read without their source (a summary, an API's answer): their own sources, in one query
    const sources = new Map<string, string>();
    const missing = [...new Set(instances.filter(i => i.source === undefined && i.id).map(i => i.id))];
    if (missing.length && server?.dataStore?.findInstances) {
        try {
            for (const found of await server.dataStore.findInstances({ id: { $in: missing } }, { projection: { id: 1, source: 1 } }))
                if (found.source) sources.set(found.id, found.source);
        }
        catch { /* without the sources, the models' current templates */ }
    }
    for (const instance of instances) {
        const source = await sourceOf(server, instance.name, instance.source ?? sources.get(instance.id));
        const labels = source ? await modelLabels(source, moddleOptions) : undefined;
        const label = await caseLabel(server, instance, labels);
        instance.label = label.text;
        instance.labelValues = label.values;
        for (const item of instance.items ?? []) {
            const own = activityLabel({ ...item, data: itemData(instance, item) }, labels, label.values, instance);
            if (own) {
                item.label = own.text;
                item.labelValues = own.values;
            }
        }
    }
    return instances;
}

/**
 * Tasks labeled for display (findItems' items: each with its data and its case's): `item.caseLabel`, its case's
 * label; `item.label`, its own, else its name and its case's. The cases' own sources are read in one query.
 */
export async function labelItems(server, items: any[]): Promise<any[]> {
    const moddleOptions = server?.appDelegate?.moddleOptions ?? defaultModdleOptions;
    const ids = [...new Set(items.map(i => i.instanceId).filter(Boolean))];
    const sources = new Map<string, string>();
    // a task as an API answers it (no instanceData) takes its case's data from its instance, read with the sources
    const datas = new Map<string, any>();
    const needData = items.some(i => i.instanceData === undefined && i.data === undefined);
    if (ids.length && server?.dataStore?.findInstances) {
        try {
            const found = await server.dataStore.findInstances({ id: { $in: ids } }, { projection: { id: 1, source: 1, ...(needData ? { data: 1 } : {}) } });
            for (const i of found) {
                if (i.source) sources.set(i.id, i.source);
                if (needData) datas.set(i.id, i.data ?? {});
            }
        }
        catch { /* without the sources, the models' current templates */ }
    }
    for (const item of items) {
        const source = await sourceOf(server, item.processName, sources.get(item.instanceId));
        const labels = source ? await modelLabels(source, moddleOptions) : undefined;
        const instance = { name: item.processName, data: item.instanceData ?? item.data ?? datas.get(item.instanceId) ?? {} };
        const label = await caseLabel(server, instance, labels);
        item.caseLabel = label.text;
        item.caseLabelValues = label.values;
        const own = activityLabel(item, labels, label.values, instance);
        item.ownLabel = own?.text;
        item.label = own ? `${own.text} — ${label.text}` : `${item.name || item.elementId} · ${label.text}`;
        item.labelValues = own?.values ?? [];
    }
    return items;
}

// ---- filters: on the data paths the labels' named values read (docs/design/labels.md, Mixed lists and filters)

/**
 * A value a model's case label shows, as the filters offer it: its name, the model, and the data path it reads. Every
 * `${data.…}` placeholder is one: a named one by its name, a plain one by its path's last name (`${data.caseId}` is
 * caseId). A model with no case label shows `<model> #<caseId>`, so it offers caseId.
 */
export interface ILabelField {
    name: string;
    model: string;
    path: string;
}

/** A filter of cases by their labels: a model; a value of a label (`field`, or any) that contains, or is, `value`; a search of them all. */
export interface ILabelFilter {
    model?: string;
    field?: string;
    op?: 'contains' | 'is';
    value?: string;
    search?: string;
}

/** The values the models' case labels (their current versions) show, for the lists' filters. */
export async function labelFields(server, models?: string[]): Promise<ILabelField[]> {
    const moddleOptions = server?.appDelegate?.moddleOptions ?? defaultModdleOptions;
    const names = models ?? (await server.definitions.getList()).map(m => m?.name ?? m);
    // without a template, the label is the application's hook's when it has one: nothing known to filter on
    const hook = typeof server?.appDelegate?.instanceLabel === 'function';
    const fields: ILabelField[] = [];
    for (const model of [...new Set<string>(names)]) {
        const source = await sourceOf(server, model);
        const labels = source ? await modelLabels(source, moddleOptions) : undefined;
        const template = labels?.process;
        if (!template) {
            if (!hook) fields.push({ name: 'caseId', model, path: 'data.caseId' });
            continue;
        }
        const seen = new Set<string>();
        for (const part of parseTemplate(template)) {
            // the case's data only (a case label's scope is its data and its model's name)
            if ('text' in part || pathProblem(part.path) || !part.path.startsWith('data.')) continue;
            const name = part.name ?? part.path.slice(part.path.lastIndexOf('.') + 1);
            if (seen.has(`${name}=${part.path}`)) continue;
            seen.add(`${name}=${part.path}`);
            fields.push({ name, model, path: part.path });
        }
    }
    return fields;
}

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A value's condition: contains (any case), or is; a number also matches as a number. */
function condition(op: string, value: string) {
    const asNumber = value.trim() !== '' && !Number.isNaN(Number(value)) ? Number(value) : undefined;
    const text = op === 'is' ? { $in: [value] } : { $regex: escapeRegex(value), $options: 'i' };
    return (path: string) => asNumber === undefined ? { [path]: text } : { $or: [{ [path]: text }, { [path]: asNumber }] };
}

/**
 * A filter as a query on the cases (findInstances, and findItems for their tasks): the model, then the named value
 * on each model's own path, then the search on every named value. Undefined when there is nothing to filter.
 */
export function labelQuery(fields: ILabelField[], filter: ILabelFilter = {}): Record<string, any> | undefined {
    const and: any[] = [];
    const scope = filter.model ? fields.filter(f => f.model === filter.model) : fields;
    if (filter.model) and.push({ name: filter.model });
    const byPath = (list: ILabelField[], make: (path: string) => any) =>
        list.map(f => ({ name: f.model, ...make(f.path) }));
    if (filter.value?.trim()) {
        // a field's paths; with no field, every field's
        const named = filter.field ? scope.filter(f => f.name === filter.field) : scope;
        and.push(named.length ? { $or: byPath(named, condition(filter.op ?? 'contains', filter.value.trim())) } : { id: { $in: [] } });
    }
    if (filter.search?.trim())
        and.push(scope.length ? { $or: byPath(scope, condition('contains', filter.search.trim())) } : { id: { $in: [] } });
    return and.length ? { $and: and } : undefined;
}
