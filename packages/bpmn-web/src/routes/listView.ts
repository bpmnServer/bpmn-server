/**
 * A list's view, as the person chose it (docs/docs/list-columns.md): its columns (a value the models' labels name,
 * or a field of the cases' data), and what it is sorted by. In the URL (?columns=Client,data.amount&sort=Client&order=asc,
 * each list's with its prefix: task_columns=...), so a view can be bookmarked and shared; and remembered for the
 * session, so a page opened again, or filtered, keeps it.
 *
 * The values come from API v3's operations (instances.ts, tasks.ts), which read only what the person may read; this
 * only says what is asked, and what the page offers.
 */
import { labelFields, listColumns, columnKeys, columnSortPath, isLabelPath, pathProblem, modelFormFields } from '../index.js';
import type { IListColumn, ILabelField } from '../index.js';
import { CaseAccess } from './caseAccess.js';

const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : undefined);

/** A list's own sorts, besides its columns: key → its heading. */
export const INSTANCE_SORTS = { model: 'Name', started: 'Started', ended: 'Ended' };
export const TASK_SORTS = { name: 'Task', model: 'Process', started: 'Waiting', due: 'Due' };

export interface IListViewOptions {
    /** Its name, for the session: workbench-instances, workbench-tasks, my-work. */
    list: string;
    /** Its parameters' prefix in the URL ('' or task_). */
    prefix?: string;
    /** The page and its section: /#instances. */
    action: string;
    /** Its own sorts (INSTANCE_SORTS, TASK_SORTS), and the default one with its order. */
    sorts: Record<string, string>;
    defaultSort: { sort: string; order: 'asc' | 'desc' };
    /** Instances are sorted by the database (one path per column); tasks in memory (a column's path in each model). */
    sortsInStore?: boolean;
}

/** The URL of this page with `changes` to its query (undefined: left out), keeping the rest: every list's filter and view. */
export function hrefWith(path: string, query: Record<string, unknown>, changes: Record<string, string | undefined>, hash?: string) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query ?? {}))
        if (!(key in changes) && key !== 'after' && key !== 'task_after')
            for (const v of Array.isArray(value) ? value : [value]) if (typeof v === 'string') params.append(key, v);
    for (const [key, value] of Object.entries(changes)) if (value !== undefined) params.set(key, value);
    const q = params.toString();
    return path + (q ? '?' + q : '') + (hash ? '#' + hash : '');
}

/**
 * The view a request asks for a list: from its URL, else as the person last chose it this session. Unknown columns
 * (a model since changed) and a sort the list can't give are left out, not an error: a bookmark still opens.
 */
