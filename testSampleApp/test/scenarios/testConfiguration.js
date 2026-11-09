// The scenarios' configuration: the engine's own MongoDB storage (BPMN_TEST_MONGO_URL, default the
// local server), in a database of their own that each run empties first (helpers/setup.js), the
// models in testSampleApp/processes, and the application's delegate (delegates/appDelegate.ts).
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { Configuration, ModelsDatastore, DataStore, NoCacheManager, ScriptHandler } from 'bpmn-web';
import { AppDelegate } from '../../delegates/appDelegate.ts';

const here = dirname(fileURLToPath(import.meta.url));
export const MONGO_URL = process.env.BPMN_TEST_MONGO_URL || 'mongodb://127.0.0.1:27017';
export const DATABASE = process.env.BPMN_SCENARIOS_DB || 'bpmn_scenarios';

export const configuration = new Configuration({
    definitionsPath: here + '/../../processes/',
    templatesPath: here + '/emailTemplates',
    timers: { precision: 3000 },
    database: { MongoDB: { db_url: MONGO_URL, db: DATABASE } },
    apiKey: 'scenarios',
    definitions: (server) => new ModelsDatastore(server),
    appDelegate: (server) => new AppDelegate(server),
    dataStore: (server) => {
        const ds = new DataStore(server);
        ds.enableSavePoints = true;
        return ds;
    },
    scriptHandler: () => new ScriptHandler(),
    cacheManager: (server) => new NoCacheManager(server),
});
