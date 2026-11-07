/**
 * The dashboards, one per role:
 *   /dashboard          my work: tasks waiting for me, tasks I completed, processes I can start
 *   /dashboard/design   designers: models and their problems, tests, decisions, templates
 *   /dashboard/admin    administrators: the server, users, operations (locks, hung items), backup, restart
 *   /dashboard/catalog  designers: browse the model catalog (CATALOG_URL) and import its models
 */
import express from 'express';
import FS from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import { SecureUser, BPMNAPI, verifyModel, dateDiff, canEncrypt } from '../index.js';
import { Common } from './common.js';
import { runProcess } from './runErrors.js';
import { loadTemplateCatalog } from './elementTemplates.js';
import { notATest, listScenarioSets, listDecisionTestSets, loadScenarios, saveScenarios, runScenarioInEngine } from '../testing/scenarios.js';
import { modelDescription, modelElements, savedCoverage } from '../testing/modelCoverage.js';
import { reachedIn } from '../testing/coverage.js';
import { loadDecisionTests, runDecisionTestsInEngine } from '../testing/decisionTests.js';
import { adminDisabled, canDesign, isAdminGroups } from '../userAccess/roles.js';
import { UserService } from '../userAccess/UserService.js';
import { loadCatalog, findCatalogEntry, readCatalogFile, catalogLocation } from './catalog.js';
import { loadConnectorCatalog, connectorCatalogLocation } from './connectorCatalog.js';
import { isSafeModelName, guardModelParams } from './middleware/modelName.js';
import { bpmnToSvg } from './bpmnToSvg.js';
import crypto from 'node:crypto';

const handler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/** A comma list or an array, as an array. */
const toList = (v): string[] => Array.isArray(v) ? v : (typeof v === 'string' && v.trim() ? v.split(',').map(s => s.trim()) : []);

const DMN_FILE = /\.dmn(\.xml)?$/i;

/** The console's commands, as `npm run cli` lists them. */
const CONSOLE_COMMANDS = [
    ['s', 'start a process'], ['lo', 'list outstanding items'], ['li', 'list items'], ['l', 'list instances of a process'],
    ['di', 'display an instance'], ['i', 'invoke (complete) a task'], ['sgl', 'signal a task'], ['msg', 'throw a message'],
    ['se', 'start event'], ['rs', 'restart an instance'], ['d', 'delete instances'], ['lm', 'list models'],
    ['lme', 'list model events'], ['ck', 'check locks (and delete them)'], ['re', 'recover hung items'],
    ['lu', 'list users'], ['spw', 'set a user\'s password'],
    ['co', 'list connectors (coa add, cok set its key, coe enable or disable, cot test, cor refresh, cod delete, coc call)'],
];

/** Why a scenario or a decision's test failed: its failed step, else its failed checks. */
function failedChecks(result): string {
    const step = result.steps?.find(s => !s.ok);
    if (step) return `step ${step.element}: ${step.error}`;
    return (result.checks ?? []).filter(c => !c.ok).map(c => `${c.what} (was ${JSON.stringify(c.actual)})`).join('; ');
}

/** What restarts this process when it exits, if anything does. */
function supervisor(): string | null {
    if (process.env.RESTART_ON_EXIT === 'true') return 'RESTART_ON_EXIT';
    if (process.env.pm_id !== undefined) return 'pm2';
    if (process.env.INVOCATION_ID) return 'systemd';
    if (FS.existsSync('/.dockerenv')) return 'Docker';
    return null;
}

function packageVersion(name: string): string {
    try {
        return JSON.parse(FS.readFileSync(createRequire(import.meta.url).resolve(`${name}/package.json`), 'utf8')).version;
    }
    catch {
        return '';
    }
}

/** The database URL without its credentials. */
function databaseName(): string {
    try {
        const url = new URL(process.env.MONGO_DB_URL);
        return `${url.host}${url.pathname}`;
    }
    catch {
        return '';
    }
}

export class Dashboards extends Common {
    /** verifyModel's counts per model, kept while the file is unchanged */
    verified = new Map<string, { mtime: number; errors: number; warnings: number; description?: string }>();

