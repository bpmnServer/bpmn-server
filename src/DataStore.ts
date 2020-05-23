'use strict';

const fs = require('fs');

const MongoDB = require('./MongoDB').MongoDB;

import { IDataStore } from './API';

const { v4: uuidv4 } = require('uuid');



class DataStore implements IDataStore  {

	dbConfiguration;
	db;
	logger;

	constructor(configuration,logger) {
		this.dbConfiguration = configuration.database.MongoDB;
		this.db = new MongoDB(this.dbConfiguration,logger);
		this.logger = logger;
    }

	async loadInstance(instanceId) {

		const recs = await this.findInstances({ id: instanceId }, 'full');
		if (recs.length == 0) {

			this.logger.error("Instance is not found for this item");
			return null;
		}
		const instanceData = recs[0];

		this.logger.log(" instance obj found" + instanceData.id);

		let items= await this.findItems({ instanceId: instanceId });
		this.logger.log("loadItems: for " + items.length + "instanceId :" + instanceId);
		return { instance: instanceData, items };
	}

// save instance to DB
	async saveInstance(instance) {
		this.logger.log("Saving...");


	var json = JSON.stringify(instance.state, null, 2);

	this.logger.log('saving instances');

	var recs;
	var promises=[];
		if (instance.dbAction == 'add') {
			if (instance.id == null)
			instance.id = uuidv4();
		let dataObject = instance.getDataObject();
		dataObject.state = json;
		dataObject.logs = instance.logs;

		promises.push(this.db.insert(this.dbConfiguration.db, this.dbConfiguration.instance_collection, [dataObject]));

		instance.dbAction = null;
		this.logger.log("inserting instance logs count: " + instance.logs.length);
	}
	else {
		promises.push(this.db.update(this.dbConfiguration.db, this.dbConfiguration.instance_collection,
			{ id: instance.id },
			{ $set: { state: json, logs: instance.logs, endAt: instance.endAt } }));


		this.logger.log("updating instance logs count:" + instance.logs.length);
	}
	this.logger.log('saving items');

	await this.saveItems(instance,promises);

	await Promise.all(promises);
	this.logger.log('saving Complete');

}


//	 invoked at end of run
// save revised items

 async saveItems(instance,promises) {

	let newItems = [];
	let i = 0;

	let updates = 0;
	 let items = instance.getItems({});

	for (i = 0; i < items.length; i++) {
		let item = items[i];
		item.instanceId = instance.id;

		if (item.dbAction == 'add') { 
			newItems.push(item.getDataObject(instance));
			item.dbAction = null;
			this.logger.log("	adding item task id " + item.taskId + " status " + item.status);
		}
		else if (item.dbAction == 'update') {
			promises.push(this.db.update(this.dbConfiguration.db, this.dbConfiguration.item_collection,
				{ id: item.id },
				{ $set: { status: item.status, endAt: item.endAt } }
			));
			updates++;
			this.logger.log("	updated task id " + item.taskId + " status " + item.status);
		}
	}

	if (newItems.length > 0) {
		promises.push(this.db.insert(this.dbConfiguration.db, this.dbConfiguration.item_collection, newItems));
		this.logger.log("inserted " + newItems.length + " items ");
	}
	instance.items.forEach(item => { item.dbAction = null; });

}
	async findItem(query) {
		let results = await this.findItems(query);
		if (results.length == 0)
			throw Error(" No records found");
		else if (results.length > 1)
			throw Error(" More than one record found " + results.length);
		else
			return results[0];

    }
	async findInstance(query, options){

		let results = await this.findInstances(query, options);
		if (results.length == 0)
			throw Error(" No records found");
		else if (results.length > 1)
			throw Error(" More than one record found " + results.length);
		else
			return results[0];

    }

	async findInstances(query, option: 'summary' | 'full' | 'withState' = 'summary') {

		let projection;
		
		if (option == 'summary')
			projection = { state: 0, logs: 0 };
		else if (option == 'full')
			projection = { state: 0 };
		else 
			projection = { };

	var records = await this.db.find(this.dbConfiguration.db, this.dbConfiguration.instance_collection, query,projection);
	return records;
}
 async findItems(query) {

	 var records = await this.db.find(this.dbConfiguration.db, this.dbConfiguration.item_collection, query);
	 
	return records;
}
 async deleteData(instanceId = null) {
		if (instanceId) {
			await this.db.remove(this.dbConfiguration.db, this.dbConfiguration.item_collection, {instanceId: instanceId});
			await this.db.remove(this.dbConfiguration.db, this.dbConfiguration.instance_collection, {id: instanceId});
		}
		else {
			await this.db.remove(this.dbConfiguration.db, this.dbConfiguration.item_collection, {});
			await this.db.remove(this.dbConfiguration.db, this.dbConfiguration.instance_collection, {});

        }

}


}

export { DataStore };


