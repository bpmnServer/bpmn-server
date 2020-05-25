
import { BPMNServer } from '../src/BPMNServer';

const config = require('../configuration.js').configuration;

let server, instance;

/**
 *  1.  models list
 *  
 *  2.  simple execution
 *  
 *  3.  show user interaction - cash request approval id
 * 
 *  4.  show pending items for a given task
 *  
 *  5.  Timer
 *  
 *  6.  show more complete example buy car
 *  
 *  7.  show services
 * 
 */
//timerWithUserTask();
cashRequest();
async function Models() {

    const definitions = config.definitions;


}
async function cashRequest() {

    let name = 'cashRequest';

    server = new BPMNServer(config);
    let execution = await server.execute(name, {}, {
        caseId: 101
    });
    let instance = execution.instance;
    let items = instance.items;

    instance.getItems({ status: 'wait' }).forEach(item => {
        console.log(`  waiting for ${item.name} `);
    });


    console.log('Invoking Buy');

    execution = await server.invoke({
        instanceId: execution.instance.id, status: 'wait', name: 'User Request'
    }, 'ralph'
        , { amount: 500, purpose: 'travel expenses' });
    console.log("invoke returned to example");
    let approvalItem = instance.getItems({ status: 'wait', name: 'Approval' });
    console.log(approvalItem);

}
async function timerWithUserTask() {
//    let name = 'Buy Used Car';

    let name = 'timerBeforeUser';

    server = new BPMNServer(config);
    let execution = await server.execute(name, {}, { caseId: 999 });
    let instance = execution.instance;
    let items = execution.instance.items;


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


