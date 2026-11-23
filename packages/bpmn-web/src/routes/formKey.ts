/**
 * Form keys (docs/design/form-keys.md): a user task or a start event may name the application's own page instead of
 * listing fields for owf to draw. The key is the page's address, and it may hold an expression
 * (`${appVars.hrForms}/assignment`) worked out from the application's contract, so the model carries no one
 * deployment's routes. owf resolves the address and sends the person there with identifiers only — never case data,
 * which the page reads itself through API v3, as the person.
 */
import { appVarsFor } from 'bpmn-server';

/** A form key owf should redirect to, or null when it has none (the task's fields are drawn instead). */
export function hasFormKey(formKey: unknown): formKey is string {
    return typeof formKey === 'string' && formKey.trim() !== '';
}

const EXPRESSION = /\$\{\s*appVars\.([A-Za-z_$][\w$]*)\s*\}/g;

/**
 * The address a form key names, with its `${appVars.<name>}` expressions worked out from the application's variables.
 * Null when the key resolves to nothing (an unset variable): the caller falls back to the task's fields (§3).
 */
export async function formKeyAddress(formKey: string, server: any, context: Record<string, any> = {}): Promise<string | null> {
    const names = [...formKey.matchAll(EXPRESSION)].map(([, name]) => name);
    let address = formKey.trim();
    if (names.length) {
        const vars = await appVarsFor(server?.appDelegate, context, [...new Set(names)]).catch(() => ({}));
        address = address.replace(EXPRESSION, (_, name) => {
            const value = (vars as any)[name];
            return value === undefined || value === null ? '' : String(value);
        });
    }
    // An expression that worked out to nothing can leave the address empty, or leave only the model's own path
    // ("/assignment"): either way there is still a path to go to, so only an empty one falls back (§3).
    address = address.trim();
    return address === '' ? null : address;
}

/**
 * The address owf sends the person to: the page's own, plus who is asking. Identifiers only (§4) — a task by its
 * instance and item, a start event by its process and element — and `returnTo`, where the person was.
 */
export function withIdentifiers(address: string, what: { instanceId?: string; itemId?: string; processName?: string; startNodeId?: string; returnTo?: string }): string {
    const [path, existing = ''] = address.split('?', 2);
    const query = new URLSearchParams(existing);
    if (what.itemId) {
        if (what.instanceId) query.set('instance', what.instanceId);
        query.set('item', what.itemId);
    } else if (what.processName) {
        query.set('process', what.processName);
        if (what.startNodeId) query.set('start', what.startNodeId);
    }
    if (what.returnTo) query.set('returnTo', what.returnTo);
    const text = query.toString();
    return text ? `${path}?${text}` : path;
}
