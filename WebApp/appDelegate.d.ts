import { Item, IExecution } from './';
import { DefaultAppDelegate } from './index';
declare class MyAppDelegate extends DefaultAppDelegate {
    winSocket: any;
    constructor(server: any);
    /**
    * is fired on application startup
    **/
    startUp(options: any): Promise<void>;
    sendEmail(to: any, msg: any, body: any): void;
    executionStarted(execution: IExecution): Promise<void>;
    executionEvent(context: any, event: any): Promise<void>;
    messageThrown(messageId: any, data: any, matchingQuery: any, item: Item): Promise<void>;
    signalThrown(signalId: any, data: any, matchingQuery: any, item: Item): Promise<void>;
    serviceCalled(input: any, context: any): Promise<void>;
}
export { MyAppDelegate };
