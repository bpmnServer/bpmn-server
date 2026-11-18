import { DataHandler } from '../engine/DataHandler.js';
import { Execution } from '../engine/Execution.js';
import type { IInstanceData, IItemData } from '../interfaces/DataObjects.js';
import type { IDataStore, FindParams, FindResult } from '../interfaces/datastore.js';
import type { IBPMNServer } from '../interfaces/server.js';

import { ObjectId, Document, WithId } from 'mongodb';


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
			// The instances' database (the upstream named the server configuration's `db`, which it has not: the URL's default database).
			const db = client.db(this.dbConfiguration.db);
			const collection = db.collection(this.dbConfiguration.Instance_collection);

			let includeItems=false;

			if (process.env.ENABLE_PROFILER === 'true')
				console.time('find');


			const sortField = Object.keys(sort)[0] || '_id';
			const sortDirection = sort[sortField] ?? -1;
			// the rows are sorted after they are projected: a sort field a projection leaves out would sort as
			// missing (every row a tie) and give an empty cursor; it is returned too
			if (projection && sortField !== '_id'
				&& Object.entries(projection).some(([key, value]) => key !== '_id' && value !== 0 && value !== false)
				&& !Object.keys(projection).some(key => key === sortField || sortField.startsWith(key + '.') || key.startsWith(sortField + '.')))
				projection = { ...projection, [sortField]: 1 };
		
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
		
			if (after) {
			  const comparator = sortDirection === -1 ? '$lt' : '$gt';

			  if (sortField === '_id') {
				matchInstances._id = { [comparator]: new ObjectId(after) };
			  } else {
				// the cursor is "<value>|<_id>"; the value may hold a '|' itself, an ObjectId never does
				const bar = after.lastIndexOf('|');
				const sortVal = parseCursorValue(after.substring(0, bar));
				const condition = afterCondition(sortField, sortVal, new ObjectId(after.substring(bar + 1)), comparator);
				// by an item's field there is a row per item: the cursor's own instance has other items after it,
				// so a later value is enough (as DocumentPager pages); only a tie is broken by the instance's _id
				const match = sortField.startsWith('items.') ? matchItems : matchInstances;
				if (match === matchItems)
					includeItems = true;
				match.$and = match.$and || [];
				match.$and.push(condition);
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
			// ties broken by _id, as the cursor breaks them: else MongoDB may order a tie differently on the next page
			pipeline.push({ $sort: sortField === '_id' || '_id' in sort ? sort : { ...sort, _id: sortDirection } });
			pipeline.push({ $limit: limit });

		
			const data = await collection.aggregate(pipeline).toArray();

			if (process.env.ENABLE_PROFILER === 'true')
				console.timeEnd('find');

			if (data.length === 0)
				return {data,nextCursor:null,totalCount:0}; 

			const last = data[data.length - 1];

			const nextCursor = sortField === '_id'
				? last._id.toString()
				: `${cursorValue(getFieldValue(last, sortField))}|${last._id}`;

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

/**
 * The sort value in a cursor, by its type: a date is `d:<ms>`, a missing value `n:`, a number as it is, text as it is
 * unless it would read as one of those (`007`, `n:x`), then `s:<text>`. Text that looks like a date ("Stage 1") stays
 * text: it is compared as stored.
 */
function cursorValue(value: any): string {
	if (value instanceof Date)
		return 'd:' + value.getTime();
	if (value === null || value === undefined)
		return 'n:';
	if (typeof value === 'number')
		return String(value);
	const text = String(value);
	return /^[dns]:/.test(text) || !isNaN(Number(text)) ? 's:' + text : text;
}

function parseCursorValue(raw: string): any {
	if (raw.startsWith('d:'))
		return new Date(Number(raw.substring(2)));
	if (raw === 'n:')
		return null;
	if (raw.startsWith('s:'))
		return raw.substring(2);
	return raw !== '' && !isNaN(Number(raw)) ? Number(raw) : raw;
}

/**
 * The rows after the cursor's: a later value, or the same value and a later _id. A missing value sorts before any
 * other, so ascending every value comes after the missing ones, and descending the missing ones come after every
 * value ($lt does not match them: MongoDB compares only values of a type).
 */
function afterCondition(field: string, value: any, id: ObjectId, comparator: '$lt' | '$gt') {
	if (value === null)
		return comparator === '$gt'
			? { $or: [{ [field]: { $ne: null } }, { [field]: null, _id: { $gt: id } }] }
			: { [field]: null, _id: { $lt: id } };
	const or: Document[] = [{ [field]: { [comparator]: value } }, { [field]: value, _id: { [comparator]: id } }];
	if (comparator === '$lt')
		or.push({ [field]: null });
	return { $or: or };
}

/** A dotted path's value in a row: `data.a.b`, `items.seq` (a row per item), `latestItem.endedAt`. */
function getFieldValue(doc, fieldName: string) {
	return fieldName.split('.').reduce((value, key) => value?.[key], doc);
}


