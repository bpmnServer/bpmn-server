import { labelFields, labelQuery, labelInstances, labelItems, listColumns, columnKeys, isLabelPath, FILTER_OPS, ListColumnError } from '../../index.js';
import type { ILabelFilter, ILabelField, IListColumn } from '../../index.js';
import { CaseAccess } from '../caseAccess.js';

/*
 * Labels in API v3 (docs/design/labels.md, phase 3): each task and instance it answers carries its label, filled in
 * from its case's own model when it is answered (nothing is stored), and its lists take the pages' filter by label
 * (routes/labelFilter.ts): ?field=&op=&value=&search=, on the data paths the models' case labels show.
 */

/** A filter that can not be used: an op other than contains or is. */
export class LabelFilterError extends Error {
    readonly status = 400;
    constructor(message: string, readonly code: string = 'BAD_FILTER') { super(message); }
}

const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : undefined);

/** The request's filter by label as a query on the cases (undefined: none); `model`, the model it is limited to. */
export async function labelFilterQuery(server, query: Record<string, unknown>, model?: string): Promise<Record<string, any> | undefined> {
    const op = query.op === undefined ? 'contains' : query.op;
    if (!(FILTER_OPS as readonly unknown[]).includes(op))
        throw new LabelFilterError(`op is ${FILTER_OPS.join(', ')}, not ${String(op)}`);
    const filter: ILabelFilter = { model: text(model), field: text(query.field), op: op as ILabelFilter['op'], value: text(query.value), search: text(query.search) };
    if (!filter.value && !filter.search)
        return filter.model ? { name: filter.model } : undefined;
    const fields = await labelFields(server, filter.model ? [filter.model] : undefined);
    refuseDataFilter(server, fields, filter.field);
    return labelQuery(fields, filter);
}

/**
 * With security policies on, a list is filtered on the values its labels name, not on any field of the data: a filter
 * on a field the policy hides would tell its values. A 400 FILTER_REFUSED.
 */
export function refuseDataFilter(server, fields: ILabelField[], field: string | undefined) {
    if (field?.startsWith('data.') && !isLabelPath(fields, field) && new CaseAccess(server).on)
        throw new LabelFilterError(`with security policies, a list is filtered on the values its labels name, not on ${field}`, 'FILTER_REFUSED');
}

/**
 * The person's columns (?columns=Client,data.amount, engine/ListColumns.ts) and what to sort by (?sort=&order=), for
 * the lists' operations; within `model` when one is chosen.
 */
export async function listViewOf(server, query: Record<string, unknown>, model?: string): Promise<{ columns: IListColumn[]; fields: ILabelField[]; sort?: string; order?: string }> {
    const fields = await labelFields(server, model ? [model] : undefined);
    try {
        return { columns: listColumns(fields, columnKeys(query.columns), model), fields, sort: text(query.sort), order: text(query.order) };
    }
    catch (error) {
        if (error instanceof ListColumnError) throw new LabelFilterError(error.message, error.code);
        throw error;
    }
}

/** A named value as the API answers it. */
const asValue = ({ name, path, value }) => ({ name, path, value });

/**
 * Tasks, labeled: `label` (its own, else its name and its case's), `labelValues` (its own named values), `caseLabel`
 * and `caseLabelValues` (its case's).
 */
export async function labeledTasks<T extends object>(server, tasks: T[]): Promise<T[]> {
    await labelItems(server, tasks);
    return tasks.map((task: any) => {
        const { ownLabel, ...rest } = task;
        return { ...rest, labelValues: (task.labelValues ?? []).map(asValue), caseLabelValues: (task.caseLabelValues ?? []).map(asValue) };
    });
}

/** Instances, labeled: `label` and `labelValues`; each of their items that has a label of its own, too. */
export async function labeledInstances<T extends object>(server, instances: T[]): Promise<T[]> {
    await labelInstances(server, instances);
    for (const instance of instances as any[]) {
        instance.labelValues = (instance.labelValues ?? []).map(asValue);
        for (const item of instance.items ?? [])
            if (item.labelValues) item.labelValues = item.labelValues.map(asValue);
    }
    return instances;
}
