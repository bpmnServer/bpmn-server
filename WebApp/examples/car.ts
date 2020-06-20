import  { configuration }   from '../configuration.js';
import { BPMNServer, Logger } from '../';
import { EventEmitter } from 'events';

const logger = new Logger({ toConsole: false });

test();
function listen(listener) {
    listener.on('end', function ({ item, event }) {
        console.log('----->'+event+" "+ item.elementId);
    });

    listener.on('all', function ({ item, event, token, execution }) {
        let object;
        if (event.startsWith('execution.')) object = execution;
        else
            object = item;

        console.log('----->event:' + event + ' '+ object.constructor.name);
    });

    listener.on('wait', function (object, event) {
//        console.log('----->' + event);
    });
}
async function test() {

    const server = new BPMNServer(configuration, logger);
    const listener = new EventEmitter();

    listen(listener);

    let response = await server.engine.start('Buy Used Car', {},listener);

    // let us get the items
    const items = response.items.filter(item => {
        return (item.status == 'wait');
    });

    items.forEach(item => {
        console.log(`  waiting for <${item.name}> -<${item.elementId}> id: <${item.id}> `);
    });

    console.log('Invoking Buy');

    response = await server.engine.invoke({ instance: { id: response.execution.id } , items: { elementId: 'task_Buy' } },
        { model: 'Thunderbird', needsRepairs: false, needsCleaning: false });

    console.log("Ready to drive");

    let item= response.items.filter(item => {
        return (item.name== 'Drive');
    })[0];

    console.log('item: -------------');

    console.log(item.data);
    item.data = { cost: 45000 };
    console.log('item: -------------');
    console.log(item.data);

    response = await server.engine.invoke({ instance: { id: response.execution.id }, items: { elementId: 'task_Drive' } });

    console.log(`that is it!, process is now complete status=<${response.execution.status}>`)

}
