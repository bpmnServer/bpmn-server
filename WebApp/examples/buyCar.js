"use strict";
/*
# Buy Used Car Example:

![Image description](buyUsedCar.png)

For the model above we will walk - through how to execute it programaticaly.

## Using bpmn - server Server Class

    ```javascript
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_js_1 = require("../configuration.js");
const __1 = require("../");
const logger = new __1.Logger({ toConsole: true });
test();
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new __1.BPMNServer(configuration_js_1.configuration, logger);
        // we execute a process by name; in this case 'Buy Used Car'
        let response = yield server.engine.start('Buy Used Car');
        // let us get the items
        // Items are the instances of various nodes executed so far
        const items = response.items.filter(item => {
            return (item.status == 'wait');
        });
        items.forEach(item => {
            console.log(`  waiting for <${item.name} > -<${item.elementId} > id: <${item.id} > `);
        });
        const itemId = items[0].id;
        console.log(`Invoking Buy id: <${itemId} > `);
        /*
        ```
        we now to specify to the server which node to invoke, keep in mind this can happen any time later
        so we need to identify the instance as well as the item, but since the ItemId is unique we can use it for the query.
        
            The query is passed to MongoDB to select the appropriate item.
           
        ```javascript
        */
        response = yield server.engine.invoke({ items: { id: itemId } }, { model: 'Thunderbird', needsRepairs: false, needsCleaning: false });
        console.log("Ready to drive");
        /*
        ```
            in the next scenario, we will query on instance id as well as the element id
        
        ```javascript
        */
        response = yield server.engine.invoke({ instance: { id: response.execution.id }, items: { elementId: 'task_Drive' } });
        console.log(`that is it!, process is now complete status = <${response.execution.status} > `);
    });
}
/*
```
The instance Items should look like this:

![Completed Process](buyUsedCarWithItems.png)
*/ 
//# sourceMappingURL=buyCar.js.map