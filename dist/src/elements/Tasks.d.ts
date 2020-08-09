import { NODE_ACTION } from '../../';
import { Process } from './Process';
import { Node } from './Node';
import { IExecution } from '../interfaces/engine';
declare class ScriptTask extends Node {
    run(item: any): Promise<NODE_ACTION>;
}
/**
 *
 *      foo[method]();
 *
 *      await this.token.appDelegate[serviceName](data);
 *
 *
 *      service signature:
 *              output= service (input,context)
 */
declare class ServiceTask extends Node {
    run(item: any): Promise<NODE_ACTION>;
}
declare class SendTask extends ServiceTask {
    get isCatching(): boolean;
    run(item: any): Promise<NODE_ACTION>;
}
declare class UserTask extends Node {
    get requiresWait(): boolean;
    get canBeInvoked(): boolean;
}
declare class ReceiveTask extends Node {
    get isCatching(): boolean;
    get requiresWait(): boolean;
    get canBeInvoked(): boolean;
}
declare class SubProcess extends Node {
    childProcess: Process;
    get requiresWait(): boolean;
    get canBeInvoked(): boolean;
    start(item: any): Promise<NODE_ACTION>;
}
/**
 *
 * <callActivity id="callCheckCreditProcess" name="Check credit" calledElement="checkCreditProcess" />
 *
 * the called process need to call me back when done.
 *
 * */
declare class CallActivity extends Node {
    get calledElement(): any;
    get requiresWait(): boolean;
    get canBeInvoked(): boolean;
    static executionEnded(execution: IExecution): Promise<void>;
    start(item: any): Promise<NODE_ACTION>;
}
export { UserTask, ScriptTask, ServiceTask, SendTask, ReceiveTask, SubProcess, CallActivity };
