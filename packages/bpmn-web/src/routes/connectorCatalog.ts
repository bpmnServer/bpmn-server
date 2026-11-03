/**
 * The connector catalog: REST APIs an administrator can add as connectors in one step (catalog/connectors/
 * api-catalog.json in bpmnServer/bpmn-server): `[{ id, name, url (the OpenAPI document), defaultAuth }]`.
 * CONNECTOR_CATALOG_URL, a web address or a local file, names another one. An administrator can still add
 * any API that is not in it, from its document.
 */
import FS from 'node:fs';

export const DEFAULT_CONNECTOR_CATALOG = 'https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/catalog/connectors/api-catalog.json';

export interface ConnectorCatalogEntry {
    id: string;
    name: string;
    /** the API's OpenAPI document */
    url: string;
    /** how the API is usually authorized: bearer, basic, apiKey */
    defaultAuth?: string;
    description?: string;
}

export const connectorCatalogLocation = () => process.env.CONNECTOR_CATALOG_URL || DEFAULT_CONNECTOR_CATALOG;

let cached: { at: number; location: string; entries: ConnectorCatalogEntry[] } | null = null;

/** The catalog's entries, by name; read again after five minutes or when CONNECTOR_CATALOG_URL changes. */
export async function loadConnectorCatalog(): Promise<ConnectorCatalogEntry[]> {
    const location = connectorCatalogLocation();
    if (cached && cached.location === location && Date.now() - cached.at < 5 * 60 * 1000)
        return cached.entries;
    let text: string;
    if (/^https?:\/\//i.test(location)) {
        const response = await fetch(location, { signal: AbortSignal.timeout(15_000) });
        if (!response.ok)
            throw new Error(`The connector catalog could not be read from ${location}: HTTP ${response.status}`);
        text = await response.text();
    }
    else
        text = FS.readFileSync(location, 'utf8');
    const list = JSON.parse(text);
    if (!Array.isArray(list))
        throw new Error(`${location} is not a connector catalog: a list of { id, name, url }`);
    const entries = list
        .filter(e => e && typeof e.id === 'string' && typeof e.url === 'string' && /^https?:\/\//i.test(e.url))
        .map(e => ({ id: e.id, name: e.name || e.id, url: e.url, defaultAuth: e.defaultAuth, description: e.description }))
        .sort((a, b) => a.name.localeCompare(b.name));
    cached = { at: Date.now(), location, entries };
    return entries;
}
