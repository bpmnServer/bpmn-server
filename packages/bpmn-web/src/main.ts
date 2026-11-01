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

function warnBootConfig() {
	const warnings: string[] = [];
	if (!process.env.API_KEY) warnings.push('API_KEY is not set — /api and /api2 will reject all requests (fail closed).');
	if (!process.env.API_SERVICE_USER_NAME || !process.env.API_SERVICE_USER_GROUPS)
		warnings.push('API_SERVICE_USER_NAME and API_SERVICE_USER_GROUPS are required for /api2.');
	if (!process.env.SESSION_SECRET) warnings.push('SESSION_SECRET is not set — sessions/CSRF cannot be secured.');
	if (process.env.REQUIRE_AUTHENTICATION === 'false') warnings.push('REQUIRE_AUTHENTICATION=false — UI authentication is DISABLED (dev only).');
	if (warnings.length) console.warn('[config] ' + warnings.join('\n[config] '));
}

setupEnvVars();
warnBootConfig();

// bpmn-web on its own, with its defaults (models in ./processes, WebAppDelegate); an application calls
// start() with its own settings, delegate and connectors (testSampleApp/index.ts). Loaded after the
// environment variables are established.
const { start } = await import('./start.js');

const webApp = await start();

export default webApp.app;
