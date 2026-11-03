// npm run verify:models [--json] [model ...]
// Checks the models saved in the database (or the models folder) with verifyModel: one line per issue,
// exit code 1 when any model has errors. No model names = every saved model.
import 'dotenv/config';
import { BPMNServer, Logger } from 'bpmn-server';
import { webConfiguration } from '../start.js';
import { verifySavedModels } from '../runtime/modelVerification.js';

const argv = process.argv.slice(2);
const json = argv.includes('--json');
const names = argv.filter(a => !a.startsWith('-'));

const server = new BPMNServer(webConfiguration(), new Logger({ toConsole: false }), { cron: false });
let failed = false;
try {
	await server.ready;
	const results = await verifySavedModels(server, names);
	failed = results.some(r => !r.valid);
	if (json)
		console.log(JSON.stringify(results, null, 2));
	else {
		for (const r of results) {
			console.log(`${r.valid ? 'ok     ' : 'ERRORS '} ${r.name}`);
			for (const i of r.issues) console.log(`    ${i.severity} ${i.code}: ${i.message}`);
		}
		console.log(`${results.length} model(s), ${results.filter(r => !r.valid).length} with errors`);
	}
}
catch (err) {
	console.error(err?.message ?? err);
	failed = true;
}
finally {
	await server.shutdown();
}
process.exit(failed ? 1 : 0);
