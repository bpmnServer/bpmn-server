import { DataStore } from ".";
import { Logger } from '../common/Logger';
import { IEventData, IEventsRegistry, IBPMNServer } from "../interfaces/server";
import { ServerComponent } from "./ServerContext";
import { BPMNServer } from "./BPMNServer";


class SignalEvent implements IEventData {
	_id: any;
	signalId: string;
	processName: string;
	elementId: string;
	constructor({ signalId = null,  processName = null, elementId = null }
		: { signalId?: string, processName?, elementId?} = {}) {
		this.signalId = signalId;
		this.processName = processName;
		this.elementId = elementId;
	}
}
class TimerEvent implements IEventData {
	_id: any;
	timeDue: Date;
	processName: string;
	elementId: string;
	constructor({ timeDue = null, processName = null, elementId = null }
		: { timeDue?: Date, processName?, elementId?} = {}) {
		this.timeDue = timeDue;
		this.processName = processName;
		this.elementId = elementId;
	}
}
/*
 * to manage process Start Events (timer, message and Signal )
 *
 */
class EventsRegistry extends ServerComponent implements IEventsRegistry{

	async registerProcess(processName) {

    }
	async addEvent(event: IEventData) {
		let res = await this.dataStore.addEvent(event);
	}
	deleteEvents(query) {
		this.dataStore.deleteEvents(query);
	}
	async execute(event: IEventData,server:IBPMNServer) {

		// start a new execution

		this.deleteEvents({ _id: event._id });
	}
}

export { EventsRegistry , TimerEvent , SignalEvent}