import { Execution } from '../engine/Execution';
import { EXECUTION_EVENT } from '../engine/Enums';
import { exec } from 'child_process';
import { Logger } from '../common/Logger';

const fs = require('fs');

const MongoDB = require('./MongoDB').MongoDB;

//import { IDataStore } from './API';

/*
 * Data Query:
 * 
 * { "items": { $elemMatch: { type: 'bpmn:StartEvent' } } }
 * 
 */ 

const Instance_collection = 'wf_instances';


class DataStore { //implements IDataStore {

	dbConfiguration;
	db;
	logger;

	execution: Execution;
	isModified = false;
	isRunning = false;
	inSaving = false;
	promises = [];

	constructor(configuration, logger: Logger) {
		this.logger = logger;
		this.dbConfiguration = configuration.database.MongoDB;
		this.db = new MongoDB(this.dbConfiguration, this.logger);

	}
	monitorExecution(execution: Execution) {
		this.execution = execution;
		const listener = execution.listener;
		this.setListener(listener);
	}
	setListener(listener) {

		let self = this;
		listener.on('end',async function (event, object) {
			if (!self.isRunning) {
				await self.check();
			}
		});


		listener.on('wait',async function (event, object) {
			if (!self.isRunning) {
				await self.check();
			}
		});
		/* done by the server 
		listener.on(EXECUTION_EVENT.execution_invoke, function (event, object) {
			self.isModified = true;
			self.isRunning = true;
		});
		listener.on(EXECUTION_EVENT.execution_execute, function (event, object) {
			self.isModified = true;
			self.isRunning = true;
		});
		listener.on(EXECUTION_EVENT.execution_invoked,async function (event, object) {
			self.isRunning = false;
			await self.save();

		});
		listener.on(EXECUTION_EVENT.execution_executed,async function (event, object) {
			self.isRunning = false;
			await self.save();
		});
		*/
	}
	saveCounter = 0;
	async save() {
		if (this.inSaving) {
			// come back please
			this.saveCounter++;	/// will do it after I am done
			this.logger.log(" in saving take a number #" + this.saveCounter);
			return;
//			await Promise.all(this.promises);
//			this.inSaving = false;
		}
		let currentCounter = this.saveCounter;
		this.inSaving = true;
		if (this.isModified) {
			this.logger.log('DataStore: saving ');
			let state = await this.execution.getState();
			if (state.saved !== this.execution.saved) {
				console.log("********* ERROR OLD State****");
            }

			await this.saveInstance(state, this.execution.getItems())
			this.execution.saved = new Date();
			this.logger.log('DataStore: saved ' + this.execution.saved);

			while(this.saveCounter > currentCounter) {	// will do it again
				this.logger.log('DataStore:while i was busy other changes happended' + this.saveCounter);
				currentCounter = this.saveCounter;
				state = await this.execution.getState();
				await this.saveInstance(state, this.execution.getItems())
				this.execution.saved = new Date();
				this.logger.log('DataStore: saved again ' + this.execution.saved);

            }
			this.isModified = false;
		}
		this.inSaving = false;
	}
	async check() {
		this.logger.log('DataStore: instance modified...');
		this.isModified = true;
		setTimeout(this.save.bind(this), 500);

	}
	async loadInstance(instanceId) {

		const recs = await this.findInstances({ id: instanceId }, 'full');
		if (recs.length == 0) {

			this.logger.error("Instance is not found for this item");
			return null;
		}
		const instanceData = recs[0];

		this.logger.log(" instance obj found" + instanceData.id);

		return { instance: instanceData, items: this.getItemsFromInstances([instanceData]) };
	}

	private getItemsFromInstances(instances,condition=null) {
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
						items.push(i);
                    }
			});
		});
		return items.sort(function (a, b) { return (a.seq - b.seq); });
    }
	// save instance to DB
	async saveInstance(instance,items ) {
		this.logger.log("Saving...");


		//var json = JSON.stringify(instance.state, null, 2);
		const tokensCount = instance.tokens.length;
		let itemsCount=instance.items.length;
		this.logger.log('saving instance '+tokensCount+" tokens and items: "+itemsCount);

		var recs;
		if (!instance.saved) {
			instance.saved = new Date();

			//this.promises.push(this.db.insert(this.dbConfiguration.db, Instance_collection, [instance]));
			this.promises.push(this.db.insert(this.dbConfiguration.db, Instance_collection, [instance]));

			this.logger.log("inserting instance" );
		}
		else {
			this.promises.push(this.db.update(this.dbConfiguration.db, Instance_collection,
				{ id: instance.id },
				{
					$set:
					{
						tokens: instance.tokens, items: instance.items, loops: instance.loops,
						ended: instance.ended, status: instance.status, saved: instance.saved , logs: instance.logs , data:instance.data
					} }));


			this.logger.log("updating instance");
		}

		await Promise.all(this.promises);
		this.logger.log('DataStore:saving Complete');

	}

	async findItem(query) {
		let results = await this.findItems(query);
		if (results.length == 0)
			throw Error(" No items found for "+ JSON.stringify(query));
		else if (results.length > 1)
			throw Error(" More than one record found " + results.length + JSON.stringify(query));
		else
			return results[0];

	}
	async findInstance(query, options) {

		let results = await this.findInstances(query, options);
		if (results.length == 0)
			throw Error(" No instance found for " + JSON.stringify(query));
		else if (results.length > 1)
			throw Error(" More than one record found " + results.length+ JSON.stringify(query));
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
			projection = {};

		var records = await this.db.find(this.dbConfiguration.db, Instance_collection, query, projection);
		return records;
	}
	async findItems(query) {
		// let us rebuild the query form {status: value} to >  "tokens.items.status": "wait" 
		let newQuery = { "items.status": query.status };
		var records = await this.db.find(this.dbConfiguration.db, Instance_collection, newQuery);

		return this.getItemsFromInstances(records,query);

	}
	async deleteData(instanceId = null) {
		if (instanceId) {
			await this.db.remove(this.dbConfiguration.db, Instance_collection, { id: instanceId });
		}
		else {
			await this.db.remove(this.dbConfiguration.db, Instance_collection, {});

		}

	}

}

export { DataStore };