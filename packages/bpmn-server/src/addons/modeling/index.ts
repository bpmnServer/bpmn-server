/**
 * The Modeling tools add-on: the model editor's Test tab (scenarios, docs/design/gherkin-testing.md) and History tab
 * (each save kept as a version, `.history/<name>/`). Its parts are the editor's and the web's; here, its manifest. Off,
 * the editor has neither tab, and a save keeps no version (the configuration's modelHistory is false).
 */
import type { IAddOn, IAddOnManifest } from '../../engine/AddOns.js';
import manifest from './addon.json' with { type: 'json' };

export const modelingManifest: IAddOnManifest = manifest;

export const modelingAddOn: IAddOn = {
    name: manifest.name,
    register() { /* nothing of the engine's */ },
};
