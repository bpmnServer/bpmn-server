/*
 * The OpenAPI document of a frozen API (/api, v1), made from its router's routes, so it lists what is there: each
 * operation deprecated, the API (/api/v3) its successor. Its shapes are not described: /api's calls take and answer
 * what bpmn-client sends and reads (docs: the client API).
 */
export function legacyDocument(router, { title, base, origin }: { title: string, base: string, origin: string }) {
    const paths: Record<string, Record<string, object>> = {};
    for (const layer of router.stack) {
        const route = layer.route;
        if (!route || route.path === '/openapi.json') continue;
        // express 5 paths: :name and {/:name} (optional) as OpenAPI's {name}
        const path = String(route.path).replace(/\{\/:(\w+)\}/g, '/{$1}').replace(/:(\w+)/g, '{$1}');
        for (const method of Object.keys(route.methods)) {
            const params = [...path.matchAll(/\{(\w+)\}/g)].map(([, name]) => ({ name, in: 'path', required: !String(route.path).includes(`{/:${name}}`), schema: { type: 'string' } }));
            (paths[path] ??= {})[method] = {
                deprecated: true,
                summary: `${method.toUpperCase()} ${base}${path}: frozen until 4.0; the API is ${origin}/api/v3`,
                ...(params.length ? { parameters: params } : {}),
                responses: { 200: { description: 'As bpmn-client reads it' }, 401: { description: 'No x-api-key, or a wrong one' } },
            };
        }
    }
    return {
        openapi: '3.1.0',
        info: { title, version: base.replace(/^\//, ''), description: `Deprecated: fixes only, until it goes (4.0). The API is ${origin}/api/v3 (its document: ${origin}/api/v3/openapi.json).` },
        servers: [{ url: `${origin}${base}` }],
        components: { securitySchemes: { apiKey: { type: 'apiKey', in: 'header', name: 'x-api-key' } } },
        security: [{ apiKey: [] }],
        paths,
    };
}

/** A frozen API's own document (/api2's), marked so: every operation deprecated, the API its successor. */
export function deprecate(doc, origin: string) {
    for (const operations of Object.values<any>(doc.paths ?? {}))
        for (const operation of Object.values<any>(operations))
            if (operation && typeof operation === 'object') operation.deprecated = true;
    doc.info = { ...doc.info, title: `${doc.info?.title ?? 'API'} v2 (deprecated)`,
        description: `Deprecated: fixes only, until it goes. The API is ${origin}/api/v3 (its document: ${origin}/api/v3/openapi.json). ${doc.info?.description ?? ''}` };
    return doc;
}
