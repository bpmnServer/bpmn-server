import { DataHandler } from '../engine';
import { Execution } from '../engine/Execution';
import { IDataStore,FindParams,FindResult, IBPMNServer, IInstanceData, IItemData } from '../interfaces';

import {  ObjectId, Document, WithId , ISODate } from 'mongodb';

import { ServerComponent } from '../server/ServerComponent';


import { InstanceLocker } from './';

import { QueryTranslator } from './QueryTranslator';
import { Aggregate} from './Aggregate'

 
class DataStore extends ServerComponent  implements IDataStore {

	dbConfiguration;
	db;

	execution: Execution;
	isModified = false;
	isRunning = false;
	inSaving = false;
	promises = [];
	locker;
	enableSavePoints=false;
	saveLogs=true;
	saveSource=true;

	constructor(server: IBPMNServer) {
		super(server);

		this.dbConfiguration = this.configuration.database.MongoDB;
		if (!this.dbConfiguration.Instance_collection)
			this.dbConfiguration.Instance_collection='wf_instances';
		if (!this.dbConfiguration.Locks_collection)
			this.dbConfiguration.Locks_collection='wf_locks';
		if (!this.dbConfiguration.Archive_collection)
			this.dbConfiguration.Archive_collection='wf_archive';


		const MongoDB = require('./MongoDB').MongoDB;
		this.db = new MongoDB(this.dbConfiguration, this.logger);
		this.locker=new InstanceLocker(this);

	}
	/*monitorExecution(execution: Execution) {
		this.execution = execution;
		const listener = execution.listener;
	} */

	async save(instance,options={}) {
		return await this.saveInstance(instance,options);
	}
	async loadInstance(instanceId,options={}) {

		const recs = await this.findInstances({ id: instanceId }, 'full');
		if (recs.length == 0) {

			this.logger.error("Instance is not found for this item");
			return null;
		}
		const instanceData = recs[0];

//		this.logger.log(" instance obj found" + instanceData.id);

		return { instance: instanceData, items: this.getItemsFromInstances([instanceData]) };
	}
	/*
	Since MongoDB returns the wholde doc (all items), we have to filter only what user asked for 
	and transform the data 
*/
	private getItemsFromInstances(instances, condition = null,trans=null) {
		const items = [];
		instances.forEach(instance => {
			instance.items.forEach(i => {
				let pass = true;
				if (trans)
					pass = trans.filterItem(i, condition);

				if (pass) {
					let data;
					if (instance.tokens[i.tokenId]) {
						let dp=instance.tokens[i.tokenId].dataPath;
						if (dp!=='')
							data=DataHandler.getData(instance.data,dp);
						else
							data=instance.data;
					}
					else 
						data=instance.data
					i['processName'] = instance.name;
					i['instanceData'] = instance.data;
					i['data'] = data;
					i['instanceId'] = instance.id;
					i['instanceVersion'] = instance.version;
					items.push(i);
				}
			});
		});
		return items.sort(function (a, b) { return (a.seq - b.seq); });
	}


	// save instance to DB
	static seq = 0;
	private async saveInstance(instance,options={}) {
//		this.logger.log("Saving...");

		let saveObject=
			{	version: instance.version,startedAt: instance.startedAt,endedAt: instance.endedAt, status: instance.status, saved: instance.saved,
				tokens: instance.tokens, items: instance.items, loops: instance.loops, name: instance.name,
				data: instance.data , parentItemId: instance.parentItemId
			};

		if (instance.version==null) 
			instance.version =0;
		else 
			instance.version++;

			if (this.saveLogs===true)
				saveObject['logs'] = instance.logs;
			if (this.saveSource===true)
				saveObject['source'] = instance.source;
	
			if (this.enableSavePoints===true && instance.items.length>0) {
				let lastItem=instance.items[instance.items.length-1].id;

				let savePoint={id:lastItem,items:instance.items,loop:instance.loops,tokens:instance.tokens,data:instance.data}
		
				saveObject['savePoints']=instance.savePoints;
				if (!saveObject['savePoints'])
					saveObject['savePoints']={};
				saveObject['savePoints'][lastItem]=savePoint;
			}

		var recs;
		if (!instance.saved) {
			instance.saved = new Date();
			saveObject['saved'] = instance.saved;
			saveObject['id']=instance.id;

			await this.db.insert(this.dbConfiguration.db, this.dbConfiguration.Instance_collection, [saveObject]);

		}
		else {

			this.promises.push(this.db.update(this.dbConfiguration.db, this.dbConfiguration.Instance_collection,
				{ id: instance.id },
				{
					$set: saveObject
				}));

		}

		await Promise.all(this.promises);
		this.logger.log('..DataStore:saving Complete');

	}

