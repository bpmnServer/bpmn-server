'use strict';

import { BPMNServer } from '../src/BPMNServer';

const config = require('../configuration.js').configuration;

let server, instance;

test();

async function test() {
//    let name = 'Buy Used Car';

    let name = 'timerBeforeUser';

    server = new BPMNServer(config);
    let execution = await server.execute(name, {}, { caseId: 999 });
    let instance = execution.instance;
    let items = execution.instance.items;
    return;

    let engine = execution.engine;
    console.log("instance");
    console.log('instanceId:' + instance.id + " items " + items.length);
    let waiting = await server.findItems({ instanceId: instance.id, status: 'wait', data: { caseId: 999 } });
    if (waiting.length > 0) {
        let item = waiting[0];
        console.log(`item ${name} is waiting - let us invoke it`);
        let newResults = await server.invoke({ instanceId: instance.id, status: 'wait', name: 'Buy Car' }
            , { model: 'Thunderbird' });
        console.log("new results");
        console.log(newResults);
    }
    else {
        console.log("Error something went wrong");
    }
}


