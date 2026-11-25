/**
 * The security add-on: a process's security policy (`owf:securityPolicy`, else `default`) says what each user may do
 * with each case (SecurityPolicy.ts). The engine doesn't ask it: the API's events do. On `pre-query` it adds the
 * policies' condition of what the user may see (SecurityQuery.ts); on `pre-action` it refuses what a case's policy
 * doesn't allow (claim, complete, assign, restart, its start events: CaseAccess.ts). It adds its decision files to the
 * model checks. It depends on nothing else of ours.
 */
import fs from 'node:fs';
import path from 'node:path';
import manifest from './addon.json' with { type: 'json' };
import { registerPolicyBasics } from '../basics/index.js';
import type { IAddOnManifest } from '../../engine/AddOns.js';
import type { IAddOn, IAddOnDecisionFile, IModelCheck } from '../../engine/AddOns.js';
import { SECURITY_FOLDER, DEFAULT_SECURITY_POLICY } from './SecurityPolicy.js';
import { CaseAccess } from './CaseAccess.js';
import { movePolicyFolder } from '../basics/folders.js';

export * from './SecurityPolicy.js';
export * from './SecurityQuery.js';
export * from './CaseAccess.js';

/** A server's case access, made once. */
const accessOf = new WeakMap<object, CaseAccess>();
function caseAccess(server): CaseAccess {
    let access = accessOf.get(server);
    if (!access) accessOf.set(server, access = new CaseAccess(server));
    return access;
}

const ITEM_ACTIONS = ['claim', 'complete', 'assign'] as const;

const named = (def): string | null => {
    const name = def?.$attrs?.['owf:securityPolicy'];
    return typeof name == 'string' && name.trim() ? name.trim() : null;
};

const modelCheck: IModelCheck = {
    name: 'security',
    decisionFiles(definition, folder) {
        movePolicyFolder(folder, 'security');
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

/** The Access Control add-on's manifest (addon.json): what it reads of a model, its settings, its doc page. */
export const securityManifest: IAddOnManifest = manifest as IAddOnManifest;

export const securityAddOn: IAddOn = {
    name: manifest.name,

    register(server) {
        registerPolicyBasics(server);
        // what the user may see: the policies' condition, on the cases the API reads
        server.listener.on?.('pre-query', async (context) => {
            // the cases a user reads: its conditions are on a case (any of its items), not on each item a task list reads
            if (context?.source?.query !== 'instances') return;
            const access = caseAccess(server);
            if (!access.on) return;
            const condition = await access.seeQuery(context.user);
            if (condition) context.conditions.push(condition);
        });
        // what the user may do: a case's policy refuses (PolicyDenied, 403); without a rule, today's rules hold
        server.listener.on?.('pre-action', async (context) => {
            const { action, user, item, instance } = context ?? {};
            const access = caseAccess(server);
            if (!access.on || !instance) return;
            if ((ITEM_ACTIONS as readonly string[]).includes(action) && item)
                CaseAccess.require(await access.decide(user, instance, { elementId: item.elementId, itemId: item.id }), action, true);
            else if (action === 'restart' || action === 'events')
                CaseAccess.require(await access.decide(user, instance), action);
        });
        server.registrations.addModelCheck(modelCheck);
        server.registrations.addDecisionLookup((ref, folder) => {
            const name = /^(.+)\.security-policy$/.exec(ref)?.[1];
            return name ? { folder: path.join(folder, SECURITY_FOLDER), name } : null;
        });
    },
};
