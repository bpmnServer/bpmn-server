import  { configuration } from './';
import { BPMNServer, Logger } from './';
import { EventEmitter } from 'events';
const logger = new Logger({ toConsole: false });


test();

function asyncTest() {


    const listener = new EventEmitter();

    listener.on('all', function ({ context, event, }) {
        let msg = '';
        if (context.instance.id)
            msg = ' instanceId: ' + context.instance.id;
        if (context.item)
            msg += ' Item: ' + context.item.elementId + " itemId: "+ context.item.id;
        console.log('---Event: -->' + event + msg );
    });

    const server = new BPMNServer(configuration, logger, { cron: false });

    // notice no await for next line
    server.engine.start('serviceTask', { v1: 1, v2: 2 });

}

async function test() {
    let name = 'serviceTask';

    const server = new BPMNServer(configuration, logger, { cron: false });

    //let response = await server.engine.start('serviceTask');
    let response = await server.engine.start('test-service');

    console.log(response.instance.data)

        
    log('end');
    logger.save(name + '.log');
}
function getItem(response) {
    let current;
    response.items.forEach(item => {
       log(`-<${item.elementId}> id: <${item.id}>  ${item.status}`);
        console.log(item['data']);
        if (item.status == 'wait')
            current = item;
    });

    return current;
}
function log(msg) {
    logger.log(msg);
}

