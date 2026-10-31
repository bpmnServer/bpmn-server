import  { configuration, FindParams }   from './';;
import { BPMNServer, Logger } from './';
import { EventEmitter } from 'events';

const logger = new Logger({ toConsole: true});

let name = 'find';
const server = new BPMNServer(configuration, logger, { cron: false });
/**
 * saved views:
 * 		pending instances , showing all pending items %type% , sort by any instance field
 * 		completed instances, showing all items , %type% , sort by 
 * 		pending tasks	, sort by any task field
 * 		completed tasks , sort by any task field
 * 
 * 	Questions:
 * 		1.	Instance Conditions
 * 		2.	Task Conditions
 * 		3.	Sort field
 */
main();
async function main() {
	scenario4();
	//await findInstancesWithLatestItem();
}
async function scenario1(){
	let {data,nextCursor,error,totalCount} =await server.dataStore.find( {
		filter: {
			name: 'Buy Used Car',
			"items.type": 'bpmn:UserTask',
			"items.status": 'wait'
			},
		sort: { "data.caseId": 1},
		projection: { id: 1, data: 1, name: 1, _id:1,startedAt:1,status:1,
					 "items.dueDate":1, "items.type":1,"items.name":1,"items.status":1	,"items.seq":1
					}
				}
	);
	data.forEach(r=>{
		console.log(r._id,r.data.caseId,r.items.seq,r.items.type,r.items.status,r.items.dueDate);
	});
}
async function scenario2() {
	let {data,nextCursor,error,totalCount} =
	await server.dataStore.find( {
		filter: {      name: 'Buy Used Car'        },
    	sort: { endedAt: -1},
    	projection: { id: 1, data: 1, name: 1, _id:1,startedAt:1,status:1 }
	});
	
	console.log(data);
}
async function scenario3() {
	console.log('scenario #3');
	
		let {data,nextCursor,error,totalCount} =

		await server.dataStore.find( {
			filter: {
				name: 'Buy Used Car'
				},
			sort: { _id: -1},
			projection: { id: 1, data: 1, name: 1, _id:1,startedAt:1,status:1,
						 "items.dueDate":1, "items.type":1,"items.name":1,"items.status":1	,"items.seq":1
						},
			lastItem: { type:'bpmn:UserTask' }
		});
		
		console.log(data);
}

