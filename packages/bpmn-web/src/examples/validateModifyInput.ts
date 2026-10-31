/*
# Buy Used Car Example:

![Image description](buyUsedCar.png)

For the model above we will walk - through how to execute it programaticaly.

## Using bpmn - server Server Class

    ```javascript
*/

import { configuration } from './';
import { BPMNServer, Logger } from './';

const logger = new Logger({ toConsole: false });

test();

async function test() {

    const server = new BPMNServer(configuration, logger);


    const listener = server.listener;
    listener.on('validate',async function ({ context, event, }) {

        console.log('--------- validate ------ ',context.item);
    });
        
    // we execute a process by name; in this case 'Buy Used Car'

    let response = await server.engine.start('Buy Used Car');

    // let us get the items
    // Items are the instances of various nodes executed so far

    const items = response.instance.items.filter(item => {
        return (item.status == 'wait');
    });

    items.forEach(item => {
        console.log(`  waiting for <${ item.name } > -<${ item.elementId } > id: <${ item.id } > `);
    });
    const itemId = items[0].id;

    console.log(`Invoking Buy id: <${ itemId } > `);
    response = await server.engine.invoke({"items.id": itemId  },
        { model: 'Thunderbird', needsRepairs: false, needsCleaning: false });

    console.log("Ready to drive");

}