    config() {
        const router = express.Router();
        guardModelParams(router);
        const server = this.webApp.bpmnServer;
        const api = new BPMNAPI(server);
        const folder = () => server.configuration.definitionsPath;

        router.use(this.isAuthenticated);

        const secureUser = (req) => process.env.REQUIRE_AUTHENTICATION === 'false'
            ? SecureUser.SystemUser()
            : new SecureUser({ userName: req.user.userName, userGroups: req.user.userGroups, tenantId: req.user.tenantId });
        const roles = (req) => ({
            isAdmin: !adminDisabled() && (process.env.REQUIRE_AUTHENTICATION === 'false' || isAdminGroups(req.user?.userGroups)),
            isDesigner: canDesign(req.user),
        });
        const render = (req, res, view, data) => res.render('dashboards/' + view, { ...data, ...roles(req), me: req.user?.userName, user: req.user, request: req });

        // ---- my work ----------------------------------------------------------------------------------------
        router.get('/', handler(async (req, res) => {
            const user = secureUser(req);
            const me = req.user?.userName;
            const myGroups = toList(req.user?.userGroups);

            const waiting: any[] = await api.data.findItems({ 'items.status': 'wait', 'items.type': 'bpmn:UserTask', ...notATest }, user);
            const mine = [], available = [];
            for (const item of waiting) {
                item.fromNow = dateDiff(item.startedAt);
                if (item.assignee) {
                    if (item.assignee === me) mine.push(item);
                    continue;
                }
                const users = toList(item.candidateUsers), groups = toList(item.candidateGroups);
                const open = !users.length && !groups.length;
                if (open || users.includes(me) || groups.some(g => myGroups.includes(g)))
                    available.push(item);
            }

            const ended: any[] = await api.data.findItems({ 'items.status': 'end', 'items.type': 'bpmn:UserTask', 'items.userName': me, ...notATest }, user);
            const completed = ended
                .filter(i => i.userName === me && i.status === 'end' && i.type === 'bpmn:UserTask')
                .sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime())
                .slice(0, 10);
            completed.forEach(i => i.fromNow = dateDiff(i.endedAt));

            render(req, res, 'user', { title: 'My work', mine, available, completed, starts: await this.startEvents() });
        }));

        // the start page of a model: its start events a user can start, each with its start form
        router.get('/start/:processName', handler(async (req, res) => {
            const processName = req.params.processName;
            render(req, res, 'start', { title: 'Start a process', processName, starts: await this.startEvents(processName) });
        }));

        // start a process at one of its start events, with the start form's fields
        router.post('/start', handler(async (req, res) => {
            const { processName, startNodeId } = req.body;
            const data = {};
            for (const [key, value] of Object.entries(req.body))
                if (key.startsWith('field.') && value !== '')
                    data[key.substring(6)] = value;
            const context = await runProcess(server, { processName }, () =>
                api.engine.start(processName, data, secureUser(req), { startNodeId: startNodeId || undefined }));
            if (context?.errors)
                return res.status(500).send(String(context.errors));
            res.redirect('/instanceDetails?id=' + (context.instance?.id ?? context.id));
        }));

