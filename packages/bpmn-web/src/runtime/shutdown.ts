/**
 * Stopping bpmn-web (SIGTERM, SIGINT): stop taking requests, let the engine finish what it is running
 * and release its locks, then close the database. A step cut off half-way leaves its instance locked
 * until the lock goes stale, and its last changes unsaved; stopping the engine first avoids that.
 *
 * Each stage is bounded so a stuck connection cannot block a restart: the whole shutdown is given
 * the engine's own timeout plus `graceMs`, then the process exits with code 1.
 */
export interface ShutdownParts {
	/** the HTTP server; close() stops accepting connections and calls back once in-flight requests end */
	server?: { close(callback: (err?: Error) => void): unknown };
	/** the engine; shutdown() stops timers and waits for running executions */
	bpmnServer?: { shutdown(): Promise<unknown> };
	/** closes the database connections (mongoose, ...) */
	closeDatabase?: () => Promise<unknown> | unknown;
	/** the engine's shutdownTimeout (default 10 s) */
	engineTimeoutMs?: number;
	/** extra time for the HTTP server and the database (default 5 s) */
	graceMs?: number;
	log?: Pick<Console, 'log' | 'error'>;
}

export interface ShutdownResult {
	/** every stage finished before the deadline */
	clean: boolean;
	/** stages that failed or did not finish */
	problems: string[];
}

function withDeadline<T>(work: Promise<T>, ms: number, what: string): Promise<T> {
	let timer;
	const deadline = new Promise<never>((_, reject) => {
		// kept referenced: a shutdown waiting on a stuck stage must still reach its deadline and report it
		timer = setTimeout(() => reject(new Error(`${what} did not finish within ${ms} ms`)), ms);
	});
	return Promise.race([work, deadline]).finally(() => clearTimeout(timer));
}

export async function gracefulShutdown(parts: ShutdownParts): Promise<ShutdownResult> {
	const { server, bpmnServer, closeDatabase, log = console } = parts;
	const engineTimeoutMs = parts.engineTimeoutMs ?? 10_000;
	const graceMs = parts.graceMs ?? 5_000;
	const problems: string[] = [];
	const stage = async (what: string, ms: number, work: () => Promise<unknown>) => {
		try {
			await withDeadline(Promise.resolve().then(work), ms, what);
		}
		catch (err) {
			problems.push(`${what}: ${err?.message ?? err}`);
			log.error(`shutdown: ${what} failed: ${err?.message ?? err}`);
		}
	};

	// stop taking requests first, without waiting: a long request should not hold up the engine
	const httpClosed = server
		? new Promise<void>((resolve, reject) => server.close(err => (err ? reject(err) : resolve())))
		: Promise.resolve();
	httpClosed.catch(() => {});

	if (bpmnServer)
		await stage('engine shutdown', engineTimeoutMs + graceMs, () => bpmnServer.shutdown());
	await stage('HTTP server close', graceMs, () => httpClosed);
	if (closeDatabase)
		await stage('database close', graceMs, async () => closeDatabase());

	return { clean: problems.length === 0, problems };
}
