/**
 * Model packages (docs/docs/export-import.md): several models, decisions and policies exported at once, each with what
 * it needs, in one .zip; and the import that reads it. A package is the models folder's own layout:
 *
 *   Leave Application.bpmn, .svg, .feature, .engine.feature, .tests.json     a model, its diagram and its tests
 *   test-cases/<model>/<scenario>.json                                       the case a scenario made (the guide's examples link to it)
 *   loanApproval.dmn.xml, loanApproval.dmn.feature                           a decision and its tests
 *   assignment/ notification/ security/  <policy>.dmn.xml                    policies
 *   notification/templates/<name>.md|.txt                                    a policy's message templates
 *   connectors/<id>.connector.json                                           a connector's definition (never its key)
 *   manifest.json                                                            what was chosen, what came with it, and a checksum of each file
 *
 * Never in a package: users, sessions, keys and secrets, instances, a model's history.
 */
import FS from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ModelVerifier } from 'bpmn-server';
import { zip } from './zip.js';

export type PackageKind = 'process' | 'diagram' | 'decision' | 'policy' | 'template' | 'connector' | 'test' | 'case';

/** One file of a package: its path in the models folder (forward slashes), what it is, and why it is there. */
export interface PackageFile {
    path: string;
    kind: PackageKind;
    /** the files that need it: none, when it was chosen itself */
    requiredBy: string[];
    /** chosen itself, not only needed by another */
    selected: boolean;
}
/** What a package could not have: something a model names that is not there, or that this person may not export. */
export interface PackageGap { what: string; neededBy: string; why: string }
export interface PackagePlan { files: PackageFile[]; gaps: PackageGap[] }

/** The policy folders, in the models folder. */
export const POLICY_FOLDERS = ['assignment', 'notification', 'security'] as const;
const TEMPLATES = 'notification/templates';
const CONNECTORS = 'connectors';
/** Policies and connectors that only an administrator exports or imports. */
const ADMIN_ONLY = (file: string) => file.startsWith('security/') || file.startsWith(CONNECTORS + '/');

const NAME = '[^\\\\/:*?"<>|\\u0000-\\u001f]{1,200}';
const LAYOUT: { kind: PackageKind; pattern: RegExp }[] = [
    { kind: 'process', pattern: new RegExp(`^${NAME}\\.bpmn$`) },
    { kind: 'diagram', pattern: new RegExp(`^${NAME}\\.svg$`) },
    { kind: 'test', pattern: new RegExp(`^${NAME}\\.(feature|tests\\.json)$`) },
    { kind: 'decision', pattern: new RegExp(`^${NAME}\\.dmn(\\.xml)?$`) },
    { kind: 'policy', pattern: new RegExp(`^(${POLICY_FOLDERS.join('|')})/${NAME}\\.dmn\\.xml$`) },
    { kind: 'template', pattern: new RegExp(`^${TEMPLATES}/${NAME}\\.(md|txt)$`) },
    { kind: 'connector', pattern: /^connectors\/[A-Za-z0-9][A-Za-z0-9_-]{0,63}\.connector\.json$/ },
    { kind: 'case', pattern: new RegExp(`^test-cases/${NAME}/${NAME}\\.json$`) },
];

/** What a path in a package is, or null when a package has no such file (so nothing else is read or written). */
export function kindOf(file: string): PackageKind | null {
    if (file.startsWith('.') || file.includes('/.') || file.includes('..')) return null;
    return LAYOUT.find(l => l.pattern.test(file))?.kind ?? null;
}

const at = (folder: string, file: string) => path.join(folder, ...file.split('/'));
const exists = (folder: string, file: string) => { try { return FS.statSync(at(folder, file)).isFile(); } catch { return false; } };
const read = (folder: string, file: string) => { try { return FS.readFileSync(at(folder, file), 'utf8'); } catch { return ''; } };
const folderOf = (server: any): string => path.resolve(server.configuration.definitionsPath ?? 'processes');

