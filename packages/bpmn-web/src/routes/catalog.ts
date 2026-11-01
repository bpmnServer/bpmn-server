/**
 * The model catalog: a catalog.json (format bpmn-server-catalog) and the files it names, read from
 * CATALOG_URL, a web address or a local folder (default https://catalog.omniworkflow.com/).
 */
import FS from 'node:fs';
import path from 'node:path';

export const DEFAULT_CATALOG = 'https://catalog.omniworkflow.com/';

export interface CatalogEntry {
    id: string;
    name: string;
    description?: string;
    tags?: string[];
    bpmn: string;
    svg?: string | null;
    sha256?: string;
    elements?: Record<string, number>;
    services?: string[];
    verify?: { errors: number; warnings: number; issues: { severity: string; code: string; elementId?: string; message: string }[] };
}
export interface CatalogConnector {
    id: string;
    name: string;
    url: string;
    defaultAuth?: string;
}
export interface Catalog {
    format: string;
    version: number;
    updated?: string;
    entries: CatalogEntry[];
    connectors?: CatalogConnector[];
}

export const catalogLocation = () => process.env.CATALOG_URL || DEFAULT_CATALOG;

/** A file of the catalog, by its path in catalog.json; only paths inside the catalog. */
export async function readCatalogFile(file: string): Promise<string> {
    if (typeof file !== 'string' || !file || file.split(/[\\/]/).includes('..') || path.isAbsolute(file))
        throw new Error(`not a catalog file: ${file}`);
    const base = catalogLocation();
    if (/^https?:\/\//i.test(base)) {
        const url = new URL(file, base.endsWith('/') ? base : base + '/');
        const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (!res.ok)
            throw new Error(`${url}: ${res.status} ${res.statusText}`);
        return await res.text();
    }
    return FS.readFileSync(path.join(base, file), 'utf8');
}

let cached: { at: number; location: string; catalog: Catalog } | null = null;

/** catalog.json, read again after five minutes or when CATALOG_URL changes. */
export async function loadCatalog(): Promise<Catalog> {
    const location = catalogLocation();
    if (cached && cached.location === location && Date.now() - cached.at < 5 * 60 * 1000)
        return cached.catalog;
    const catalog = JSON.parse(await readCatalogFile('catalog.json'));
    if (catalog?.format !== 'bpmn-server-catalog' || !Array.isArray(catalog.entries))
        throw new Error(`${location} is not a model catalog (catalog.json with format "bpmn-server-catalog")`);
    cached = { at: Date.now(), location, catalog };
    return catalog;
}

export async function findCatalogEntry(id: string): Promise<CatalogEntry> {
    const entry = (await loadCatalog()).entries.find(e => e.id === id);
    if (!entry)
        throw new Error(`the catalog has no model '${id}'`);
    return entry;
}
