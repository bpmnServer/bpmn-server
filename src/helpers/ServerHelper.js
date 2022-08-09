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
exports.ServerHelper = void 0;
const DefaultLogger = require('../src/DefaultLogger.js').DefaultLogger;
const logger = new DefaultLogger({ toConsole: false });
const Server = require("../src/.");
var caseId;
Log("Server Helper");
function Log(msg) {
    logger.log(msg);
}
class ServerHelper {
    constructor(configuration) {
        this.configuration = configuration;
        this.bpmnServer = new Server.BPMNServer(configuration, logger);
    }
    log(msg) {
        logger.log(msg);
        logger.log(msg);
    }
    getLogger() {
        return logger;
    }
    execute(definitionName, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            Log(" from ServerHelper.ts --- to Logger Execute");
            let result = yield this.bpmnServer.execute(definitionName, data);
            if (result.error) {
                console.log("returned error");
                console.log(result.error);
                return;
            }
            this.instance = result.instance;
            this.items = result.items;
            this.engine = result.engine;
            this.instanceId = this.instance.id;
            Log("process start Completed");
            return this;
        });
    }
    invoke(nodeName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Invoking " + nodeName);
            let result = yield this.bpmnServer.invoke({ name: nodeName, status: 'wait', instanceId: this.instanceId }, data = {});
            if (result.error) {
                console.log("returned error");
                console.log(result.error.message);
                return;
            }
            this.instance = result.instance;
            this.items = result.items;
            this.engine = result.engine;
            this.instanceId = this.instance.id;
            Log("invoke Completed");
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
    resetData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bpmnServer.deleteData();
            return true;
        });
    }
    dumpInfo(execution) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!execution.instance)
                return false;
            let instance = execution.instance;
            //        Log("---Logs:---");
            //        instance.logs.forEach(log => { Log(log); });
            let items = execution.instance.items;
            Log("---Items:--- for instance " + execution.instance.id);
            items.forEach(item => { Log("taskId:" + item.taskId + " name:'" + item.name + "' status:" + item.status); });
        });
    }
    isComplete() {
        return __awaiter(this, void 0, void 0, function* () {
            let recs = yield this.bpmnServer.findInstances({ instance: { data: { caseId: caseId } } });
            let rec = recs[0];
            if (!rec)
                return false;
            if (rec.endAt == null)
                return false;
            else
                return true;
        });
    }
    checkItem(query, step) {
        return __awaiter(this, void 0, void 0, function* () {
            query.instance.data = { caseId: caseId };
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
            let items = yield this.bpmnServer.findItems(query); // ({ name: 'Approval', claimId: 5000 });
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
    saveLog(name) {
        logger.save(__dirname + '/logs/' + name + '.log');
    }
}
exports.ServerHelper = ServerHelper;
//# sourceMappingURL=ServerHelper.js.map