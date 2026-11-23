/**
 * The AI Agents add-on (docs/design/add-ons.md): a person's link for their AI agent. Its parts are bpmn-web's (the
 * /ai pages, the menu's link, the API's refusal of its links while it is off): the engine has none, so it registers
 * nothing; it is here for its manifest, and to be on or off as app-config.json says.
 */
import type { IAddOn, IAddOnManifest } from '../../engine/AddOns.js';
import manifest from './addon.json' with { type: 'json' };

export const aiManifest: IAddOnManifest = manifest as IAddOnManifest;

export const aiAddOn: IAddOn = {
    name: manifest.name,
    register() { /* bpmn-web's parts only */ },
};
