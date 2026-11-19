/**
 * READ_ONLY=true (docs/docs/environments.md#read-only): a server people may use but not change, such as a public demo.
 * They start cases and complete tasks; the processes and the server's setup stay as they are. Refused here, in front
 * of every route, pages and APIs alike, so no page, API or AI link gets around it:
 *
 * - the models, decision tables, policies, tests and modeling rules: saved, added, imported, renamed, deleted;
 * - roles, connectors, the Integration page's settings, the catalog's import;
 * - users and passwords (bpmn-web's own), restarting the server, deleting every case at once.
 *
 * Running the tests, checking a model, previewing a policy, and everything a case does stay allowed.
 */
import { isReadOnly } from './environment.js';

export const READ_ONLY_MESSAGE = 'This server is read-only: you can start cases and complete tasks, not change the processes or its setup';

/** What READ_ONLY refuses: a change (any method but GET and HEAD) to one of these paths. */
const REFUSED: RegExp[] = [
    // the models and the files beside them (routes/model.ts)
    /^\/model\/(new|import|delete|rename|lint-rules)$/,
    /^\/model\/(add|addNoProp|edit|editNoProp)(\/|$)/,
    /^\/model\/decision\/[^/]+(\/tests)?$/,
    /^\/model\/([a-z]+-)?policy\/[^/]+(\/tests)?$/,
    /^\/model\/(history|scenarios)\//,
    // the dashboards: the catalog's import, administration, the Integration page (routes/dashboards.ts)
    /^\/dashboard\/catalog\/import$/,
    /^\/dashboard\/admin\/(users|roles|roles\/delete|restart)$/,
    /^\/dashboard\/admin\/connectors(\/[^/]+(\/(settings|enabled|operations|key|refresh|delete))?)?$/,
    /^\/dashboard\/integration\//,
    // every case deleted at once (routes/workflow.ts)
    /^\/resetData$/,
    // bpmn-web's own users and passwords (userAccess/routes/account.ts)
    /^\/account\/(edit|profile|password|delete)$/,
    /^\/(forgot|reset\/[^/]+)$/,
    // the APIs: API v3, the REST API v1 and v2 and their administration forms
    /^\/api\/v3\/models\/[^/]+(\/rename|\/feature)?$/,
    /^\/api\/v3\/users(\/|$)/,
    /^\/(admin\/)?api\/(definitions\/(import|rename|delete)(\/|$)|model\/save$)/,
    /^\/(admin\/)?api2\/(model\/(import|rename|delete)(\/|$)|models\/[^/]+(\/feature)?$)/,
];

/** Whether READ_ONLY refuses this request (true only when it is on). */
export function refusedWhenReadOnly(method: string, path: string): boolean {
    if (/^(GET|HEAD|OPTIONS)$/i.test(method)) return false;
    return REFUSED.some(re => re.test(path));
}

/** Express middleware: with READ_ONLY=true, a refused request answers 403 READ_ONLY (JSON for the APIs and scripts). */
export function readOnlyGuard(req, res, next) {
    if (!isReadOnly() || !refusedWhenReadOnly(req.method, req.path)) return next();
    const api = /^\/(admin\/)?api(2)?(\/|$)/.test(req.path);
    if (api || req.is?.('application/json') || req.get?.('x-requested-with') || !req.accepts?.('html'))
        return res.status(403).json({ error: { code: 'READ_ONLY', message: READ_ONLY_MESSAGE }, errors: READ_ONLY_MESSAGE });
    return res.status(403).render('message', { title: 'Read-only', message: READ_ONLY_MESSAGE });
}
