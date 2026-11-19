import type { IAppDelegate, IServiceProvider } from '../interfaces/common.js';
import type { IExecution } from '../interfaces/engine.js';
import { Item } from './Item.js';
import { moddleOptions} from '../elements/js-bpmn-moddle.js';
import path from 'node:path';
import { readAppContract, APP_CONTRACT_FILE } from './AppContract.js';
import type { IAppContract } from './AppContract.js';

class DefaultAppDelegate implements IAppDelegate {
    server;
    /**
     * The application's variables (docs/design/app-contract.md §2.1): a class whose methods are the names an expression
     * reads as appVars.<name>, made for each evaluation from its context. None: appVars is empty.
     */
    appVarsClass?: new (context: any) => any;
    /** The application's functions, as a class (appServices.<method>): its method names, for checks without a context. */
    appServicesClass?: new (context: any) => any;


    constructor(server) {
        this.server = server;
        let self = this;
        server.listener.on('all', async function ({ context, event }) {
            await self.executionEvent(context, event);
        });
    }

    /** The variables for one evaluation (appVars.<name>): the variables class, made from its context. */
    getAppVars(context): any {
        return this.appVarsClass ? new this.appVarsClass(context) : null;
    }

    /**
     * The application's contract, its declarative part (docs/design/app-contract.md): its app-contract.json (the
     * configuration's appContract, else the working folder's), or null when it has none. An application may build it
     * in code instead.
     */
    describe(): IAppContract | null {
        const file = this.server?.configuration?.appContract ?? path.resolve(APP_CONTRACT_FILE);
        return readAppContract(file).contract;
    }

    async getServicesProvider(context): Promise<IServiceProvider>  {
        return this as unknown as IServiceProvider;
    }

    startUp(options) {
        console.log('server started..');
    }

    sendEmail(to, msg, body) {
        throw Error("sendEmail must be implemented by AppDelegate");
    }

    get moddleOptions() {
        return this.server?.configuration?.moddleOptions ?? moddleOptions;
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

        // throwSignal answers what it reached: a list (started instances' ids, invoked items' { instanceId, itemId })
        const resp = await item.context.engine.throwSignal(signalId, data, messageMatchingKey, item);
        const reached = Array.isArray(resp) ? resp : [];
        if (reached.length) {
            item.log(" signal " + signalId + " reached " + reached.length + " instance(s)");
        }
        else
            await this.issueSignal(signalId, data);
    }
    async serviceCalled(serviceName, data, item: Item) {
        item.log("Service called:"+serviceName+data);

    }

}

export { DefaultAppDelegate }