        // ---- design -----------------------------------------------------------------------------------------
        router.get('/design', this.isDesigner, handler(async (req, res) => {
            const dir = folder();
            const files = FS.existsSync(dir) ? FS.readdirSync(dir) : [];
            const models = [];
            for (const file of files.filter(f => f.endsWith('.bpmn'))) {
                const name = file.slice(0, -5);
                const mtime = FS.statSync(path.join(dir, file)).mtimeMs;
                let checked = this.verified.get(name);
                if (!checked || checked.mtime !== mtime) {
                    try {
                        const source = FS.readFileSync(path.join(dir, file), 'utf8');
                        const result = await verifyModel(source, server, name);
                        checked = { mtime, errors: result.errors, warnings: result.warnings, description: await modelDescription(source).catch(() => '') };
                    }
                    catch {
                        checked = { mtime, errors: 1, warnings: 0 };
                    }
                    this.verified.set(name, checked);
                }
                models.push({ name, saved: new Date(mtime), fromNow: dateDiff(new Date(mtime)), ...checked });
            }
            const tests = new Map((await listScenarioSets()).map(s => [s.model, s]));
            for (const m of models) {
                m.tests = tests.get(m.name)?.count ?? 0;
                m.versions = (await server.definitions.history(m.name).catch(() => [])).length;
                if (m.tests)
                    m.coverage = await savedCoverage(server, FS.readFileSync(path.join(dir, m.name + '.bpmn'), 'utf8'), await loadScenarios(m.name), m.saved).catch(() => null);
            }
            const decisionTests = new Map((await listDecisionTestSets()).map(s => [s.decision, s.count]));
            models.sort((a, b) => (b.errors - a.errors) || (b.warnings - a.warnings) || a.name.localeCompare(b.name));
            const recent = [...models].sort((a, b) => b.saved - a.saved).slice(0, 5);
            const decisions = files.filter(f => DMN_FILE.test(f)).map(f => {
                const name = f.replace(DMN_FILE, '');
                return { name, tests: decisionTests.get(name) ?? 0 };
            });
            const catalog = loadTemplateCatalog(this.webApp.application?.elementTemplatesPath, undefined);
            render(req, res, 'design', {
                title: 'Design', models, recent, decisions, runs: req.session?.testRuns ?? { models: {}, decisions: {} },
                message: req.query.message,
                templates: catalog.templates ?? [], rejectedTemplates: catalog.rejected ?? [],
                problems: { errors: models.filter(m => m.errors).length, warnings: models.filter(m => !m.errors && m.warnings).length },
            });
        }));

        // run the tests of a model (model), of a decision (decision), or every test (neither); the results are
        // kept in the session, by model and decision, and shown on the dashboard; a model's are its scenarios' last runs too
        router.post('/design/tests', this.isDesigner, handler(async (req, res) => {
            const { model, decision } = req.body ?? {};
            const dir = folder();
            const files = FS.existsSync(dir) ? FS.readdirSync(dir) : [];
            const runs = req.session.testRuns ??= { models: {}, decisions: {} };
            const at = new Date().toISOString();
            let passed = 0, failed = 0;
            const note = (into, name, results) => {
                const failures = results.filter(r => !r.ok).map(r => ({ name: r.name, why: r.error || failedChecks(r) }));
                into[name] = { passed: results.length - failures.length, failed: failures.length, failures, at };
                passed += results.length - failures.length;
                failed += failures.length;
            };

            if (!decision) {
                const names = model ? [String(model)] : (await listScenarioSets()).filter(s => s.count).map(s => s.model);
                for (const name of names) {
                    if (!files.includes(name + '.bpmn'))
                        continue;
                    const results = [], scenarios = await loadScenarios(name);
                    const { listeners } = await modelElements(FS.readFileSync(path.join(dir, name + '.bpmn'), 'utf8'));
                    for (const scenario of scenarios) {      // one after another: they may share state
                        const result = await runScenarioInEngine(server, name, scenario, req.user?.userName);
                        results.push(result);
                        // this is the scenario's last run now, as in the Test tab: its instance replaces the one before
                        for (const old of (scenario as any).runs ?? [])
                            if (String(old.instanceId).startsWith('test-'))
                                await server.dataStore.deleteInstances({ id: old.instanceId }).catch(() => { });
                        (scenario as any).runs = result.instance ? [{
                            instanceId: result.instance.id, at, how: 'dashboard', ok: result.ok, error: result.error, checks: result.checks, steps: result.steps,
                            reached: [...reachedIn(result.instance.items, listeners)],
                        }] : [];
                    }
                    await saveScenarios(name, scenarios, req.user?.userName);
                    note(runs.models, name, results);
                }
            }
            if (!model) {
                const names = decision ? [String(decision)] : (await listDecisionTestSets()).filter(s => s.count).map(s => s.decision);
                for (const name of names) {
                    const file = files.find(f => DMN_FILE.test(f) && f.replace(DMN_FILE, '') === name);
                    if (file)
                        note(runs.decisions, name, await runDecisionTestsInEngine(server, file, await loadDecisionTests(name)));
                }
            }
            const what = model || decision ? `${model || decision}: ` : 'All tests: ';
            const message = passed + failed === 0 ? `${what}no tests to run.` : `${what}${passed} passed, ${failed} failed.`;
            res.redirect('/dashboard/design?message=' + encodeURIComponent(message) + '#tests');
        }));

