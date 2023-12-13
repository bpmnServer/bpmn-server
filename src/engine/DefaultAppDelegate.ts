import { IExecution, Item, NODE_ACTION, FLOW_ACTION, IAppDelegate , IDefinition} from "../";

import { moddleOptions} from '../elements/js-bpmn-moddle';



class DefaultAppDelegate implements IAppDelegate {
    server;


    constructor(server) {
        this.server = server;
        let self = this;
        server.listener.on('all', async function ({ context, event }) {
            await self.executionEvent(context, event);
        });
    }
    async getServicesProvider(context)  {
        return this;
    }

    startUp(options) {
        console.log('server started..');
    }
    sendEmail(to, msg, body) {
        throw Error("sendEmail must be implemented by AppDelegate");
    }

    get moddleOptions() {
        return moddleOptions;
    }
    async executionStarted(execution: IExecution) {

    }
    async executionEvent(context,event) {

    }
    /**
     *  is called when a event throws a message
     * 
     * @param messageId
     * @param data
     * @param messageMatchingKey
     * @param item
     */
    async messageThrown(messageId, data, messageMatchingKey: any , item: Item) {
        const msgId = item.node.messageId;
        item.log("Message Issued" + msgId);
        // issue it back for others to receive
        const resp = await item.context.engine.throwMessage(msgId, data, messageMatchingKey);
        if (resp && resp.instance) {
            item.log(" invoked another process " + resp.instance.id + " for " + resp.instance.name);
        }
        else
            await this.issueMessage(messageId, data);
    }
    /**
     * 
     * is called when an event throws a message that can not be answered by another process
     * 
     * @param messageId
     * @param data
     */
    async issueMessage(messageId, data) {

    }
    async issueSignal(signalId, data) {

    }
    async signalThrown(signalId, data, messageMatchingKey: any, item: Item) {

        item.log("Signal Issued" + signalId);
        // issue it back for others to receive

        const resp = await item.context.engine.throwSignal(signalId, data, messageMatchingKey);
        if (resp && resp.instance) {
            item.log(" invoked another process " + resp.instance.id + " for " + resp.instance.name);
        }
        else
            await this.issueSignal(signalId, data);
    }
    async serviceCalled(serviceName, data, item: Item) {
        item.log("Service called:"+serviceName+data);

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
export { DefaultAppDelegate }


