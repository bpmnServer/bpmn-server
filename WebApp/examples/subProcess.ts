import  { configuration } from '../configuration.js';
import { BPMNServer, Logger } from '..';

const logger = new Logger({ toConsole: true});

test();

async function test() {
    let name = 'SubProcess';

    const server = new BPMNServer(configuration, logger);

    let response = await server.engine.start(name, { task_subProcess: { clients: ['abc', 'mbc', 'cbc'] } });

    let current = getItem(response);

    log('Test:invoking ' + current.elementId);
    response = await server.engine.invoke({ items: { id: current.id } });

    current = getItem(response);
   log('Test:invoking ' + current.elementId);
    response = await server.engine.invoke({ items: { id: current.id } });

        
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

