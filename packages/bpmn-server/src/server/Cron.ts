import { ServerComponent } from './ServerComponent.js';

import type { ICron } from '../interfaces/server.js';

import * as duration from 'iso8601-duration';
import { CronExpressionParser } from 'cron-parser';
const parse = duration.parse;
const toSeconds = duration.toSeconds;

/** The longest delay `setTimeout` takes; a longer one is waited out in steps. */
const MAX_DELAY = 2 ** 31 - 1;

type Scheduled = { timeout: ReturnType<typeof setTimeout>; instanceId?: string };

/**
 * The server's timers: every one it schedules is its own (cancelled by `stop()`, and by an
 * instance's cancellation), keyed so that a timer is scheduled once in this process.
 *
 * Across processes, a timer fires once: before firing, the server claims it through the lock
 * port (`timer:<item>:<due>`, or `timer:process:<model>:<element>:<due>`), and an item timer
 * fires only while its item still waits. A server that stops leaves its timers in the store;
 * the others pick them up on their next re-read (`timers.pollInterval`). A claim expires after the
 * lock port's stale age, so a timer whose firing failed is tried again then.
 */
class Cron  extends ServerComponent implements ICron {

	private timersStarted = false;
	private stopped = false;
	private readonly scheduled = new Map<string, Scheduled>();
	private poller: ReturnType<typeof setInterval> | null = null;
	/** Timers this server scheduled and fired: its own counters. */
	readonly counters = { scheduled: 0, fired: 0, skipped: 0, failed: 0 };

	/** @deprecated The counters are the server's (`cron.counters`); kept for callers of the earlier form. */
	static timerScheduled(timeDue) { }
	/** @deprecated See {@link timerScheduled}. */
	static timerEnded(item) { }

	async start() {
		await this.startTimers();
		const interval = this.configuration.timers?.pollInterval ?? 60_000;
		if (interval > 0 && !this.poller && !this.stopped) {
			this.poller = setInterval(() => { void this.checkTimers().catch(error => this.report(error)); }, interval);
			this.poller.unref?.();
		}
	}
	/** Cancels every timer this server owns, and its re-reads. */
	stop(): void {
		this.stopped = true;
		this.timersStarted = false;
		if (this.poller) clearInterval(this.poller);
		this.poller = null;
		for (const { timeout } of this.scheduled.values()) clearTimeout(timeout);
		this.scheduled.clear();
	}
	/** How many timers are scheduled now. */
	get pending(): number { return this.scheduled.size; }

	async startTimers() {
		this.stopped = false;
		if (this.timersStarted)
			return;
		this.timersStarted = true;

		try {
			await this.definitions.rebuild();
		}
		catch(exc)
		{
			// A model that does not load is reported; the timers of the others still start.
			this.report(exc);
		}
		const events = await this.definitions.findEvents({ "events.subType": "Timer" });
		for (const entry of events) {
			if (entry.timeDue) this.scheduleProcess(entry);
		}
		await this.checkTimers();
	}
	/** Schedules every waiting timer item in the store that this server has not scheduled yet: recovery at start, and the periodic re-read. */
	async checkTimers(duration = 0) {
		if (this.stopped) return;
		const items = await this.dataStore.findItems({ "items.timeDue": { $exists: true }, "items.status": "wait" });
		for (const item of items) {
			if (item.timeDue) this.scheduleItem(item);
		}
		const locker: any = this.lockManager;
		if (typeof locker.purgeClaims === 'function') await locker.purgeClaims();
	}
	/** Schedules a timer item's `onDue` (the Timer behaviour's own firing), claimed first, unless this server has already scheduled it. */
	scheduleItemTimer(item: { id: string; timeDue: any; instanceId?: string }, onDue: () => Promise<void>) {
		const due = Cron.time(item.timeDue);
		this.schedule('item:' + item.id, due - Date.now(), item.instanceId, () => this.fireClaimed(`timer:${item.id}:${due}`, onDue));
	}
	/** Cancels the timers of one instance (its cancellation). */
	cancelInstance(instanceId: string) {
		for (const [key, entry] of this.scheduled) {
			if (entry.instanceId === instanceId) { clearTimeout(entry.timeout); this.scheduled.delete(key); }
		}
	}

