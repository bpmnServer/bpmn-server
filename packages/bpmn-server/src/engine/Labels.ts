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
import { fillTemplate } from './LabelTemplate.js';
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
        userName: item.userName, completedBy: item.status === 'end' && item.endedAt ? item.userName : undefined,
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
    for (const instance of instances) {
        const source = await sourceOf(server, instance.name, instance.source);
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
