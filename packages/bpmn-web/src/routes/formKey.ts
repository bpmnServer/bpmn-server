/**
 * Form keys (docs/design/form-keys.md): a user task or a start event may name the application's own page instead of
 * listing fields for owf to draw. The key is the page's address. owf sends the person there with identifiers only —
 * never case data, which the page reads itself through API v3, as the person.
 */

/** A form key owf should redirect to, or null when it has none (the task's fields are drawn instead). */
export function hasFormKey(formKey: unknown): formKey is string {
    return typeof formKey === 'string' && formKey.trim() !== '';
}

/** The address a form key names; null when it is blank, and the caller falls back to the task's fields (§3). */
export function formKeyAddress(formKey: string): string | null {
    const address = String(formKey ?? '').trim();
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
