// npm run upgrade:running -- [--dry-run] [--json] [model ...]   (see runtime/upgradeRunning.ts)
// Exit code 1 when something needs attention: a refused model, a stranded, busy or failed instance.
import 'dotenv/config';
import { BPMNServer, Logger } from 'bpmn-server';
import { webConfiguration } from '../start.js';
import { parseUpgradeArgs, upgradeUsage, formatUpgradeReport, summarizeUpgrade } from '../runtime/upgradeRunning.js';

const args = parseUpgradeArgs(process.argv.slice(2));
if (args.help || args.unknown.length) {
	if (args.unknown.length) console.error(`unknown option ${args.unknown.join(' ')}`);
	console.log(upgradeUsage);
	process.exit(args.help ? 0 : 2);
}

const server = new BPMNServer(webConfiguration(), new Logger({ toConsole: false }), { cron: false });
let code = 0;
try {
	await server.ready;
	const reports = await server.engine.upgradeRunning(args.models, { dryRun: args.dryRun });
	console.log(args.json ? JSON.stringify(reports, null, 2) : formatUpgradeReport(reports, args.dryRun));
	if (summarizeUpgrade(reports).attention) code = 1;
}
catch (err) {
	console.error(err?.message ?? err);
	code = 1;
}
finally {
	await server.shutdown();
}
process.exit(code);
