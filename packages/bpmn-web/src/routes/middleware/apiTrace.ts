import fs from 'node:fs';

/*
 * API_TRACE=<file>: every call to the APIs, one JSON line each, to replay what a client (an AI agent, an
 * application) sent and got back: when, how long, the method and path, which credential (its kind, never its value),
 * the acting user, the status, and the request and response bodies, cut at API_TRACE_MAX characters (default 4000),
 * with the values of any field named like a password, key, token or secret replaced. Off without API_TRACE.
 */
// a field named as a secret: password, apiKey, x-api-key, accessToken, ... (not "passed", not "tokenId")
const SECRET = /(^|[-_])?(pass(word)?|passwd|secret|token|api[-_]?key|key|authorization)$/i;

function redact(value, depth = 0) {
    if (depth > 8 || value === null || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map(v => redact(v, depth + 1));
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, SECRET.test(k) ? '***' : redact(v, depth + 1)]));
}

function cut(value, max: number) {
    if (value === undefined) return undefined;
    const text = typeof value === 'string' ? value : JSON.stringify(redact(value));
    return text.length > max ? `${text.slice(0, max)}… (${text.length} characters)` : text;
}

export function apiTrace() {
    const file = process.env.API_TRACE;
    if (!file) return (req, res, next) => next();
    const max = Number(process.env.API_TRACE_MAX) || 4000;
    return (req, res, next) => {
        const began = Date.now();
        let body;
        const json = res.json.bind(res), send = res.send.bind(res);
        res.json = value => { body ??= value; return json(value); };
        res.send = value => { body ??= value; return send(value); };
        res.on('finish', () => {
            const credential = req.get('x-api-key') ? 'x-api-key' : req.get('authorization') ? 'authorization' : 'none';
            const multipart = /multipart/i.test(req.get('content-type') ?? '');
            const line = {
                at: new Date(began).toISOString(), ms: Date.now() - began,
                method: req.method, path: req.originalUrl, status: res.statusCode,
                credential, actingUser: req.get('x-acting-user') ?? undefined,
                request: multipart ? '(multipart)' : cut(req.body && Object.keys(req.body).length ? req.body : undefined, max),
                response: cut(body, max),
            };
            fs.appendFile(file, JSON.stringify(line) + '\n', () => { });
        });
        next();
    };
}