export async function listViewOf(server, request, options: IListViewOptions) {
    const prefix = options.prefix ?? '';
    const q = request.query ?? {};
    const remembered = (request.session ??= {} as any).listViews ??= {};
    const asked = q[prefix + 'columns_set'] !== undefined || q[prefix + 'columns'] !== undefined || q[prefix + 'sort'] !== undefined;
    const saved = remembered[options.list] ?? {};
    // the columns: those asked (the picker's boxes, and a data field typed), else those remembered
    let keys: string[];
    if (asked) {
        const added = text(q[prefix + 'columns_add']);
        keys = columnKeys(q[prefix + 'columns']);
        if (added) keys.push(added.startsWith('data.') ? added : `data.${added}`);
        keys = [...new Set(keys)];
    }
    else keys = saved.columns ?? [];
    const model = text(q[prefix + 'model']);
    const fields: ILabelField[] = await labelFields(server);
    const scope = model ? fields.filter(f => f.model === model) : fields;
    const columns: IListColumn[] = [];
    for (const key of keys) {
        try { columns.push(...listColumns(scope, [key], model)); } catch { /* not a column here: left out */ }
        if (columns.length >= 12) break;
    }
    const policies = new CaseAccess(server).on;
    // with security policies, sorted and filtered by what the labels name only (a hidden field's values would show)
    const open = (column: IListColumn) => !policies || (column.path ? isLabelPath(fields, column.path) : true);
    const sortable = (column: IListColumn) => open(column) && (!options.sortsInStore || !!columnSortPath(column));
    let sort = asked ? text(q[prefix + 'sort']) : saved.sort;
    let order = asked ? text(q[prefix + 'order']) : saved.order;
    if (sort && !(sort in options.sorts) && !columns.some(c => c.key === sort && sortable(c))) sort = undefined;
    if (order !== 'asc' && order !== 'desc') order = undefined;
    if (!sort) { sort = options.defaultSort.sort; order ??= options.defaultSort.order; }
    order ??= options.defaultSort.sort === sort ? options.defaultSort.order : 'asc';
    remembered[options.list] = { columns: columns.map(c => c.key), sort, order };

    const [path, hash] = options.action.split('#');
    const base = { [prefix + 'columns_set']: '1', [prefix + 'columns']: columns.map(c => c.key).join(',') || undefined, [prefix + 'columns_add']: undefined };
    /** A heading that sorts: by it, the other way when it already is. */
    const heading = (key: string, title: string) => {
        const current = sort === key;
        const next = current ? (order === 'asc' ? 'desc' : 'asc') : (key === 'started' || key === 'ended' ? 'desc' : 'asc');
        return { key, title, current, order: current ? order : undefined, href: hrefWith(path, q, { ...base, [prefix + 'sort']: key, [prefix + 'order']: next }, hash) };
    };
    return {
        columns, fields, model,
        sort, order,
        /** What the operations take: the columns, and the sort when it isn't the list's default. */
        asked: { columns, fields, sort, order },
        view: {
            prefix, action: options.action, list: options.list,
            columns: columns.map(c => ({ ...heading(c.key, c.title), sortable: sortable(c), data: !!c.path })),
            sorts: Object.fromEntries(Object.entries(options.sorts).map(([key, title]) => [key, heading(key, title)])),
            /** The picker's boxes, by model (withChoices, once the list's rows are known). */
            groups: [] as { model: string; items: { key: string; title: string; checked: boolean; where: string }[] }[],
            others: [] as { key: string; title: string; checked: boolean; where: string }[],
            /** The data columns the filter bar offers too. */
            filterFields: columns.filter(c => c.path && open(c)).map(c => c.key),
            // the rest of the page's query, kept by the picker's form
            keep: Object.entries(q).flatMap(([key, value]) => key.startsWith(prefix + 'columns') || key === prefix + 'sort' || key === prefix + 'order' || key === 'after' || key === 'task_after'
 ? [] : (Array.isArray(value) ? value : [value]).filter(v => typeof v === 'string').map(v => ({ name: key, value: v }))),
            reset: hrefWith(path, q, { [prefix + 'columns_set']: '1', [prefix + 'columns']: undefined, [prefix + 'columns_add']: undefined, [prefix + 'sort']: undefined, [prefix + 'order']: undefined }, hash),
            dataProblem: (() => { const added = text(q[prefix + 'columns_add']); return added && pathProblem(added.startsWith('data.') ? added : `data.${added}`); })() || undefined,
        },
    };
}

/**
 * The picker's choices, once the list's rows are known: for each model in the list (the one the filter chooses; with
 * no rows, every model), the values its label names, then its form fields by their labels, each field once. A data
 * column that is neither is listed apart. A data column's heading is its form field's label.
 */
export async function withChoices(server, list: Awaited<ReturnType<typeof listViewOf>>, rowModels: string[]) {
    const all = async () => [...new Set<string>((await server.definitions.getList()).map(m => m?.name ?? m))];
    const models = list.model ? [list.model] : rowModels.length ? [...new Set(rowModels)] : await all();
    models.sort((a, b) => a.localeCompare(b));
    const chosen = new Set(list.columns.map(c => c.key));
    const shown = new Set<string>(), titles = new Map<string, string>(), forms = new Map<string, { id: string; label: string }[]>();
    for (const model of models) {
        let source: string | undefined;
        try { source = await server.definitions.getSource(model); } catch { source = undefined; }
        forms.set(model, modelFormFields(source));
        for (const f of forms.get(model)) if (!titles.has(`data.${f.id}`)) titles.set(`data.${f.id}`, f.label);
    }
    for (const model of models) {
        const items = [];
        const labelPaths = new Set<string>();
        for (const f of list.fields.filter(f => f.model === model)) {
            labelPaths.add(f.path);
            if (shown.has(f.name)) continue;
            shown.add(f.name);
            items.push({ key: f.name, title: f.name === 'caseId' ? 'Case id' : f.name, checked: chosen.has(f.name), where: `Shown in the case's label (${f.path})` });
        }
        for (const f of forms.get(model)) {
            const key = `data.${f.id}`;
            if (shown.has(key) || labelPaths.has(key)) continue;
            shown.add(key);
            items.push({ key, title: f.label, checked: chosen.has(key), where: `A form field (${key})` });
        }
        if (items.length) list.view.groups.push({ model, items });
    }
    list.view.others = list.columns.filter(c => c.path && !shown.has(c.key))
        .map(c => ({ key: c.key, title: c.title, checked: true, where: c.key }));
    for (const c of list.view.columns) if (c.data && titles.has(c.key)) c.title = titles.get(c.key);
    return list;
}
