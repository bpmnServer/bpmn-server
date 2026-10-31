
import { BPMNServer, Logger, ItemObject, InstanceObject, ITEM_STATUS, Engine } from './';

import { configuration, BPMNAPI,APIEngine } from './'
const FS = require('fs');
import { EventEmitter } from 'events';
import { BPMN_TYPE } from './';
import { EXECUTION_STATUS, Query } from './';

const logger = new Logger({ toConsole: false });

var caseId = Math.floor(Math.random() * 10000);

var server, response;
test();

var instanceId;

async function test() { 

    let option = 'b';
    server = new BPMNServer(configuration, logger);

    const engine: Engine = server.engine;
    //execute(name: any, user: any, data ?: any, source ?: string, startNodeId ?: string
    response = await engine.start('invoice', 
        { reminderCounter: 0, caseId: caseId}, null, 'StartEvent_AP');

    instanceId = response.execution.id;
    log(instanceId);
    expect(getItem('task_issue_invoice').status,'equals','wait');
    log('invoking issue invoice');

    let items = await server.findItems({id: instanceId , "items.elementId" : 'task_issue_invoice' });
    items.forEach(item => {
        console.log('item:' + item.elementId + ' status:' + item.status);
    });

    response = await server.invoke({id: instanceId , "items.elementId" : 'task_issue_invoice' }, null);

    if (response.error) {
        console.log('got error');
        console.log(response.error);
        return;
    }
    if (option == 'a') {
        // option a:
        await delay(12000);
        response = await server.restore({ id: instanceId });

        expect(response.items.filter(item => { return (item.elementId == 'event_cancel' && item.status == 'wait'); }).length
            , 'equals', 1);
        expect(response.items.filter(item => { return (item.elementId == 'task_got_payment' && item.status == 'wait'); }).length
            , 'equals', 1);
        // option a:

        response = await server.invoke({id: instanceId  , "items.elementId" : 'event_cancel' }, null);
    }
    else {
        console.log("option b 1");
    // option b:
        response = await server.invokeSignal(instanceId,'StartEvent_Manager', null);
        console.log("option b 2");
    
        response = await server.invoke({id: instanceId  , "items.elementId" : 'Task_cancelByAdmin' }, null);
        console.log("option b 3");
    }
    logger.save('invoice-cancel.log');
}
async function delay(time) {
    log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            log("delayed is done.");
            resolve(time);
        }, time);
    });
}
function log(msg) {
    logger.log(msg);
}
function expect(object, operation, value) {
    if (object == value)
        return true;
    else {
        log('***Error:' + object + ' does not equal ' + value);
    }
}
function getItem(id) {
    return response.items.filter(item => { return (item.elementId == id); })[0];
}