        // ---- administration ---------------------------------------------------------------------------------
        router.get('/admin', this.isAdmin, handler(async (req, res) => {
            const counts = {};
            for (const status of ['running', 'end', 'terminated', 'error'])
                counts[status] = await server.dataStore.countInstances({ status });
            counts['waiting'] = await server.dataStore.countInstances({ 'items.status': 'wait' });
            const locks = await server.dataStore.locker.list();
            locks.forEach(l => l.fromNow = dateDiff(l.time));
            const hung = await server.dataStore.findItems({ 'items.status': 'start' });
            hung.forEach(i => i.fromNow = dateDiff(i.startedAt));
            const users = await new UserService().listUsers();
            const connectorList = await server.connectors.list();
            render(req, res, 'admin', {
                title: 'Administration', counts, locks, hung, users, connectors: connectorList, canEncrypt: canEncrypt(),
                serverInfo: {
                    bpmnWeb: this.webApp.packageJson?.version ?? packageVersion('bpmn-web'),
                    bpmnServer: packageVersion('bpmn-server'),
                    node: process.version,
                    uptime: dateDiff(new Date(Date.now() - process.uptime() * 1000)),
                    database: databaseName(),
                    models: folder(),
                    serverId: process.env.SERVER_ID || '',
                },
                supervisor: supervisor(),
                commands: CONSOLE_COMMANDS,
                message: req.query.message,
            });
        }));
        const back = (res, message: string) => res.redirect('/dashboard/admin?message=' + encodeURIComponent(message));

        router.post('/admin/users', this.isAdmin, handler(async (req, res) => {
            const { userName, email, password } = req.body;
            const groups = toList(req.body.userGroups);
            if (!userName || !email || !password)
                return back(res, 'A new user needs a user name, an email and a password.');
            if (await new UserService().findUser({ $or: [{ userName }, { email }] }))
                return back(res, `A user named '${userName}' or with the email '${email}' already exists.`);
            await new UserService().addUser(userName, email, password, groups);
            back(res, `User '${userName}' added.`);
        }));

        router.post('/admin/locks/release', this.isAdmin, handler(async (req, res) => {
            const locker = server.dataStore.locker as any;
            if (typeof locker.delete !== 'function')
                return back(res, 'This lock manager cannot release other servers\' locks.');
            await locker.delete(req.body.id ? { id: req.body.id } : {});
            back(res, req.body.id ? `Lock ${req.body.id} released.` : 'All locks released.');
        }));

        router.post('/admin/recover', this.isAdmin, handler(async (req, res) => {
            const { itemId, instanceId } = req.body;
            const locker = server.dataStore.locker as any;
            if (typeof locker.delete === 'function')
                await locker.delete({ id: instanceId });
            try {
                await server.engine.invoke({ 'items.id': itemId }, {}, req.user?.userName, { recover: true });
                back(res, `Item ${itemId} invoked again.`);
            }
            catch (exc) {
                back(res, `Item ${itemId}: ${exc.message}`);
            }
        }));

        // ---- connectors: REST APIs (OpenAPI) that service tasks call, added with their keys (docs/docs/connectors.md)
        const connectors = () => server.connectors;
        const backToConnectors = (res, message: string, id?: string) =>
            res.redirect(`/dashboard/admin/connectors${id ? '/' + encodeURIComponent(id) : ''}?message=` + encodeURIComponent(message));
        /** Runs an administration action; its error goes back as the page's message. */
        const action = (fn: (req, res) => Promise<any>) => handler(async (req, res) => {
            try {
                await fn(req, res);
            }
            catch (exc) {
                backToConnectors(res, exc.message, req.params.id && req.path.endsWith('/delete') ? undefined : req.params.id);
            }
        });

