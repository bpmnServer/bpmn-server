import { configuration } from './';
import { BPMNServer, Logger, Definition } from './';
import { inherits } from 'util';
//import { MyDelegate } from './test2.js';
const logger = new Logger({ toConsole: false });
const server = new BPMNServer(configuration, logger, { cron: false });

test();
//runmocha();

//server.cron.checkTimers(1000);

let name = 'Event Based Gateway';

let process;
let response;
let instanceId;

//mocha
function runmocha() {

    var expect = require("chai").expect;
    var chai = require("chai");
    //console.log(chai);
    //var mocha = require("mocha");
    //console.log(mocha);
    var { describe, it } = require('mocha');
    console.log(describe);

describe('Event Based Gateway', () => {

    describe('All', () => {

        it('Start Process', async () => {
            server.cron.checkTimers();
            response = await server.engine.start(name, { reminderCounter: 0, caseId: 1005 });
        });
        it('events should fire and wait', () => {

            expect(response).to.have.property('execution');
            instanceId = response.execution.id;
            expect(getItem('timerEvent').status).equals('wait');
            expect(getItem('messageEvent').status).equals('wait');
            expect(getItem('Task_receive').status).equals('wait');
            expect(getItem('event_signal').status).equals('wait');

        });

        it('we wait a bit for timer to complete', async () => {
            await delay(3000);
            await server.cron.checkTimers();
            // we restore to get latest status; since the timer did some work in the background!

            //response = await server.engine.restore({ "id": instanceId });
            console.log(response.instance.items.length);
            let item = getItem('timerEvent');
            log('timerEvent:' + item.id + " status: " + item.status);

        });
        {

            it('after wait - timer should have completed', () => {
                expect(getItem('timerEvent').status).equals('end');
            });
            it('other events complete as well', () => {
                expect(getItem('messageEvent').status).equals('end');
                expect(getItem('Task_receive').status).equals('end');
                expect(getItem('event_signal').status).equals('end');
            });

            it('also reminder task will fire', () => {
                try {
                    expect(getItem('reminder').status).equals('wait');
                }
                catch (exc) {

                }
            });

            it('we issue reminder', async () => {

                const query = {
                    id: instanceId,
                    "items.elementId": 'reminder'
                };
                response = await server.engine.invoke(query, {});
            });
        }
        it('write log file to' + name + '.log', async () => {
            let fileName = __dirname + '/../logs/' + name + '.log';
            logger.save(fileName);
        });

    });

}); 

}

function env() {

    const dotenv = require('dotenv');
    const res = dotenv.config();
    console.log(`keY: ${process.env.API_KEY} ${JSON.stringify(res, null, 2)} ---- `);

}

/*
console.log(res);
console.log("dir:", __dirname, "API Key", process.env.API_KEY);
console.log(configuration);
*/
/*
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
    to: 'hanna.ralph@gmail.com', // Change to your recipient
    from: 'ralphhanna@hotmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}

sgMail
    .send(msg)
    .then((response) => {
        console.log('responseCode',response[0].statusCode)
        console.log('responseHeaders',response[0].headers)
    })
    .catch((error) => {
        console.error('Error'+error)
    })

*/

//test5();


class ProcessDefinition {
    name;
    def: Definition;
    constructor(name) {
        this.name = name;
    }
    async describe() {
        if (!this.def)
            this.def= await server.definitions.load(this.name);
        console.log(this.def.processes);
        this.def.nodes.forEach(node => { console.log(node.id,node.describe()); });
        this.def.accessRules.forEach(rule => { console.log(rule.id,rule.constructor.name,rule.describe()); });

    }
}
class BaseProcess {
    get _name() { return ''; }
    instance;
    get _data() { return this.instance.data; }
    get _items() { return this.instance.items; }

    async _start(data = {}, startNodeId) {
        const response = await server.engine.start(this._name,data, startNodeId);
        this.instance = response.instance;

    }

    async _invoke(itemId, data) {
        const response = await server.engine.invoke(
            { id: this.instance.id, "items.elementId": itemId },
            data);
        this.instance = response.instance;

    }
    static _describe() {
//        console.log(BaseProcess._name);
    }
}
class BaseProcessDelegate {

}
class BuyUsedCarDelegate extends BaseProcessDelegate {
    load() { }
    save() { }
    validate_buy(data,user,context) {

    }
    perform_buy(data, user, context) {

    }
}
class BuyUsedCar extends BaseProcess { 
    static Definition = new ProcessDefinition('Buy Used Car');
    get _name() { return 'Buy Used Car';}
    static async Start(data, startNodeId=null) {

        const car = new BuyUsedCar();
        await car._start(data, startNodeId);
        //const resp = await server.engine.start(this._name, data, null, null);
        return car;

    }
    static async Load(query) {
        const car = new BuyUsedCar();
        car.instance = await server.dataStore.findInstance(query, {});
        return car;

    }
    async buy(data) {
        return super._invoke('task_Buy', data);
    }
    async clean(data = {}) {
        return super._invoke('task_clean', data);
    }
    async repair(data = {}) {
        return super._invoke('task_repair', data);
    }
    async drive(data = {}) {
        return super._invoke('task_Drive', data);
    }
}
/*
test2(1,'user1');
test2(2,'user2');
test2(3,'user3');
*/
//test4();

