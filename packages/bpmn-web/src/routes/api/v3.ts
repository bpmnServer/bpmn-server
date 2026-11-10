import express from 'express';
import { door } from './door.js';
import { Tokens, TokenError } from './tokens.js';
import { canDesign, isAdminGroups } from '../../userAccess/roles.js';

/*
 * API v3, /api/v3 (docs/design/api-v3.md): every call through the door (a user's token, or the service key) and as
 * that user. Errors are { error: { code, message } } with the status their kind gives. So far: tokens and /me; the
 * operations follow (step 4).
 */
export function v3Router(server) {
    const router = express.Router();
    const tokens = new Tokens(server);
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
            next(error);
        }
    };

    // who I am, and what I may do
    router.get('/me', handler(async (req, user) => ({
        userName: user.userName,
        groups: user.userGroups,
        credential: req.apiCredential,
        may: { start: true, design: canDesign(user), administer: isAdminGroups(user.userGroups) },
    })));

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