	private scheduleItem(item) {
		const due = Cron.time(item.timeDue);
		this.schedule('item:' + item.id, due - Date.now(), item.instanceId,
			() => this.fireClaimed(`timer:${item.id}:${due}`, () => this.itemTimerExpired(item)));
	}
	private async itemTimerExpired(entry: any) {
		// The item may have moved on (completed, cancelled, fired by another server) since it was read.
		const current = (await this.dataStore.findItems({ 'items.id': entry.id }))[0];
		if (!current || current.status !== 'wait') { this.counters.skipped++; return; }
		await this.engine.invoke({ 'items.id': entry.id }, null);
	}
	private async processTimerExpired(event: any) {
		await this.definitions.updateTimer(event.modelName);
		event.referenceDateTime = new Date().getTime();
		this.scheduleProcess(event);
		await this.engine.start(event.modelName, null, null, event.elementId);
	}
	private scheduleProcess(entry) {
		const delay = Cron.timeDue(entry.expression, entry.referenceDateTime);
		if (delay === null || !Number.isFinite(delay)) return;
		const ms = Math.max(delay * 1000, 100);
		const due = Date.now() + ms;
		this.logger.log('scheduling process ' + entry.modelName + ' at ' + new Date(due));
		const key = 'process:' + entry.modelName + ':' + entry.elementId;
		this.schedule(key, ms, undefined, () => this.fireClaimed(`timer:${key}:${Math.round(due / 1000)}`, () => this.processTimerExpired(entry)));
	}
	/** One timer, owned by this server, once per key; a delay longer than `setTimeout` takes is waited out in steps. */
	private schedule(key: string, delayMs: number, instanceId: string | undefined, fire: () => Promise<void>) {
		if (this.stopped || this.scheduled.has(key)) return;
		const delay = Math.max(Number.isFinite(delayMs) ? delayMs : 0, 1);
		const step = Math.min(delay, MAX_DELAY);
		const timeout = setTimeout(() => {
			this.scheduled.delete(key);
			if (this.stopped) return;
			if (delay > MAX_DELAY) return this.schedule(key, delay - MAX_DELAY, instanceId, fire);
			void fire().catch(error => { this.counters.failed++; this.report(error); });
		}, step);
		this.scheduled.set(key, { timeout, instanceId });
		this.counters.scheduled++;
	}
	/** Fires `fire` when this server wins the claim on `claim`; otherwise another server has fired, or is firing, it. */
	private async fireClaimed(claim: string, fire: () => Promise<void>) {
		const locker: any = this.lockManager;
		if (typeof locker.claim === 'function' && !(await locker.claim(claim))) {
			this.counters.skipped++;
			this.logger.log(`timer ${claim} is claimed by another server: not fired here`);
			return;
		}
		this.counters.fired++;
		await fire();
	}
	private report(error) {
		if (typeof this.logger.reportError === 'function') this.logger.reportError(error);
		else console.error(error);
	}
	/** A due time as milliseconds: stored as a number, a Date, or (by a JSON store) an ISO string. */
	static time(value): number {
		if (typeof value === 'number') return value;
		return new Date(value).getTime();
	}

	static checkCron(expression,referenceDateTime) {


		const now = new Date().getTime();

		try {
			var options = {
				currentDate: referenceDateTime
			};

			const interval = CronExpressionParser.parse(expression, options);
			const next = interval.next();
			const delay = (next.getTime()- now)/1000;
			return delay;
		} catch (err) {
			return null;
		}

    }
	static timeDue(expression,referenceDateTime) {
		if (expression) {
			let baseDate = new Date();
			let delay;
			const now = new Date().getTime();
			if (referenceDateTime) {
				baseDate = new Date(referenceDateTime);
			}
			try {
				delay = Cron.checkCron(expression, baseDate);
				if (!delay) {
					delay = toSeconds(parse(expression));
					if (referenceDateTime) {
						delay += (referenceDateTime - now) / 1000;
					}
				}
			}
			catch (exc) {
				return null;
            }

			return delay;
		}
		return null;
    }
}

export { Cron};
