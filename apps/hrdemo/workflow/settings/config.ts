// bpmn-server settings that replace bpmn-web's defaults. Leave out what you do not change. Everything of the workflows
// is in this folder (workflow/): the models, their tests, the delegate, the services and the element templates.
// Secrets and per-machine values belong in .env, not here.
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');

/** The element templates the model editor offers (*.json); their services are in connectors/appServices.ts. */
export const connectorsPath = path.join(ROOT, 'connectors');

/** Read when called: DEFINITIONS_PATH (the tests' own folder) wins over processes/. */
export function config() {
    return {
        definitionsPath: process.env.DEFINITIONS_PATH || path.join(ROOT, 'processes') + path.sep,
        // the delegate's services, as npm run services lists them
        servicesFile: path.join(ROOT, 'services.json'),
    };
}
