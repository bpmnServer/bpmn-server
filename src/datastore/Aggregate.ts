import { DataHandler } from '../engine';
import { Execution } from '../engine/Execution';
import { IDataStore,FindParams,FindResult, IBPMNServer, IInstanceData, IItemData } from '../interfaces';

import {  ObjectId, Document, WithId , ISODate } from 'mongodb';


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
export class Aggregate {
	db;
	configuration;
	dbConfiguration;

	constructor(db,configuration,dbConfiguration) {
		this.db=db;
		this.configuration=configuration;
		this.dbConfiguration=dbConfiguration;
	}
		
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

		try {

			const client = await this.db.getClient();
			const db = client.db(this.configuration.db);
			const collection = db.collection(this.dbConfiguration.Instance_collection);

			let includeItems=false;

			if (process.env.ENABLE_PROFILER === 'true')
				console.time('find');


			const sortField = Object.keys(sort)[0] || '_id';
			const sortDirection = sort[sortField] ?? -1;
		
			const matchInstances: Record<string, any>= { };
			const matchItems: Record<string, any> = {};

			Object.keys(filter).forEach((key,value) => {
				if (key.startsWith('items.')) 
				{
					matchItems[key]=filter[key];
					includeItems=true;
				}
				else
					matchInstances[key]=filter[key]

			});
		
			let sortFieldIsDate=false;
			let sortVal;

			if (after) {
			  const [sortValRaw, idPart] = sortField === '_id' ? [after, null] : after.split('|');
			  if (sortValRaw.startsWith('d:'))
			  {
				sortFieldIsDate=true;
				sortVal=new Date();
				sortVal.setTime(Number(sortValRaw.substring(2)));
			  }
			  else if (isNaN(Number(sortValRaw)))	
				sortVal=sortValRaw;
			  else
				sortVal=Number(sortValRaw);
			  
			  const comparator = sortDirection === -1 ? '$lt' : '$gt';
		
			  // for items:
			  // {"items":{"$elemMatch":{"candidateGroups":"Owner"}}},

			  if (sortField === '_id') {
				matchInstances._id = { [comparator]: new ObjectId(sortValRaw) };
			  } else {

				if (sortField.startsWith('items.')) {	
					includeItems=true;
					const sortField2=sortField.substring(6);
					matchItems.$and = matchItems.$and || [];
					matchItems.$and.push({
						$or: [
							{ [sortField]: { [comparator]: sortVal } ,
								_id: { "$ne": new ObjectId(idPart) }},
							{
							[sortField]: sortVal,
							_id: { [comparator]: new ObjectId(idPart) }
							}
						]
						});
			
				}
				else {

					matchInstances.$and = matchInstances.$and || [];
					matchInstances.$and.push({
					$or: [
						{ [sortField]: { [comparator]: sortVal } ,
							_id: { "$ne": new ObjectId(idPart) }},
						{
						[sortField]: sortVal,
						_id: { [comparator]: new ObjectId(idPart) }
						}
					]
					});
				}
			  }
			}

			const pipeline: Document[]=[];
				//if (sortField.startsWith('items.')===true)
		
				
			if (Object.keys(lastItem).length > 0)
			{
				pipeline.push({ $match: matchInstances });
				pipeline.push({ $match: matchItems });
				projection['lastItem']=(getProjectForLastItem(lastItem,true));
				pipeline.push({ $project: projection });
				pipeline.push({ $match: { lastItem: { $exists: true, $ne: null }}});
			}
			else if (Object.keys(latestItem).length > 0)
			{
				pipeline.push({ $match: matchInstances });
				pipeline.push({ $match: matchItems });
				projection['latestItem']=(getProjectForLastItem(latestItem,false));
				pipeline.push({ $project: projection });
				pipeline.push({ $match: { latestItem: { $exists: true, $ne: null }}});
			}
			else 
			{
				pipeline.push({ $match: matchInstances });
			
				if (projection) 
				pipeline.push({ $project: projection });
				if (includeItems===true)
				{
					pipeline.push({ $unwind: '$items' });
					pipeline.push({ $match: matchItems });
				}
			}
			pipeline.push({ $sort: sort });
			pipeline.push({ $limit: limit });

			console.log(JSON.stringify(pipeline,null,2));
		
			const data = await collection.aggregate(pipeline).toArray();

			if (process.env.ENABLE_PROFILER === 'true')
				console.timeEnd('find');

			if (data.length === 0)
				return {data,nextCursor:null,totalCount:0}; 

			const last = data[data.length - 1];

			const sortFieldValue=getFieldValue(last,sortField);

			if (isDateString(sortFieldValue)===true)
				sortFieldIsDate=true;
			let lastSortField;

			if (sortFieldIsDate===true)
				lastSortField='d:'+new Date(sortFieldValue).getTime();
			else
				lastSortField=sortFieldValue;
				
			const nextCursor = last
			  ? sortField === '_id'
				? last._id.toString()
				: `${lastSortField}|${last._id}`
			  : null;

			  let ret: FindResult = { data, nextCursor };

			  if (getTotalCount === true) {

				if (process.env.ENABLE_PROFILER === 'true')
					console.time('find-count');

				const totalCount= await collection.countDocuments(filter);

				if (process.env.ENABLE_PROFILER === 'true')
					console.timeEnd('find-count');
				ret['totalCount']=totalCount;
		
			}
			  
			return ret;
		  } 
		  	catch (error: any) {
				if (process.env.ENABLE_PROFILER === 'true')
					console.timeEnd('find');
				
				return { error: error.message };
		  }
		
	}
}
function getProjectForLastItem(match:any,last:boolean) {
	const cond=matchToFilterCond(match);
	let sort;
	if (last)
		sort={'seq':-1};
	else
		sort={'endedAt':-1};
	
	const js=
		{

			  '$arrayElemAt': [
				{
				  '$sortArray': {
					'input': {
					  '$filter': {
						'input': '$items', 
						'as': 'item', 
						'cond': cond
					  }
					}, 
					'sortBy': sort
				  }
				}, 0
			  ]
		};
	return js;
	  
}
function matchToFilterCond(match, varName = "item") {
	const VAR = prefix => `$$${varName}.${prefix}`;
  
	function convertCondition(key, value) {
	  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		const ops = Object.keys(value).map(op => {
		  const val = value[op];
		  switch (op) {
			case "$eq": return { $eq: [VAR(key), val] };
			case "$ne": return { $ne: [VAR(key), val] };
			case "$gt": return { $gt: [VAR(key), val] };
			case "$gte": return { $gte: [VAR(key), val] };
			case "$lt": return { $lt: [VAR(key), val] };
			case "$lte": return { $lte: [VAR(key), val] };
			default: throw new Error(`Unsupported operator: ${op}`);
		  }
		});
		return ops.length === 1 ? ops[0] : { $and: ops };
	  } else {
		return { $eq: [VAR(key), value] };
	  }
	}
  
	if (match.$and) {
	  return {
		$and: match.$and.map(sub => matchToFilterCond(sub, varName))
	  };
	}
  
	if (match.$or) {
	  return {
		$or: match.$or.map(sub => matchToFilterCond(sub, varName))
	  };
	}
  
	return {
	  $and: Object.entries(match).map(([key, value]) => convertCondition(key, value))
	};
  }

  function isDateString(value: any): boolean {
	if (value instanceof Date)
		return true;
return !isNaN(Date.parse(value)) && isNaN(Number(value));
}

function getFieldValue(doc,fieldName)
{
let dp=fieldName.split('.');
if (dp.length===1)
	return doc[dp[0]];
if (dp[0]==='data') {
	return doc.data[dp[1]];
}
else if (dp[0]==='items')
{
	return doc.items[dp[1]];
}

}


