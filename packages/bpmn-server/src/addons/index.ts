/**
 * The add-ons bpmn-server comes with (engine/AddOns.ts), and which are on. Each is apart from the others; this is where
 * they are put together. The application's `app-config.json` says which are on (`{ "addOns": ["policies"] }`); with no
 * file, or no `addOns` in it, every one is on, so an application written before keeps what it had.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { IAddOn, IAddOnManifest } from '../engine/AddOns.js';
import { policiesAddOn, policiesManifest } from './policies/index.js';
import { labelsAddOn, labelsManifest } from './labels/index.js';
import { formsAddOn, formsManifest } from './forms/index.js';
import { modelingAddOn, modelingManifest } from './modeling/index.js';

export * from './policies/index.js';
export * from './labels/index.js';
export * from './forms/index.js';
export * from './modeling/index.js';

/** Every add-on bpmn-server comes with, by name, and its manifest (read even when it is off). */
const AVAILABLE: { addOn: IAddOn; manifest: IAddOnManifest }[] = [
    { addOn: policiesAddOn, manifest: policiesManifest },
    { addOn: labelsAddOn, manifest: labelsManifest },
    { addOn: formsAddOn, manifest: formsManifest },
    { addOn: modelingAddOn, manifest: modelingManifest },
];

export const APP_CONFIG_FILE = 'app-config.json';

/** The application's `app-config.json` (the working folder's, or the one given), or null when there is none. */
export function readAppConfig(file = path.resolve(APP_CONFIG_FILE)): { addOns?: string[];[more: string]: any } | null {
    if (!fs.existsSync(file)) return null;
    const config = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (config.addOns !== undefined && (!Array.isArray(config.addOns) || config.addOns.some(a => typeof a !== 'string')))
        throw new Error(`${file}: addOns is a list of add-on names: ["policies"]`);
    return config;
}

/** The manifests of every add-on bpmn-server comes with, on or off. */
export function addOnManifests(): IAddOnManifest[] {
    return AVAILABLE.map(a => a.manifest);
}

/**
 * The add-ons that are on: those `app-config.json` names, in bpmn-server's order; every one with no file or no
 * `addOns`. A name that isn't an add-on is reported (`warn`) and left out.
 */
export function enabledAddOns(file?: string, warn: (message: string) => void = console.warn): IAddOn[] {
    const names = readAppConfig(file)?.addOns;
    if (!names) return AVAILABLE.map(a => a.addOn);
    for (const name of names.filter(n => !AVAILABLE.some(a => a.manifest.name === n)))
        warn(`[add-ons] ${APP_CONFIG_FILE} names '${name}', which is not an add-on (${AVAILABLE.map(a => a.manifest.name).join(', ')})`);
    return AVAILABLE.filter(a => names.includes(a.manifest.name)).map(a => a.addOn);
}

/** The Policies add-on, alone: what a server had before `app-config.json`. */
export function policyAddOns(): IAddOn[] {
    return [policiesAddOn];
}
