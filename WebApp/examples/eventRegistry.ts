
import { BPMNServer, Logger, ItemObject, InstanceObject, ITEM_STATUS } from '../';
import { MyAppDelegate } from '../appDelegate';
import { configuration } from '../configuration'
const FS = require('fs');
import { EventEmitter } from 'events';
import { DataStore } from '../';
import { BPMN_TYPE } from '../';
import { EXECUTION_STATUS, Query } from '../';
import { config } from 'process';
import { EventsRegistry, TimerEvent, SignalEvent } from '../';

const MongoClient = require('mongodb').MongoClient;
const MongoDb = require('mongodb');
const mongoose = require('mongoose');

const logger = new Logger({ toConsole: true });

var caseId = Math.floor(Math.random() * 10000);


async function test() {
   //simulate a timer:
	const server = new BPMNServer(configuration, logger);

    const registry = server.eventsRegistry;
    let duration = 100;
    let now = new Date();
    let timeDue = new Date(now.getTime() + duration);
    console.log(" now in time: " + now.getTime());

    let event1 = new TimerEvent({ timeDue: timeDue});
    registry.addEvent(event1);

    let event2 = new SignalEvent({ signalId: 'StopAllServices'});
    registry.addEvent(event2);

    await delay(1500);
    await server.cron.checkTimers();
	return;
    console.log(await server.cron.findEventById('StopAllServices'));

}

async function delay(time) {
    log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            log("delayed is done.");
            resolve();
        }, time);
    });
}
function log(msg) {
    logger.log(msg);
}

test();