        router.get('/admin/connectors', this.isAdmin, handler(async (req, res) => {
            const list = await connectors().list();
            const used = this.connectorUse();
            // the catalog: APIs to add in one step (an entry already added is marked); unreadable, the page says why
            let catalog = [], catalogError = null;
            try {
                const added = new Set(list.map(c => c.id));
                catalog = (await loadConnectorCatalog()).map(e => ({ ...e, added: added.has(e.id) }));
            }
            catch (exc) {
                catalogError = exc.message;
            }
            render(req, res, 'connectors', {
                title: 'Connectors', connectors: list.map(c => ({ ...c, models: used.get(c.id) ?? [] })),
                catalog, catalogError, catalogLocation: connectorCatalogLocation(),
                canEncrypt: canEncrypt(), message: req.query.message,
            });
        }));

        router.post('/admin/connectors', this.isAdmin, action(async (req, res) => {
            const { id, name, source, document, baseUrl } = req.body;
            const added = await connectors().add({
                id: String(id ?? '').trim(), name: name?.trim() || undefined, baseUrl: baseUrl?.trim() || undefined,
                ...(document?.trim() ? { document } : { source: source?.trim() }),
            }, req.user?.userName);
            backToConnectors(res, `Connector '${added.id}' added: ${Object.keys(added.operations).length} operations.`, added.id);
        }));

        router.get('/admin/connectors/:id', this.isAdmin, handler(async (req, res) => {
            const connector = await connectors().get(req.params.id);
            if (!connector)
                return backToConnectors(res, `No connector '${req.params.id}'.`);
            const document = await connectors().document(connector.id);
            const schemes = Object.entries<any>(document.components?.securitySchemes ?? {})
                .map(([name, s]) => ({ name, text: `${name}: ${s.type}${s.scheme ? ' ' + s.scheme : ''}${s.in ? ` in ${s.in} ${s.name}` : ''}` }));
            render(req, res, 'connector', {
                title: `Connector: ${connector.name}`, connector, operations: await connectors().operations(connector.id),
                schemes, models: this.connectorUse().get(connector.id) ?? [], canEncrypt: canEncrypt(), message: req.query.message,
            });
        }));

        router.post('/admin/connectors/:id/settings', this.isAdmin, action(async (req, res) => {
            const { name, description, baseUrl, groups, timeout, retries, enabled } = req.body;
            const number = v => v === undefined || String(v).trim() === '' ? null : Number(v);
            await connectors().update(req.params.id, {
                name: name?.trim() || undefined, description: description ?? undefined, baseUrl: baseUrl?.trim() || undefined,
                groups: toList(groups), timeout: number(timeout), retries: number(retries), enabled: enabled === 'on' || enabled === 'true',
            });
            backToConnectors(res, 'Settings saved.', req.params.id);
        }));

        router.post('/admin/connectors/:id/enabled', this.isAdmin, action(async (req, res) => {
            const on = req.body.enabled === 'true';
            await connectors().update(req.params.id, { enabled: on });
            backToConnectors(res, `Connector '${req.params.id}' ${on ? 'enabled' : 'disabled'}.`, req.body.list ? undefined : req.params.id);
        }));

        router.post('/admin/connectors/:id/operations', this.isAdmin, action(async (req, res) => {
            const chosen = new Set(toList(req.body.operation));
            const all = await connectors().operations(req.params.id);
            await connectors().update(req.params.id, { operations: Object.fromEntries(all.map(op => [op.operationId, chosen.has(op.operationId)])) });
            backToConnectors(res, `${chosen.size} of ${all.length} operations enabled.`, req.params.id);
        }));

