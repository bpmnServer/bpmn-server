
import { Logger } from '../common/Logger';

import { ServerComponent } from './ServerContext';

import { IEventData } from '../..';

class Cron  extends ServerComponent {

	private static checkingTimers = false;
	private static timersFired = 0;

	static timerScheduled(timeDue) {
		Cron.timersFired++;
    }
	static timerEnded(item) {
		Cron.timersFired--;

    }
	async checkTimers(duration = 0) {

		await this._checkTimers();
		if (duration > 0)
			setTimeout(this.checkTimers.bind(this, duration), duration);
	}
	async start() {
		this.checkTimers(5000);
    }
	private async _checkTimers() {
		if (Cron.checkingTimers || Cron.timersFired==0)
			return;

		this.logger.log("Checking timers"+ Cron.timersFired);

		Cron.checkingTimers = true;
		let precision = this.configuration.timers.precision;
		if (!precision)
			precision = 3000;
		let target = new Date().getTime();
		let query, list, i;
		target += precision;

		const self = this;
		/* Todo
		query = { "timeDue": { $lt: new Date(target).toISOString() } };
		list = await this.findEvents(query);

		for (i = 0; i < list.length; i++) {
			let entry = list[i];
			if (entry.timeDue) {
				let now = new Date();
				self.logger.log(`checking timer: ${entry.timeDue.getTime()}  vs now: ${now.getTime()}`);
//				if (entry.timeDue.getTime() < now.getTime()) {
					self.logger.log("process timer is now due");
					//await this.execute(entry, server);
//				}
			}
		}
		*/
		// { "items.timeDue": { $lt: new ISODate("2020-06-14T19:44:38.541Z") } }	
		query = { "items.timeDue": { $lt: target } };
		//query = { query: { "items.timeDue": { $lt: new Date(target).toISOString() } } };
		//query = { items: {timeDue: { $lt: new Date(target).toISOString() } }};
		list = await this.dataStore.findItems(query);
		this.logger.log("items query returend " + list.length);
		let promises = [];
		for (i = 0; i < list.length; i++) {
			let item = list[i];
			if (item.timeDue) {
				self.logger.log(item.timeDue);
				let now = new Date();
				self.logger.log(`checking timer: ${item.timeDue}  vs ${now.getTime()}`);
//				if (item.timeDue < now.getTime()) {
					self.logger.log("timer is now due for item:" + item.elementId+ " status:"+ item.status + " "+item.id);
				await self.engine.invoke({"items.id": item.id }, null);
//				}
			}
		}
		await Promise.all(promises);
		this.logger.log(" all timers are done.");
		Cron.checkingTimers = false;
	}
	private async findEvents(query): Promise<IEventData[]> {
		return null;	// todo
	}
	private async findEventById(signalId: string): Promise<IEventData> {
		return null;	// todo 
	}
}


export { Cron};
