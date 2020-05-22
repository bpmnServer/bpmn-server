//'use strict';

const { Engine } = require('bpmn-engine');
const { EventEmitter } = require('events');

const fs = require('fs');

function engineLogger(name) {
    return new EngineCustomLogger(name);
}
class EngineCustomLogger {
    constructor(name) {
        this.name = name;
    }
    debug(...args) { // console.log('bpmn:'+args[0]); 
    }
    warn(...args) { console.log(args); }
    error(...args) { console.log(args); }
}

class EngineHelper {
    constructor(bpmnPath, logPath) {
        this.bpmnPath = bpmnPath;
        this.logPath = logPath;
        this.engine = null;
        this.completed = false;
        this.waitings = new Map();
    }
    async getSource(name) {

        console.log('name:'+name);
        let file = fs.readFileSync(this.bpmnPath+'/'+name+'.bpmn',
            { encoding: 'utf8', flag: 'r' });
        return file;
    }
    async saveLogs(name) {

    }

    async runAlist(name,list) {

        await this.execute(name, {});

        let i;
        for (i = 0; i < list.length; i++) {
        id = list[i];
            console.log(" invoking " + id);
            await this.invoke(id, {});
        }
    }
    async runAll(name) {
        await this.execute(name, {});

        let sequence = [];
        while (this.whoIsWaitng().length > 0) {
            let taskId = this.whoIsWaitng()[0];
            console.log(" invoking " + taskId);
            await this.invoke(taskId, {});
            sequence.push(taskId);
        }
        return sequence;
    }
    async execute(name, data) {

        let source = await this.getSource(name);
        console.log("execute");
        console.log("-------");
        this.engine = Engine({ name: 'listen example', source, Logger: engineLogger });

        const listener = this.getListener(this.engine);
        await this.engine.execute({ listener , data }, (err) => {
            if (err) throw err;
        });
    }

    invoke(taskId,data) {

        let task = this.waitings.get(taskId);
        if (task) {
            console.log(`Invoking...`);
            task.signal({
                ioSpecification: {
                    dataOutputs: data
                }
            });
        }
        else
            console.log("Error can't invoke this item it is not in waiting");

    }

    getListener(engine, callback = null) {

        const listener = new EventEmitter();

        listener.on('activity.end', (task) => {
            console.log("end " + task.id);
            this.waitings.delete(task.id);
        });

        listener.on('wait', (task) => {
            console.log("waiting " + task.id);
            this.waitings.set(task.id,task);
        });
        engine.on('end', (execution) => {
            this.completed = true;
        });

        return listener;
    }
    whoIsWaitng() {
        let list = [];
        this.waitings.forEach(function (value, key, map) {
            list.push(key);
        });
        return list;
    }
}


runTest();

async function runTest() {
    let helper = new EngineHelper('../processes');
    
    let list = await helper.runAll('Buy Used Car2', {});
    console.log("Executed"+ list);
    return;
    await helper.execute('sample', {})
    console.log("waitings:" + helper.whoIsWaitng());

    await helper.invoke('userTask1');

    await helper.invoke('userTask1');


    console.log("waitings:" + helper.whoIsWaitng());

    console.log("-------");
    await helper.runAll('sample', {})

}
module.exports = {EngineHelper}