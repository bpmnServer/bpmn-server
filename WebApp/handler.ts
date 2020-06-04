
import { Execution,IHandler, Item, FLOW_ACTION , NODE_ACTION  } from 'bpmn-server';

const fs = require('fs');

var seq = 1;

class MyHandler implements IHandler {
    constructor(logger=null) {
    }

    executionStarted(execution: Execution) { }

    messageIssued(messageId: string, data: any, item: Item) { }
    signalIssued(messageId: string, data: any, item: Item) { }
    serviceCalled(elementId: string, data: any, item: Item) { }

    async service1(item) {
        seq++;
        await delay(15000 -(seq * 100) , 'test');
        item.token.log("SERVICE 1" + item.token.currentNode.id);
    }
    nodeResponse(item: any): NODE_ACTION {
        throw new Error("Method not implemented.");
    }
    flowResponse(item: any): FLOW_ACTION {
        let flow = item.element;

        let action = FLOW_ACTION.take; // default

        let data = item.token.data;
        if (flow) {
            item.token.log('=== ' + flow.id);
            //        console.log(msg);

            if (flow.id == 'flow_gateway_repair') {
                if (data.needsRepairs == false)
                    action = FLOW_ACTION.discard;
                item.token.log(data);
            }
        }

        return action;
    }

}

function delay(time, result) {

    let i = 0;
    for (i = 0; i < (time / 500); i++) {
        let file = fs.readFileSync('./modlle2.txt',
            { encoding: 'utf8', flag: 'r' });
    }
    console.log("read the file " + i);

}
async function delay2(time, result) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(result);
        }, time);
    });
}
export {MyHandler}