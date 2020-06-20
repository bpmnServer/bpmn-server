
import { Execution } from '../engine/Execution';
import { Token } from '../engine/Token';
import { IBehaviour, Behaviour, Behaviour_names } from "./behaviours";
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../../';
//import { Gateway } from './Gateway';
import { Item } from '../engine/Item';

import { Process } from './Process';
import { Node } from './Node';

// ---------------------------------------------
class ScriptTask extends Node {
    async run(item): Promise<NODE_ACTION> {

        if (this.def.script) {
            item.token.log(this.def.script);
            await item.token.execution.appDelegate.scopeJS(item, this.def.script);
        }
        return NODE_ACTION.end;
    }
}
/* * TODO: should also call it by just name
 * 
 *      foo[method]();
 *      
 *      await this.token.appDelegate[serviceName](data);
 */
class ServiceTask extends Node {
    async run(item): Promise<NODE_ACTION> {

        // calling appDelegate by service name
        const appDelegate = item.token.execution.appDelegate;
        let serviceName = 'serviceCalled';
        if (this.def.implementation) {
            serviceName = this.def.implementation;
        }
        await appDelegate[serviceName](item);
        /*
        item.token.log(this.def.implementation);
        if (this.def.implementation) {
            item.token.log('invoking service call ' + this.id + " " + item.id);
            await item.token.execution.appDelegate.scopeJS(item, this.def.implementation);
            //await item.token.execution.appDelegate[this.def.implementation](item);
            item.token.log('returned from service call ' + this.id + " " + item.id);
        }
        //        console.log(' returning at service task');
        */
        return NODE_ACTION.end;
    }
}
class SendTask extends ServiceTask {
    async run(item): Promise<NODE_ACTION> {

        if (this.def.script) {
            item.token.log(this.def.script);
            await item.token.execution.appDelegate.scopeJS(item, this.def.script);
        }
        return NODE_ACTION.end;
    }
}
class UserTask extends Node {

    requiresWait() { return true; }
    canBeInvoked() { return true; }
}
class ReceiveTask extends Node {

    requiresWait() { return true; }
    canBeInvoked() { return true; }
}

class SubProcess extends Node {
    childProcess: Process;
    requiresWait() { return true; }
    canBeInvoked() { return false; }

    async start(item): Promise<NODE_ACTION> {

        const token = item.token;

        token.log('..executing a sub process item:' + item.id );
        const startNode = this.childProcess.getStartNode();

        await Token.startNewToken(token.execution, startNode, this.id, token, this, null);

        return NODE_ACTION.continue;
    }
}

export {  UserTask, ScriptTask, ServiceTask, SendTask, ReceiveTask, SubProcess }