import crypto from 'node:crypto';
import { SecureUser } from 'bpmn-server';

/*
 * Keys for AI agents: a signed-in person gets a link (/ai/<key>) and hands it to their agent. The key stands for that
 * person, with their groups: on /api2 the agent acts as them, can do what they may, and no more; it expires (30 minutes,
 * or AI_KEY_TTL_GROUPS), and goes when they sign out or revoke it.
 *
 * A key is random; the server keeps its SHA-256, never the key. Kept in this process's memory: a restart drops the keys
 * (they last minutes), and several hosts behind one address would each need the agent's own key.
 */
export interface AiKeyHolder { userName: string; groups: string[]; expiresAt: number; issuedAt: number }

const held = new Map<string, AiKeyHolder>();
const hash = (key: string) => crypto.createHash('sha256').update(key).digest('hex');

/**
 * How long a key lasts, by the person's groups: AI_KEY_TTL_GROUPS='{"ADMIN":10,"staff":60}' (minutes); several
 * matching groups: the shortest; none: 30 minutes.
 */
export function aiKeyTtlMs(groups: string[] = []): number {
    let limits: Record<string, unknown> = {};
    try { limits = JSON.parse(process.env.AI_KEY_TTL_GROUPS ?? '{}'); } catch { /* the default */ }
    const matches = groups.map(group => Number(limits[group])).filter(value => Number.isFinite(value) && value > 0);
    return (matches.length ? Math.min(...matches) : 30) * 60 * 1000;
}

/** A key for this person: it stands for them, with their groups. */
export function issueAiKey(user: { userName: string; userGroups?: string[] }, now = Date.now()) {
    for (const [h, k] of held) if (k.expiresAt <= now) held.delete(h);
    const groups = Array.isArray(user.userGroups) ? [...user.userGroups] : [];
    const ttlMs = aiKeyTtlMs(groups);
    const key = `ai_${crypto.randomBytes(32).toString('base64url')}`;
    held.set(hash(key), { userName: user.userName, groups, issuedAt: now, expiresAt: now + ttlMs });
    return { key, expiresAt: new Date(now + ttlMs).toISOString(), ttlMs, groups };
}

/** Whom a key stands for, if it is one, and not expired or revoked. */
export function aiKeyHolder(candidate: unknown, now = Date.now()): AiKeyHolder | undefined {
    if (typeof candidate !== 'string' || !candidate.startsWith('ai_')) return undefined;
    const h = hash(candidate);
    const holder = held.get(h);
    if (!holder) return undefined;
    if (holder.expiresAt <= now) { held.delete(h); return undefined; }
    return holder;
}

/** Every key of this person goes: they signed out, or asked. How many went. */
export function revokeAiKeys(userName: string): number {
    let n = 0;
    for (const [h, k] of held) if (k.userName === userName) { held.delete(h); n++; }
    return n;
}

/** The person a key stands for, as the API acts: their name and groups. */
export function aiKeyUser(holder: AiKeyHolder): SecureUser {
    return new SecureUser({ userName: holder.userName, userGroups: holder.groups, tenantId: null });
}
