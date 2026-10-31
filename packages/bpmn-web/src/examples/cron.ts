import  { configuration }   from './';
import { BPMNServer, Logger ,Cron  } from './';
import { EventEmitter } from 'events';
import { IModelsDatastore, ModelsDatastore } from  "bpmn-server";

const logger = new Logger({ toConsole: true});

let name = 'ds';
let process;
let needsRepairs = true;
let needsCleaning = true;
let response;
let items;
let item;
let query, query1;

let server;
let instanceId;

test();


	function checkCron(expression, referenceDateTime) {

    var parser = require('cron-parser');
    const now = new Date().getTime();

    try {
        var options = {
            currentDate: referenceDateTime
        };

        const interval = parser.parseExpression(expression, options);

        let next;

        next = interval.next();
        console.log("now ", new Date());
        console.log('Date: ', next.toString() , ' delay ', (next.getTime() - now)/1000); // Sat Dec 29 2012 00:42:00 GMT+0200 (EET)
        console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)

        console.log('Date: ', interval.prev().toString()); // Sat Dec 29 2012 00:42:00 GMT+0200 (EET)
        console.log('Date: ', interval.prev().toString()); // Sat Dec 29 2012 00:40:00 GMT+0200 (EET)

        const delay = (next.getTime() - now) / 1000;
        console.log("--Expression",expression,"Delay", delay, delay/60 , delay/3600);
        return delay;

    } catch (err) {
        return null;
    }
}

async function test() {


    var interval = checkCron('0 0/1 * * *', new Date());

    interval = checkCron('0 0/1 * * * ?', new Date());

    interval = checkCron('0 0/1 * * * *', new Date());

    interval = checkCron('0 * * * *', new Date());

    interval = checkCron('5 * * * *', new Date());

    interval = checkCron('*/2 * * * *', new Date());

    

    console.log(interval);


    const server = new BPMNServer(configuration, logger);

    const defs:IModelsDatastore = server.definitions;

      
    var caseId = Math.floor(Math.random() * 10000);

    const def= await defs.load("cron",null);
    //    await defs.rebuild("cron");

   // await server.cron.startTimers();

    //defs.updateTimer("cron");


    return;
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


            query = { "items.id": item.id };
            items = await server.dataStore.findItems(query);
            checkItem(items, { id: item.id });


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