/**
 * Engine settings an operator sets in the environment rather than in code:
 *
 *   LOCK_RETRY_DELAY_MS        how long to wait between tries for a locked instance
 *   LOCK_MAX_TRIES             how many tries before giving up on a locked instance
 *   LOCK_STALE_AFTER_MS        a lock older than this is taken over (its owner is presumed dead)
 *   ENGINE_SHUTDOWN_TIMEOUT_MS how long a stopping server lets running executions finish
 *   MONGO_DB_NAME              the database, when MONGO_DB_URL does not name one
 *
 * Unset or invalid values are left out, so bpmn-server's defaults apply. (SERVER_ID, this process's
 * name in the locks it takes, is read by bpmn-server's InstanceLocker itself.)
 */
type Env = Record<string, string | undefined>;

function positiveInt(env: Env, name: string, invalid: string[]): number | undefined {
	const raw = env[name];
	if (raw === undefined || raw.trim() === '') return undefined;
	const value = Number(raw);
	if (Number.isInteger(value) && value > 0) return value;
	invalid.push(`${name}=${raw} is not a positive whole number; using the default`);
	return undefined;
}

export interface EngineEnvSettings {
	locks?: { retryDelay?: number; maxTries?: number; staleAfter?: number };
	shutdownTimeout?: number;
	db?: string;
	/** settings that were set but not usable */
	invalid: string[];
}

export function engineSettingsFromEnv(env: Env = process.env): EngineEnvSettings {
	const invalid: string[] = [];
	const settings: EngineEnvSettings = { invalid };
	const locks: EngineEnvSettings['locks'] = {};
	const retryDelay = positiveInt(env, 'LOCK_RETRY_DELAY_MS', invalid);
	const maxTries = positiveInt(env, 'LOCK_MAX_TRIES', invalid);
	const staleAfter = positiveInt(env, 'LOCK_STALE_AFTER_MS', invalid);
	if (retryDelay !== undefined) locks.retryDelay = retryDelay;
	if (maxTries !== undefined) locks.maxTries = maxTries;
	if (staleAfter !== undefined) locks.staleAfter = staleAfter;
	if (Object.keys(locks).length) settings.locks = locks;
	const shutdownTimeout = positiveInt(env, 'ENGINE_SHUTDOWN_TIMEOUT_MS', invalid);
	if (shutdownTimeout !== undefined) settings.shutdownTimeout = shutdownTimeout;
	if (env.MONGO_DB_NAME?.trim()) settings.db = env.MONGO_DB_NAME.trim();
	return settings;
}
