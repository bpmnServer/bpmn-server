// What the Test tabs share: the model editor's (TestPanel.js) and the decision editor's (DecisionTestPanel.js).

export const RUNS_KEPT = 20;
export const CHECK_OPS = ['=', '<>', '>', '<', '>=', '<='];

export function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === null || value === false) continue;
        if (key === 'class') node.className = value;
        else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
        else if (key === 'value') node.value = value;
        else node.setAttribute(key, value === true ? '' : value);
    }
    for (const child of children.flat(Infinity))
        if (child !== undefined && child !== null && child !== false)
            node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    return node;
}

/** Short JSON on one line, longer pretty-printed. */
export const json = value => {
    const line = JSON.stringify(value ?? {});
    return line.length <= 80 ? line : JSON.stringify(value ?? {}, null, 2);
};

/** An object typed as JSON: { value } or { error }. */
export function parse(text) {
    if (!text.trim()) return { value: {} };
    try {
        const value = JSON.parse(text);
        if (!value || typeof value !== 'object' || Array.isArray(value)) return { error: 'Must be an object: { "field": value }' };
        return { value };
    } catch (err) {
        return { error: err.message };
    }
}

/** A value typed in: JSON when it reads as JSON (5, true, "x", {..}), else the text itself. */
export function parseValue(text) {
    try { return JSON.parse(text); } catch { return text; }
}
export const showValue = value => typeof value === 'string' ? value : JSON.stringify(value ?? '');

/** A request to the server: its JSON answer, or an Error with the route's message. */
export async function request(method, url, body, options = {}) {
    const response = await fetch(url, {
        method, headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined, ...options
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(data.error || `${response.status} ${response.statusText}`);
        error.instance = data.instance;
        error.reported = Boolean(data.error);      // the route answered (not a 404 for a route the server lacks)
        throw error;
    }
    return data;
}
