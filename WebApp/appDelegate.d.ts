import { Item, IExecutionContext } from '.';
import { DefaultAppDelegate } from '.';
declare class MyAppDelegate extends DefaultAppDelegate {
    constructor(logger?: any);
    executionStarted(execution: IExecutionContext): void;
    executionEvent({ event, item, execution }: {
        event: any;
        item: any;
        execution: any;
    }): Promise<void>;
    messageIssued(item: Item): void;
    signalIssued(item: Item): void;
    serviceTask(item: any): Promise<void>;
    serviceCalled(item: any): Promise<void>;
    service1(item: any): Promise<void>;
}
export { MyAppDelegate };
