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
const configuration_1 = require("./configuration");
const _1 = require("./");
const logger = new _1.Logger({ toConsole: true });
let name = 'ds';
let process;
let needsRepairs = true;
let needsCleaning = true;
let response;
let items;
let item;
let query, query1;
let server;
let instanceId;
carGateway();
function carGateway() {
    return __awaiter(this, void 0, void 0, function* () {
        let name = 'Buy.Used.Car.With.Branching';
        let process;
        let caseId = 1050;
        console.log('test');
        const server = new _1.BPMNServer(configuration_1.configuration, logger, { cron: false });
        response = yield server.engine.start(name, { caseId: caseId });
        console.log('==task_buy', getItem('task_Buy').status);
        response = yield server.engine.invoke({
            id: response.id,
            "items.elementId": 'task_Buy'
        }, { needsCleaning: "Yes", needsRepairs: "Yes" });
        response = yield server.engine.invoke({ id: response.id, "items.elementId": 'task_clean' });
        //    response = await server.engine.invoke({ id: response.id, "items.elementId": 'task_repair' });
    });
}
function getItem(id) {
    return response.instance.items.filter(item => { return item.elementId == id; })[0];
}
function checkItem(items, criteria) {
    //    expect(items.length).greaterThan(0);
    if (items.length == 0) {
        console.log(" No items");
        return false;
    }
    const item = items[0];
    let pass = '';
    console.log(' items' + items.length);
    /*
    Object.keys(criteria).forEach(key => {
        if (item[key] != criteria[key]) {
            if (item[key] == criteria[key])
        }

    }); */
}
function checkInstance(instances, criteria) {
    //    expect(items.length).greaterThan(0);
    if (instances.length == 0) {
        console.log(" No items");
        return false;
    }
    const instance = instances[0];
    let pass = '';
    Object.keys(criteria).forEach(key => {
        if (instance[key] != criteria[key]) {
            //expect(instance[key]).equals(criteria[key]);
        }
    });
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
//# sourceMappingURL=test.js.map