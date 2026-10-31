/*
# Buy Used Car Example:

![Image description](buyUsedCar.png)

For the model above we will walk - through how to execute it programaticaly.

## Using bpmn - server Server Class

    ```javascript
*/

import { configuration } from './';
import { BPMNServer, Logger } from './';

const logger = new Logger({ toConsole: true });

test();

async function test() {

    const server = new BPMNServer(configuration, logger);

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
/*
```
we now to specify to the server which node to invoke, keep in mind this can happen any time later
so we need to identify the instance as well as the item, but since the ItemId is unique we can use it for the query.

    The query is passed to MongoDB to select the appropriate item.
   
```javascript
*/
    response = await server.engine.invoke({"items.id": itemId  },
        { model: 'Thunderbird', needsRepairs: false, needsCleaning: false });

    console.log("Ready to drive");
/*
```
    in the next scenario, we will query on instance id as well as the element id

```javascript
*/
    response = await server.engine.invoke({id: response.id , "items.elementId": 'task_Drive' });

    console.log(`that is it!, process is now complete status = <${ response.status } > `)

}
/*
```
The instance Items should look like this:

![Completed Process](buyUsedCarWithItems.png)
*/