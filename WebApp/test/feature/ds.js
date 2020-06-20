const { BPMNServer, DataStore, Execution, DefaultAppDelegate, Logger } = require("../../");


const config = require("../../configuration.js").configuration;

const logger = new Logger({ toConsole: false });

let name = 'ds';
let process;
let needsRepairs = true;
let needsCleaning = true;
let response;
let items;
let item;
let query;

let server;

Feature('DataStore', () => {
    Scenario('Find Items', () => {
        var caseId = Math.floor(Math.random() * 10000);

        Given('execute a process to generate data', async () => {

            server = new BPMNServer(config, logger);
            let data = { caseId: caseId };
            response = await server.engine.start('Buy Used Car', data);
            console.log(caseId);
        });
        
        and('get an item', async () => {

            items = response.items.filter(item => {
                return (item.name == 'Buy');
            });
            item = items[0];

        });
        when('check for find items ', async () => {

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

        });
        and('find items by item id only', async () => {

            query = { items: { id: item.id } };
            items = await server.dataStore.findItems(query);
            checkItem(items, { id: item.id });

        });
        and('find items by instance and item elemetnId ', async () => {
            query = {
                instance: { id: response.execution.id },
                items: { elementId: item.elementId }
            };

            items = await server.dataStore.findItems(query);
            checkItem(items, { id: item.id });

        });
        and('find items by caseId and item elemetnId ', async () => {
            query = {
                instance: {
                    data: { caseId: caseId } },
                items: { elementId: item.elementId }
            };
            console.log(items);
            items = await server.dataStore.findItems(query);
            checkItem(items, { id: item.id });

        });


        and('check for items "wait" ', async () => {
            query = { items: { status: 'wait' } };
            items = await server.dataStore.findItems(query);
            checkItem(items, { status: 'wait' });
        });


        and('write log file to' + name + '.log', async () => {
            let fileName = __dirname + '/../logs/' + name + '.log';
            logger.save(fileName);
        });


    });
    // ------------------------------------------
    var caseId = Math.floor(Math.random() * 10000);

    Scenario('Find Instances', () => {
        Given('execute a process to generate data', async () => {

            server = new BPMNServer(config, logger);
            let data = { caseId: caseId };
            response = await server.engine.start('Buy Used Car', data);
            console.log(caseId);
        });
        and('get an item', async () => {

            items = response.items.filter(item => {
                return (item.name == 'Buy');
            });
            item = items[0];

        });

        and('find instance by instance id only', async () => {

            query = { id: response.execution.id };
            instances = await server.dataStore.findInstances(query);
            checkInstance(instances, { id: response.execution.id });

        });

        and('find instance by itemd id ', async () => {

            query = {
                items: { id: item.id  }};
            instances = await server.dataStore.findInstances(query);
            checkInstance(instances, { id: response.execution.id });

        });


        and('find instance by caseId', async () => {

            query = {
                data: { caseId: caseId }};
            instances = await server.dataStore.findInstances(query);
            checkInstance(instances, { id: response.execution.id  });

        });

        and('write log file to' + name + '.log', async () => {
            let fileName = __dirname + '/../logs/' + name + '2.log';
            logger.save(fileName);
        });


    });
});

async function test() {

    //    response = await server.invoke({ itemId: item.id } ,null);

}
function checkItem(items, criteria) {

//    expect(items.length).greaterThan(0);

    if (items.length == 0) {
        console.log(" No items");
        return false;
    }
    const item = items[0];
    let pass = '';
    Object.keys(criteria).forEach(key => {
        if (item[key] != criteria[key]) {
            expect(item[key]).equals(criteria[key]);
        }

    });
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
            expect(instance[key]).equals(criteria[key]);
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