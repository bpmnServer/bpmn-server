/**
 * The lists' filter by label (docs/design/labels.md): read from the request's query (?model=&field=&op=&value=&search=),
 * turned into a query on the cases' data paths (engine/Labels.ts labelQuery), and the filter bar's choices: the
 * models, and the named values their case labels offer (views/includes/labelFilter.pug).
 */
import { labelFields, labelQuery } from '../index.js';
import type { ILabelFilter } from '../index.js';

const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : undefined);

export async function labelFilterOf(server, request, action: string) {
    const q = request.query ?? {};
    const filter: ILabelFilter = {
        model: text(q.model), field: text(q.field), op: q.op === 'is' ? 'is' : 'contains', value: text(q.value), search: text(q.search),
    };
    const fields = await labelFields(server);
    const models = [...new Set<string>((await server.definitions.getList()).map(m => m?.name ?? m))].sort();
    // the named values offered: the chosen model's, else every model's, each name once, with where it is read
    const groups = new Map<string, string[]>();
    for (const f of filter.model ? fields.filter(f => f.model === filter.model) : fields)
        groups.set(f.name, [...(groups.get(f.name) ?? []), `${f.model}: ${f.path}`]);
    const query = labelQuery(fields, filter);
    return {
        filter,
        query,
        view: {
            action, filter, models,
            groups: [...groups].map(([name, where]) => ({ name, where: where.join('; ') })),
            active: !!(filter.model || (filter.field && filter.value) || filter.search),
        },
    };
}
