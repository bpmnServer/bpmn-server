import { Tokens } from './tokens.js';

/*
 * The pages' client of API v3 (the 3.7 plan, part 3: the pages call the API like any client). A page acts as the person
 * signed in by calling /api/v3, on this server's own address, with a token for them: their own, issued by the server,
 * kept in their session until a minute before it expires, and gone when they sign out (Tokens.revoke). With no sign-in
 * (REQUIRE_AUTHENTICATION=false) the pages act as the system, as they did.
 */

export class ApiError extends Error {
    constructor(readonly status: number, readonly code: string, message: string) { super(message); }
}

const TOKEN_MINUTES = 60;

/** Whom the pages act for: the person signed in, else (no sign-in) the system. */
function pageUser(req): { userName: string, userGroups: string[] } {
    if (req.user?.userName) return { userName: req.user.userName, userGroups: req.user.userGroups ?? [] };
    if (process.env.REQUIRE_AUTHENTICATION === 'false') return { userName: 'system', userGroups: ['SYSTEM'] };
    throw new ApiError(401, 'UNAUTHORIZED', 'Not signed in');
}

/** A token for the page's user: the session's while it lasts, else a new one. */
async function tokenFor(req, server): Promise<string> {
    const user = pageUser(req);
    const held = req.session?.apiToken;
    if (held && held.userName === user.userName && Date.parse(held.expiresAt) - Date.now() > 60_000)
        return held.token;
    const issued = await new Tokens(server).issue({ userName: user.userName, groups: user.userGroups, minutes: TOKEN_MINUTES }, user.userName, { own: true });
    if (req.session) req.session.apiToken = { token: issued.token, expiresAt: issued.expiresAt, userName: user.userName };
    return issued.token;
}

/** API v3 as the page's user: get, post and delete, answering the JSON, or throwing an ApiError with its code. */
export async function pageApi(req, server) {
    const token = await tokenFor(req, server);
    const base = `http://127.0.0.1:${req.socket.localPort}/api/v3`;
    const call = async (method: string, path: string, body?: object) => {
        const res = await fetch(base + path, {
            method,
            headers: { authorization: `Bearer ${token}`, ...(body ? { 'content-type': 'application/json' } : {}) },
            body: body ? JSON.stringify(body) : undefined,
        });
        const answer: any = await res.json().catch(() => null);
        if (!res.ok)
            throw new ApiError(res.status, answer?.error?.code ?? 'API_ERROR', answer?.error?.message ?? `API v3 answered ${res.status}`);
        return answer;
    };
    return {
        get: (path: string) => call('GET', path),
        post: (path: string, body: object = {}) => call('POST', path, body),
        delete: (path: string) => call('DELETE', path),
    };
}
