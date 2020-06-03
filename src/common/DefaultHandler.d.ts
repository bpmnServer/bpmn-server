import { Execution, Item } from '../engine';
import { IHandler, FLOW_ACTION, NODE_ACTION } from '../engine';
declare class DefaultHandler implements IHandler {
    constructor(logger?: any);
    executionStarted(execution: Execution): void;
    messageIssued(messageId: string, data: any, item: Item): void;
    signalIssued(messageId: string, data: any, item: Item): void;
    serviceCalled(elementId: string, data: any, item: Item): void;
    service1(item: any): Promise<void>;
    nodeResponse(item: any): NODE_ACTION;
    flowResponse(item: any): FLOW_ACTION;
}
export { DefaultHandler };