/** What may be chosen: the models, the decisions and the policies the folder has. */
export function listExportable(server: any): { processes: string[]; decisions: string[]; policies: string[] } {
    const folder = folderOf(server);
    const names = (dir: string) => { try { return FS.readdirSync(dir).filter(f => FS.statSync(path.join(dir, f)).isFile()).sort(); } catch { return []; } };
    return {
        processes: names(folder).filter(f => f.endsWith('.bpmn')).map(f => f.slice(0, -'.bpmn'.length)),
        decisions: names(folder).filter(f => /\.dmn(\.xml)?$/.test(f)),
        policies: POLICY_FOLDERS.flatMap(kind => names(path.join(folder, kind)).filter(f => f.endsWith('.dmn.xml')).map(f => `${kind}/${f}`)),
    };
}

/** A choice is `process:<model>`, `decision:<file>` or `policy:<folder>/<file>`. */
export function parseChoice(choice: string): { type: 'process' | 'decision' | 'policy'; name: string } | null {
    const [type, ...rest] = String(choice).split(':');
    const name = rest.join(':');
    if (!name || !['process', 'decision', 'policy'].includes(type)) return null;
    const file = type === 'process' ? name + '.bpmn' : name;
    return kindOf(file) === type ? { type: type as any, name } : null;
}

export interface PlanOptions {
    /** what the chosen need: the models they call, their decisions, policies, templates and connectors (default: yes) */
    dependencies?: boolean;
    /** the tests and diagrams beside what is exported (default: yes) */
    companions?: boolean;
    /** the cases the models' scenarios made (`test-cases/`), which the guide's examples link to (default: yes) */
    cases?: boolean;
    /** an administrator: security policies and connectors may be exported */
    admin?: boolean;
}

/**
 * The files of a package for these choices: each chosen, with what it needs, found by reading the models: the models
 * a call activity calls, the decisions a business rule task names and the policies a model uses (through its add-ons),
 * a notification policy's templates, the connectors a service task or a form's lookup names. What a model names that
 * is not there is a gap, not an error: the package is still made.
 */
