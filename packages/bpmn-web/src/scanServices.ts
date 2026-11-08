#!/usr/bin/env node
/*
 * The names of an application's services, read from its source: nothing of it runs. A host keeps them in a file, so the
 * editor can offer and check services with no application code and no engine.
 *   node <bpmn-web>/dist/scanServices.js delegates/appDelegate.ts services.json
 * What the source can't say is left out, so a name not listed may still exist: a service made as the application runs, a
 * class from a package (`partial` then says so). The file's `extra` names are kept, for those.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const CANDIDATES = ['.ts', '.js', '.mjs', '/index.ts', '/index.js'];

/** Every node of a tree, in source order. */
function* walk(node) {
    if (!node || typeof node.type !== 'string') return;
    yield node;
    for (const value of Object.values(node))
        for (const child of Array.isArray(value) ? value : [value])
            if (child && typeof child === 'object') yield* walk(child);
}

async function parseFile(file: string) {
    let esbuild;
    try {
        esbuild = await import('esbuild');
    }
    catch {
        throw new Error('Scanning services needs esbuild: npm install --save-dev esbuild');
    }
    const { parse } = await import('acorn');
    const { code } = await esbuild.transform(fs.readFileSync(file, 'utf8'), { loader: path.extname(file) === '.ts' ? 'ts' : 'js', target: 'es2022' });
    return parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
}

function resolveImport(from: string, specifier: string): string | null {
    if (!specifier.startsWith('.')) return null;
    const base = path.resolve(path.dirname(from), specifier).replace(/\.js$/, '');
    return CANDIDATES.map(ending => base + ending).find(file => fs.existsSync(file)) ?? null;
}

/** A file's classes and the names it imports. */
async function readModule(file: string) {
    const tree = await parseFile(file);
    const classes = new Map(), imports = new Map();
    for (const node of walk(tree)) {
        if (node.type === 'ClassDeclaration' && node.id) classes.set(node.id.name, node);
        if (node.type === 'VariableDeclarator' && node.init?.type === 'ClassExpression' && node.id?.name) classes.set(node.id.name, node.init);
        if (node.type === 'ImportDeclaration')
            for (const spec of node.specifiers)
                imports.set(spec.local.name, { file: resolveImport(file, node.source.value), name: spec.imported?.name ?? 'default' });
    }
    return { file, classes, imports };
}

export interface ScannedServices {
    from: string;
    /** Something was out of reach (a class from a package, a provider made as it runs): the list may be short. */
    partial: boolean;
    services: string[];
    extra: string[];
}

export async function scanServices(delegateFile: string): Promise<Omit<ScannedServices, 'extra'>> {
    const modules = new Map();
    const moduleOf = async (file: string) => {
        if (!modules.has(file)) modules.set(file, await readModule(file));
        return modules.get(file);
    };
    let partial = false;

    /** A class by the name it has in a module: there, or through its import. */
    const findClass = async (module, name: string) => {
        if (module.classes.has(name)) return { module, node: module.classes.get(name) };
        const imported = module.imports.get(name);
        if (!imported?.file) return null;
        const from = await moduleOf(imported.file);
        return from.classes.has(imported.name) ? { module: from, node: from.classes.get(imported.name) } : null;
    };

    /** A class's public methods, its parents' too, and one level of the objects it makes (`this.billing = new Billing()`). */
    const namesOf = async ({ module, node }, depth = 0, seen = new Set()): Promise<string[]> => {
        if (seen.has(node)) return [];
        seen.add(node);
        const names: string[] = [];
        const add = name => { if (name !== 'constructor' && name !== 'appDelegate' && !name.startsWith('_')) names.push(name); };
        const nested = async (name, value) => {
            if (value?.type !== 'NewExpression' || value.callee?.type !== 'Identifier' || depth > 0) return;
            const made = await findClass(module, value.callee.name);
            if (made) names.push(...(await namesOf(made, depth + 1, seen)).map(inner => `${name}.${inner}`));
            else partial = true;
        };
        for (const member of node.body.body) {
            if (member.static || member.computed || member.key?.type !== 'Identifier') continue;
            if (member.type === 'MethodDefinition' && member.kind === 'method') add(member.key.name);
            if (member.type === 'PropertyDefinition') {
                if (['ArrowFunctionExpression', 'FunctionExpression'].includes(member.value?.type)) add(member.key.name);
                else await nested(member.key.name, member.value);
            }
        }
        for (const inner of walk(node.body))
            if (inner.type === 'AssignmentExpression' && inner.left?.type === 'MemberExpression' && inner.left.object?.type === 'ThisExpression' && inner.left.property?.name)
                await nested(inner.left.property.name, inner.right);
        if (node.superClass?.type === 'Identifier') {
            const parent = await findClass(module, node.superClass.name);
            if (parent) names.push(...await namesOf(parent, depth, seen));
            else partial = true;
        }
        return names;
    };

    const file = path.resolve(delegateFile);
    const delegateModule = await moduleOf(file);
    const delegate = [...delegateModule.classes.values()].find(node => node.body.body.some(m => m.key?.name === 'getServicesProvider'));
    let provider = null;
    if (delegate) {
        const method = delegate.body.body.find(m => m.key?.name === 'getServicesProvider');
        const made = [...walk(method)].filter(n => n.type === 'NewExpression' && n.callee?.type === 'Identifier');
        for (const node of made) {
            provider = await findClass(delegateModule, node.callee.name);
            if (provider) break;
        }
    }
    if (!provider) partial = true;
    const services = provider ? [...new Set(await namesOf(provider))].sort() : [];
    return { from: path.basename(delegateFile), partial, services };
}

if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) {
    const [delegateFile, output = 'services.json'] = process.argv.slice(2);
    if (!delegateFile) throw new Error('Name the delegate: scanServices.js delegates/appDelegate.ts [services.json]');
    const before = fs.existsSync(output) ? JSON.parse(fs.readFileSync(output, 'utf8')) : {};
    const scanned = await scanServices(delegateFile);
    fs.writeFileSync(output, JSON.stringify({ ...scanned, extra: before.extra ?? [] }, null, 2) + '\n');
    console.log(`${output}: ${scanned.services.length} services${scanned.partial ? ', and some out of reach' : ''}`);
}
