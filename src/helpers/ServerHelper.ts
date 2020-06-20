

const DefaultLogger = require('../src/DefaultLogger.js').DefaultLogger;

const logger = new DefaultLogger({ toConsole: false });

const Server= require("../src/.");



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
    bpmnServer;
    configuration;
    instance;
    items;
    engine;
    instanceId;

    log(msg) {
        logger.log(msg);
        logger.log(msg);
    }

    getLogger() {
        return logger;
    }

    async execute(definitionName, data = {}) {
        Log(" from ServerHelper.ts --- to Logger Execute");
        let result = await this.bpmnServer.execute(definitionName,data);
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
    }
    async invoke(nodeName, data) {

        console.log("Invoking "+nodeName);

        let result = await this.bpmnServer.invoke({ name: nodeName, status: 'wait', instanceId: this.instanceId }, data = {});

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

    async resetData() {
        await this.bpmnServer.deleteData();
        return true;

    }
    async dumpInfo(execution) {

        if (!execution.instance)
            return false;
        let instance = execution.instance;
//        Log("---Logs:---");
//        instance.logs.forEach(log => { Log(log); });
        let items = execution.instance.items;
        Log("---Items:--- for instance " + execution.instance.id);
        items.forEach(item => { Log("taskId:" + item.taskId + " name:'" +  item.name + "' status:" + item.status); });

    }
    async isComplete() {

        let recs = await this.bpmnServer.findInstances({ instance: { data: { caseId: caseId } } });
        let rec = recs[0];
        if (!rec)
            return false;
        if (rec.endAt == null)
            return false;
        else
            return true;
    }
    async checkItem(query,step) {
        query.instance.data = { caseId: caseId };
        console.log(query);
        let items = await this.findItems(query);

        if (items.length !=step.count) {
            Error("Count of "+items.length+ "not "+ step.count+ " in "+step.title);
            return null;
        }
        return true;
    }

    async findItems(query) {
        let items = await this.bpmnServer.findItems(query); // ({ name: 'Approval', claimId: 5000 });
        console.log(" found items " + items.length);
    //    items.forEach(item => { Log("id:" + item.taskId + " " +  item.name + " status:" + item.status); });
        return items;
    }
    async delay(time, result) {
        console.log("delaying ... "+time)
        return new Promise(function (resolve) {
            setTimeout(function () {
                console.log("delayed is done.");
                resolve(result);
            }, time);
        });
    }
    saveLog(name) {
        logger.save(__dirname+'/logs/' + name + '.log');
    }
}

export { ServerHelper}