const { Engine } = require('bpmn-engine');

import { EventEmitter } from 'events';

const { v4: uuidv4 } = require('uuid');


/***
 *	============================================================
 * */
class WFInstance {
	id;
	name;
	startAt;
	endAt;
	data;
	state;
	lastAt;
	lastItem;
	lastStatus;
	items = new Map();
	logs = [];
	engineClassPath;
	dbAction;
	modified = false;

	constructor(action = '') {
		this.dbAction = action;
		this.id = getUUID();
		this.startAt = new Date().toISOString();
		this.logs = [];
		this.items = new Map();
	}
	getDataObject() {
		return {
			id: this.id,
			name: this.name,
			startAt: this.startAt,
			endAt: this.endAt,
			lastAt: this.lastAt,
			lastItem: this.lastItem,
			lastStatus: this.lastStatus,
			engineClassPath: this.engineClassPath,
			data: this.data
		}
	}
	fromDataObject(instanceObj) {
		this.id = instanceObj.id;
		this.name = instanceObj.name;
		this.startAt = instanceObj.startAt;
		this.endAt = instanceObj.endAt;
		this.lastAt = instanceObj.lastAt;
		this.lastItem = instanceObj.lastItem;
		this.lastStatus = instanceObj.lastStatus;

		this.data = instanceObj.data;
		this.items = new Map();
		this.state = instanceObj.state;
		this.logs = instanceObj.logs;
    }
	getItems({ status = null, name = null }) : any[]{
		let items = [];
		this.items.forEach(item => {
			let take = true;
			if (status && (item.status != status)) take = false;
			if (name && (item.name != name)) take = false;

			if (take)
				items.push(item);
		});
		return items;
	}
	// is called after any changes happening in background to see if save is already invoked
}

function getUUID() {

	return uuidv4(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a' 

}
export { WFInstance };
