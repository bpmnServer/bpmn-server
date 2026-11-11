/**
 * The first start of a server with no users: rather than an admin/admin anyone can guess, the pages ask for the administrator.
 * Whoever reaches a new server first could otherwise make themselves its administrator, so the page asks for a token the server
 * prints where it runs: who can read its console, owns it. ADMIN_PASSWORD makes the administrator at setup instead, as before.
 */
import crypto from 'node:crypto';

/**
 * Each server's token (docs/design/multi-app-tenants.md §8.1: no process-wide state for what is a server's), by its
 * Express app (`req.app`, `webApp.app`); one with none given, for a caller that has no app.
 */
const tokens = new WeakMap<object, string>();
const NO_APP = {};
const of = (app?: object) => app ?? NO_APP;

/** Whether the server waits for its administrator. */
export const firstRunPending = (app?: object) => tokens.has(of(app));

/** The server has no users: from now on its pages ask for the administrator, with this token. */
export function beginFirstRun(app?: object): string {
    const token = crypto.randomBytes(18).toString('base64url');
    tokens.set(of(app), token);
    const port = process.env.PORT || '3000';
    console.log([
        '',
        '  No users yet. Open the server in a browser to create its administrator:',
        `    http://localhost:${port}/setup`,
        `  Setup token: ${token}`,
        '',
    ].join('\n'));
    return token;
}

/** The token as given, compared in constant time. */
export function isSetupToken(given: unknown, app?: object): boolean {
    const token = tokens.get(of(app));
    if (token === undefined || typeof given !== 'string') return false;
    const hash = (text: string) => crypto.createHash('sha256').update(text).digest();
    return crypto.timingSafeEqual(hash(given.trim()), hash(token));
}

/** The administrator exists: the pages go back to signing in. */
export function endFirstRun(app?: object) {
    tokens.delete(of(app));
}
