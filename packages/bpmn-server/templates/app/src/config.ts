// bpmn-server settings that replace bpmn-web's defaults. Leave out what you do not change.
// The defaults: models in ./processes, MongoDB at MONGO_DB_URL (.env), timers checked every 3 seconds.
// Secrets and per-machine values belong in .env, not here.
import path from 'node:path';

export const config = {
    definitionsPath: path.join(import.meta.dirname, '..', 'processes') + path.sep,
};
