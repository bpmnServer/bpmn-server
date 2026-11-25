/**
 * OpenAPI 3.0 and 3.1 documents, as connectors use them (docs/docs/connectors.md): parsed from JSON or YAML, their
 * local `$ref`s resolved, and their operations listed by operationId with what calling one needs.
 */
import { parse as parseYaml } from 'yaml';

export const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

export interface OperationParameter {
    name: string;
    in: 'path' | 'query' | 'header' | 'cookie';
    required: boolean;
    description?: string;
    schema?: any;
}

export interface Operation {
    operationId: string;
    method: string;
    path: string;
    summary?: string;
    description?: string;
    parameters: OperationParameter[];
    /** the JSON request body, when the operation takes one */
    body?: { required: boolean; schema?: any; contentType: string };
    /** the responses by status ('200', '404', 'default'): their description, JSON schema, and the document's example */
    responses: Record<string, { description?: string; schema?: any; example?: any }>;
    /** the security requirements (names of securitySchemes); none given: the document's */
    security?: string[];
}

/**
 * A document from text: JSON, else YAML. Refuses what is not OpenAPI 3.x, and a `$ref` to another file. The
 * document is returned as it is written: its `$ref`s are resolved when it is read (listOperations), never
 * stored resolved (that copies each shared schema wherever it is used: GitHub's 11 MB document becomes 50).
 */
export function parseDocument(text: string | object): any {
    let document: any = text;
    if (typeof text === 'string') {
        const trimmed = text.trim();
        try {
            document = trimmed.startsWith('{') ? JSON.parse(trimmed) : parseYaml(trimmed);
        }
        catch (error) {
            throw new Error(`The OpenAPI document does not parse: ${error.message}`);
        }
    }
    if (!document || typeof document !== 'object')
        throw new Error('The OpenAPI document is not an object');
    if (document.swagger)
        throw new Error(`Swagger ${document.swagger} documents are not supported yet: give an OpenAPI 3.0 or 3.1 document`);
    if (typeof document.openapi !== 'string' || !/^3\.[01]\./.test(document.openapi))
        throw new Error(`Not an OpenAPI 3.0 or 3.1 document (openapi: ${JSON.stringify(document.openapi)})`);
    if (!document.paths || typeof document.paths !== 'object')
        throw new Error('The OpenAPI document has no paths');
    const external = findExternalRef(document);
    if (external)
        throw new Error(`The OpenAPI document refers to another file (${external}): give a single document`);
    return document;
}

/** The first `$ref` that is not into the document itself. */
function findExternalRef(value: any): string | undefined {
    const stack = [value];
    while (stack.length) {
        const v = stack.pop();
        if (!v || typeof v !== 'object') continue;
        if (typeof v.$ref === 'string' && !v.$ref.startsWith('#')) return v.$ref;
        for (const child of Array.isArray(v) ? v : Object.values(v)) if (child && typeof child === 'object') stack.push(child);
    }
    return undefined;
}

/**
 * A resolver of the document's local `$ref`s (`#/components/...`): what a value is with each reference replaced by
 * what it points to. Each target is resolved once and shared by every place that refers to it (a recursive schema
 * refers back to itself), so resolving costs what the document is, however often its schemas are used.
 */
export function refResolver(document: any): (value: any) => any {
    const cache = new Map<string, any>();
    const target = (ref: string) => {
        let value = document;
        for (const part of ref.slice(2).split('/').map(p => decodeURIComponent(p).replace(/~1/g, '/').replace(/~0/g, '~'))) {
            value = value?.[part];
            if (value === undefined)
                throw new Error(`The OpenAPI document refers to ${ref}, which it does not have`);
        }
        return value;
    };
    const resolveObject = (value: object) => {
        const out = {};
        for (const [key, v] of Object.entries(value)) out[key] = resolve(v);
        return out;
    };
    const resolve = (value: any): any => {
        if (Array.isArray(value)) return value.map(resolve);
        if (!value || typeof value !== 'object') return value;
        if (typeof value.$ref !== 'string') return resolveObject(value);
        const { $ref, ...siblings } = value;
        if (!$ref.startsWith('#/'))
            throw new Error(`The OpenAPI document refers to another file (${$ref}): give a single document`);
        let resolved;
        if (cache.has($ref))
            resolved = cache.get($ref);
        else {
            const raw = target($ref);
            if (raw && typeof raw === 'object' && !Array.isArray(raw) && typeof raw.$ref !== 'string') {
                // the object first, filled in after: a reference back to it (recursion) gets the same object
                resolved = {};
                cache.set($ref, resolved);
                Object.assign(resolved, resolveObject(raw));
            }
            else {
                cache.set($ref, undefined);       // a chain of references that loops ends as undefined
                resolved = resolve(raw);
                cache.set($ref, resolved);
            }
        }
        return Object.keys(siblings).length && resolved && typeof resolved === 'object' && !Array.isArray(resolved)
            ? { ...resolved, ...resolveObject(siblings) } : resolved;
    };
    return resolve;
}

