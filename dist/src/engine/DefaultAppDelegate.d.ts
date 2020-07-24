import { Item, IAppDelegate, IExecutionContext } from "../..";
declare class DefaultAppDelegate implements IAppDelegate {
    servicesProvider: any;
    constructor(logger?: any);
    get moddleOptions(): {
        name: string;
        uri: string;
        prefix: string;
        xml: {
            tagAlias: string;
        };
        types: ({
            name: string;
            isAbstract: boolean;
            extends: string[];
            properties: {
                name: string;
                isAttr: boolean;
                type: string;
            }[];
            superClass?: undefined;
        } | {
            name: string;
            superClass: string[];
            isAbstract?: undefined;
            extends?: undefined;
            properties?: undefined;
        })[];
    };
    executionStarted(execution: IExecutionContext): Promise<void>;
    executionEvent({ event, item, execution }: {
        event: any;
        item: any;
        execution: any;
    }): Promise<void>;
    /**
     *  is called when a event throws a message
     *
     * @param messageId
     * @param data
     * @param messageMatchingKey
     * @param item
     */
    messageThrown(messageId: any, data: any, messageMatchingKey: any, item: Item): Promise<void>;
    /**
     *
     * is called when an event throws a message that can not be answered by another process
     *
     * @param messageId
     * @param data
     */
    issueMessage(messageId: any, data: any): Promise<void>;
    issueSignal(signalId: any, data: any): Promise<void>;
    signalThrown(signalId: any, data: any, messageMatchingKey: any, item: Item): Promise<void>;
    serviceCalled(serviceName: any, data: any, item: Item): Promise<void>;
    scopeEval(scope: any, script: any): any;
    scopeJS(scope: any, script: any): Promise<any>;
}
export { DefaultAppDelegate };
