/**
 * The first start of a server with no users: rather than an admin/admin anyone can guess, the pages ask for the administrator.
 * Whoever reaches a new server first could otherwise make themselves its administrator, so the page asks for a token the server
 * prints where it runs: who can read its console, owns it. ADMIN_PASSWORD makes the administrator at setup instead, as before.
 */
import crypto from 'node:crypto';

let token: string | null = null;

/** Whether the server waits for its administrator. */
export const firstRunPending = () => token !== null;

/** The server has no users: from now on its pages ask for the administrator, with this token. */
export function beginFirstRun(): string {
    token = crypto.randomBytes(18).toString('base64url');
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
export function isSetupToken(given: unknown): boolean {
    if (token === null || typeof given !== 'string') return false;
    const hash = (text: string) => crypto.createHash('sha256').update(text).digest();
    return crypto.timingSafeEqual(hash(given.trim()), hash(token));
}

/** The administrator exists: the pages go back to signing in. */
export function endFirstRun() {
    token = null;
}
