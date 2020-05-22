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
const Logger_1 = require("../src/Logger");
const Log = Logger_1.Logger.log;
const Error = Logger_1.Logger.error;
const config = require('../configuration.js').configuration;
const Server = require("../src/BPMNServer");
let bpmnServer = new Server.BPMNServer(config);
var caseId;
Log("starting...");
//test();
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        let helper = new ServerHelper();
        yield helper.execute('Buy Used Car');
    });
}
class ServerHelper {
    execute(definitionName, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield bpmnServer.execute(definitionName, data);
            this.instance = result.instance;
            this.items = result.items;
            console.log(this.items);
            this.engine = result.engine;
            this.instanceId = this.instance.id;
            Log("process start Completed");
            return this;
        });
    }
    invoke(nodeName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield bpmnServer.invoke({ name: nodeName, instanceId: this.instanceId }, data = {});
            this.instance = result.instance;
            this.items = result.items;
            this.engine = result.engine;
            this.instanceId = this.instance.id;
            Log("process start Completed");
            return this;
        });
    }
    waitingItems() {
        return this.getItems('wait');
    }
    completedItems() {
        return this.getItems('end');
    }
    getItems(status) {
        let items = [];
        this.items.forEach(item => {
            if (item.status == status)
                items.push(item);
        });
        return items;
    }
    static resetData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield bpmnServer.deleteData();
            return true;
        });
    }
    showLog() {
        return __awaiter(this, void 0, void 0, function* () {
            let recs = yield DS.findInstances({ data: { caseId: caseId } });
            let instance = recs[0];
            if (!instance)
                return false;
            Log("---Logs:---");
            instance.logs.forEach(log => { Log(log); });
            let items = yield DS.findItems({ data: { caseId: caseId } });
            Log("---Items:---" + items.length);
            items.forEach(item => { Log("taskId:" + item.taskId + " name:'" + item.name + "' status:" + item.status); });
        });
    }
    isComplete() {
        return __awaiter(this, void 0, void 0, function* () {
            let recs = yield DS.findInstances({ data: { caseId: caseId } });
            let rec = recs[0];
            if (!rec)
                return false;
            if (rec.endAt == null)
                return false;
            else
                return true;
        });
    }
    invokeStep(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield this.findItems({ status: 'wait', name: name, data: { caseId: caseId } });
            if (items.length == 0) {
                Log("++++++++++++++++++++");
                Log("Error not waiting items for " + name);
                return null;
            }
            let item = items[0];
            let instance = yield bpmnServer.invoke({ id: item.id }, {});
            items = yield this.findItems({ status: 'end', name: name, data: { caseId: caseId } });
            if (items.length == 0) {
                Log("++++++++++++++++++++");
                Log("Invoked task is not ended yet" + name);
                return null;
            }
            items = yield this.findItems({ data: { caseId: caseId } });
            item = items[0];
            Log("step Completed");
            return instance;
        });
    }
    checkItem(query, step) {
        return __awaiter(this, void 0, void 0, function* () {
            query.data = { caseId: caseId };
            console.log(query);
            let items = yield this.findItems(query);
            if (items.length != step.count) {
                Error("Count of " + items.length + "not " + step.count + " in " + step.title);
                return null;
            }
            return true;
        });
    }
    findItems(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield DS.findItems(query); // ({ name: 'Approval', claimId: 5000 });
            console.log(" found items " + items.length);
            //    items.forEach(item => { Log("id:" + item.taskId + " " +  item.name + " status:" + item.status); });
            return items;
        });
    }
    delay(time, result) {
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
}
exports.ServerHelper = ServerHelper;
//# sourceMappingURL=ServerHelper.js.map