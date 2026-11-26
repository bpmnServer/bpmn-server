import crypto from 'node:crypto';
import { REFUSED_GROUPS } from './tokens.js';

/*
 * Handoffs (docs/docs/handoffs.md): the application hands a person it has signed in to one page of OWF, with no second
 * sign-in. Its back end asks, with the service key, for a handoff: a link good for one visit, within a minute or so, for
 * one person and one page. The person's browser opens the link; OWF trades it for a short session that opens that page and
 * nothing else (routes/embed.ts). The link is random and the store keeps its SHA-256, never the link, in a collection of its
 * own (wf_handoffs) through the storage port, as the tokens are.
 *
 * The page is a task's form (`{ type: 'task', id }`) or a process's start form (`{ type: 'start', process, startNodeId? }`).
 *
 * A handoff is not a token: a token is a person's credential for API calls and lasts minutes to a day; a handoff is
 * spent by its first visit, and what it leads to is one page.
 */
const COLLECTION = 'wf_handoffs';
export const DEFAULT_HANDOFF_MINUTES = 1, MAX_HANDOFF_MINUTES = 5;

export type HandoffPage = { type: 'task'; id: string } | { type: 'start'; process: string; startNodeId?: string };
/** What a spent handoff gives: whom the page is for, which page, and where to go when it is done. */
export interface HandoffHolder { userName: string; groups: string[]; page: HandoffPage; returnTo?: string; issuedBy: string }

export class HandoffError extends Error {
    constructor(readonly status: number, message: string, readonly code: string) { super(message); }
}

const hash = (secret: string) => crypto.createHash('sha256').update(secret).digest('hex');
const nowIso = (now: number) => new Date(now).toISOString();
/** Where a person goes when done: an address of the application's (http or https), or a path on this site. */
const isReturnTo = (value: unknown): value is string => typeof value === 'string' && value.length <= 2000
    && (/^https?:\/\/[^\s]+$/i.test(value) || (value.startsWith('/') && !value.startsWith('//')));

/** A name that is a part of an address: no separator, no `..`, no control characters. */
const plain = (value: unknown, max = 128): value is string => typeof value === 'string' && value.trim() !== '' && value.length <= max
    && !/[\\/?#\u0000-\u001f]/.test(value) && !value.includes('..');

/** The page as it is kept, or undefined when it is not one a handoff opens. */
export function pageOf(page: any): HandoffPage | undefined {
    if (page?.type === 'task' && plain(page.id, 200)) return { type: 'task', id: page.id.trim() };
    if (page?.type === 'start' && plain(page.process) && (page.startNodeId === undefined || plain(page.startNodeId)))
        return { type: 'start', process: page.process.trim(), ...(page.startNodeId ? { startNodeId: page.startNodeId.trim() } : {}) };
    return undefined;
}

export class Handoffs {
    constructor(private readonly server) { }

    private get store() { return this.server.documentStore ?? this.server.dataStore.db; }
    private get database() { return ((this.server.configuration.database as any)?.MongoDB ?? { db: 'bpmn' }).db; }

    async install() {
        await this.store.createIndex(this.database, COLLECTION, { hash: 1 }, { unique: true });
    }

    /**
     * A handoff for this person and page: { handoff, url, expiresAt }. `site` is where this server is, as the application
     * reaches it (the link begins with it). The groups an application can not give (SYSTEM, ADMIN, DESIGNER) are refused,
     * as for a token.
     */
    async issue(input: any, issuedBy: string, site: string, now = Date.now()) {
        const { userName, groups = [], page, returnTo, minutes = DEFAULT_HANDOFF_MINUTES } = input ?? {};
        if (typeof userName !== 'string' || !userName.trim())
            throw new HandoffError(400, 'userName is required', 'BAD_USER');
        if (!Array.isArray(groups) || groups.some(g => typeof g !== 'string'))
            throw new HandoffError(400, 'groups is a list of names', 'BAD_GROUPS');
        if (groups.some(g => REFUSED_GROUPS.includes(g.toUpperCase())))
            throw new HandoffError(403, `a handoff can not have ${REFUSED_GROUPS.join(', ')}`, 'GROUP_REFUSED');
        const stored = pageOf(page);
        if (!stored)
            throw new HandoffError(400, "page is { type: 'task', id } (the task's id) or { type: 'start', process, startNodeId? }", 'BAD_PAGE');
        if (returnTo !== undefined && !isReturnTo(returnTo))
            throw new HandoffError(400, 'returnTo is an http or https address, or a path', 'BAD_RETURN');
        const minutesNumber = Number(minutes);
        if (!Number.isFinite(minutesNumber) || minutesNumber <= 0 || minutesNumber > MAX_HANDOFF_MINUTES)
            throw new HandoffError(400, `minutes is from 1 to ${MAX_HANDOFF_MINUTES}`, 'BAD_MINUTES');
        await this.store.remove(this.database, COLLECTION, { expiresAt: { $lt: nowIso(now) } });
        const handoff = `bph_${crypto.randomBytes(32).toString('base64url')}`;
        const expiresAt = nowIso(now + minutesNumber * 60_000);
        await this.store.insert(this.database, COLLECTION, [{
            hash: hash(handoff), userName: userName.trim(), groups, page: stored, ...(returnTo ? { returnTo } : {}),
            issuedBy, issuedAt: nowIso(now), expiresAt,
        }]);
        const where = stored.type === 'task' ? `task/${encodeURIComponent(stored.id)}` : `start/${encodeURIComponent(stored.process)}`;
        const url = `${site.replace(/\/+$/, '')}/embed/${where}?handoff=${handoff}`;
        return { handoff, url, expiresAt, userName: userName.trim(), page: stored };
    }

    /**
     * The handoff spent: whom it is for and which page, or undefined when it is not one, has expired, or has been used. Used
     * once: it is removed as it is read, and only the visit that removed it has it (two at the same moment: one).
     */
    async redeem(handoff: unknown, now = Date.now()): Promise<HandoffHolder | undefined> {
        if (typeof handoff !== 'string' || !handoff.startsWith('bph_')) return undefined;
        const [found] = await this.store.find(this.database, COLLECTION, { hash: hash(handoff) });
        if (!found) return undefined;
        const taken = await this.store.remove(this.database, COLLECTION, { hash: found.hash });
        if (!(taken?.deletedCount >= 1) || found.expiresAt <= nowIso(now)) return undefined;
        const { userName, groups, page, returnTo, issuedBy } = found;
        return { userName, groups, page, ...(returnTo ? { returnTo } : {}), issuedBy };
    }
}
