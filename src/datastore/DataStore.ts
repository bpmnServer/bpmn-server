import { Execution } from '../engine/Execution';
import { IDataStore, IBPMNServer, IInstanceData } from '../interfaces';

import { ServerComponent } from '../server/ServerComponent';
import { Authorization, Involvement, Assignment, Notification } from '../acl/';
import { ACL } from '../server/ACL';


const fs = require('fs');

const MongoDB = require('./MongoDB').MongoDB;


const Instance_collection = 'wf_instances';
const Events_collection = 'wf_events';


class DataStore extends ServerComponent  implements IDataStore {

	dbConfiguration;
	db;

	execution: Execution;
	isModified = false;
	isRunning = false;
	inSaving = false;
	promises = [];

	constructor(server: IBPMNServer) {
		super(server);

		this.dbConfiguration = this.configuration.database.MongoDB;
		this.db = new MongoDB(this.dbConfiguration, this.logger);

	}
	/*monitorExecution(execution: Execution) {
		this.execution = execution;
		const listener = execution.listener;
	} */

	async save(instance) {
		return this.saveInstance(instance);
	}
	async loadInstance(instanceId) {

		const recs = await this.findInstances({ id: instanceId }, 'full');
		if (recs.length == 0) {

			this.logger.error("Instance is not found for this item");
			return null;
		}
		const instanceData = recs[0];

//		this.logger.log(" instance obj found" + instanceData.id);

		return { instance: instanceData, items: this.getItemsFromInstances([instanceData]) };
	}

	private getItemsFromInstances(instances, condition = null) {
		const items = [];
		instances.forEach(instance => {
			instance.items.forEach(i => {
				let pass = true;

				if (condition) {
					const keys = Object.keys(condition);
					keys.forEach(key => {
						if (i[key] != condition[key])
							pass = false;
					});
				}
				if (pass) {
					i['processName'] = instance.name;
					i['data'] = instance.data;
					i['instanceId'] = instance.id;
					items.push(i);
				}
			});
		});
		return items.sort(function (a, b) { return (a.seq - b.seq); });
	}
	// save instance to DB
	static seq = 0;
	private async saveInstance(instance) {
//		this.logger.log("Saving...");


		//var json = JSON.stringify(instance.state, null, 2);
		const tokensCount = instance.tokens.length;
		let itemsCount = instance.items.length;
//		this.logger.log('saving instance ' + tokensCount + " tokens and items: " + itemsCount);

		var recs;
		if (!instance.saved) {
			instance.saved = new Date().toISOString();

			//this.promises.push(this.db.insert(this.dbConfiguration.db, Instance_collection, [instance]));
			//this.promises.push(this.db.insert(this.dbConfiguration.db, Instance_collection, [instance]));
			await this.db.insert(this.dbConfiguration.db, Instance_collection, [instance]);

//			this.logger.log("inserting instance");
		}
		else {
			this.promises.push(this.db.update(this.dbConfiguration.db, Instance_collection,
				{ id: instance.id },
				{
					$set:
					{
						tokens: instance.tokens, items: instance.items, loops: instance.loops,
						endedAt: instance.endedAt, status: instance.status, saved: instance.saved,
						logs: instance.logs, data: instance.data,
						involvements: instance.involvements,
						authorizations: instance.authorizations

					}
				}));

//			this.logger.log("updating instance");
		}
		/*t fileName = instance.name + '_' + DataStore.seq++ + '.state';
		await fs.writeFile(fileName, JSON.stringify(instance), function (err) {
			if (err) throw err;
		});*/

		await Promise.all(this.promises);
		this.logger.log('..DataStore:saving Complete');

	}

