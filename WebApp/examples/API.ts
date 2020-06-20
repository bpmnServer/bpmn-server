/*
# Buy Used Car Example:

![Image description](buyUsedCar.png)

For the model above we will walk - through how to execute it programaticaly.

## Using bpmn - server Server Class

    ```javascript
*/

import { configuration }  from '../configuration.js';
import { BPMNServer, Logger } from '..';
import { Definition, IInstanceData, ExecutionResponse, IItemData } from '../';

const logger = new Logger({ toConsole: true });

test();

async function test() {

    const server = new BPMNServer(configuration, logger);

    const bpmn = new BPMNServer(configuration, logger);

    let signalId, messageId;
    let itemQuery, instanceQuery, eventQuery;

    itemQuery = {
        instance: { id: '<instanceId>', name: '<name>' },
        items: { id: '<id>', elementId: '<>', status: 'wait', itemKey: '<key>', messageId: '', type: '' }
    };

    instanceQuery = {
        instance: { id: '<instanceId>', name: '<name>' },
        items: { id: '<id>', elementId: '<>', status: 'wait', itemKey: '<key>', messageId: '', type: '' }
    };
    // or short format:
    instanceQuery = { id: '<instanceId>', name: '<name>' };

    eventQuery = {
        procesName: '<name>', messageId: ''
    };

    // all of the calls below are independent  and will load different instances if need be
    let status, instance: IInstanceData;
    let response: ExecutionResponse;
    let data = {};

    //  engine
    response = await bpmn.engine.start('SubProcess');
    response = await bpmn.engine.invoke(itemQuery, data);
    response = await bpmn.engine.signal(signalId, data);
    response = await bpmn.engine.startEvent(instanceQuery, 'elementId', data);
    response = await bpmn.engine.get(instanceQuery);
        
    status = response.instance.status;

    let items: IItemData[];
    items = await bpmn.dataStore.findItems(itemQuery);
    items = await bpmn.dataStore.findInstances(instanceQuery, 'full');
    items = await bpmn.dataStore.findEvents(eventQuery);
            await bpmn.dataStore.deleteData(instanceQuery);

    let definition: Definition;
    let list;
    definition = bpmn.definitions.load('SubProcess');
    list       = bpmn.definitions.list();

    let instanceId;
    list =  bpmn.cache.list();
            bpmn.cache.remove(instanceId);
            bpmn.cache.shutdown();
            bpmn.cache.restart();


    list = bpmn.cron.checkTimers();

}
