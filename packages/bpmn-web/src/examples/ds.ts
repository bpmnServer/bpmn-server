import  { configuration }   from './';;
import { BPMNServer, Logger } from './';
import { EventEmitter } from 'events';

const logger = new Logger({ toConsole: true});
let token1={data:{}}
let token2={data:Object.create(token1.data)};

token1.data['abc']='abc';
console.log(token2.data.abc);

let data = {a:'a',b:'b'};
let data2=Object.create(data);
data2.c='c';
console.log(data2);

let name = 'ds';
let process;
let needsRepairs = true;
let needsCleaning = true;
let response;
let items;
let item;
let query, query1;


let instanceId;
const server = new BPMNServer(configuration, logger, { cron: false });
//find();
//test();

function translateCriteria(query) {

    let match = {};
    let newQuery = {};
    let hasMatch = false;
    let projection = {};
    {
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

        if (hasMatch)
            newQuery['items'] = { $elemMatch: match };
        console.log('match',match);
        if (hasMatch) {
            projection = { id: 1, data: 1, name: 1, "items": { $elemMatch: match } };
            query = newQuery;
        }
        else
            projection = { id: 1, data: 1, name: 1, "items": 1 };
    }
    return { query, projection };
}


async function findItemsRaw(ds, query, proj = null) {
    console.log(query);
    // let us rebuild the query form {status: value} to >  "tokens.items.status": "wait"


    if (proj == null)
        proj = { id: 1, data: 1, name: 1 , items: 1};
    var records = await ds.db.find(ds.dbconfiguration.db, "wf_instances", query, proj);

    return records;


}
async function findItems(ds, query,proj=null) {
    console.log(query);
    // let us rebuild the query form {status: value} to >  "tokens.items.status": "wait"
    const result = translateCriteria(query);

    console.log('translated query',result,result.projection);

    query = result.query;
    proj = result.projection;
    console.log(proj.items);
    console.log('itms match', proj.items['$elemMatch']);


    if (proj == null)
        proj = { id: 1, data: 1, name: 1, items: 1, query };
    /*
    var records = await ds.db.find(ds.dbconfiguration.db, "wf_instances" , result.query, result.projection);

*/
    var records = await ds.db.find(ds.dbconfiguration.db, "wf_instances", query,result.projection);

    //return records;

//    this.logger.log('find items for ' + JSON.stringify(query) + " result :" + JSON.stringify(result) + " recs:" + records.length);

    //return ds.getItemsFromInstances(records,query);
    return ds.getItemsFromInstances(records, null);

}
async function findPerfect() {
    // works perfect 

    const server = new BPMNServer(configuration, logger, { cron: false });

    var insts;

    insts = await findItemsRaw(server.dataStore,
        { "items": { "$elemMatch": { "status": "end", "elementId": "task_Buy" } } },
        { id: 1, data: 1, name: 1, "items": { "$elemMatch": { "status": "end", "elementId": "task_Buy" } } }
    );

    console.log('results length', insts.length);
    console.log(insts[0]);

    var itms = 0, fitms = 0;

    for (var i = 0; i < insts.length; i++) {
        var inst = insts[i];
        itms += inst['items'].length;

        var items = inst['items'].filter(item => {
            return (item.elementId == "task_Buy");
        });

        fitms += items.length;
    }
    console.log(itms, fitms);
    return;

}
async function findWorking() {
    // works fine but returns all items for each instances and I have to filter them

    const server = new BPMNServer(configuration, logger, { cron: false });

    var insts;

    insts = await findItemsRaw(server.dataStore,
        { "items": { "$elemMatch": { "status": "end", "elementId": "task_Buy" } } }
    );
    
    console.log('results length',insts.length);
    console.log(insts[0]);
    
    var itms=0, fitms=0;
    
    for (var i = 0; i < insts.length; i++)
    {
        var inst = insts[i];
        itms += inst['items'].length;

        var items = inst['items'].filter(item => {
            return (item.elementId == "task_Buy");
        });

        fitms += items.length;
    }
    console.log(itms, fitms);
    return;

}
async function find() {

    const server = new BPMNServer(configuration, logger, { cron: false });

  /*  items = await server.dataStore.findItems(
        { "items": { "$elemMatch": { "status": "end", "elementId": "task_Buy" } } });
        


    insts = await findItems(server.dataStore,
        { "items": { "$elemMatch": { "status": "end", "elementId": "task_Buy" } } }
    );
    console.log(insts.length);


        */
    var insts;
    query = { "data.caseId": 6001 , "items.vars.param1": 'value1' };
    items = await server.dataStore.findItems(query);
    console.log('items count', items);

    insts = await findItems(server.dataStore, 
        {
 //           "data.caseId" : 53 ,
            "items.status": "end", "items.elementId": "task_Buy"
        }
    );

    /* worked too
    insts = await findItems(server.dataStore,
        { "items.status": "end", "items.elementId": "task_Buy" } 
    ); */
    
    console.log(insts.length);
    console.log(insts[0]);
    
    return;
    
}
async function test() {

    const server = new BPMNServer(configuration, logger);

        var caseId = Math.floor(Math.random() * 10000);


            data = { caseId: caseId };
            response = await server.engine.start('Buy Used Car', data);
            instanceId = response.execution.id;

            console.log(caseId + " instanceId: " + instanceId);


            items = response.items.filter(item => {
                return (item.name == 'Buy');
            });
            item = items[0];


            /*
            * scenario:
            * itemId			{ items { id : value } }
            * itemKey			{ items {key: value } }
            * instance, task	{ instance: { id: instanceId }, items: { elementId: value }}
            * message			{ items: { messageId: nameofmessage, key: value } {}
            * status			{ items: {status: 'wait' } }
            * custom: { query: query, projection: projection }
            * 
           * 
            */


            query = { id: instanceId , "items.elementId": item.elementId };

            items = await server.dataStore.findItems(query);
            checkItem(items, { id: item.id });

            query1 = {
                instance: {
                    data: { caseId: caseId }
                },
                items: { elementId: item.elementId }
            };
            query = {
                "data.caseId": caseId,
                "items.elementId": item.elementId
            };
            items = await server.dataStore.findItems(query);
            checkItem(items, { id: item.id });
            query1 = { items: { status: 'wait' } };

            query = { id: instanceId, "items.status": 'wait' };
            items = await server.dataStore.findItems(query);
            checkItem(items, { status: 'wait' });


            var caseId = Math.floor(Math.random() * 10000);

            var data = { caseId: caseId };
            response = await server.engine.start('Buy Used Car', data);
            console.log(caseId);

            items = response.items.filter(item => {
                return (item.name == 'Buy');
            });
            item = items[0];


            query = { id: response.execution.id };
            let instances = await server.dataStore.findInstances(query,'summary');
            checkInstance(instances, { id: response.execution.id });

            query = {"items.id": item.id };
            instances = await server.dataStore.findInstances(query,'summary');
            checkInstance(instances, { id: response.execution.id });


            query = { "data.caseId": caseId };
            instances = await server.dataStore.findInstances(query,'summary');
            checkInstance(instances, { id: response.execution.id });


}
function checkItem(items, criteria) {

    //    expect(items.length).greaterThan(0);

    if (items.length == 0) {
        console.log(" No items");
        return false;
    }
    const item = items[0];
    let pass = '';
    console.log(' items' + items.length);
    /*
    Object.keys(criteria).forEach(key => {
        if (item[key] != criteria[key]) {
            if (item[key] == criteria[key])
        }

    }); */
}
function checkInstance(instances, criteria) {

    //    expect(items.length).greaterThan(0);

    if (instances.length == 0) {
        console.log(" No items");
        return false;
    }
    const instance = instances[0];
    let pass = '';
    Object.keys(criteria).forEach(key => {
        if (instance[key] != criteria[key]) {
            //expect(instance[key]).equals(criteria[key]);
        }

    });
}

async function delay(time, result) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(result);
        }, time);
    });
}