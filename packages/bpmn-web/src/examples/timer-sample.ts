
import { BPMNServer , Logger, ItemObject, InstanceObject, ITEM_STATUS } from '..';
import {configuration } from './'
const FS = require('fs');
import { EventEmitter } from 'events';
import { DataStore } from 'bpmn-server';
import { parse } from 'querystring';
import { BPMN_TYPE } from '..';
import { EXECUTION_STATUS, Query } from '..';


const logger = new Logger({ toConsole: true});
console.log(configuration);
console.log(configuration.timers);

test();

async function test() {
    console.log(configuration);
    const server = new BPMNServer(configuration, logger, {cron:false});

    console.log("Version #" + BPMNServer.getVersion());


    let response = await server.engine.start('timer-repeat', '');
    console.log("============= doning nothing");
    console.log('============= status:' + response.execution.status);
    logger.log('status:' + response.execution.status);
    await delay(30000);

    //await server.checkTimers();


//    logger.log('status:' + response.execution.status);
    logger.save(__dirname+'/timer-sample.log');
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
 