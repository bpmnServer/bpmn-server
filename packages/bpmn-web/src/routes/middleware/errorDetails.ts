import { randomUUID } from 'node:crypto';

/**
 * Production error responses: enough detail to diagnose (status, error type, message,
 * request, reference id) without leaking secrets. Stack traces stay in the server log.
 */

const REDACTED = '[redacted]';
const MAX_MESSAGE = 500;

const SECRET_PATTERNS: [RegExp, string][] = [
    // credentials embedded in URLs, e.g. mongodb://user:pass@host
    [/([a-z][a-z0-9+.-]*:\/\/)[^\s/@:]+:[^\s/@]+@/gi, `$1${REDACTED}@`],
    // Authorization header values
    [/\b(bearer|basic)\s+[A-Za-z0-9._~+/=-]+/gi, `$1 ${REDACTED}`],
    // JWTs
    [/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*/g, REDACTED],
    // key=value / key: value pairs with sensitive names
    [/\b([\w-]*(?:password|passwd|pwd|secret|token|api[_-]?key|apikey|auth|cookie|session|credential|private[_-]?key)[\w-]*)(["']?\s*[:=]\s*["']?)[^\s"',;&}]+/gi, `$1$2${REDACTED}`],
    // long opaque strings (keys, hashes)
    [/\b[A-Za-z0-9+/_-]{40,}={0,2}/g, REDACTED],
];

export function redactSecrets(text: string): string {
    let out = text;
    for (const [pattern, replacement] of SECRET_PATTERNS)
        out = out.replace(pattern, replacement);
    // values of the server's own sensitive env vars, wherever they appear
    for (const [name, value] of Object.entries(process.env)) {
        if (value && value.length >= 6 && /PASS|SECRET|TOKEN|KEY|DB_URL|URI/i.test(name))
            out = out.split(value).join(REDACTED);
    }
    return out.length > MAX_MESSAGE ? out.slice(0, MAX_MESSAGE) + '…' : out;
}

export interface ErrorDetails {
    status: number;
    error: string;
    message: string;
    code?: string;
    method: string;
    path: string;
    reference: string;
    time: string;
}

export function describeError(err, req, res?): ErrorDetails {
    // middleware such as lusca (CSRF) sets the response status, then passes a plain Error
    const raw = err?.status ?? err?.statusCode ?? (res?.statusCode >= 400 ? res.statusCode : undefined);
    const status = Number.isInteger(raw) && raw >= 400 && raw <= 599 ? raw : 500;
    const message = err instanceof Error ? err.message : (typeof err === 'string' ? err : 'Unexpected error');
    const details: ErrorDetails = {
        status,
        error: redactSecrets(String(err?.name || 'Error')),
        message: redactSecrets(message || 'Unexpected error'),
        method: req.method,
        path: String(req.originalUrl || req.url || '').split('?')[0],   // query strings may carry secrets
        reference: randomUUID(),
        time: new Date().toISOString(),
    };
    if (err?.code !== undefined) details.code = redactSecrets(String(err.code));
    return details;
}

function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

export function errorDetailsHandler(err, req, res, next): void {
    const details = describeError(err, req, res);
    console.error(`[error ${details.reference}] ${details.method} ${details.path}`, err);
    if (res.headersSent) {
        next(err);
        return;
    }
    res.status(details.status);
    const wantsJson = /^(\/admin)?\/api2?(\/|$)/.test(details.path) || req.xhr || !req.accepts?.('html');
    if (wantsJson) {
        res.json(details);
        return;
    }
    const rows = Object.entries(details)
        .map(([k, v]) => `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(String(v))}</td></tr>`).join('');
    res.type('html').send(`<!doctype html><html><head><meta charset="utf-8"><title>Error ${details.status}</title>` +
        `<style>body{font-family:sans-serif;margin:2rem}th{text-align:left;padding-right:1rem;vertical-align:top}td{font-family:monospace;white-space:pre-wrap}</style>` +
        `</head><body><h1>Error ${details.status}: ${escapeHtml(details.error)}</h1><table>${rows}</table>` +
        `<p>Quote the reference when reporting this problem; full details are in the server log.</p></body></html>`);
}
