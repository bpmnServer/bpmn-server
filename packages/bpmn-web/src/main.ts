import dotenv from 'dotenv';

function setupEnvVars() {
	dotenv.config();
	const argv = process.argv;
	for (let i = 2; i < argv.length; i++) {
		const key = argv[i];
		const val = argv[++i];
		process.env[key] = val;
	}
}

setupEnvVars();

// bpmn-web on its own, with its defaults (models in ./processes, WebAppDelegate); an application calls
// start() with its own settings, delegate and connectors (testSampleApp/index.ts). Loaded after the
// environment variables are established.
const { start } = await import('./start.js');

const webApp = await start();

export default webApp.app;
