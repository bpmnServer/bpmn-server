import { SecureUser } from '../../index.js';
import { apiKeyAuth, configuredApiUser, timingSafeEqualStr } from '../middleware/apiKeyAuth.js';
import { unrestrictedUser } from './operations.js';
import { Tokens, tokenUser, REFUSED_GROUPS } from './tokens.js';
import { hostSettings } from '../../runtime/hostSettings.js';
import { hostUserManager } from '../../userAccess/UserManager.js';

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

/** API_IMPERSONATION, as the request's server has it (hostSettings). */
export const impersonationAllowed = (req?) => hostSettings(req).impersonation;

/** The user a v1 caller names, if any. */
const namedUser = req => req.body?.options?.userName ?? req.body?.userName;

const toList = (value): string[] => Array.isArray(value) ? value : typeof value === 'string' && value.trim() ? value.split(',').map(v => v.trim()) : [];

/** An answer the door gives instead of letting the call in. */
class Refused extends Error {
    constructor(readonly status: number, readonly body: object) { super(JSON.stringify(body)); }
}

function serviceAccount(req): SecureUser {
    try {
        return configuredApiUser(hostSettings(req));
    }
    catch {
        throw new Refused(500, { errors: 'API service principal is not configured: set API_SERVICE_USER_NAME and API_SERVICE_USER_GROUPS (for example integration and SYSTEM) in .env, then restart' });
    }
}

function userFor(way: Way, req, res): SecureUser {
    switch (way) {
        case 'v1': {
            const named = namedUser(req);
            if (impersonationAllowed(req))
                return unrestrictedUser(named);
            if (named !== undefined)
                res.set('Warning', '299 - "userName is ignored: /api acts as its service account (API_IMPERSONATION=true allows it until 4.0)"');
            return serviceAccount(req);
        }
        case 'v1-admin':
            return unrestrictedUser(req.user?.userName);
        case 'v2':
        case 'v2-admin':
            return serviceAccount(req);
        case 'acting': {
            const userName = req.header('x-acting-user')?.trim();
            if (!userName)
                throw new Refused(400, { errors: 'missing "x-acting-user"', code: 'ACTING_USER_MISSING' });
            const userGroups = toList(req.header('x-acting-groups'));
            if (userGroups.some(group => REFUSED_GROUPS.includes(group.toUpperCase())))
                throw new Refused(403, { errors: `"x-acting-groups" can not have ${REFUSED_GROUPS.join(', ')}`, code: 'ACTING_GROUP_REFUSED' });
            // the tenant is the service account's, never the caller's; the security rules hold whatever the environment says
            const { tenantId, modelsOwner } = hostSettings(req).serviceAccount;
            return new SecureUser({ userName, userGroups, tenantId, modelsOwner }, { enforceSecurity: true });
        }
    }
}

/** The acting-user key's own check: off unless API_ACTING_USER_KEY is set, and API_KEY does not open it. */
function actingKey(req, res, next) {
    const key = hostSettings(req).actingUserKey;
    if (!key)
        return res.status(404).json({ errors: 'The task API is not turned on: API_ACTING_USER_KEY', code: 'TASK_API_OFF' });
    const presented = req.header('x-api-key');
    if (typeof presented !== 'string' || !timingSafeEqualStr(presented, key))
        return res.status(401).json({ errors: 'missing or invalid "x-api-key"', code: 'UNAUTHORIZED' });
    next();
}

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

/**
 * Why a call that changes something (POST, PUT, DELETE...) is refused as coming from another site, or null. A browser
 * says where a request comes from (Sec-Fetch-Site, Origin); a form another site posts says another site. A call from
 * no browser (a server, a script, the pages' own client) says neither, and is let through: it carries no visitor's
 * cookie unless its caller gave it one.
 */
export function crossSiteWrite(req): string | null {
    if (SAFE_METHODS.includes(req.method)) return null;
    const site = req.header('sec-fetch-site');
    if (site !== undefined && site !== 'same-origin' && site !== 'none')
        return `A ${site} request may not change anything with this site's sign-in: send it from this site, or with a key`;
    const origin = req.header('origin');
    if (origin !== undefined && origin !== 'null' && origin !== originOf(req))
        return `A request from ${origin} may not change anything with this site's sign-in: send it from this site, or with a key`;
    if (origin === 'null')
        return 'A request from no origin (a sandboxed page, a file) may not change anything with this site\'s sign-in';
    return null;
}