        router.post('/admin/connectors/:id/key', this.isAdmin, action(async (req, res) => {
            const { scheme, apiKeyName, apiKeyIn, key, clear } = req.body;
            if (clear) {
                await connectors().clearKey(req.params.id);
                return backToConnectors(res, 'Key removed: calls go without authorization.', req.params.id);
            }
            const how = scheme === 'bearer' || scheme === 'basic' ? { type: scheme }
                : scheme === 'apiKey' ? { type: 'apiKey', in: apiKeyIn || 'header', name: String(apiKeyName ?? '').trim() }
                : scheme || undefined;
            const updated = await connectors().setKey(req.params.id, String(key ?? ''), how as any, req.user?.userName);
            backToConnectors(res, `Key set (${updated.auth.type}, ending ${updated.auth.last4}).`, req.params.id);
        }));

        router.post('/admin/connectors/:id/test', this.isAdmin, action(async (req, res) => {
            let input = {};
            if (String(req.body.input ?? '').trim()) {
                try {
                    input = JSON.parse(req.body.input);
                }
                catch (exc) {
                    return backToConnectors(res, `The inputs are not JSON: ${exc.message}`, req.params.id);
                }
            }
            const result = await connectors().test(req.params.id, req.body.operation || undefined, input);
            backToConnectors(res, `Test of ${result.operation}: ${result.ok ? 'OK' : 'failed'}, ${result.message}`, req.params.id);
        }));

        router.post('/admin/connectors/:id/refresh', this.isAdmin, action(async (req, res) => {
            const changed = await connectors().refresh(req.params.id, req.body.document?.trim() ? req.body.document : undefined);
            backToConnectors(res, `Document read again: ${changed.added.length ? 'added ' + changed.added.join(', ') : 'no operation added'}; `
                + `${changed.removed.length ? 'removed ' + changed.removed.join(', ') : 'none removed'}.`, req.params.id);
        }));

        router.post('/admin/connectors/:id/delete', this.isAdmin, action(async (req, res) => {
            const removed = await connectors().remove(req.params.id);
            backToConnectors(res, removed ? `Connector '${req.params.id}' deleted.` : `No connector '${req.params.id}'.`);
        }));

        router.get('/admin/backup', this.isAdmin, handler(async (req, res) => this.backup(res)));

        router.post('/admin/restart', this.isAdmin, handler(async (req, res) => {
            const by = supervisor();
            if (!by)
                return back(res, 'Nothing restarts this process when it stops (Docker, pm2, systemd, or RESTART_ON_EXIT=true), so it was not stopped.');
            res.send(`<p>Restarting (${by} starts the server again). <a href="/dashboard/admin">Back to the dashboard</a> in a few seconds.</p>`);
            setTimeout(() => process.kill(process.pid, 'SIGTERM'), 500);
        }));

        // ---- the model catalog (designers) ------------------------------------------------------------------
        router.get('/catalog', this.isDesigner, handler(async (req, res) => {
            let catalog = null, error = null;
            try {
                catalog = await loadCatalog();
            }
            catch (exc) {
                error = exc.message;
            }
            const existing = new Set((await server.definitions.getList({})).map(m => m.name));
            const entries = (catalog?.entries ?? []).map(e => ({ ...e, exists: existing.has(e.name) }));
            const tags = [...new Set(entries.flatMap(e => e.tags ?? []))].sort();
            render(req, res, 'catalog', {
                title: 'Model catalog', entries, tags, error, location: catalogLocation(), updated: catalog?.updated,
                message: req.query.message,
            });
        }));

        router.get('/catalog/svg/:id', this.isDesigner, handler(async (req, res) => {
            const entry = await findCatalogEntry(req.params.id);
            if (!entry.svg)
                return res.status(404).send('no diagram');
            res.type('image/svg+xml').send(await readCatalogFile(entry.svg));
        }));

