import { labelFields, labelQuery, labelInstances, labelItems } from '../../index.js';
import type { ILabelFilter } from '../../index.js';

/*
 * Labels in API v3 (docs/design/labels.md, phase 3): each task and instance it answers carries its label, filled in
 * from its case's own model when it is answered (nothing is stored), and its lists take the pages' filter by label
 * (routes/labelFilter.ts): ?field=&op=&value=&search=, on the data paths the models' named values read.
 */

/** A filter that can not be used: an op other than contains or is. */
export class LabelFilterError extends Error {
    readonly status = 400;
    readonly code = 'BAD_FILTER';
}

const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : undefined);

/** The request's filter by label as a query on the cases (undefined: none); `model`, the model it is limited to. */
export async function labelFilterQuery(server, query: Record<string, unknown>, model?: string): Promise<Record<string, any> | undefined> {
    const op = query.op === undefined ? 'contains' : query.op;
    if (op !== 'contains' && op !== 'is')
        throw new LabelFilterError(`op is contains or is, not ${String(op)}`);
    const filter: ILabelFilter = { model: text(model), field: text(query.field), op, value: text(query.value), search: text(query.search) };
    if (!(filter.field && filter.value) && !filter.search)
        return filter.model ? { name: filter.model } : undefined;
    return labelQuery(await labelFields(server, filter.model ? [filter.model] : undefined), filter);
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
