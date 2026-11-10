import { Tokens, type TokenScope } from './api/tokens.js';
import { canDesign, isAdminGroups } from '../userAccess/roles.js';

/*
 * A person's link for their AI agent (/ai/key): an API token (routes/api/tokens.ts) that stands for them, with their
 * groups, and a level, chosen when the link is made, among those they have (docs/design/setup-wizard.md §4):
 *
 *   work         start processes, their tasks, their instances and the Rationale
 *   design       and models and their tests (a designer's, an administrator's)
 *   administer   and the settings, read (secrets masked), and their checks (an administrator's); it changes nothing
 *
 * A link never has more than its level, nor than its person. It expires (30 minutes, AI_KEY_TTL_GROUPS by group; an
 * administer link 10 at most), and goes when its person signs out or revokes their links. AI_ACCESS, optional, says
 * which levels this server offers: off, or some of work,design,administer (unset: all).
 */
// written out, not tokens.ts's SCOPES: this module is loaded while tokens.ts may still be loading (index.js, app.ts)
export const LEVELS: TokenScope[] = ['work', 'design', 'administer'];
const ADMINISTER_MINUTES = 10;

/** The levels this server offers. */
export function offeredLevels(): TokenScope[] {
    const setting = process.env.AI_ACCESS?.trim().toLowerCase();
    if (!setting) return LEVELS;
    if (setting === 'off' || setting === 'none') return [];
    const asked = setting.split(',').map(level => level.trim());
    return LEVELS.filter(level => asked.includes(level));
}

/** The levels this person may give a link: as far as their rights go, and the server offers. */
export function levelsFor(user: { userName: string, userGroups?: string[] }): TokenScope[] {
    const theirs: TokenScope[] = ['work'];
    if (canDesign(user)) theirs.push('design');
    if (isAdminGroups(user.userGroups)) theirs.push('administer');
    return theirs.filter(level => offeredLevels().includes(level));
}

/**
 * How long a link lasts, in minutes: AI_KEY_TTL_GROUPS='{"ADMIN":10,"staff":60}' by group (several matching: the
 * shortest; none: 30); an administer link 10 at most.
 */
export function linkMinutes(groups: string[] = [], level: TokenScope = 'work'): number {
    let limits: Record<string, unknown> = {};
    try { limits = JSON.parse(process.env.AI_KEY_TTL_GROUPS ?? '{}'); } catch { /* the default */ }
    const matches = groups.map(group => Number(limits[group])).filter(value => Number.isFinite(value) && value > 0);
    const minutes = matches.length ? Math.min(...matches) : 30;
    return level === 'administer' ? Math.min(minutes, ADMINISTER_MINUTES) : minutes;
}

/** A link for this person at this level: { key, expiresAt, level, minutes, groups }; undefined if they may not have it. */
export async function issueAiLink(server, user: { userName: string, userGroups?: string[] }, level: TokenScope) {
    if (!levelsFor(user).includes(level)) return undefined;
    const groups = Array.isArray(user.userGroups) ? [...user.userGroups] : [];
    const minutes = linkMinutes(groups, level);
    const issued = await new Tokens(server).issue({ userName: user.userName, groups, minutes }, user.userName, { own: true, scope: level });
    return { key: issued.token, expiresAt: issued.expiresAt, level, minutes, groups };
}

/** Whom a link stands for, at which level, if it is one and has not expired or been revoked. */
export async function aiLinkHolder(server, key: unknown) {
    const holder = await new Tokens(server).holder(key);
    return holder?.scope ? holder : undefined;
}

/** Every link of this person goes (they asked; signing out ends all their tokens). How many went. */
export const revokeAiLinks = (server, userName: string) => new Tokens(server).revoke(userName, { scoped: true });