/**
 * v3's door: a user's token, or the service key; with the application's user manager, the application's credential
 * (its apiUser) or the service key. request.apiCredential says which ('token', 'host' or 'service').
 */
function v3Door(tokens: Tokens) {
    return async (req, res, next) => {
        // the application's user manager: the application's credentials, and no tokens of bpmn-web's
        const host = hostUserManager(req);
        if (host && req.header('x-api-key') === undefined) {
            // the application's credential may be its session cookie, which a browser sends with a form another site
            // posts: a call that changes something comes from this site, or from no browser at all (CSRF)
            const crossSite = crossSiteWrite(req);
            if (crossSite)
                return res.status(403).json({ error: { code: 'CROSS_SITE', message: crossSite } });
            try {
                const info = await host.apiUser?.(req);
                if (!info?.userName)
                    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: "Send the application's credential, or the service key (x-api-key)" } });
                req.apiUser = new SecureUser({ ...info, userGroups: info.userGroups ?? [] } as any, { enforceSecurity: true });
                req.apiCredential = 'host';
                return next();
            }
            catch (error) {
                return next(error);
            }
        }
        const bearer = host ? undefined : /^Bearer\s+(\S+)$/i.exec(req.header('authorization') ?? '')?.[1];
        if (bearer) {
            try {
                const holder = await tokens.holder(bearer);
                if (!holder)
                    return res.status(401).json({ error: { code: 'TOKEN_INVALID', message: 'The token is unknown, expired or revoked' } });
                req.apiUser = tokenUser(holder, hostSettings(req));
                req.apiCredential = 'token';
                // a person's AI link: its level (aiAccess.ts); v3's routes check it
                req.apiScope = holder.scope;
                return next();
            }
            catch (error) {
                return next(error);
            }
        }
        const key = hostSettings(req).apiKey, presented = req.header('x-api-key');
        if (!key)
            return res.status(500).json({ error: { code: 'NOT_CONFIGURED', message: 'server API_KEY is not configured' } });
        if (typeof presented !== 'string' || !timingSafeEqualStr(presented, key))
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: "Send a user's token (Authorization: Bearer) or the service key (x-api-key)" } });
        try {
            req.apiUser = serviceAccount(req);
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
/** The address the client used (https behind a proxy). */
const originOf = req => `${String(req.get('x-forwarded-proto') ?? req.protocol).split(',')[0].trim()}://${req.get('x-forwarded-host') ?? req.get('host')}`;

/** The routes of /api and /api2 called since this process started: each is logged once, to see who still uses them. */
const deprecatedSeen = new Set<string>();

/**
 * /api (v1) and /api2 (v2) are frozen (docs/design/api-v3.md): fixes only, through the shared operations, until they go
 * (v1 at 4.0). Their answers say so (Deprecation, and the API's document as their successor), and each of their routes
 * is logged once when it is first called.
 */
export function deprecated(req, res, next) {
    res.set('Deprecation', 'true');
    res.set('Link', `<${originOf(req)}/api/v3/openapi.json>; rel="successor-version"`);
    const route = `${req.method} ${req.baseUrl}${req.path}`.replace(/\/[0-9a-f-]{16,}(?=\/|$)/gi, '/{id}');
    if (!deprecatedSeen.has(route)) {
        deprecatedSeen.add(route);
        console.warn(`[api] ${route}: a deprecated API (until 4.0); the API is /api/v3`);
    }
    next();
}

export function door(way: Way, tokens?: Tokens) {
    if (way === 'v3')
        return v3Door(tokens);
    const checkKey = way === 'acting' ? actingKey : apiKeyAuth;
    return (req, res, next) => deprecated(req, res, () => checkKey(req, res, () => {
        try {
            req.apiUser = userFor(way, req, res);
        }
        catch (error) {
            if (error instanceof Refused)
                return res.status(error.status).json(error.body);
            return next(error);
        }
        next();
    }));
}
