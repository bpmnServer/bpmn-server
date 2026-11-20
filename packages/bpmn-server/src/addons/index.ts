/**
 * The add-ons bpmn-server comes with (engine/AddOns.ts): the policies. Each is apart from the others; this is where
 * they are put together, and a server has them unless its configuration says otherwise (`addOns`).
 */
import type { IAddOn } from '../engine/AddOns.js';
import { assignmentAddOn } from './assignment/index.js';
import { notificationAddOn } from './notification/index.js';
import { securityAddOn } from './security/index.js';

export * from './assignment/index.js';
export * from './notification/index.js';
export * from './security/index.js';

/** The policies, in the order their hooks are called: who works on a task is decided before anyone is told. */
export function policyAddOns(): IAddOn[] {
    return [assignmentAddOn, notificationAddOn, securityAddOn];
}
