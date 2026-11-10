import express from 'express';
import { door } from './door.js';
import { Tokens, TokenError } from './tokens.js';
import { canDesign, isAdminGroups } from '../../userAccess/roles.js';
import { TaskOperations, DEFAULT_LIMIT } from './tasks.js';
import { v2TaskError } from '../taskApi.js';

/*
 * API v3, /api/v3 (docs/design/api-v3.md): every call through the door (a user's token, or the service key) and as
 * that user. Errors are { error: { code, message } } with the status their kind gives; lists are { items, next }, and
 * the next page is asked with ?cursor=<next> (next is absent on the last page; the cursor is opaque).
 */

/** A page's bookmark as the client sees it: opaque. */
const toCursor = (position: string | null) => position ? Buffer.from(position).toString('base64url') : undefined;
const fromCursor = (cursor: unknown) => typeof cursor === 'string' ? Buffer.from(cursor, 'base64url').toString() : undefined;
export function v3Router(server) {
    const router = express.Router();
    const tokens = new Tokens(server);
    const tasks = new TaskOperations(server);
    router.use(door('v3', tokens));

    /** Only with the service key: an application's back end, never a user's token. */
    const serviceOnly = (req, res, next) => req.apiCredential === 'service' ? next()
        : res.status(403).json({ error: { code: 'SERVICE_KEY_REQUIRED', message: 'Only the service key (x-api-key) may do this' } });

    const handler = (fn, status = 200) => async (req, res, next) => {
        try {
            res.status(status).json(await fn(req, req.apiUser));
        }
        catch (error) {
            if (error instanceof TokenError)
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
        const { tasks: items, next } = await tasks.list(user, {
            limit: req.query.limit === undefined ? DEFAULT_LIMIT : Number(req.query.limit),
            after: fromCursor(req.query.cursor),
        });
        return { items, ...(next ? { next: toCursor(next) } : {}) };
    }));
    router.get('/tasks/:id', handler((req, user) => tasks.get(user, req.params.id)));
    router.post('/tasks/:id/claim', handler((req, user) => tasks.claim(user, req.params.id)));
    router.post('/tasks/:id/complete', handler((req, user) => tasks.complete(user, req.params.id, req.body?.data ?? {})));

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
