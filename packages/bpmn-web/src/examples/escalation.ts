import  { configuration }   from './';;
import { BPMNServer, Logger } from './';
import { EventEmitter } from 'events';

const logger = new Logger({ toConsole: true});


let name = 'gateway';
let process;
let needsRepairs = true;
let needsCleaning = true;
let response;
let items;
let item;
let query, query1;

let instanceId;
const server = new BPMNServer(configuration, logger, { cron: false });

console.log('escalation.ts');
escalation2();
async function escalation2() {
    let name = 'test-escalation2';
    let process;
    let caseId = 1050;
    console.log('test');
    try {
        response = await server.engine.start(name, { caseId: caseId });
//        response = await server.engine.invoke({ id: response.id, "items.elementId": 'Activity_userTask1' }, {"escalation":"true"});
//        response = await server.engine.invoke({ id: response.id, "items.elementId": 'Activity_11tr5am' }, {});
        
    }
    catch (exc) {
        console.log(exc);
    }
    response.instance.items.forEach(item=>{
        console.log('->item:',item.elementId,item.type,item.status);
    });

    logger.save(__dirname + '/' + name + '.log');
    console.log('log file written to :' + __dirname + '/' + name + '.log');
}

async function escalation() {
        let name = 'test-escalation';
        let process;
        let caseId = 1050;
        console.log('test');
        try {
            response = await server.engine.start(name, { caseId: caseId });
            response = await server.engine.invoke({ id: response.id, "items.elementId": 'Activity_userTask1' }, {"escalation":"true"});
            response = await server.engine.invoke({ id: response.id, "items.elementId": 'Activity_11tr5am' }, {});
            
        }
        catch (exc) {
            console.log(exc);
        }

        logger.save(__dirname + '/' + name + '.log');
        console.log('log file written to :' + __dirname + '/' + name + '.log');
}
function getItem(id) {
    return response.instance.items.filter(item => { return item.elementId == id; })[0];
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
        console.log("delaying ... " + time);
        return new Promise(function (resolve) {
            setTimeout(function () {
                console.log("delayed is done.");
                resolve(result);
            }, time);
        });
}