        // import a catalog model into the models folder, under its name or one given
        router.post('/catalog/import', this.isDesigner, handler(async (req, res) => {
            const again = (message: string) => res.redirect('/dashboard/catalog?message=' + encodeURIComponent(message));
            let entry;
            try {
                entry = await findCatalogEntry(req.body.id);
            }
            catch (exc) {
                return again(exc.message);
            }
            const name = String(req.body.name || entry.name).trim();
            if (!isSafeModelName(name))
                return again(`'${name}' can not be a model name.`);
            if (FS.existsSync(path.join(folder(), name + '.bpmn')) && req.body.overwrite !== 'true')
                return again(`A model named '${name}' exists: import it under another name.`);
            const source = await readCatalogFile(entry.bpmn);
            if (entry.sha256 && crypto.createHash('sha256').update(source).digest('hex') !== entry.sha256)
                return again(`${entry.bpmn} is not the file the catalog describes (its checksum differs); nothing was imported.`);
            const svg = await bpmnToSvg(source).catch(() => null);
            await server.definitions.save(name, source, svg, null, req.user?.userName);
            this.verified.delete(name);
            res.redirect('/model/edit/' + encodeURIComponent(name));
        }));

        return router;
    }

    /** The models that call each connector (camunda:connectorId <connector>/<operation>), by connector id. */
    connectorUse(): Map<string, string[]> {
        const dir = this.webApp.bpmnServer.configuration.definitionsPath;
        const used = new Map<string, string[]>();
        for (const file of FS.existsSync(dir) ? FS.readdirSync(dir).filter(f => f.endsWith('.bpmn')) : []) {
            const xml = FS.readFileSync(path.join(dir, file), 'utf8');
            const ids = new Set([...xml.matchAll(/<(?:\w+:)?connectorId>\s*([^<\/\s]+)\//g)].map(m => m[1]));
            for (const id of ids)
                used.set(id, [...(used.get(id) ?? []), file.slice(0, -5)]);
        }
        return used;
    }

    /** Every model's start events a user can start (no timer, message or signal), with their form fields. */
    /** The start events a user can start, with their start forms' fields: every model's, or one model's. */
    async startEvents(model?: string) {
        const server = this.webApp.bpmnServer;
        const starts = [];
        const names = model ? [{ name: model }] : await server.definitions.getList({});
        for (const { name } of names) {
            try {
                const definition = await server.definitions.load(name);
                for (const node of definition.getStartNodes(true)) {
                    const fields = definition.getNodeInfo(node.id).fields ?? [];
                    starts.push({ processName: name, startNodeId: node.id, name: node.name || node.id, fields });
                }
            }
            catch {
                // a model that does not load has nothing to start; the design dashboard reports it
            }
        }
        return starts.sort((a, b) => a.processName.localeCompare(b.processName));
    }

    /**
     * A backup to download: the models folder's files and, by collection, what each store keeps (the engine's
     * instances, archive, locks, models and events; the connectors, keys encrypted; the users), as one JSON document. The models'
     * tests are files of the models folder (*.tests.json).
     * The stores give their own documents, whatever database they are on; the sessions are never in it.
     */
    async backup(res) {
        const server = this.webApp.bpmnServer;
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="bpmn-backup-${stamp}.json"`);
        res.write(`{"format":"bpmn-web-backup","version":2,"createdAt":${JSON.stringify(new Date())},`);
        res.write(`"bpmnServer":${JSON.stringify(packageVersion('bpmn-server'))},"bpmnWeb":${JSON.stringify(this.webApp.packageJson?.version ?? '')},`);

        const dir = server.configuration.definitionsPath;
        const files = (FS.existsSync(dir) ? FS.readdirSync(dir, { withFileTypes: true }) : []).filter(e => e.isFile());
        res.write('"files":[');
        files.forEach((e, i) => res.write((i ? ',' : '') + JSON.stringify({ name: e.name, content: FS.readFileSync(path.join(dir, e.name), 'utf8') })));
        res.write('],"collections":{');

        const stores = [
            () => server.dataStore.backup?.() ?? {},
            () => (server.definitions as any).backup?.() ?? {},
            () => server.connectors?.backup() ?? {},
            () => new UserService().backup(),
        ];
        let first = true;
        for (const store of stores)
            for (const [name, docs] of Object.entries(await store())) {
                res.write(`${first ? '' : ','}${JSON.stringify(name)}:[`);
                (docs as any[]).forEach((doc, i) => res.write((i ? ',' : '') + JSON.stringify(doc)));
                res.write(']');
                first = false;
            }
        res.end('}}');
    }
}
