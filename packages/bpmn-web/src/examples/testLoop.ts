import  { configuration } from './';
import { BPMNServer, Logger } from './';

const logger = new Logger({ toConsole: true});

test();

async function test() {
    let name = 'Loop';

    const server = new BPMNServer(configuration, logger);

    let response = await server.engine.start(name, { records: [1, 2, 3] });

    response.instance.items.forEach(item => {
        console.log(`-<${item.elementId}> id: <${item.id}> `);
        console.log(item['data']);
    });

 
}
function log(msg) {
    logger.log(msg);
}

