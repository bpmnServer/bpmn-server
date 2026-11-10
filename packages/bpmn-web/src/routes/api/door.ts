import { SecureUser } from '../../index.js';
import { apiKeyAuth, configuredApiUser, timingSafeEqualStr } from '../middleware/apiKeyAuth.js';
import { unrestrictedUser } from './operations.js';
import { Tokens, tokenUser, REFUSED_GROUPS } from './tokens.js';

/*
 * The API's door (docs/design/api-v3.md): who is calling, once per request. It checks the credential and sets
 * request.apiUser, the user every operation acts as; a route never reads a header to learn who calls.
 *
 *   v1        /api           API_KEY: the service account. With API_IMPERSONATION=true (until 4.0), the user the
 *                            caller names (body.userName, body.options.userName), with no security rules, as before 3.7
 *   v1-admin  /admin/api     ADMIN_API_KEY: an administrator with no security rules; a save records the signed-in user
 *   v2        /api2          API_KEY: the service account
 *   v2-admin  /admin/api2    ADMIN_API_KEY: the service account
 *   acting    /api2/tasks    API_ACTING_USER_KEY: the user in x-acting-user, with x-acting-groups (never SYSTEM,
 *                            ADMIN or DESIGNER), security on
 *   v3        /api/v3        Authorization: Bearer <token>: the user the token stands for, security on (tokens.ts);
 *                            or x-api-key: API_KEY: the service account. Never a header naming a user
 */
export type Way = 'v1' | 'v1-admin' | 'v2' | 'v2-admin' | 'acting' | 'v3';

export const impersonationAllowed = () => process.env.API_IMPERSONATION?.toLowerCase() === 'true';

/** The user a v1 caller names, if any. */
const namedUser = req => req.body?.options?.userName ?? req.body?.userName;

const toList = (value): string[] => Array.isArray(value) ? value : typeof value === 'string' && value.trim() ? value.split(',').map(v => v.trim()) : [];

/** An answer the door gives instead of letting the call in. */
class Refused extends Error {
    constructor(readonly status: number, readonly body: object) { super(JSON.stringify(body)); }
}

function serviceAccount(): SecureUser {
    try {
        return configuredApiUser();
    }
    catch {
        throw new Refused(500, { errors: 'API service principal is not configured: set API_SERVICE_USER_NAME and API_SERVICE_USER_GROUPS (for example integration and SYSTEM) in .env, then restart' });
    }
}

function userFor(way: Way, req, res): SecureUser {
    switch (way) {
        case 'v1': {
            const named = namedUser(req);
            if (impersonationAllowed())
                return unrestrictedUser(named);
            if (named !== undefined)
                res.set('Warning', '299 - "userName is ignored: /api acts as its service account (API_IMPERSONATION=true allows it until 4.0)"');
            return serviceAccount();
        }
        case 'v1-admin':
            return unrestrictedUser(req.user?.userName);
        case 'v2':
        case 'v2-admin':
            return serviceAccount();
        case 'acting': {
            const userName = req.header('x-acting-user')?.trim();
            if (!userName)
                throw new Refused(400, { errors: 'missing "x-acting-user"', code: 'ACTING_USER_MISSING' });
            const userGroups = toList(req.header('x-acting-groups'));
            if (userGroups.some(group => REFUSED_GROUPS.includes(group.toUpperCase())))
                throw new Refused(403, { errors: `"x-acting-groups" can not have ${REFUSED_GROUPS.join(', ')}`, code: 'ACTING_GROUP_REFUSED' });
            // the tenant is the service account's, never the caller's; the security rules hold whatever the environment says
            return new SecureUser({ userName, userGroups, tenantId: process.env.API_SERVICE_TENANT_ID, modelsOwner: process.env.API_SERVICE_MODELS_OWNER }, { enforceSecurity: true });
        }
    }
}

/** The acting-user key's own check: off unless API_ACTING_USER_KEY is set, and API_KEY does not open it. */
function actingKey(req, res, next) {
    const key = process.env.API_ACTING_USER_KEY;
    if (!key)
        return res.status(404).json({ errors: 'The task API is not turned on: API_ACTING_USER_KEY', code: 'TASK_API_OFF' });
    const presented = req.header('x-api-key');
    if (typeof presented !== 'string' || !timingSafeEqualStr(presented, key))
        return res.status(401).json({ errors: 'missing or invalid "x-api-key"', code: 'UNAUTHORIZED' });
    next();
}

/** v3's door: a user's token, or the service key. request.apiCredential says which ('token' or 'service'). */
function v3Door(tokens: Tokens) {
    return async (req, res, next) => {
        const bearer = /^Bearer\s+(\S+)$/i.exec(req.header('authorization') ?? '')?.[1];
        if (bearer) {
            try {
                const holder = await tokens.holder(bearer);
                if (!holder)
                    return res.status(401).json({ error: { code: 'TOKEN_INVALID', message: 'The token is unknown, expired or revoked' } });
                req.apiUser = tokenUser(holder);
                req.apiCredential = 'token';
                // a person's AI link: its level (aiAccess.ts); v3's routes check it
                req.apiScope = holder.scope;
                return next();
            }
            catch (error) {
                return next(error);
            }
        }
        const key = process.env.API_KEY, presented = req.header('x-api-key');
        if (!key)
            return res.status(500).json({ error: { code: 'NOT_CONFIGURED', message: 'server API_KEY is not configured' } });
        if (typeof presented !== 'string' || !timingSafeEqualStr(presented, key))
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: "Send a user's token (Authorization: Bearer) or the service key (x-api-key)" } });
        try {
            req.apiUser = serviceAccount();
            req.apiCredential = 'service';
        }
        catch (error) {
            if (error instanceof Refused)
                return res.status(error.status).json({ error: { code: 'NOT_CONFIGURED', message: (error.body as any).errors } });
            return next(error);
        }
        next();
    };
}

/** The door for one way in: the key checked, then request.apiUser set. v3's needs the token store. */
export function door(way: Way, tokens?: Tokens) {
    if (way === 'v3')
        return v3Door(tokens);
    const checkKey = way === 'acting' ? actingKey : apiKeyAuth;
    return (req, res, next) => checkKey(req, res, () => {
        try {
            req.apiUser = userFor(way, req, res);
        }
        catch (error) {
            if (error instanceof Refused)
                return res.status(error.status).json(error.body);
            return next(error);
        }
        next();
    });
}
