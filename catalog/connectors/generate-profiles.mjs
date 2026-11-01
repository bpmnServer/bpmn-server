import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const DIR = import.meta.dirname;
const sourceFile = path.join(DIR, 'api-catalog.json');
const outputDir = path.join(DIR, 'profiles');
const sourceCatalog = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
const methods = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace']);
const concurrency = 8;

if (!Array.isArray(sourceCatalog))
    throw new Error(`${sourceFile} must contain an array`);

function baseUrl(spec) {
    if (Array.isArray(spec.servers) && spec.servers[0]?.url)
        return spec.servers[0].url;
    if (spec.host)
        return `${spec.schemes?.[0] ?? 'https'}://${spec.host}${spec.basePath ?? ''}`;
    return '';
}

function operationId(method, route, operation) {
    if (operation.operationId)
        return operation.operationId;
    const suffix = route.split('/').filter(Boolean).map(part => part.replace(/[{}]/g, '')).join('_') || 'root';
    return `${method}_${suffix}`;
}

function parametersFor(pathItem, operation) {
    const parameters = [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])];
    return parameters
        .filter(parameter => parameter && !parameter.$ref)
        .map(parameter => ({
            name: parameter.name,
            in: parameter.in,
            ...(parameter.required !== undefined ? { required: parameter.required } : {}),
            ...(parameter.schema ? { schema: parameter.schema } : {}),
            ...(parameter.description ? { description: parameter.description } : {}),
        }));
}

function operationsFor(id, entry, spec) {
    const operations = [];
    for (const [route, pathItem] of Object.entries(spec.paths ?? {})) {
        if (!pathItem || typeof pathItem !== 'object')
            continue;
        for (const [method, operation] of Object.entries(pathItem)) {
            if (!methods.has(method) || !operation || typeof operation !== 'object')
                continue;
            const opId = operationId(method, route, operation);
            const parameters = parametersFor(pathItem, operation);
            if (operation.requestBody && !parameters.some(parameter => parameter.in === 'body'))
                parameters.push({ name: 'body', in: 'body', required: !!operation.requestBody.required, schema: operation.requestBody.content ?? {} });
            operations.push({
                connector: `${id}.${opId}`,
                title: operation.summary ?? operation.description ?? opId,
                packageVersion: '1.0.0',
                method: method.toUpperCase(),
                baseUrl: baseUrl(spec),
                path: route,
                authentication: entry.defaultAuth ?? null,
                parameters,
            });
        }
    }
    return operations;
}

async function fetchSpec(entry) {
    const response = await fetch(entry.url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok)
        throw new Error(`${response.status} ${response.statusText}`);
    return parseYaml(await response.text());
}

async function mapConcurrent(items, worker) {
    const results = new Array(items.length);
    let next = 0;
    async function run() {
        while (true) {
            const index = next++;
            if (index >= items.length)
                return;
            results[index] = await worker(items[index]);
        }
    }
    await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
    return results;
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const results = await mapConcurrent(sourceCatalog, async entry => {
    try {
        const spec = await fetchSpec(entry);
        const profile = {
            name: entry.id,
            title: entry.name,
            source: entry.url,
            authentication: entry.defaultAuth ?? null,
            operations: operationsFor(entry.id, entry, spec),
        };
        fs.writeFileSync(path.join(outputDir, `${entry.id}.json`), JSON.stringify(profile, null, 2) + '\n');
        console.log(`${entry.id}: ${profile.operations.length} operations`);
        return { ...profile, error: null };
    } catch (error) {
        console.error(`${entry.id}: ${error.message}`);
        const profile = { name: entry.id, title: entry.name, source: entry.url, authentication: entry.defaultAuth ?? null, operations: [], error: error.message };
        fs.writeFileSync(path.join(outputDir, `${entry.id}.json`), JSON.stringify(profile, null, 2) + '\n');
        return profile;
    }
});

fs.writeFileSync(path.join(outputDir, 'catalog.json'), JSON.stringify(results, null, 2) + '\n');
console.log(`Generated ${results.filter(profile => !profile.error).length}/${results.length} connector profiles in ${outputDir}`);
