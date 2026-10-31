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

// Load application-owned configuration only in the executable composition root,
// after environment variables have been established.
const [{ WebApp }, { sampleWorkflowApplication }] = await Promise.all([
	import('./app.js'),
	import('./sample-app/index.js'),
]);

const webApp = new WebApp(sampleWorkflowApplication);
webApp.start();

export default webApp.app;
