import express from 'express';
import { door } from './door.js';
import { Tokens, TokenError } from './tokens.js';
import { canDesign, isAdminGroups } from '../../userAccess/roles.js';
import { TaskOperations, DEFAULT_LIMIT } from './tasks.js';
import { v2TaskError } from '../taskApi.js';
import { openApiV3 } from './openapi-v3.js';
import { ModelOperations, ModelError } from './models.js';
import { SettingsOperations, SettingsError, settingsSchema } from './settings.js';
import { UserOperations, UserError } from './users.js';
import { originOf } from '../modelApi.js';
import { InstanceOperations, InstanceError, DEFAULT_LIMIT as INSTANCES_LIMIT } from './instances.js';
import { invokeDecision } from '../decisions.js';

/*
 * API v3, /api/v3 (docs/design/api-v3.md): every call through the door (a user's token, or the service key) and as
 * that user. Errors are { error: { code, message } } with the status their kind gives; lists are { items, next }, and
 * the next page is asked with ?cursor=<next> (next is absent on the last page; the cursor is opaque).
 */

/** A rule that can not be evaluated: not there (404), or failing on the data given (422). */
class RuleError extends Error {
    constructor(public status: number, message: string, public code: string) { super(message); }
}

/** A page's bookmark as the client sees it: opaque. */
const toCursor = (position: string | null) => position ? Buffer.from(position).toString('base64url') : undefined;
const fromCursor = (cursor: unknown) => typeof cursor === 'string' ? Buffer.from(cursor, 'base64url').toString() : undefined;
export function v3Router(server) {
    const router = express.Router();
    const tokens = new Tokens(server);
    const tasks = new TaskOperations(server);
    const instances = new InstanceOperations(server);
    const models = new ModelOperations(server);
    const settings = new SettingsOperations(server);
    const users = new UserOperations(server);
    /** Where a person opens a model: the editor (signed in to the site; a token does not open it). */
    const editorUrl = (req, name: string) => `${originOf(req)}/model/edit/${encodeURIComponent(name)}`;
    /** Changing models and running tests: design on, and a designer's token or the service key. */
    const designer = (req, res, next) => {
        try { models.assertDesign(req.apiUser, { service: req.apiCredential === 'service' }); next(); }
        catch (error) { res.status(error.status).json({ error: { code: error.code, message: error.message } }); }
    };

    // the contract, with no credential: the address as the client used it (https behind a proxy)
    router.get('/openapi.json', (req, res) => {
        const proto = String(req.get('x-forwarded-proto') ?? req.protocol).split(',')[0].trim();
        const host = String(req.get('x-forwarded-host') ?? req.get('host')).split(',')[0].trim();
        res.json(openApiV3(`${proto}://${host}`));
    });
    router.use(door('v3', tokens));

    /**
     * A person's AI link reaches only its level (aiAccess.ts): work everywhere but models and settings; design, models
     * too; administer, the settings too. A token with no level (an application's, the pages') only its user's rights.
     */
    const needs = (level: 'design' | 'administer') => (req, res, next) => !req.apiScope || req.apiScope === level ? next()
        : res.status(403).json({ error: { code: 'LEVEL_REFUSED', message: `This link's level is ${req.apiScope}: this needs a ${level} link` } });
    router.use('/models', needs('design'));
    // the settings: an administrator's (or the service key's), and an AI link's at the administer level
    router.use('/settings', needs('administer'), (req: any, res, next) => req.apiCredential === 'service' || isAdminGroups(req.apiUser.userGroups) ? next()
        : res.status(403).json({ error: { code: 'ADMIN_REQUIRED', message: 'Only an administrator reads the settings' } }));

    // the users: an administrator's own token or the service key; never an AI link, whatever its level
    router.use('/users', (req: any, res, next) => req.apiScope
        ? res.status(403).json({ error: { code: 'LEVEL_REFUSED', message: 'An AI link does not reach the users' } })
        : req.apiCredential === 'service' || isAdminGroups(req.apiUser.userGroups) ? next()
        : res.status(403).json({ error: { code: 'ADMIN_REQUIRED', message: 'Only an administrator manages the users' } }));

    /** Only with the service key: an application's back end, never a user's token. */
    const serviceOnly = (req, res, next) => req.apiCredential === 'service' ? next()
        : res.status(403).json({ error: { code: 'SERVICE_KEY_REQUIRED', message: 'Only the service key (x-api-key) may do this' } });

    /** An operation's answer, with its status (or the status its result gives: 201 for a model created), or its error. */
    const handler = (fn, status: number | ((result) => number) = 200) => async (req, res, next) => {
        try {
            const result = await fn(req, req.apiUser);
            res.status(typeof status === 'function' ? status(result) : status).json(result);
        }
        catch (error) {
            if (error instanceof ModelError)
                return res.status(error.status).json({ error: { code: error.code, message: error.message, ...(error.details ? { details: error.details } : {}) } });
            if (error instanceof TokenError || error instanceof InstanceError || error instanceof SettingsError || error instanceof UserError || error instanceof RuleError)
                return res.status(error.status).json({ error: { code: error.code, message: error.message } });
            // the task operations' errors, and the engine's, as v2 sorts them; in v3's shape
            const [code, body] = v2TaskError(error) as [number, any];
            if (body.code === 'BAD_AFTER')
                return res.status(400).json({ error: { code: 'BAD_CURSOR', message: 'cursor is a page\'s next' } });
            res.status(code).json({ error: { code: body.code, message: body.errors } });
        }
    };

    // who I am, and what I may do
    router.get('/me', handler(async (req, user) => ({
        userName: user.userName,
        groups: user.userGroups,
        credential: req.apiCredential,
        may: { start: true, design: canDesign(user), administer: isAdminGroups(user.userGroups) },
    })));

    // ---- processes: what this user may start, and starting one as them

    router.get('/processes/startable', handler(async (req, user) => ({ items: await tasks.startable(user) })));
    router.post('/processes/:name/start', handler((req, user) => tasks.start(user, req.params.name, { data: req.body?.data ?? {}, startNodeId: req.body?.startNodeId }), 201));

    // ---- tasks: the waiting tasks this user has a part in; one with its form; claim; complete

    router.get('/tasks', handler(async (req, user) => {
        // the ones this user completed, newest first
        if (req.query.status === 'completed')
            return { items: await tasks.completed(user, { limit: req.query.limit === undefined ? 10 : Number(req.query.limit) }) };
        const { tasks: items, next } = await tasks.list(user, {
            limit: req.query.limit === undefined ? DEFAULT_LIMIT : Number(req.query.limit),
            after: fromCursor(req.query.cursor),
        });
        return { items, ...(next ? { next: toCursor(next) } : {}) };
    }));
    router.get('/tasks/:id', handler((req, user) => tasks.get(user, req.params.id)));
    router.post('/tasks/:id/claim', handler((req, user) => tasks.claim(user, req.params.id)));
    router.post('/tasks/:id/complete', handler((req, user) => tasks.complete(user, req.params.id, req.body?.data ?? {})));

    // ---- instances: those this user may see; one; why it went the way it did; what moves it on

    const limitOf = (req, fallback) => req.query.limit === undefined ? fallback : Number(req.query.limit);
    router.get('/instances', handler(async (req, user) => {
        const { instances: items, next } = await instances.list(user, {
            status: typeof req.query.status === 'string' ? req.query.status : undefined,
            name: typeof req.query.name === 'string' ? req.query.name : undefined,
            limit: limitOf(req, INSTANCES_LIMIT),
            after: fromCursor(req.query.cursor),
        });
        return { items, ...(next ? { next: toCursor(next) } : {}) };
    }));
    router.get('/instances/:id', handler((req, user) => instances.get(user, req.params.id)));
    router.get('/instances/:id/rationale', handler((req, user) => instances.rationale(user, req.params.id)));
    router.post('/instances/:id/events/:elementId', handler(async (req, user) => ({ instance: await instances.startEvent(user, req.params.id, req.params.elementId, req.body?.data ?? {}) })));
    router.post('/instances/:id/restart', handler(async (req, user) => ({ instance: await instances.restart(user, req.params.id, req.body?.itemId, req.body?.data ?? {}) })));
    router.delete('/instances/:id', handler((req, user) => instances.remove(user, req.params.id)));

    // ---- models and their tests: read by anyone the door lets in; changed and tested by design

    router.get('/models', handler(async req => ({ items: (await models.list()).map(name => ({ name, url: editorUrl(req, name) })) })));
    router.get('/models/:name', handler(async req => ({ ...await models.get(req.params.name), url: editorUrl(req, req.params.name) })));
    router.put('/models/:name', designer, handler(async (req, user) => {
        const saved = await models.save(user, req.params.name, req.body?.source, { force: req.query.force === 'true' });
        return { ...saved, url: editorUrl(req, saved.name) };
    }, saved => saved.created ? 201 : 200));
    router.delete('/models/:name', designer, handler(req => models.remove(req.params.name)));
    router.post('/models/:name/rename', designer, handler(req => models.rename(req.params.name, req.body?.newName)));
    router.post('/models/:name/verify', handler(req => models.verify(req.params.name, req.body?.source)));
    router.get('/models/:name/elements/:elementId', handler(req => models.element(req.params.name, req.params.elementId)));
    router.get('/models/:name/feature', handler(req => models.feature(req.params.name)));
    router.put('/models/:name/feature', designer, handler(req => models.saveFeature(req.params.name, req.body?.text, req.body?.base)));
    router.post('/models/:name/test', designer, handler(req => models.test(req.params.name, req.body?.source, { raw: req.query.raw === 'true' })));

    // ---- the settings, read (secrets masked), and their checks; nothing here changes one

    router.get('/settings', handler(() => settings.list()));
    router.get('/settings/schema', handler(() => settingsSchema()));
    router.post('/settings/checks/:name', handler(req => settings.check(req.params.name)));

    // ---- the users (an administrator's)

    router.get('/users', handler(() => users.list()));
    router.post('/users', handler(req => users.add(req.body ?? {}), 201));
    router.put('/users/:userName/groups', handler(req => users.setGroups(req.params.userName, req.body?.groups)));
    router.post('/users/:userName/password', handler(req => users.setPassword(req.params.userName, req.body?.password)));
    router.delete('/users/:userName', handler((req, user) => users.remove(req.params.userName, user.userName)));

    // ---- messages and signals (the system's)

    router.post('/messages/:id', handler((req, user) => instances.message(user, req.params.id, req.body?.data ?? {}, req.body?.matchingKey ?? {})));
    router.post('/signals/:id', handler((req, user) => instances.signal(user, req.params.id, req.body?.data ?? {}, req.body?.matchingKey ?? {})));

    // ---- rules: a decision table of the models folder, evaluated with the data given; anyone the door lets in (it changes nothing)

    router.post('/rules/:name', handler(async req => {
        const data = req.body?.data ?? {};
        if (typeof data !== 'object' || Array.isArray(data))
            throw new RuleError(400, "data is an object: the decision's inputs by name", 'BAD_DATA');
        try { return await invokeDecision(server, { decision: req.params.name, data }); }
        catch (error) {
            if (/^Decision '.*' not found/.test(error?.message ?? ''))
                throw new RuleError(404, error.message, 'RULE_NOT_FOUND');
            throw new RuleError(422, error?.message ?? String(error), 'RULE_FAILED');
        }
    }));

    // ---- tokens

    // a token for one of the application's users: { userName, groups, minutes }
    router.post('/tokens', serviceOnly, handler(async req => tokens.issue(req.body ?? {}, req.apiUser.userName), 201));

    // revoke a user's tokens: ?userName=
    router.delete('/tokens', serviceOnly, handler(async req => {
        const userName = req.query.userName;
        if (typeof userName !== 'string' || !userName)
            throw new TokenError(400, 'userName is required', 'BAD_USER');
        return { revoked: await tokens.revoke(userName) };
    }));

    router.use((req, res) => res.status(404).json({ error: { code: 'NO_ROUTE', message: `No API v3 route ${req.method} ${req.originalUrl.split('?')[0]}` } }));
    return router;
}

/** The token store's indexes: part of a server's setup. */
export const installTokens = server => new Tokens(server).install();