	async findItem(query) {
		let results = await this.findItems(query);
		if (results.length == 0)
			throw Error(" No items found for " + JSON.stringify(query));
		else if (results.length > 1)
			throw Error(" More than one record found " + results.length + JSON.stringify(query));
		else
			return results[0];

	}
	async findInstance(query, options): Promise<IInstanceData> {

		let results = await this.findInstances(query, options);
		if (results.length == 0)
			throw Error(" No instance found for " + JSON.stringify(query));
		else if (results.length > 1)
			throw Error(" More than one record found " + results.length + JSON.stringify(query));

		const rec = results[0];

		this.convertColl(rec.authorizations, Authorization);
		this.convertColl(rec.involvements, Involvement);
		rec.items.forEach(item => {
			this.convertColl(item.authorizations, Authorization);
			this.convertColl(item.assignments, Assignment);
			this.convertColl(item.notifications, Notification);

		});
		return rec;

	}
	convertObj(obj, cls) {
		return Object.assign(new cls,obj);

    }
	convertColl(coll, cls) {
		if (coll)
		{
		for (let i = 0; i < coll.length; i++) {
			const el = coll[i];
			coll[i] = Object.assign(new cls, el);
			}
		}

    }
	async findInstances(query, option: 'summary' | 'full' | any ='summary') {

		let projection;

		if (option == 'summary')
			projection = { source: 0, logs: 0 };
		else
			projection = {};

		var records = await this.db.find(this.dbConfiguration.db, Instance_collection, query, projection);
		return records;
	}
	/**
            * scenario:
            * itemId			{ items { id : value } }
            * itemKey			{ items {key: value } }
            * instance, task	{ instance: { id: instanceId }, items: { elementId: value }}
            * message			{ items: { messageId: nameofmessage, key: value } {}
            * status			{ items: {status: 'wait' } }
            * custom: { query: query, projection: projection }

	New approach:
		just like MongoDB
	        * itemId			{ items { id : value } }
            * itemKey			{ items {key: value } }
            * instance, task	{  id: instanceId , items.elementId: value }
            * message			{ items.messageId: nameofmessage, key: value } {}
            * status			{ items.status: 'wait' } }
            * custom: { query: query, projection: projection }

     Problem with Mongodb:	projection $elematch returns only the first record
	 *
	 * @param query
	 */
	async findItems(query) {
		// let us rebuild the query form {status: value} to >  "tokens.items.status": "wait" 
		const result = this.translateCriteria(query);

		var records = await this.db.find(this.dbConfiguration.db, Instance_collection, result.query, result.projection);

		this.logger.log('...find items for ' + JSON.stringify(query) + " result :" + JSON.stringify(result)+" recs:"+records.length);

		return this.getItemsFromInstances(records, result.match);

	}
	private translateCriteria(query) {

		let match = {};
		let hasMatch = false;
		let projection = {};
		{
			let newQuery = {};
			Object.keys(query).forEach(key => {
				let val = query[key];
				if (key.startsWith('items.')) {
					key = key.replace('items.', '');
					match[key] = val;
					hasMatch = true;
				}
				else
					newQuery[key] = val;
			});

			if (hasMatch) {
				newQuery['items'] = { $elemMatch: match };
				projection = { id: 1, data: 1, name: 1, "items": 1 }; // { $elemMatch: match } };
				query = newQuery;
			}
			else
				projection = { id: 1, data: 1, name: 1, "items": 1 };
		}
		return { query: query, projection: projection , match };
	}

private translateCriteria2(criteria) {

		let match = {};
		let query = {};
		let projection = {};
		if (criteria.query) {
			let query = criteria.query;
			let projection;
			if (!criteria.projection) {

				Object.keys(query).forEach(key => {
					if (key.startsWith('items.')) {
						let val = query[key];
						key = key.replace('items.', '');
						match[key] = val;
					}
				});
				if (Object.keys(match).length == 0)
					projection = { id: 1, data: 1, name: 1 };
				else
					projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: match } };
			}
			else
				projection = criteria.projection;
			return { query: criteria.query, projection: projection };
		}
		const instance = criteria.instance;
		const items = criteria.items;
		if (instance) {
			Object.keys(instance).forEach(key => {
				query[key] = instance[key];
			});
		}
		if (items && Object.keys(items).length > 0) {
			Object.keys(items).forEach(key => {
				match[key] = items[key];
				query["items." + key] = items[key];
			});
			projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: match } };
		}
		return { query, projection };



		// { "items": { $elemMatch: { type: 'bpmn:StartEvent' } } }
		Object.keys(criteria).forEach(key => {
			query[key] = criteria[key];
			if (key.startsWith("items.")) {
				match[key] = criteria[key];
			}

		});
		projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: match } };
		return { query, projection };

		if (criteria.itemId) {
			query = { "items.id": criteria.itemId };
			projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: { id: criteria.itemId } } };
		}
		else if (criteria.status) {
			query = { "items.status": criteria.status };
			projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: { status: criteria.status } } };
		}
		else if (criteria.itemKey) {
			query = { "items.itemKey": criteria.itemKey };
			projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: { itemKey: criteria.itemKey } } };
		}
		else if (criteria.data) {
			query = { "data": criteria.data };
			projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: { itemKey: criteria.itemKey } } };
		}
		else if (criteria.instanceId) {
			query = { "id": criteria.instanceId };
			projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: { "elementId": criteria.elementId } } };
		}
		else
			return { query: null, projection: null };
		return { query, projection };
	}

	async deleteInstances(query) {

		await this.cache.shutdown();
		return await this.db.remove(this.dbConfiguration.db, Instance_collection, query );

	}
	// db.collection.createIndex({ "a.loc": 1, "a.qty": 1 }, { unique: true })
    /**
     * first time installation of DB
     * 
     * creates a new collection and add an index
     * 
     * */
	async install() {
		return await this.db.createIndex(this.dbConfiguration.db, Instance_collection, { id: 1 }, { unique: true });
	}

}
export { DataStore };