async function scenario4() {
	console.log('scenario #4');
	
			let {data,nextCursor,error,totalCount} =
			await server.dataStore.find( {
				filter: {	name: 'Buy Used Car' , "items.type":'bpmn:UserTask', "items.status": 'end'},
				sort: {"data.caseId": 1},
				projection: { id: 1, data: 1, name: 1, _id:1,startedAt:1,status:1},
				latestItem: { type:'bpmn:UserTask' ,status:'end'}
			});

		console.log(data);
		data.forEach(r=>{
			if (r.latestItem)
				console.log(r._id,r.data.caseId,r.status,r.latestItem.seq,r.latestItem.name,r.latestItem.type,r.latestItem.status,r.latestItem.dueDate);
			else
			console.log(r._id,r.data.caseId,r.status,'---');

		});
}
async function test() {	
	return;
	const project1={ id: 1, data: 1, name: 1, _id:1,startedAt:1,status:1,  // columns to return
		items: {        
			$filter: {  // filter items to only include UserTask types    
			  input: "$items",
			  as: "item",
			  cond: {
			   $eq: ["$$item.type", "bpmn:UserTask"] // filter to include only UserTask items
			  }
			}
	}};

	const project2={ id: 1, data: 1, name: 1, _id:1,startedAt:1,status:1,  // columns to return
		items: {        
			$filter: {  // filter items to only include UserTask types    
			  input: "$items",
			  as: "item",
			  cond: {
			   	$and:[
						{$eq: ["$$item.type", "bpmn:UserTask"]},
						{$eq: ["$$item.status", "wait"]}
					]}
			  }
			}
	};

/*	await findAggregation(
		{ name: 'Buy Used Car' ,"items.status": 'wait' },
		{"items.dueDate":1},
		{ id: 1, data: 1, name: 1, _id:1,startedAt:1,status:1, "items.dueDate":1, "items.type":1,"items.name":1,"items.status":1	}
		,true);	// has any item in wait status
	
		console.log('--------------------------------------');
*/
	await findAggregation(
			{ name: 'Buy Used Car',"items.seq":1 },
			{"name":1},
			{ id: 1, data: 1, name: 1, _id:1,startedAt:1,status:1,
				 "items.dueDate":1, "items.type":1,"items.name":1,"items.status":1	,"items.seq":1}
			,true);	// has any item in wait status
	
	await findAggregation(
				{ name: 'Buy Used Car' },
				{"name":1},
				{ id: 1, data: 1, name: 1, _id:1,startedAt:1,status:1}
				,false);	// has any item in wait status
		
	

return;
}
async function findInstancesWithLatestItem() {

	const projectA={ id: 1, data: 1, name: 1, _id:1,startedAt:1,status:1, 
		
		"items":1, // columns to return
/*		items: {        
			$filter: {  // filter items to only include UserTask types    
			  input: "$items",
			  as: "item",
			  cond: {
			   	$and:[
						{$eq: ["$$item.type", "bpmn:UserTask"]},
						{$eq: ["$$item.status", "wait"]}
					]}
				}		
			}, */
		latestItem: { $arrayElemAt: ["$items", -1] }
	};

	let res=await server.dataStore.find({
		filter:{"status":"running","items.status":"wait"},
		projection:projectA
	});
	console.log(res.data.length);
	res.data.forEach(inst=>{
		console.log(inst._id,inst.name,inst);
	});



}
async function findAggregation(filter,sort:Record<string,1|-1>={_id:-1},projection,printItems=false) {
    // benchmark findInstances
        console.time('find-instances call');
    console.log('findAggregation');
    let insts=await server.dataStore.findInstances(filter, 'summary');
	if (insts.length==0)
		return;
    let lastIns=insts[insts.length-1];
    console.log('findInstances:',insts.length,lastIns.startedAt,lastIns.data.caseId);

    console.timeEnd('find-instances call');

    // benchmark find)

    // works perfect
    let nextCursor = null;
    let param:FindParams = {
        getTotalCount: true, // get the total count of records
        limit: 50, // limit to 10 records per page
        filter: filter, // filter by process name
        sort: sort,   // sort by _id to get the earliest first
        projection: projection
    };

    for(let i=0;i<100;i++) {
            if (i>0)
                param.after=nextCursor;
    
            console.time('find-aggregation call');

			let res=await server.dataStore.find(param);

			if (res.data.length===0)
				return;
    
            if (i===0)
			{
                console.log('findAggregation    total', res.totalCount,'total pages', Math.ceil(res.totalCount/param.limit));
				console.log(JSON.stringify(param,null,2));
				console.log('-----------------------------------------');
			}

            param.getTotalCount=false; // do not get the total count again
            if (res.error) {
                console.log('error',res.error);
                return;
            }
            else if(!res.data)
                return;
            let first=res.data?res.data[0]:null;
            let last=res.data?res.data[res.data.length-1]:null;
    
            nextCursor=res.nextCursor;
            
            console.timeEnd('find-aggregation call');
    
            console.log('findAggregation    page:',i+1,'length:',res.data.length,res.nextCursor);
			//console.log('		',first._id,first.startedAt,first.data.caseId,first.items.length);//.data.length, res.data[0] );
			//console.log('		',last._id,last.startedAt,last.data.caseId,last.items.length);//.data.length, res.data[0] );

			if (printItems)
			{
				
				res.data.forEach(inst=>{
					let item=inst.items;
					console.log('	item:',inst._id,inst.startedAt,inst.data.caseId,item.name,item.status,'due Date:',item.dueDate);
				});
			}
			else {
				res.data.forEach(inst=>{
					console.log('		inst:',inst._id,inst.startedAt,inst.data.caseId);
				});

			}

			//if (i==0) 
				{
				//console.log('Sample Instance Items:');
				//first.items.forEach(item=>{
				//	console.log(`	item:# ${item.seq} 	${item.name}	status:${item.status}	due ${item.dueDate}`);
				//})
			}

            if(res.data.length<param.limit)
                break;

    }
}

