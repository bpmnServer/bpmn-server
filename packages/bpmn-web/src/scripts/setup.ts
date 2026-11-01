// bpmn-web's own setup (npm run setup): the database's indexes and the first user, on bpmn-web's default configuration
import "dotenv/config";
import { start } from '../start.js';

await start({ setupOnly: true });
