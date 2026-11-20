/**
 * The security add-on: a process's security policy (`owf:securityPolicy`, else `default`) says what each user may do
 * with each case (SecurityPolicy.ts). The engine doesn't ask it: the host does, around the engine (bpmn-web's
 * routes/caseAccess.ts), and narrows its own queries with the policy's condition (SecurityQuery.ts). Here it only adds
 * its decision files to the model checks. It depends on nothing else of ours.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { IAddOn, IAddOnDecisionFile, IModelCheck } from '../../../engine/AddOns.js';
import { SECURITY_FOLDER, DEFAULT_SECURITY_POLICY } from './SecurityPolicy.js';

export * from './SecurityPolicy.js';
export * from './SecurityQuery.js';

const named = (def): string | null => {
    const name = def?.$attrs?.['owf:securityPolicy'];
    return typeof name == 'string' && name.trim() ? name.trim() : null;
};

const modelCheck: IModelCheck = {
    name: 'security',
    decisionFiles(definition, folder) {
        const files: IAddOnDecisionFile[] = [];
        const add = (name: string, explicit: boolean) => {
            const file = path.join(folder, SECURITY_FOLDER, `${name}.dmn.xml`);
            if (!fs.existsSync(file)) return;
            const known = files.find(f => f.file === file);
            // named by the model: what it calls is checked too; the default, only the actors it reads
            if (known) known.calls ||= explicit;
            else files.push({ what: `security policy ${name}`, file, calls: explicit });
        };
        for (const node of definition.nodes.values()) {
            const name = named(node.def);
            if (name) add(name, true);
        }
        for (const proc of definition.processes.values()) {
            const name = named(proc.def || proc);
            add(name ?? DEFAULT_SECURITY_POLICY, !!name);
        }
        return files;
    },
};

export const securityAddOn: IAddOn = {
    name: 'security',

    register(server) {
        server.registrations.addModelCheck(modelCheck);
        server.registrations.addDecisionLookup((ref, folder) => {
            const name = /^(.+)\.security-policy$/.exec(ref)?.[1];
            return name ? { folder: path.join(folder, SECURITY_FOLDER), name } : null;
        });
    },
};
