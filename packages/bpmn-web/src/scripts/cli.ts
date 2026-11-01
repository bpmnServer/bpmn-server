// bpmn-web's own console (npm run cli), on bpmn-web's default configuration
import "dotenv/config";
import { start } from '../start.js';

await start({ console: true });