async function test5() {


    const { MyDelegate, definitionDelegate } = require('./test2');
    const res = await server.engine.start('Buy Used Car', { caseId: 55}, null, null);
    const delegate = definitionDelegate();
    console.log(delegate,delegate.data);
}
async function test4() {

    //await BuyUsedCar.Definition.describe();

    const car=await BuyUsedCar.Start({ caseId: 10080 });
//    console.log("Car:", car.instance.items);
//    const car2 = await BuyUsedCar.Load({ data: { caseId: 10080 }});
//   console.log("Car:", car._data, car._items.length);

    await car.buy({ model: 'Thunderbird', needsRepairs: "Yes", needsCleaning: "Yes"});
    await car.clean();
    await car.repair();
    await car.drive();

    console.log("Car:", car.instance.id, car._data.caseId, car._items.length);
    BuyUsedCar._describe();

}

async function test2(id,userId) {

    const listener = server.listener;
    console.dir(listener);

    listen(listener);
    const options = { listener, nowait: true };
    const res = await server.engine.start('Buy Used Car', { caseId: id }, null,userId, { noWait: true });
    console.log("no wait",res.instance.constructor.name,res.instance.items.length);
    let out = await res.tillDone();

    console.log('return from start');
    console.log("done",res.instance.constructor.name,res.instance.items.length,res.instance.data,res.userName);
    return;

}
function listen(listener) {
    listener.on('end', function ({ context, event }) {
        console.log('----->'+event+" "+ context.item.elementId);
    });

    listener.on('all', function ({ context, event, }) {
//        console.log('-----> Event:', event);
    });

    listener.on('wait', function ({ context, event }) {
        console.log('-----> wait 1' + event , context.instance.id,context.item.id);
    });
}
async function test() {
    console.log('test');
    const server = new BPMNServer(configuration, logger, {cron:false});
    const listener = server.listener;

    //listen(listener);
    let context = await server.engine.start('Buy Used Car', { caseId: 1050 }, null,'user1', {noWait:false});
    let out = await context.tillDone();

    console.log('item:',context.item.id);

    console.log('return from start');
    return;


    let response = await server.engine.start('Buy Used Car', { caseId: 1050 });

    console.log('return from start');
    return;
//    console.log(response.items);
    response.instance.items.forEach(item => { console.log(item.id); });

    // let us get the items
    const items = response.instance.items.filter(item => {
        return (item.status == 'wait');
    });
    console.log('-------------------------------------');

    items.forEach(item => {
        console.log(`====  waiting for <${item.name}> -<${item.elementId}> id: <${item.id}> `);
    });
    console.log('Invoking Buy');
    console.log('ID:' + response.execution.id);
//    return;

    const insts = await server.dataStore.findInstance({ id: response.execution.id }, {});
    console.log(insts.items);
    return;
    response = await server.engine.invoke({id: response.execution.id , "items.elementId": 'Buy' },
        { model: 'Thunderbird', needsRepairs: false, needsCleaning: false });

    console.log("Ready to drive");
    console.log(response.instance.items.length);
    return;
    let item = response.instance.items.filter(item => {
        return (item.name== 'Drive');
    })[0];

    console.log('item: -------------');

    console.log(item.data);
    item.data = { cost: 45000 };
    console.log('item: -------------');
    console.log(item.data);

    response = await server.engine.invoke({id: response.execution.id , "items.elementId": 'Drive' });

    console.log(`that is it!, process is now complete status=<${response.execution.status}>`)

    await logger.save('car.log');

}
async function readMe() {
    console.log("ReadMe");
    const server = new BPMNServer(configuration, logger);

    let response = await server.engine.start('Buy Used Car');

    // let us get the items
    const items = response.instance.items.filter(item => {
        return (item.status == 'wait');
    });

    items.forEach(item => {
        console.log(`  waiting for <${item.name}> -<${item.elementId}> id: <${item.id}> `);
    });
    console.log('response.execution.id');
    console.log(response.execution.id);

    console.log('Invoking Buy');

    response = await server.engine.invoke({ id: response.execution.id, "items.elementId": 'task_Buy' },
        { model: 'Thunderbird', needsRepairs: false, needsCleaning: false });

    console.log("Ready to drive");

    response = await server.engine.invoke({ id: response.execution.id, "items.elementId": 'task_Drive' });


    console.log(`that is it!, process is now complete status=<${response.execution.status}>`)


}

async function delay(time) {
    log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(time);
        }, time);
    });
}
function log(msg) {
    logger.log(msg);
}
function getItem(id) {
    const item = response.instance.items.filter(item => { return item.elementId == id; })[0]
    if (!item) {
        log('item ' + id + ' not found');
    }
    return item;
}