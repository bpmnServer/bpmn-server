import crypto from 'node:crypto';
import { SecureUser } from '../../index.js';

/** The groups an application can not give its users (by a token, or the acting-user key): it can not make an administrator. */
export const REFUSED_GROUPS = ['SYSTEM', 'ADMIN', 'DESIGNER'];

/*
 * User tokens (docs/design/api-v3.md, decision 2): an application's back end asks, with the service key, for a token
 * that stands for one of its users; every call with `Authorization: Bearer <token>` then acts as that user, with their
 * groups and the security rules. A token is random; the store keeps its SHA-256, never the token, in a collection of
 * its own (wf_tokens) through the storage port, so it outlives a restart and holds for every server on the database.
 */
const COLLECTION = 'wf_tokens';
export const DEFAULT_MINUTES = 15, MAX_MINUTES = 24 * 60;

/** What a token may do beyond its user's rights: nothing (no scope); a person's AI link has its level (aiAccess.ts). */
export type TokenScope = 'work' | 'design' | 'administer';
export const SCOPES: TokenScope[] = ['work', 'design', 'administer'];

export interface TokenHolder { userName: string; groups: string[]; issuedBy: string; issuedAt: string; expiresAt: string; scope?: TokenScope }

export class TokenError extends Error {
    constructor(readonly status: number, message: string, readonly code: string) { super(message); }
}

const hash = (token: string) => crypto.createHash('sha256').update(token).digest('hex');
const nowIso = (now: number) => new Date(now).toISOString();

export class Tokens {
    constructor(private readonly server) { }

    private get store() { return this.server.documentStore ?? this.server.dataStore.db; }
    private get database() { return ((this.server.configuration.database as any)?.MongoDB ?? { db: 'bpmn' }).db; }

    async install() {
        await this.store.createIndex(this.database, COLLECTION, { hash: 1 }, { unique: true });
        await this.store.createIndex(this.database, COLLECTION, { userName: 1 });
    }

    /**
     * A token for this user: { token, expiresAt }. An application may not make an administrator: groups SYSTEM, ADMIN
     * and DESIGNER are refused, unless the token is a person's own (issuedBy their name, from a signed-in page).
     */
    async issue({ userName, groups = [], minutes = DEFAULT_MINUTES }, issuedBy: string, { own = false, now = Date.now(), scope }: { own?: boolean, now?: number, scope?: TokenScope } = {}) {
        if (typeof userName !== 'string' || !userName.trim())
            throw new TokenError(400, 'userName is required', 'BAD_USER');
        if (!Array.isArray(groups) || groups.some(g => typeof g !== 'string'))
            throw new TokenError(400, 'groups is a list of names', 'BAD_GROUPS');
        if (!own && groups.some(g => REFUSED_GROUPS.includes(g.toUpperCase())))
            throw new TokenError(403, `a token can not have ${REFUSED_GROUPS.join(', ')}`, 'GROUP_REFUSED');
        minutes = Number(minutes);
        if (!Number.isFinite(minutes) || minutes <= 0 || minutes > MAX_MINUTES)
            throw new TokenError(400, `minutes is from 1 to ${MAX_MINUTES}`, 'BAD_MINUTES');
        await this.store.remove(this.database, COLLECTION, { expiresAt: { $lt: nowIso(now) } });
        const token = `bpt_${crypto.randomBytes(32).toString('base64url')}`;
        const expiresAt = nowIso(now + minutes * 60_000);
        await this.store.insert(this.database, COLLECTION, [{
            hash: hash(token), userName: userName.trim(), groups, issuedBy, issuedAt: nowIso(now), expiresAt, ...(scope ? { scope } : {}),
        }]);
        return { token, expiresAt, userName: userName.trim(), groups, ...(scope ? { scope } : {}) };
    }

    /** Whom a token stands for, if it is one and has not expired or been revoked. */
    async holder(token: unknown, now = Date.now()): Promise<TokenHolder | undefined> {
        if (typeof token !== 'string' || !token.startsWith('bpt_')) return undefined;
        const [found] = await this.store.find(this.database, COLLECTION, { hash: hash(token) });
        if (!found) return undefined;
        if (found.expiresAt <= nowIso(now)) {
            await this.store.remove(this.database, COLLECTION, { hash: found.hash });
            return undefined;
        }
        const { userName, groups, issuedBy, issuedAt, expiresAt, scope } = found;
        return { userName, groups, issuedBy, issuedAt, expiresAt, ...(scope ? { scope } : {}) };
    }

    /** This token goes (a page's, when its person signs out). */
    async revokeToken(token: string): Promise<void> {
        if (typeof token === 'string') await this.store.remove(this.database, COLLECTION, { hash: hash(token) });
    }

    /** Every token of this user goes: they signed out, were disabled, or asked. How many went. */
    async revoke(userName: string, { scoped = false } = {}): Promise<number> {
        // scoped: their AI links only (the tokens with a level), not the pages' or an application's
        const query = scoped ? { userName, scope: { $in: SCOPES } } : { userName };
        return (await this.store.remove(this.database, COLLECTION, query)).deletedCount;
    }
}

/** The user a token stands for, as the API acts: their name and groups, the security rules on. */
export function tokenUser(holder: TokenHolder): SecureUser {
    return new SecureUser({ userName: holder.userName, userGroups: holder.groups, tenantId: process.env.API_SERVICE_TENANT_ID, modelsOwner: process.env.API_SERVICE_MODELS_OWNER } as any, { enforceSecurity: true });
}
