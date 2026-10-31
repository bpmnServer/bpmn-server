// Starts a real bpmn-web for the contract tests, with bpmn-web's own test harness
// (its test/support/webApp.mjs: own MongoDB database, own definitions, no timers, auth on).
// bpmn-web is found at BPMN_WEB_DIR, else next to this checkout (../bpmn-web), and must be built.
// When it is not there the contract tests are skipped, not failed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const WEB_DIR = path.resolve(process.env.BPMN_WEB_DIR || path.join(HERE, '../../../bpmn-web'));
const HARNESS = path.join(WEB_DIR, 'test', 'support', 'webApp.mjs');

export const available = fs.existsSync(HARNESS) && fs.existsSync(path.join(WEB_DIR, 'dist', 'app.js'));
export const skip = available ? false : `bpmn-web (built) not found at ${WEB_DIR}; set BPMN_WEB_DIR`;

/** { web, host, port, apiKey, adminApiKey, fixtures } — web.stop() when done. */
export async function startServer(options = {}) {
    const harness = await import(pathToFileURL(HARNESS).href);
    const web = await harness.startWebApp(options);
    const url = new URL(web.base);
    return {
        web,
        host: url.hostname,
        port: url.port,
        apiKey: harness.API_KEY,
        adminApiKey: harness.ADMIN_API_KEY,
        fixtures: harness.FIXTURES,
    };
}