/** The document with its references resolved (shared: see refResolver). */
export function resolveRefs(document: any): any {
    return refResolver(document)(document);
}

/** The JSON schema of a content map's JSON entry (application/json, or any +json). */
function jsonContent(content): { contentType: string; schema?: any; example?: any } | undefined {
    if (!content || typeof content !== 'object') return undefined;
    const type = Object.keys(content).find(t => /^application\/(.+\+)?json\b/i.test(t)) ?? Object.keys(content).find(t => /json/i.test(t));
    if (!type) return undefined;
    // its example: `example`, else the first of `examples`
    const media = content[type] ?? {};
    const example = media.example !== undefined ? media.example : Object.values<any>(media.examples ?? {})[0]?.value;
    return { contentType: type, schema: media.schema, ...(example !== undefined ? { example } : {}) };
}

/** Every operation of the document that has an operationId, by it; `skipped` lists those that have none. */
export function listOperations(document: any): { operations: Map<string, Operation>; skipped: string[] } {
    const operations = new Map<string, Operation>();
    const skipped: string[] = [];
    const resolve = refResolver(document);
    for (const [path, raw] of Object.entries<any>(document.paths ?? {})) {
        const item = resolve(raw);
        if (!item || typeof item !== 'object') continue;
        const shared: any[] = item.parameters ?? [];
        for (const method of HTTP_METHODS) {
            const op = item[method];
            if (!op) continue;
            if (!op.operationId) {
                skipped.push(`${method.toUpperCase()} ${path}`);
                continue;
            }
            // the operation's parameters override the path's with the same name and place
            const byKey = new Map<string, any>();
            for (const p of [...shared, ...(op.parameters ?? [])])
                if (p?.name && p?.in) byKey.set(`${p.in}:${p.name}`, p);
            const parameters: OperationParameter[] = [...byKey.values()].map(p => ({
                name: p.name, in: p.in, required: p.in === 'path' || Boolean(p.required), description: p.description, schema: p.schema
            }));
            const body = op.requestBody ? jsonContent(op.requestBody.content) : undefined;
            const responses = {};
            for (const [status, response] of Object.entries<any>(op.responses ?? {}))
            {
                const json = jsonContent(response?.content);
                responses[status] = { description: response?.description, schema: json?.schema, ...(json?.example !== undefined ? { example: json.example } : {}) };
            }
            operations.set(op.operationId, {
                operationId: op.operationId, method: method.toUpperCase(), path,
                summary: op.summary, description: op.description,
                parameters,
                body: body ? { required: Boolean(op.requestBody.required), schema: body.schema, contentType: body.contentType } : undefined,
                responses,
                security: (op.security ?? document.security)?.flatMap(requirement => Object.keys(requirement ?? {})),
            });
        }
    }
    return { operations, skipped };
}

/**
 * A value as a schema describes it (a connector's answer outside production, from its document): its example, else
 * its default, else one made from its type: an object's properties, an array of one item, the first of an enum, a
 * date for a date, 0, false, a string.
 */
export function exampleOf(schema: any, depth = 0): any {
    if (!schema || typeof schema !== 'object' || depth > 8) return null;
    if (schema.example !== undefined) return schema.example;
    if (Array.isArray(schema.examples) && schema.examples.length) return schema.examples[0];
    if (schema.default !== undefined) return schema.default;
    if (Array.isArray(schema.enum) && schema.enum.length) return schema.enum[0];
    const of = schema.allOf ?? schema.oneOf ?? schema.anyOf;
    if (Array.isArray(of) && of.length)
        return schema.allOf ? Object.assign({}, ...of.map(s => exampleOf(s, depth + 1)).filter(v => v && typeof v === 'object')) : exampleOf(of[0], depth + 1);
    const type = Array.isArray(schema.type) ? schema.type.find(t => t !== 'null') : schema.type;
    switch (type ?? (schema.properties ? 'object' : schema.items ? 'array' : undefined)) {
        case 'object': return Object.fromEntries(Object.entries<any>(schema.properties ?? {}).map(([k, v]) => [k, exampleOf(v, depth + 1)]));
        case 'array': return [exampleOf(schema.items, depth + 1)];
        case 'integer': case 'number': return 0;
        case 'boolean': return false;
        case 'string': return schema.format === 'date' ? '2026-01-01' : schema.format === 'date-time' ? '2026-01-01T00:00:00Z' : schema.format === 'email' ? 'someone@example.com' : 'string';
        default: return null;
    }
}
