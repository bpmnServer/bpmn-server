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
const __1 = require("..");
const logger = new __1.Logger({ toConsole: true });
test();
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new __1.BPMNServer(configuration_js_1.configuration, logger);
        const bpmn = new __1.BPMNServer(configuration_js_1.configuration, logger);
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
        let status, instance;
        let response;
        let data = {};
        //  engine
        response = yield bpmn.engine.start('SubProcess');
        response = yield bpmn.engine.invoke(itemQuery, data);
        response = yield bpmn.engine.signal(signalId, data);
        response = yield bpmn.engine.startEvent(instanceQuery, 'elementId', data);
        response = yield bpmn.engine.get(instanceQuery);
        status = response.instance.status;
        let items;
        items = yield bpmn.dataStore.findItems(itemQuery);
        items = yield bpmn.dataStore.findInstances(instanceQuery, 'full');
        items = yield bpmn.dataStore.findEvents(eventQuery);
        yield bpmn.dataStore.deleteData(instanceQuery);
        let definition;
        let list;
        definition = bpmn.definitions.load('SubProcess');
        list = bpmn.definitions.list();
        let instanceId;
        list = bpmn.cache.list();
        bpmn.cache.remove(instanceId);
        bpmn.cache.shutdown();
        bpmn.cache.restart();
        list = bpmn.cron.checkTimers();
    });
}
//# sourceMappingURL=API.js.map