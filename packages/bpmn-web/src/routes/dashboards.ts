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
import mongoose from 'mongoose';

import { SecureUser, BPMNAPI, verifyModel, dateDiff } from '../index.js';
import { Common } from './common.js';
import { runProcess } from './runErrors.js';
import { loadTemplateCatalog } from './elementTemplates.js';
import { listScenarioSets } from '../testing/scenarios.js';
import { adminDisabled, engineGroups, isAdminGroups, isDesignerGroups } from '../userAccess/roles.js';
import User from '../userAccess/models/User.js';
import { UserService } from '../userAccess/UserService.js';
import { loadCatalog, findCatalogEntry, readCatalogFile, catalogLocation } from './catalog.js';
import { isSafeModelName } from './middleware/modelName.js';
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
];

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
    verified = new Map<string, { mtime: number; errors: number; warnings: number }>();

    config() {
        const router = express.Router();
        const server = this.webApp.bpmnServer;
        const api = new BPMNAPI(server);
        const folder = () => server.configuration.definitionsPath;

        router.use(this.isAuthenticated);

        const secureUser = (req) => process.env.REQUIRE_AUTHENTICATION === 'false'
            ? SecureUser.SystemUser()
            : new SecureUser({ userName: req.user.userName, userGroups: engineGroups(req.user), tenantId: req.user.tenantId });
        const roles = (req) => ({
            isAdmin: !adminDisabled() && (process.env.REQUIRE_AUTHENTICATION === 'false' || isAdminGroups(req.user?.userGroups)),
            isDesigner: process.env.REQUIRE_AUTHENTICATION === 'false' || isDesignerGroups(req.user?.userGroups),
        });
        const render = (req, res, view, data) => res.render('dashboards/' + view, { ...data, ...roles(req), me: req.user?.userName, user: req.user, request: req });

        // ---- my work ----------------------------------------------------------------------------------------
        router.get('/', handler(async (req, res) => {
            const user = secureUser(req);
            const me = req.user?.userName;
            const myGroups = toList(req.user?.userGroups);

            const waiting: any[] = await api.data.findItems({ 'items.status': 'wait', 'items.type': 'bpmn:UserTask' }, user);
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

            const ended: any[] = await api.data.findItems({ 'items.status': 'end', 'items.type': 'bpmn:UserTask', 'items.userName': me }, user);
            const completed = ended
                .filter(i => i.userName === me && i.status === 'end' && i.type === 'bpmn:UserTask')
                .sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime())
                .slice(0, 10);
            completed.forEach(i => i.fromNow = dateDiff(i.endedAt));

            render(req, res, 'user', { title: 'My work', mine, available, completed, starts: await this.startEvents() });
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
                        const result = await verifyModel(FS.readFileSync(path.join(dir, file), 'utf8'), server, name);
                        checked = { mtime, errors: result.errors, warnings: result.warnings };
                    }
                    catch {
                        checked = { mtime, errors: 1, warnings: 0 };
                    }
                    this.verified.set(name, checked);
                }
                models.push({ name, saved: new Date(mtime), fromNow: dateDiff(new Date(mtime)), ...checked });
            }
            const tests = new Map((await listScenarioSets()).map(s => [s.model, s]));
            models.forEach(m => m.tests = tests.get(m.name)?.count ?? 0);
            models.sort((a, b) => (b.errors - a.errors) || (b.warnings - a.warnings) || a.name.localeCompare(b.name));
            const recent = [...models].sort((a, b) => b.saved - a.saved).slice(0, 5);
            const decisions = files.filter(f => DMN_FILE.test(f)).map(f => f.replace(DMN_FILE, ''));
            const catalog = loadTemplateCatalog(this.webApp.application?.elementTemplatesPath, undefined);
            render(req, res, 'design', {
                title: 'Design', models, recent, decisions,
                templates: catalog.templates ?? [], rejectedTemplates: catalog.rejected ?? [],
                problems: { errors: models.filter(m => m.errors).length, warnings: models.filter(m => !m.errors && m.warnings).length },
            });
        }));

        // ---- administration ---------------------------------------------------------------------------------
        router.get('/admin', this.isAdmin, handler(async (req, res) => {
            const instances = mongoose.connection.db.collection(server.configuration.database.MongoDB.Instance_collection);
            const counts = {};
            for (const status of ['running', 'end', 'terminated', 'error'])
                counts[status] = await instances.countDocuments({ status });
            counts['waiting'] = await instances.countDocuments({ 'items.status': 'wait' });
            const locks = await server.dataStore.locker.list();
            locks.forEach(l => l.fromNow = dateDiff(l.time));
            const hung = await server.dataStore.findItems({ 'items.status': 'start' });
            hung.forEach(i => i.fromNow = dateDiff(i.startedAt));
            const users = await User.find({}).sort({ userName: 1 }).lean();
            render(req, res, 'admin', {
                title: 'Administration', counts, locks, hung, users,
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
            if (await User.findOne({ $or: [{ userName }, { email }] }))
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
            await server.definitions.save(name, source, svg);
            this.verified.delete(name);
            res.redirect('/model/edit/' + encodeURIComponent(name));
        }));

        return router;
    }

    /** Every model's start events a user can start (no timer, message or signal), with their form fields. */
    async startEvents() {
        const server = this.webApp.bpmnServer;
        const starts = [];
        for (const { name } of await server.definitions.getList({})) {
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
     * A backup to download: the models folder's files and every database collection but the sessions,
     * as one JSON document (collections in MongoDB Extended JSON, so types survive a restore).
     */
    async backup(res) {
        const server = this.webApp.bpmnServer;
        const { EJSON } = (mongoose as any).mongo.BSON;
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="bpmn-backup-${stamp}.json"`);
        res.write(`{"format":"bpmn-web-backup","version":1,"createdAt":${JSON.stringify(new Date())},`);
        res.write(`"bpmnServer":${JSON.stringify(packageVersion('bpmn-server'))},"bpmnWeb":${JSON.stringify(this.webApp.packageJson?.version ?? '')},`);

        const dir = server.configuration.definitionsPath;
        const files = (FS.existsSync(dir) ? FS.readdirSync(dir, { withFileTypes: true }) : []).filter(e => e.isFile());
        res.write('"files":[');
        files.forEach((e, i) => res.write((i ? ',' : '') + JSON.stringify({ name: e.name, content: FS.readFileSync(path.join(dir, e.name), 'utf8') })));
        res.write('],"collections":{');

        const db = mongoose.connection.db;
        const names = (await db.listCollections({}, { nameOnly: true }).toArray()).map(c => c.name).filter(n => n !== 'sessions' && !n.startsWith('system.')).sort();
        for (let i = 0; i < names.length; i++) {
            res.write(`${i ? ',' : ''}${JSON.stringify(names[i])}:[`);
            let first = true;
            for await (const doc of db.collection(names[i]).find({})) {
                res.write((first ? '' : ',') + EJSON.stringify(doc, { relaxed: false }));
                first = false;
            }
            res.write(']');
        }
        res.end('}}');
    }
}
