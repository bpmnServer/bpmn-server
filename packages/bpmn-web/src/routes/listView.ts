/**
 * A list's view, as the person chose it (docs/docs/list-columns.md): which columns it shows, in what order (its own,
 * `@process`, `@case`...; a value the models' labels name; a field of the cases' data), and what it is sorted by. In
 * the URL (?columns=@process,@case,Client,data.amount,@started&sort=Client&order=asc, each list's with its prefix:
 * task_columns=...), so a view can be bookmarked and shared; and remembered for the session, so a page opened again,
 * or filtered, keeps it.
 *
 * The values come from API v3's operations (instances.ts, tasks.ts), which read only what the person may read; this
 * only says what is asked, and what the page offers.
 */
import { labelFields, listColumns, columnKeys, columnSortPath, isLabelPath, pathProblem, modelFormFields } from '../index.js';
import type { IListColumn, ILabelField } from '../index.js';
import { CaseAccess } from './caseAccess.js';

const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : undefined);

/** A list's own column: its heading, what it sorts by (when it does), and whether it is shown by default. */
export interface IOwnColumn { title: string; sort?: string; shown?: boolean }

/** The lists' own columns, in their default order; the same names in every list. */
export const INSTANCE_COLUMNS: Record<string, IOwnColumn> = {
    '@process': { title: 'Process', sort: 'model', shown: true },
    '@case': { title: 'Case', shown: true },
    '@status': { title: 'Status', sort: 'status' },
    '@started': { title: 'Started', sort: 'started', shown: true },
    '@ended': { title: 'Ended', sort: 'ended', shown: true },
};
export const WORKBENCH_TASK_COLUMNS: Record<string, IOwnColumn> = {
    '@task': { title: 'Task', sort: 'name', shown: true },
    '@case': { title: 'Case', shown: true },
    '@process': { title: 'Process', sort: 'model', shown: true },
    '@waiting': { title: 'Waiting', sort: 'started', shown: true },
    '@assignee': { title: 'Assignee', shown: true },
    '@candidateUsers': { title: 'Candidate users', shown: true },
    '@candidateGroups': { title: 'Candidate groups', shown: true },
    '@due': { title: 'Due', sort: 'due', shown: true },
    '@followUp': { title: 'Follow-up' },
    '@priority': { title: 'Priority', sort: 'priority' },
};
export const MY_WORK_COLUMNS: Record<string, IOwnColumn> = {
    '@task': { title: 'Task', sort: 'name', shown: true },
    '@case': { title: 'Case', shown: true },
    '@process': { title: 'Process', sort: 'model', shown: true },
    '@waiting': { title: 'Waiting', sort: 'started', shown: true },
    '@due': { title: 'Due', sort: 'due', shown: true },
    '@assignee': { title: 'Assignee' },
    '@priority': { title: 'Priority', sort: 'priority' },
};

/** A field's name as a heading: caseId is Case id. */
const titleOf = (name: string) => (name === 'caseId' ? 'Case id' : name);

export interface IListViewOptions {
    /** Its name, for the session: workbench-instances, workbench-tasks, my-work. */
    list: string;
    /** Its parameters' prefix in the URL ('' or task_). */
    prefix?: string;
    /** The page and its section: /#instances. */
    action: string;
    /** Its own columns (INSTANCE_COLUMNS...), and the default sort with its order. */
    own: Record<string, IOwnColumn>;
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
 * The view a request asks for a list: from its URL, else as the person last chose it this session. The columns asked
 * are its layout, in order, when they name one of the list's own (`@...`); a list of added columns only (an older
 * link) goes after Case in the default layout. Unknown columns (a model since changed) and a sort the list can't give
 * are left out, not an error: a bookmark still opens.
 */
