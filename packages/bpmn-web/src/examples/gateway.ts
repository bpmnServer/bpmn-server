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
// gateway1();
//gateway3();
recover();
async function recover() {
        var query = { "items.status": "start" };

        var list = await server.dataStore.findItems(query);
        if (list.length > 0) {

            server.logger.log("...items query returend " + list.length);
            for (var i = 0; i < list.length; i++) {
                let item = list[i];
                if (item.type=='bpmn:ScriptTask')
                {
                    console.log(item.processName,item.elementId,item.type,item.startedAt,item.status);
                    let response =await server.engine.invoke({"items.id":item.id}, {},null, {recover:true});
                }
            }
        }

}
async function savePoint(response,msg) {
    logger.log('---- save point ----'+msg);
    response.execution.report();
    await response.execution.save();
    await server.cache.shutdown();
    logger.log('--------------------------');
  
}
async function gateway3() {
        let name = 'test_gateway3';
        let process;
        let caseId = 1050;
        console.log('test');
        try {
            response = await server.engine.start(name, { caseId: caseId });
            console.log('==task_buy', getItem('task_Buy').status);
            response = await server.engine.invoke({
                id: response.id,
                "items.elementId": 'task_Buy'
            }, { needsCleaning: "Yes", needsRepairs: "Yes" });
            response = await server.engine.invoke({ id: response.id, "items.elementId": 'task_clean' });
            await savePoint(response,'1');
            
            response = await server.engine.invoke({ id: response.id, "items.elementId": 'task_repair' });
            response = await server.engine.invoke({ id: response.id, "items.elementId": 'task_Drive' });
            response = await server.engine.invoke({ id: response.id, "items.name": 'Buy more cleaning supplies' });
            
        }
        catch (exc) {
            console.log(exc);
        }

        logger.save(__dirname + '/' + name + '.log');
        console.log('log file written to :' + __dirname + '/' + name + '.log');
}
async function gateway1() {
        let name = 'test_gateway1';
        let process;
        let caseId = 1050;
        console.log('test');
        try {
            response = await server.engine.start(name, { caseId: caseId });
        await savePoint(response,'1 Start');
            response = await server.engine.invoke({ id: response.id, "items.elementId": 'Activity_1' }, {});
        await savePoint(response,'2 Activity_1');
            response = await server.engine.invoke({id: response.id, "items.elementId": 'Activity_2_1'},{});
        await savePoint(response,'3 Activity_2_1');
            response = await server.engine.invoke({id: response.id, "items.elementId": 'Activity_2_2'},{});
        await savePoint(response,'4 Activity_2_2');
            response = await server.engine.invoke({id: response.id, "items.elementId": 'Activity_2_3'},{});
        await savePoint(response,'5 Activity_2_3');

            response = await server.engine.invoke({ id: response.id, "items.elementId": 'Activity_2_4_1' }, {});
//        await savePoint(response,'6 Activity_2_4_1');


        response = await server.engine.invoke({"id": response.id , "items.elementId": 'Activity_3'},{});
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
