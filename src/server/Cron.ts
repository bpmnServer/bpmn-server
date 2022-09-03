
import { Logger } from '../common/Logger';

import { ServerComponent } from './ServerComponent';

import { IEventData, ICron } from '../..';

const duration = require('iso8601-duration');
const parse = duration.parse;
const end = duration.end;
const toSeconds = duration.toSeconds;



class Cron  extends ServerComponent implements ICron {

	private static timersStarted = false;
	private static checkingTimers = false;
	private static timersFired = 0;

	static timerScheduled(timeDue) {
		Cron.timersFired++;
    }
	static timerEnded(item) {
		Cron.timersFired--;

    }
	async checkTimers(duration = 0) {
		return;
	}
	async start() {
		this.startTimers();
    }
	async startTimers() {

		if (Cron.timersStarted)
			return;
		Cron.timersStarted = true;

		await this.definitions.rebuild();

		this.logger.log("Start timers");

		let promises = [];
		const self = this;
		try {

			let precision = this.configuration.timers.precision;
			if (!precision)
				precision = 3000;
			let target = new Date().getTime();
			let query, list, i;
			target += precision;

			query = { "events.subType": "Timer" };
			list = await self.definitions.findEvents(query);

			for (i = 0; i < list.length; i++) {
				let entry = list[i];
				if (entry.timeDue) {
					this.scheduleProcess(entry)
				}
			}

			// { "items.timeDue": { $lt: new ISODate("2020-06-14T19:44:38.541Z") } }	
			// query = { "items.timeDue": { $lt: target } };
			query = { "items.timeDue": { $exists: true }, "items.status": "wait" };
			
			//query = { query: { "items.timeDue": { $lt: new Date(target).toISOString() } } };
			//query = { items: {timeDue: { $lt: new Date(target).toISOString() } }};
			list = await this.dataStore.findItems(query);
			this.logger.log("...items query returend " + list.length);
			for (i = 0; i < list.length; i++) {
				let item = list[i];
				if (item.timeDue) {
					let now = new Date();
					self.logger.log(`...checking timer: ${item.timeDue}`);

					this.scheduleItem(item);
				}
			}
		}
		catch (exc) {
			console.log(exc);
		}
		await Promise.all(promises);

		//this.logger.log("... all timers are done.");
	}

	private async itemTimerExpired() {
		const entry: any = this as any;
			await entry.cron.engine.invoke({ "items.id": entry.id }, null); 
	}
	private async processTimerExpired() {
		const params: any = this as any;
		const event = params.entry;
		const cron = params.cron;

		await cron.definitions.updateTimer(event.modelName);

		event.referenceDateTime = new Date().getTime();
		cron.scheduleProcess(event);

		await cron.engine.start(event.modelName, null, null, event.elementId);
	}
	private scheduleProcess( entry) {
		const delay = Cron.timeDue(entry.expression,entry.referenceDateTime);
		if (delay) {

			const scheduleAt = new Date(delay * 1000 + new Date().getTime());
			console.log("scheduling process " + entry.modelName + " delayed by " + delay + " seconds, scheduled at: " + scheduleAt );
			if (delay < 0)
				setTimeout(this.processTimerExpired.bind({ entry, cron: this }), 100);
			else 
				setTimeout(this.processTimerExpired.bind({ entry, cron: this }), delay * 1000);

        }
	}
	private scheduleItem(entry) {

		const now = new Date().getTime();
		let delay;
		delay = entry.timeDue - now;
		if (delay < 0) delay = .1;
		entry.cron = this;
		setTimeout(this.itemTimerExpired.bind(entry), delay * 1000);
	}

	static checkCron(expression,referenceDateTime) {

		var parser = require('cron-parser');
		const now = new Date().getTime();

		try {
			var options = {
				currentDate: referenceDateTime
			};

			const interval = parser.parseExpression(expression, options);
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
				if (delay) {
					console.log(" expression " + expression + " base date" + baseDate+ " -> delay of " + delay + " sec " + delay / 60 + " min" + delay/3600 + " hours ");
				}
				else {
					delay = toSeconds(parse(expression));
					if (referenceDateTime) {
						delay += (referenceDateTime - now) / 1000;
					} 
					console.log(" expression " + expression + " base date" + baseDate + " -> delay of " + delay + " sec " + delay / 60 + " min" + delay / 3600 + " hours ");
				}
			}
			catch (exc) {
				console.log(exc);
				return null;
            }

			return delay;
		}
		return null;
    }

}


export { Cron};