export async function planExport(server: any, choices: string[], options: PlanOptions = {}): Promise<PackagePlan> {
    const { dependencies = true, companions = true, cases = true, admin = false } = options;
    const folder = folderOf(server);
    const files = new Map<string, PackageFile>();
    const gaps: PackageGap[] = [];
    const done = new Set<string>();

    const add = (file: string, kind: PackageKind, by: string | null) => {
        if (!exists(folder, file)) return false;
        if (ADMIN_ONLY(file) && !admin) {
            if (by) gaps.push({ what: file, neededBy: by, why: 'only an administrator exports it' });
            return false;
        }
        const have = files.get(file) ?? { path: file, kind, requiredBy: [], selected: false };
        if (by === null) have.selected = true;
        else if (!have.requiredBy.includes(by)) have.requiredBy.push(by);
        files.set(file, have);
        return true;
    };
    const beside = (base: string, extensions: string[], by: string | null) => {
        if (companions) for (const extension of extensions) add(base + extension, extension === '.svg' ? 'diagram' : 'test', by ?? base);
    };
    const templatesOf = (file: string, text: string) => {
        if (!dependencies) return;
        let names: string[] = [];
        try { names = FS.readdirSync(at(folder, TEMPLATES)); } catch { /* none */ }
        for (const template of names.filter(n => /\.(md|txt)$/.test(n)))
            if (text.includes(template.replace(/\.(md|txt)$/, ''))) add(`${TEMPLATES}/${template}`, 'template', file);
    };

    const decisionOrPolicy = (file: string, by: string | null) => {
        const kind: PackageKind = file.includes('/') ? 'policy' : 'decision';
        if (!add(file, kind, by)) return;
        const base = file.split('/').pop().replace(/\.dmn(\.xml)?$/, '');
        beside(base, ['.dmn.feature', '.dmn.tests.json', '.policy.dmn.feature'], file);
        templatesOf(file, read(folder, file));
    };

    const processOf = async (name: string, by: string | null) => {
        const file = `${name}.bpmn`;
        if (!add(file, 'process', by) || done.has(name)) return;
        done.add(name);
        beside(name, ['.svg', '.feature', '.engine.feature', '.tests.json'], file);
        if (cases) {
            let made: string[] = [];
            try { made = FS.readdirSync(at(folder, `test-cases/${name}`)).filter(f => f.endsWith('.json')).sort(); } catch { /* it has run no tests */ }
            for (const made1 of made) add(`test-cases/${name}/${made1}`, 'case', file);
        }
        if (!dependencies) return;
        const text = read(folder, file);

        // the models it calls
        for (const [, called] of text.matchAll(/\bcalledElement\s*=\s*"([^"]+)"/g)) {
            if (called.startsWith('$') || called === name) continue;
            if (exists(folder, `${called}.bpmn`)) await processOf(called, file);
            else gaps.push({ what: `${called}.bpmn`, neededBy: file, why: 'a call activity calls it, and the models folder has no such model' });
        }

        // the connectors: a service task's (<connector>/<operation>) and a form lookup's (connector:<connector>/<operation>)
        const connectors = new Set<string>();
        for (const [, ref] of text.matchAll(/connectorId>\s*([^<]+?)\s*</g)) connectors.add(ref.split('/')[0]);
        for (const [, id] of text.matchAll(/connector:([A-Za-z0-9][A-Za-z0-9_-]*)\//g)) connectors.add(id);
        for (const id of connectors) {
            const connector = `${CONNECTORS}/${id}.connector.json`;
            if (exists(folder, connector)) add(connector, 'connector', file);
            else gaps.push({ what: connector, neededBy: file, why: 'a service task or a form names it, and this server has no such connector file' });
        }

        // the decisions it names, and the policies it uses (through the add-ons that read them)
        let definition = null;
        try { definition = await server.definitions.load(name); } catch { /* an unreadable model has no policies to find */ }
        let used: { file: string }[] = [];
        try { used = await new ModelVerifier(server).decisionFilesUsed(text, definition); } catch { /* the model's own checks say why */ }
        for (const { file: absolute } of used) {
            const relative = path.relative(folder, absolute).split(path.sep).join('/');
            if (!relative.startsWith('..') && kindOf(relative)) decisionOrPolicy(relative, file);
        }
        for (const [, ref] of text.matchAll(/\bdecisionRef\s*=\s*"([^"]+)"/g))
            if (![ref, ref + '.dmn', ref + '.dmn.xml'].some(f => exists(folder, f)))
                gaps.push({ what: ref, neededBy: file, why: 'a business rule task names this decision, and the models folder has no such decision' });
    };

    for (const choice of choices) {
        const picked = parseChoice(choice);
        if (!picked) continue;
        if (picked.type === 'process') await processOf(picked.name, null);
        else decisionOrPolicy(picked.name, null);
    }
    const order: PackageKind[] = ['process', 'diagram', 'test', 'case', 'decision', 'policy', 'template', 'connector'];
    return {
        files: [...files.values()].sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || a.path.localeCompare(b.path)),
        gaps,
    };
}

/** A connector's file as it is exported and imported: what the server keeps of the key never goes with it. */
export function withoutSecrets(text: string): string {
    let definition: any;
    try { definition = JSON.parse(text); } catch { return text; }
    if (definition?.auth && typeof definition.auth === 'object')
        for (const key of ['secret', 'last4', 'setAt', 'setBy']) delete definition.auth[key];
    delete definition.test;
    return JSON.stringify(definition, null, 2) + '\n';
}

const sha256 = (data: Buffer | string) => crypto.createHash('sha256').update(data).digest('hex');
export const MANIFEST = 'manifest.json';
export const PACKAGE_FORMAT = 'owf-package';

export interface Manifest {
    format: typeof PACKAGE_FORMAT;
    version: 1;
    createdAt: string;
    createdBy?: string;
    chosen: string[];
    files: { path: string; kind: PackageKind; requiredBy: string[]; sha256: string }[];
    gaps: PackageGap[];
}

