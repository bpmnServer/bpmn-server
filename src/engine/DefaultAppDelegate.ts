import { IExecution, Item, NODE_ACTION, FLOW_ACTION, IAppDelegate , IDefinition} from "../..";

import { moddleOptions} from '../elements/js-bpmn-moddle';



class DefaultAppDelegate implements IAppDelegate {
    server;

    sendEmail(to, msg, body) {
        throw Error("sendEmail must be implemented by AppDelegate");
    }

    servicesProvider: any;
    constructor(server) {
        this.server = server;
    }

    get moddleOptions() {
        return moddleOptions;
    }
    async executionStarted(execution: IExecution) {

        let self = this;
        execution.listener.on('all',async function (eventApi) {
            await self.executionEvent(eventApi);
        });
    }
    async executionEvent({ event, item, execution }) {
        let object;
        if (event.startsWith('execution.'))
            object = execution;
        else
            object = item;
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
        item.context.logger.log("Message Issued" + msgId);
        // issue it back for others to receive
        console.log(item.context.engine);
        const resp = await item.context.engine.throwMessage(msgId, data, messageMatchingKey);
        if (resp && resp.instance) {
            item.context.logger.log(" invoked another process " + resp.instance.id + " for " + resp.instance.name);
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
        const msgId = item.node.messageId;
        item.context.logger.log("Signal Issued" + signalId);
        // issue it back for others to receive

        const resp = await item.context.engine.throwSignal(msgId, data, messageMatchingKey);
        if (resp && resp.instance) {
            item.context.logger.log(" invoked another process " + resp.instance.id + " for " + resp.instance.name);
        }
        else
            await this.issueSignal(signalId, data);
    }
    async serviceCalled(serviceName, data, item: Item) {
        item.context.logger.log("Service called:"+serviceName+data);

    }
    scopeEval(scope, script) {
        let result;
        try {
            result = Function('"use strict";return (' + script + ')').bind(scope)();
        }
        catch (exc) {
            console.log(exc);
        }
        return result;
    }
    async scopeJS(scope, script) {
        const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

        let result;
        try {
            scope.token.log("..executing js " + scope.id);
            result = await new AsyncFunction('"use strict";' + script).bind(scope)();
            scope.token.log("..executing js is done " + scope.id);
        }
        catch (exc) {
            console.log(exc);
        }
        return result;

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


