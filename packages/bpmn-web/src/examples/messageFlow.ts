
import { BPMNServer , Logger, ItemObject, InstanceObject, ITEM_STATUS } from '..';
import {configuration } from './'
const FS = require('fs');
import { EventEmitter } from 'events';
import { DataStore } from 'bpmn-server';;
import { parse } from 'querystring';
import { BPMN_TYPE } from '..';
import { EXECUTION_STATUS, Query } from '..';


const logger = new Logger({ toConsole: true});
console.log(configuration);
console.log(configuration.timers);

test();

async function test() {

    const server = new BPMNServer(configuration, logger, { cron: false });
    const bpmnServer = server;
    console.log(1);
    var messageId = 'Msg1'; //'StartEvent_Manager';

    const items1 = await bpmnServer.dataStore.findItems({"items.elementId": "task_Buy"});
    console.log(items1.length);

    return;

    const eventsQuery = { "events.elementId": messageId };
    const events = await bpmnServer.definitions.findEvents(eventsQuery);
    console.log('startingEvents', events);


    let res1 = await server.engine.start('messageFlow', '');

    //console.log(res1.items);

    var messageId = 'Msg2'; //'StartEvent_Manager';

    var query = { "items.messageId": messageId};

    
    const items = await bpmnServer.dataStore.findItems(query);

    console.log(items);
    return;
    let context = await bpmnServer.engine.throwMessage(messageId, {});

    return;
    let response = await server.engine.start('messageFlow', '');

    //await server.checkTimers();


    logger.log('status:' + response.execution.status);
    logger.save(__dirname + '/messageFlow.log');
    console.log("Done...............");
    return;

}
function checkItem(items, criteria) {
    if (items.length == 0) {
        console.log(" No items");
        return;
    }
    const item = items[0];
    let pass = '';
    Object.keys(criteria).forEach(key => {
        if (item[key] != criteria[key])
            pass += `${key} not same ${item[key]} vs ${criteria[key]}`;
    });
    console.log('check:'+pass);
}
async function delay(time) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(time);
        }, time);
    });
}
 