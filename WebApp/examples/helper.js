
const { Execution , Logger } = require ('../index');
const fs = require('fs');

const logger = new Logger({ toConsole: true });

class Helper {
    constructor(name) {
        this.errors = [];
        this.source = this.getSource(name);
        this.logger = logger;
        this.execution = new Execution(name,this.source,null,logger);
    }
    async execute(startNode,data) {
        return await this.execution.execute(startNode, data);
    }
    async signal(id, data) {
        return await this.execution.signal(id, data);
    }

    executionStatus(option,status) {
        if (this.execution.status == status)
            log(` execution status ${status}`);
        else {
            const msg = `Error exection status is ${execution.status} not ${status}`;
            log(msg);
            this.errors.push(msg);
        }
    }

    itemStatus( elementId,option  , status) {
        const list = this.execution.getItems().filter(item => {
            return (item.elementId == elementId && item.status == status);
        });
        if ((list.length > 0))
            log(` item<${elementId}> has the status ${status}`);
        else {
            const msg =`Error item<${elementId}> does not have the status ${status}`;
            log(msg);
            this.errors.push(msg);
        }
    }
    getSource(name) {
        const file = __dirname + '/../../WebApp/processes/' + name + '.bpmn';

        return fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
    }

    async restore() {
        const state = await  this.execution.getState();
        this.execution = await Execution.restore(state , null, logger);
    }
    delay(time, result) {
        log("delaying ... " + time)
        return new Promise(function (resolve) {
            setTimeout(function () {
                log("delayed is done.");
                resolve(result);
            }, time);
        });
    }
    report() {
        this.execution.report();
        this.errors.forEach(error => {
            log(error);});

    }
    save(fileName) {
        logger.save(fileName);
    }
    log(msg) {
        logger.log(msg);
    }
}

function expectExecution(execution,status) {
    if (execution.status == status)
        log(` execution status ${status}`);
    else
        log(`Error exection status is ${execution.status} not ${status}`);

}

function expectItem(execution,elementId, status) {
    const list = execution.getItems().filter(item => {
        return (item.elementId == elementId && item.status == status);
    });
    if ((list.length > 0))
        log(` item<${elementId}> has the status ${status}`);
    else
        log(`Error item<${elementId}> does not have the status ${status}`);
}
function getSource(name) {
    const file = __dirname + '/../../WebApp/processes/' + name + '.bpmn';

    return fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
}
async function delay(time, result) {
    log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            log("delayed is done.");
            resolve(result);
        }, time);
    });
}
function save(fileName) {

}
function log(msg) {
    logger.log(msg);
}


module.exports = { Helper, save, log, delay, expectItem, expectExecution, getSource };