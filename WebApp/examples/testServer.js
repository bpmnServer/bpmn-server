"use strict";
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
const index_1 = require("../index");
const configuration_1 = require("../configuration");
const FS = require('fs');
const __1 = require("../");
const logger = new index_1.Logger({ toConsole: true });
console.log(index_1.InstanceObject);
console.log(index_1.ItemObject);
test();
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const bpmn = new index_1.BPMNServer(configuration_1.configuration, logger);
        let execution, definition, list, status, instance;
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
        let data = {};
        instance = bpmn.engine.start('SubProcess');
        instance = bpmn.engine.invoke(itemQuery, data);
        //    instance = bpmn.engine.signal(signalId, data);
        //    instance = bpmn.engine.message(messageId, data);
        instance = bpmn.engine.startEvent(instanceQuery, 'elementId', data);
        instance = bpmn.engine.restore(instanceQuery);
        list = instance.items.filter(item => { });
        status = instance.instance.status;
        list = bpmn.dataStore.findItems(itemQuery);
        list = bpmn.dataStore.findInstances(instanceQuery, 'full');
        list = bpmn.dataStore.findEvents(eventQuery);
        list = bpmn.dataStore.deleteData(instanceQuery);
        definition = bpmn.definitions.load('SubProcess');
        list = bpmn.definitions.list();
        list = bpmn.cron.checkTimers();
        let response = yield bpmn.engine.start('SubProcess', '');
        let items = response.items.filter(item => {
            return (item.status == 'wait');
        });
        let item = items[0];
        console.log(item.id);
        response = yield bpmn.engine.invoke({ items: { id: item.id } }, null);
        response = yield bpmn.engine.invoke({
            instance: { id: response.execution.id },
            items: { elementId: 'sub_usertask_2' }
        }, null);
        console.log('----------------');
        console.log(response);
        console.log('status:' + response.execution.status);
        checkItem(response.items, { status: 'end' });
        logger.save('testbpmn.log');
        return;
    });
}
function testFind() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new index_1.BPMNServer(configuration_1.configuration, logger);
        let response = yield server.engine.start('SubProcess', '');
        let items = response.items.filter(item => {
            return (item.status == 'wait');
        });
        let item = items[0];
        console.log(item.id);
        let query = new __1.Query({ itemId: item.id });
        items = yield server.dataStore.findItems(query);
        console.log(items);
        items = yield server.dataStore.findItems(new __1.Query({ instanceId: response.execution.id, itemElementId: 'sub_usertask_2' }));
        console.log(items);
        /*
         * function example() {
        
            //option 1:
        //    test(new InstanceQuery({ id: 'abc', name: 'Buy', items: new ItemQuery({ id: '112' ,status: ITEM_STATUS.end}) }));
        
            //option 2:
            test({ instanceId: 'abc', instanceName: 'Buy', itemId: '112' , itemStatus: 'end'});
        
            //option 3:
            test(new Query().instanceId('abc').instanceName('Buy').itemId('112').itemStatus(ITEM_STATUS.end));
        
            //option 4:
            test(new Query({ instanceId: 'abc', instanceName: 'Buy', itemId: '112', itemStatus: ITEM_STATUS.end }));
        }
         */
    });
}
function checkItem(items, criteria) {
    if (items.length == 0) {
        console.log(" No items");
        return;
    }
    const item = items[0];
    let pass = '';
    Object.keys(criteria).forEach(key => {
        if (item[key] != criteria[key])
            pass += `${key} not same ${item[key]} vs ${criteria[key]}`;
    });
    console.log('check:' + pass);
}
function delay(time, result) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("delaying ... " + time);
        return new Promise(function (resolve) {
            setTimeout(function () {
                console.log("delayed is done.");
                resolve(result);
            }, time);
        });
    });
}
//# sourceMappingURL=testServer.js.map