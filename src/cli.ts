#!/usr/bin/env node
/**
 * bpmn-server command line.
 *
 *   bpmn-server verify <file-or-folder>... [--json]
 *
 * verify: checks BPMN models with verifyModel (no server, no database), one line per issue;
 * exits 1 when a model has errors. `npx bpmn-server verify model.bpmn` needs no installation.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { verifyModel } from './elements/verifyModel.js';
import type { IModelIssue } from './elements/verifyModel.js';

const USAGE = `usage: bpmn-server verify <file-or-folder>... [--json]

  Checks BPMN 2.0 models the way bpmn-server loads and runs them: XML and
  references, structure, gateways, diagram, the engine's load, scripts,
  conditions and expressions, timers. Exit code 1 when a model has errors.`;

interface FileResult { file: string; valid: boolean; errors: number; warnings: number; issues: IModelIssue[] }

function bpmnFiles(target: string): string[] {
    const stat = fs.statSync(target);
    if (stat.isFile()) return [target];
    return fs.readdirSync(target, { withFileTypes: true })
        .filter(e => e.isFile() && e.name.endsWith('.bpmn'))
        .map(e => path.join(target, e.name));
}

const describe = (i: IModelIssue) => `${i.code}${i.elementId ? ' ' + i.elementId : ''}: ${i.message}`;

async function verify(targets: string[], json: boolean): Promise<number> {
    const results: FileResult[] = [];
    for (const target of targets) {
        let files: string[];
        try {
            files = bpmnFiles(target);
        }
        catch (exc) {
            results.push({ file: target, valid: false, errors: 1, warnings: 0, issues: [{ severity: 'error', code: 'not-found', message: exc.message }] });
            continue;
        }
        if (!files.length)
            results.push({ file: target, valid: false, errors: 1, warnings: 0, issues: [{ severity: 'error', code: 'not-found', message: 'no .bpmn files' }] });
        for (const file of files) {
            const result = await verifyModel(fs.readFileSync(file, 'utf8'), undefined, path.basename(file, '.bpmn'));
            results.push({ file, ...result });
        }
    }
    if (json)
        console.log(JSON.stringify(results, null, 2));
    else
        for (const r of results) {
            console.log(`${r.file}: ${r.errors} errors, ${r.warnings} warnings`);
            for (const severity of ['error', 'warning', 'info'])
                for (const issue of r.issues.filter(i => i.severity === severity))
                    console.log(`  ${severity.padEnd(7)} ${describe(issue)}`);
        }
    return results.some(r => !r.valid) ? 1 : 0;
}

export async function main(argv: string[]): Promise<number> {
    const [command, ...rest] = argv;
    if (command === 'verify') {
        const json = rest.includes('--json');
        const targets = rest.filter(a => a !== '--json');
        if (targets.length) return await verify(targets, json);
    }
    if (command === '--help' || command === '-h' || command === 'help') {
        console.log(USAGE);
        return 0;
    }
    console.error(USAGE);
    return 2;
}

if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href)
    process.exitCode = await main(process.argv.slice(2));