export async function listViewOf(server, request, options: IListViewOptions) {
    const prefix = options.prefix ?? '';
    const q = request.query ?? {};
    const remembered = (request.session ??= {} as any).listViews ??= {};
    const asked = q[prefix + 'columns_set'] !== undefined || q[prefix + 'columns'] !== undefined || q[prefix + 'sort'] !== undefined;
    const saved = remembered[options.list] ?? {};
    const defaults = Object.keys(options.own).filter(key => options.own[key].shown);
    // the layout: the columns asked (the picker's boxes in their order, and a data field typed), else as remembered
    let keys: string[];
    if (asked) {
        const added = text(q[prefix + 'columns_add']);
        keys = columnKeys(q[prefix + 'columns']);
        if (added) keys.push(added.startsWith('data.') ? added : `data.${added}`);
        keys = [...new Set(keys)];
        // the picker sends a whole layout; a link may name added columns only
        if (q[prefix + 'columns_layout'] === undefined && !keys.some(k => k.startsWith('@'))) {
            const at = defaults.indexOf('@case') + 1 || defaults.length;
            keys = [...defaults.slice(0, at), ...keys, ...defaults.slice(at)];
        }
    }
    else keys = saved.layout ?? defaults;
    const model = text(q[prefix + 'model']);
    const fields: ILabelField[] = await labelFields(server);
    const scope = model ? fields.filter(f => f.model === model) : fields;
    // each key: one of the list's own, or a column of the data (at most 12)
    const layout: { key: string; own?: IOwnColumn; column?: IListColumn }[] = [];
    const columns: IListColumn[] = [];
    for (const key of keys) {
        if (key.startsWith('@')) { if (options.own[key]) layout.push({ key, own: options.own[key] }); continue; }
        if (columns.length >= 12) continue;
        try {
            const [column] = listColumns(scope, [key], model);
            columns.push(column);
            layout.push({ key, column });
        }
        catch { /* not a column here: left out */ }
    }
    const policies = new CaseAccess(server).on;
    // with security policies, sorted and filtered by what the labels name only (a hidden field's values would show)
    const open = (column: IListColumn) => !policies || (column.path ? isLabelPath(fields, column.path) : true);
    const sortable = (column: IListColumn) => open(column) && (!options.sortsInStore || !!columnSortPath(column));
    const ownSorts = new Set(Object.values(options.own).map(c => c.sort).filter(Boolean));
    let sort = asked ? text(q[prefix + 'sort']) : saved.sort;
    let order = asked ? text(q[prefix + 'order']) : saved.order;
    if (sort && !ownSorts.has(sort) && !columns.some(c => c.key === sort && sortable(c))) sort = undefined;
    if (order !== 'asc' && order !== 'desc') order = undefined;
    if (!sort) { sort = options.defaultSort.sort; order ??= options.defaultSort.order; }
    order ??= options.defaultSort.sort === sort ? options.defaultSort.order : 'asc';
    remembered[options.list] = { layout: layout.map(l => l.key), sort, order };

    const [path, hash] = options.action.split('#');
    const base = { [prefix + 'columns_set']: '1', [prefix + 'columns_layout']: '1', [prefix + 'columns']: layout.map(l => l.key).join(','), [prefix + 'columns_add']: undefined };
    /** A heading: one that sorts links to sorting by it, the other way when it already is. */
    const heading = (key: string, title: string, sortKey: string | undefined) => {
        if (!sortKey) return { key, title, sortable: false };
        const current = sort === sortKey;
        const next = current ? (order === 'asc' ? 'desc' : 'asc') : (sortKey === 'started' || sortKey === 'ended' ? 'desc' : 'asc');
        return { key, title, sortable: true, current, order: current ? order : undefined, href: hrefWith(path, q, { ...base, [prefix + 'sort']: sortKey, [prefix + 'order']: next }, hash) };
    };
    return {
        columns, fields, model, layout,
        sort, order,
        /** What the operations take: the columns of data, and the sort when it isn't the list's default. */
        asked: { columns, fields, sort, order },
        view: {
            prefix, action: options.action, list: options.list, sort, order,
            /** The columns shown, in order: each a heading; `own`, one of the list's own. */
            layout: layout.map(l => ({
                ...heading(l.key, l.own ? l.own.title : titleOf(l.column.title), l.own ? l.own.sort : sortable(l.column) ? l.key : undefined),
                own: !!l.own, data: !!l.column?.path,
            })),
            /** The list's own columns not shown: offered to show again. */
            hidden: Object.entries(options.own).filter(([key]) => !layout.some(l => l.key === key)).map(([key, c]) => ({ key, title: c.title })),
            /** The picker's other boxes, by model (withChoices, once the list's rows are known). */
            groups: [] as { model: string; items: { key: string; title: string; where: string }[] }[],
            /** The data columns the filter bar offers too. */
            filterFields: columns.filter(c => c.path && open(c)).map(c => c.key),
            // the rest of the page's query, kept by the picker's form
            keep: Object.entries(q).flatMap(([key, value]) => key.startsWith(prefix + 'columns') || key === prefix + 'sort' || key === prefix + 'order' || key === 'after' || key === 'task_after'
                ? [] : (Array.isArray(value) ? value : [value]).filter(v => typeof v === 'string').map(v => ({ name: key, value: v }))),
            reset: hrefWith(path, q, { [prefix + 'columns_set']: '1', [prefix + 'columns_layout']: undefined, [prefix + 'columns']: undefined, [prefix + 'columns_add']: undefined, [prefix + 'sort']: undefined, [prefix + 'order']: undefined }, hash),
            dataProblem: (() => { const added = text(q[prefix + 'columns_add']); return added && pathProblem(added.startsWith('data.') ? added : `data.${added}`); })() || undefined,
        },
    };
}

/**
 * The picker's other choices, once the list's rows are known: for each model in the list (the one the filter chooses;
 * with no rows, every model), the values its label names, then its form fields by their labels, each field once and
 * not those shown already. A data column's heading is its form field's label.
 */
export async function withChoices(server, list: Awaited<ReturnType<typeof listViewOf>>, rowModels: string[]) {
    const all = async () => [...new Set<string>((await server.definitions.getList()).map(m => m?.name ?? m))];
    const models = list.model ? [list.model] : rowModels.length ? [...new Set(rowModels)] : await all();
    models.sort((a, b) => a.localeCompare(b));
    const offered = new Set(list.layout.map(l => l.key)), titles = new Map<string, string>(), forms = new Map<string, { id: string; label: string }[]>();
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
            if (offered.has(f.name)) continue;
            offered.add(f.name);
            items.push({ key: f.name, title: titleOf(f.name), where: `Shown in the case's label (${f.path})` });
        }
        for (const f of forms.get(model)) {
            const key = `data.${f.id}`;
            if (offered.has(key) || labelPaths.has(key)) continue;
            offered.add(key);
            items.push({ key, title: f.label, where: `A form field (${key})` });
        }
        if (items.length) list.view.groups.push({ model, items });
    }
    for (const c of list.view.layout) if (c.data && titles.has(c.key)) c.title = titles.get(c.key);
    return list;
}
