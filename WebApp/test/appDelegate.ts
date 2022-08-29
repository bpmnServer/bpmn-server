
import { IExecution, Item, FLOW_ACTION, NODE_ACTION} from '..';
import { DefaultAppDelegate } from '..';

const fs = require('fs');

var seq = 1;

class MyAppDelegate extends DefaultAppDelegate {
    constructor(logger = null) {
        super(logger);
        this.servicesProvider = new MyServices();
    }
    sendEmail(to, msg, body) {
        console.log(`sendign email to ${to}`);
    }
    async executionStarted(execution: IExecution) {
        await super.executionStarted(execution);
    }

    async messageThrown(messageId, data, matchingQuery, item: Item) {
        await super.messageThrown(messageId, data, matchingQuery, item);
    }
    async signalThrown(signalId, data, matchingQuery, item: Item) {
        await super.signalThrown(signalId, data, matchingQuery, item);
    }
    async serviceCalled(input, context) {

    }
}

async function delay(time, result) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(result);
        }, time);
    });
}
class MyServices {

    async serviceTask(input, context) {
        let item = context.item;
        console.log(" Hi this is the serviceTask from appDelegate");
        console.log(item);
        await delay(5000, 'test');
        console.log(" Hi this is the serviceTask from appDelegate says bye");
    }
    async add({ v1, v2 }) {
        console.log("Add Service");
        console.log(v1, v2);
        return v1 + v2;
    }
    async service1(input, context) {
        let item = context.item;
        seq++;
        await delay(3000 - (seq * 100), 'test');
        item.token.log("SERVICE 1" + item.token.currentNode.id);
        return { seq, text: 'test' };

    }
}
export { MyAppDelegate }