	async findItem(query): Promise <IItemData> {
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

		if (!rec.logs)
			rec.logs=[];
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
	/**
	 * 
	 * @param query 
	 * @param option
	 * 		-'summary'	minimal data
	 * 		- 'full'
	 * 		- {projection,sort} 
	 * @returns 
	 */
	async findInstances(query, option: 'summary' | 'full' | any = 'summary'): Promise<IInstanceData[]>{

		let projection=null;
		let sort=null;

		if (option == 'summary')
			projection = { source: 0, logs: 0 };
		else if (option['projection'])
			projection = option['projection'];
		if (option['sort'])
			sort=option['sort'];

		var records = await this.db.find(this.dbConfiguration.db, this.dbConfiguration.Instance_collection, query, projection,sort);
		return records;
	}
	/**
		* scenario:
		*
		* ```
		* itemId			{ items { id : value } }
		* itemKey			{ items {key: value } }
		* instance, task	{ instance: { id: instanceId }, items: { elementId: value }}
		* message			{ items: { messageId: nameofmessage, key: value } {}
		* status			{ items: {status: 'wait' } }
		* custom: { query: query, projection: projection }
		* ```
		* New approach:
		* just like MongoDB
		* ```
		* itemId			{ items { id : value } }
		* itemKey			{ items {key: value } }
		* instance, task	{  id: instanceId , items.elementId: value }
		* message			{ items.messageId: nameofmessage, key: value } {}
		* status			{ items.status: 'wait' } }
		* custom: { query: query, projection: projection }
		* ```

		* Problem with Mongodb:	`projection $elematch returns only the first record`
	 *
	 * @param query
	 */
	async findItems(query) : Promise<IItemData[]> {
		// let us rebuild the query form {status: value} to >  "tokens.items.status": "wait" 
		const trans = new QueryTranslator('items');
		const result = trans.translateCriteria(query);
		const projection = { id: 1, data: 1, name: 1, version:1, "items": 1 , "tokens":1};
		var records = await this.db.find(this.dbConfiguration.db, this.dbConfiguration.Instance_collection, result, projection);
		// console.log('...find items for query:', query, " translated to :", JSON.stringify(result),  " recs:" , records.length)

		const items=this.getItemsFromInstances(records, result,trans);
		//		this.logger.log('...find items for ' + JSON.stringify(query) + " result :" + JSON.stringify(result) + " instances:" + records.length+ " items: "+items.length);
		return items;
	}

	async deleteInstances(query) {

		await this.cache.shutdown();
		
		return await this.db.remove(this.dbConfiguration.db, this.dbConfiguration.Instance_collection, query );

	}
	// db.collection.createIndex({ "a.loc": 1, "a.qty": 1 }, { unique: true })
    /**
     * first time installation of DB
     * 
     * creates a new collection and add an index
     * 
     * */
	async install() {
		await this.db.createIndex(this.dbConfiguration.db, this.dbConfiguration.Instance_collection, { id: 1 }, { unique: true });
		await this.db.createIndex(this.dbConfiguration.db, this.dbConfiguration.Instance_collection, { "items.id": 1 });
		await this.db.createIndex(this.dbConfiguration.db, this.dbConfiguration.Locks_collection, { id: 1 }, { unique: true });
	}
	
	async archive(query) {
		
        let docs=await this.db.find(this.dbConfiguration.db,this.dbConfiguration.Instance_collection,query,{});

		if (docs.length>0)
			{
				await this.db.insert(this.dbConfiguration.db, this.dbConfiguration.Archive_collection, docs);

				await this.deleteInstances(query);
			}


		console.log('total of ',docs.length,' archived');
	}
	/**
 * MongoDB Pagination class for finding instances in a collection.
 * This module provides a function to retrieve paginated results from a MongoDB collection.	
 * It allows filtering, sorting, and projecting fields in the results.
 * The results can be paginated using a cursor for efficient data retrieval.
 * all the parameters are optional and are passed to the findInstances method.
 * * `sort` fields can be specified as an object with field names as keys and 1 (ascending) or -1 (descending) as values.
 * *   Sort by `_id` in descending order by default.
 * *   Sort field can be a nested field, e.g., `data.caseId`
 * 	*  Sort field can be a numeric or date field.
 * * `filter` is an object that specifies the criteria for filtering the results.
 * * `after` is a string that specifies the cursor for pagination, allowing you to retrieve results after a specific document.	
 * * * `limit` is a number that specifies the maximum number of documents to return in the result set.
 * * * `projection` is an object that specifies which fields to include or exclude in the returned documents.
 * 
 *  *  */

	async find(
	  {
		filter = {},
		after,
		limit = 10,
		sort = { _id: -1 },
		projection,
		lastItem={},
		latestItem={},
		getTotalCount=false
	  }: FindParams
	): Promise<FindResult> {

			const aggregate=new Aggregate(this.db,this.configuration,this.dbConfiguration);
			
			return await aggregate.find({
				filter,
				after,
				limit,
				sort,
				projection,
				lastItem,
				latestItem,
				getTotalCount
			});
		}

  }
  

export { DataStore };