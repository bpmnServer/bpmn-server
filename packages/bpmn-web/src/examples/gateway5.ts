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

console.log('gateway.ts');
gateway5();

/*
Given('Start Process', async () => {
    response = await server.engine.start(name, { caseId: 1005 });

});
Then('Check waits 1', () => {
    expect(response).to.have.property('execution');
    instanceId = response.execution.id;
    expect(getItem('Activity_1m6hqy8').status).equals('wait');
});

When('Create Vote', async () => {
    response = await server.engine.invoke({ id: response.id, "items.elementId": 'Activity_1m6hqy8' }, {"Vote":"true"});
    });
Then('check gateway ', () => {
    expect(response).to.have.property('execution');
    instanceId = response.execution.id;
    expect(getItem('Gateway_1jwui8m').status).equals('end');
    expect(getItem('Event_1b19bas').status).equals('end');
    expect(getItem('Activity_1uh26d0').status).equals('wait');

*/
async function gateway5() {
        let name = 'test_gateway5';
        let process;
        let caseId = 1050;
        console.log('test');
        try {
            response = await server.engine.start(name, { caseId: caseId });
            response = await server.engine.invoke({ id: response.id, "items.elementId": 'Activity_1m6hqy8' }, {"vote":"true"});
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
