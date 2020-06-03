import { Item } from "./Item";
import { Execution } from ".";
declare enum EXECUTION_EVENT {
    node_enter = "enter",
    node_start = "start",
    node_wait = "wait",
    node_end = "end",
    node_terminated = "terminated",
    flow_take = "take",
    flow_discard = "discard",
    execution_execute = "execution.execute",
    execution_executed = "execution.executed",
    execution_invoke = "execution.invoke",
    execution_invoked = "execution.invoked",
    execution_restored = "execution.restored",
    execution_resumed = "execution_resumed",
    execution_wait = "execution.wait",
    execution_end = "execution.end",
    execution_terminated = "executeion.terminate",
    token_start = "token.start",
    token_wait = "token.wait",
    token_end = "token.end",
    token_terminated = "token.terminated"
}
declare enum NODE_ACTION {
    continue = "continue",
    end = "end",
    stop = "stop",
    error = "error",
    abort = "abort",
    wait = "wait"
}
declare enum ITEM_STATUS {
    enter = "enter",
    start = "start",
    wait = "wait",
    end = "end",
    terminated = "terminated",
    discard = "discard"
}
declare enum EXECUTION_STATUS {
    running = "running",
    wait = "wait",
    end = "end",
    terminated = "terminated"
}
declare enum TOKEN_STATUS {
    running = "running",
    wait = "wait",
    end = "end",
    terminated = "terminated"
}
declare enum FLOW_ACTION {
    take = "take",
    discard = "discard"
}
/**
 *  Application Delegate Object to respond to various events and services:
 *
 *  1.  receive all events from workflow
 *  2.  receive service calls that are not covered by an implementation in the definition
 *  3.  receive message and signal calls
 * */
interface IHandler {
    executionStarted(execution: Execution): any;
    messageIssued(messageId: string, data: any, item: Item): any;
    signalIssued(messageId: string, data: any, item: Item): any;
    serviceCalled(elementId: string, data: any, item: Item): any;
    nodeResponse(item: Item, NODE_EVENT: any): NODE_ACTION;
    flowResponse(item: Item): FLOW_ACTION;
}
/**
 * A logging tool to take various message for monitoring and debugging
 *
 * it can also keep the message in memory till saved later through saveToFile
 * msgs can be cleared by the clean method
 *
 * */
interface ILogger {
    /**
     *
     * @param toConsole boolean
     *  writes to the output console
     * @param toFile string
     * writes to file
     *
     */
    setOptions({ toConsole, toFile, callback }: {
        toConsole: any;
        toFile: any;
        callback: any;
    }): void;
    clear(): void;
    get(): any[];
    debug(message: any): void;
    warn(message: any): void;
    log(message: any): void;
    error(err: any): void;
    save(filename: any): Promise<void>;
}
export { IHandler, ILogger, EXECUTION_EVENT, NODE_ACTION, FLOW_ACTION, ITEM_STATUS, TOKEN_STATUS, EXECUTION_STATUS };
