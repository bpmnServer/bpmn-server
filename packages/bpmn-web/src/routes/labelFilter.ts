/**
 * The lists' filter by label (docs/design/labels.md): read from the request's query (?model=&field=&op=&value=&search=),
 * turned into a query on the cases' data paths (engine/Labels.ts labelQuery), and the filter bar's choices: the
 * models, and the named values their case labels offer (views/includes/labelFilter.pug).
 *
 * A page with two lists gives each its own: `prefix` names this filter's parameters (task_field=...), and `other` the
 * other filter's, which this bar keeps, so that using one does not clear the other.
 */
import { labelFields, labelQuery } from '../index.js';
import type { ILabelFilter } from '../index.js';

const PARAMETERS = ['model', 'field', 'op', 'value', 'search'];
const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : undefined);

export async function labelFilterOf(server, request, action: string, { prefix = '', other }: { prefix?: string; other?: string } = {}) {
    const q = request.query ?? {};
    const filter: ILabelFilter = {
        model: text(q[prefix + 'model']), field: text(q[prefix + 'field']), op: q[prefix + 'op'] === 'is' ? 'is' : 'contains',
        value: text(q[prefix + 'value']), search: text(q[prefix + 'search']),
    };
    const fields = await labelFields(server);
    const models = [...new Set<string>((await server.definitions.getList()).map(m => m?.name ?? m))].sort();
    // the named values offered: the chosen model's, else every model's, each name once, with where it is read
    const groups = new Map<string, string[]>();
    for (const f of filter.model ? fields.filter(f => f.model === filter.model) : fields)
        groups.set(f.name, [...(groups.get(f.name) ?? []), `${f.model}: ${f.path}`]);
    // the other list's filter stays: in this form, and when this one is cleared
    const keep = other === undefined ? [] : PARAMETERS.map(p => ({ name: other + p, value: text(q[other + p]) })).filter(k => k.value);
    const [path, hash] = action.split('#');
    const kept = keep.map(k => `${encodeURIComponent(k.name)}=${encodeURIComponent(k.value)}`).join('&');
    return {
        filter,
        query: labelQuery(fields, filter),
        view: {
            action, filter, models, prefix, keep,
            clear: path + (kept ? '?' + kept : '') + (hash ? '#' + hash : ''),
            groups: [...groups].map(([name, where]) => ({ name, where: where.join('; ') })),
            active: !!(filter.model || (filter.field && filter.value) || filter.search),
        },
    };
}