/** The .zip for a plan: its files as they are in the models folder (a connector's without any key) and the manifest. */
export function buildPackage(server: any, plan: PackagePlan, chosen: string[], who?: string): Buffer {
    const folder = folderOf(server);
    const entries = plan.files.map(file => {
        let data = FS.readFileSync(at(folder, file.path));
        if (file.kind === 'connector') data = Buffer.from(withoutSecrets(data.toString('utf8')), 'utf8');
        return { file, data };
    });
    const manifest: Manifest = {
        format: PACKAGE_FORMAT, version: 1, createdAt: new Date().toISOString(), ...(who ? { createdBy: who } : {}), chosen,
        files: entries.map(({ file, data }) => ({ path: file.path, kind: file.kind, requiredBy: file.requiredBy, sha256: sha256(data) })),
        gaps: plan.gaps,
    };
    return zip([...entries.map(({ file, data }) => ({ name: file.path, data })), { name: MANIFEST, data: Buffer.from(JSON.stringify(manifest, null, 2) + '\n', 'utf8') }]);
}

// ---- the import

export type ImportStatus = 'new' | 'same' | 'different' | 'refused';
export interface ImportRow {
    path: string;
    kind: PackageKind;
    status: ImportStatus;
    /** why it is refused, or what the manifest says is wrong with it */
    why?: string;
}

/**
 * What a package's files would do to this models folder: new, the same as what is there, different from it, or refused
 * (not a file a package has; a security policy or a connector for someone who is not an administrator; a connector file
 * that is not one; a file that does not match the manifest's checksum). `manifest.json` itself is not a row.
 */
export function previewImport(server: any, entries: { name: string; data: Buffer }[], admin: boolean): { rows: ImportRow[]; manifest: Manifest | null; problem?: string } {
    const folder = folderOf(server);
    let manifest: Manifest | null = null;
    const found = entries.find(e => e.name === MANIFEST);
    if (found) {
        try { manifest = JSON.parse(found.data.toString('utf8')); }
        catch { return { rows: [], manifest: null, problem: `${MANIFEST} is not JSON: the package is damaged.` }; }
        if (manifest?.format !== PACKAGE_FORMAT) return { rows: [], manifest: null, problem: `${MANIFEST} is not an OmniWorkflow package's.` };
        if (Number(manifest.version) > 1) return { rows: [], manifest: null, problem: `The package is version ${manifest.version}: this server reads version 1.` };
    }
    const sums = new Map((manifest?.files ?? []).map(f => [f.path, f.sha256]));
    const rows: ImportRow[] = [];
    for (const { name, data } of entries) {
        if (name === MANIFEST) continue;
        const kind = kindOf(name);
        if (!kind) { rows.push({ path: name, kind: 'test', status: 'refused', why: 'not a file a package has' }); continue; }
        if (ADMIN_ONLY(name) && !admin) { rows.push({ path: name, kind, status: 'refused', why: 'only an administrator imports it' }); continue; }
        if (sums.has(name) && sums.get(name) !== sha256(data)) { rows.push({ path: name, kind, status: 'refused', why: 'does not match the manifest: the package was changed or damaged' }); continue; }
        if (kind === 'case') {
            let format: unknown;
            try { format = JSON.parse(data.toString('utf8'))?.format; } catch { /* not JSON */ }
            if (format !== 'owf-test-case') { rows.push({ path: name, kind, status: 'refused', why: 'not a test case file' }); continue; }
        }
        if (kind === 'connector') {
            try {
                const definition = JSON.parse(data.toString('utf8'));
                const id = path.posix.basename(name).slice(0, -'.connector.json'.length);
                if (definition?.id !== id) throw new Error(`it names the connector '${definition?.id}': its id is its file's name`);
            }
            catch (error) { rows.push({ path: name, kind, status: 'refused', why: `not a connector file: ${error.message}` }); continue; }
        }
        const current = exists(folder, name) ? FS.readFileSync(at(folder, name)) : null;
        const incoming = kind === 'connector' ? Buffer.from(withoutSecrets(data.toString('utf8'))) : data;
        rows.push({ path: name, kind, status: current === null ? 'new' : current.equals(incoming) ? 'same' : 'different' });
    }
    return { rows, manifest };
}

/** Writes a file into the models folder, beside the others: a temporary file, then renamed over. */
export function writePackageFile(server: any, file: string, data: Buffer): void {
    const target = at(folderOf(server), file);
    FS.mkdirSync(path.dirname(target), { recursive: true });
    const temporary = `${target}.${process.pid}.tmp`;
    FS.writeFileSync(temporary, data);
    FS.renameSync(temporary, target);
}
