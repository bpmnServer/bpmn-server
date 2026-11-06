/**
 * The settings bpmn-web checks before it starts. In production (NODE_ENV=production) a setting that
 * leaves the server open is an error and the server does not start; elsewhere it is a warning.
 *
 *   SESSION_SECRET unset            sessions and CSRF tokens cannot be secured
 *   API_KEY unset                   /api and /api2 reject every request (they fail closed)
 *   REQUIRE_AUTHENTICATION=false    anyone can use the web pages as an administrator;
 *                                   allowed in production only with ALLOW_INSECURE_NO_AUTH=true
 *
 * The public demo modes (GUEST_ACCESS, DEMO_MODE) check their own settings (guests/guests.ts);
 * they need sessions too, so SESSION_SECRET applies to them as well.
 */
export interface BootConfigReport {
	errors: string[];
	warnings: string[];
}

type Env = Record<string, string | undefined>;

const isProduction = (env: Env) => (env.NODE_ENV ?? '').toLowerCase() === 'production';
const isTrue = (value?: string) => (value ?? '').toLowerCase() === 'true';

/** What the server will serve: the API checks apply only with the APIs, the sign-in checks only with the pages. */
export interface BootParts {
	api?: boolean;
	ui?: boolean;
}

export function checkBootConfig(env: Env = process.env, parts: BootParts = {}): BootConfigReport {
	const { api = true, ui = true } = parts;
	const production = isProduction(env);
	const errors: string[] = [];
	const warnings: string[] = [];
	const unsafe = (message: string) => (production ? errors : warnings).push(message);

	if (!env.SESSION_SECRET)
		unsafe('SESSION_SECRET is not set: sessions and CSRF tokens cannot be secured.');
	if (api && !env.API_KEY)
		unsafe('API_KEY is not set: /api and /api2 will reject all requests (fail closed).');
	if (api && env.API_ACTING_USER_KEY && env.API_ACTING_USER_KEY === env.API_KEY)
		unsafe('API_ACTING_USER_KEY is the same as API_KEY: it must be a secret of its own.');
	if (api && (!env.API_SERVICE_USER_NAME || !env.API_SERVICE_USER_GROUPS))
		warnings.push('API_SERVICE_USER_NAME and API_SERVICE_USER_GROUPS are required for /api2.');
	if (ui && env.REQUIRE_AUTHENTICATION === 'false') {
		if (production && !isTrue(env.ALLOW_INSECURE_NO_AUTH))
			errors.push('REQUIRE_AUTHENTICATION=false in production: the web pages would be open to anyone. '
				+ 'Set ALLOW_INSECURE_NO_AUTH=true to start anyway.');
		else
			warnings.push('REQUIRE_AUTHENTICATION=false: UI authentication is DISABLED (dev only).');
	}
	return { errors, warnings };
}

/** Logs the report; returns false when the server must not start. */
export function reportBootConfig(report: BootConfigReport, log: Pick<Console, 'warn' | 'error'> = console): boolean {
	if (report.warnings.length) log.warn('[config] ' + report.warnings.join('\n[config] '));
	if (report.errors.length) {
		log.error('[config] refusing to start:\n[config] ' + report.errors.join('\n[config] '));
		return false;
	}
	return true;
}
