
import { IExecution, Item, FLOW_ACTION , NODE_ACTION, IExecutionContext  } from '.';
import { DefaultAppDelegate } from '.';

const fs = require('fs');

var seq = 1;

class MyAppDelegate extends DefaultAppDelegate{
    constructor(logger = null) {
        super(logger);
    }

    async executionStarted(execution: IExecutionContext) {
        await super.executionStarted(execution);}
    async executionEvent({ event, item, execution }) {
        let object;
        if (event.startsWith('execution.'))
            object = execution;
        else
            object = item;
    }
    async messageThrown(messageId, data, matchingQuery, item: Item) {
        await super.messageThrown(messageId, data, matchingQuery,item);
    }
    async signalThrown(signalId, data, matchingQuery, item: Item) {
        await super.signalThrown(signalId, data, matchingQuery, item);
    }

    async serviceTask(item) {
        console.log(" Hi this is the serviceTask from appDelegate");
        console.log(item);
        await delay(5000, 'test');
        console.log(" Hi this is the serviceTask from appDelegate says bye");
    }
    async serviceCalled(item) {

    }
    async service1(item) {
        seq++;
        await delay(3000 -(seq * 100) , 'test');
        item.token.log("SERVICE 1" + item.token.currentNode.id);
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
export {MyAppDelegate}