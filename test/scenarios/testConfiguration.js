// The scenarios' configuration: the engine's own MongoDB storage (BPMN_TEST_MONGO_URL, default the
// local server), in a database of their own that each run empties first (helpers/setup.js), and the
// models in ./processes.
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { Configuration, ModelsDatastore, DataStore, NoCacheManager, ScriptHandler } from '../../dist/index.js';
import { ScenarioDelegate } from './app/ScenarioDelegate.js';

const here = dirname(fileURLToPath(import.meta.url));
export const MONGO_URL = process.env.BPMN_TEST_MONGO_URL || 'mongodb://127.0.0.1:27017';
export const DATABASE = process.env.BPMN_SCENARIOS_DB || 'bpmn_scenarios';

export const configuration = new Configuration({
    definitionsPath: here + '/processes/',
    templatesPath: here + '/emailTemplates',
    timers: { precision: 3000 },
    database: { MongoDB: { db_url: MONGO_URL, db: DATABASE } },
    apiKey: 'scenarios',
    definitions: (server) => new ModelsDatastore(server),
    appDelegate: (server) => new ScenarioDelegate(server),
    dataStore: (server) => {
        const ds = new DataStore(server);
        ds.enableSavePoints = true;
        return ds;
    },
    scriptHandler: () => new ScriptHandler(),
    cacheManager: (server) => new NoCacheManager(server),
});
