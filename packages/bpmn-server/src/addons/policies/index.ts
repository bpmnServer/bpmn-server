/**
 * The policies (docs/design/add-ons.md): three add-ons, each on or off on its own. Assignment: who works on each task
 * (the task's assignee and candidates, its lane, assignment policies). Security: who may see and do what (security
 * policies). Notifications: who is told what (notification policies). What they share, the actors, is basics.ts; the
 * roles are the server's. Before 3.7.5 they were one add-on, `policies`: an app-config.json that names it has all
 * three, and `policiesAddOn` registers them together.
 */
import type { IAddOn, IAddOnManifest } from '../../engine/AddOns.js';
import manifest from './addon.json' with { type: 'json' };
import { assignmentAddOn, assignmentManifest } from './assignment/index.js';
import { notificationAddOn, notificationManifest } from './notification/index.js';
import { securityAddOn, securityManifest } from './security/index.js';

export * from './assignment/index.js';
export * from './notification/index.js';
export * from './security/index.js';
export * from './actors.js';
export { registerPolicyBasics } from './basics.js';
export { assignmentAddOn, notificationAddOn, securityAddOn, assignmentManifest, notificationManifest, securityManifest };

/** The three, in the order they are registered: who works on a task is decided before anyone is told. */
export const POLICY_ADD_ONS = ['assignment', 'notification', 'security'];

/** @deprecated the three add-ons' manifests; what `policies` was before 3.7.5 */
export const policiesManifest: IAddOnManifest = manifest as IAddOnManifest;

/** @deprecated the three add-ons, registered together: what `policies` was before 3.7.5 */
export const policiesAddOn: IAddOn = {
    name: manifest.name,
    register(server) {
        for (const part of [assignmentAddOn, notificationAddOn, securityAddOn]) part.register(server);
    },
};
