import { ITEM_STATUS, EXECUTION_STATUS, NODE_ACTION, FLOW_ACTION, TOKEN_STATUS } from './Enums';
 import { ILogger, IAppDelegate,    IBPMNServer, IDefinition, IElement, Execution, Token, Item, Element, INode, Node  } from '../../';
import { EventEmitter } from 'events';
interface IDataStore {

}
interface IToken {
    id: any;
    execution: IExecution;
    dataPath: string;
    startNodeId: any;
    parentToken?: IToken;
    branchNode?: any;
    path: IItem[];
    currentNode: any;
    processId: any;
    status: TOKEN_STATUS;
    data;
    currentItem: IItem;
    lastItem: IItem;
    save(): {
        id: any;
        status: TOKEN_STATUS;
        dataPath: string;
        loopId: any;
        parentToken: any;
        branchNode: any;
        startNodeId: any;
        currentNode: any;
    };
    resume(): void;
    restored(): void;
    getChildrenTokens(): any[];
    preExecute(): Promise<boolean>;
    preNext(): Promise<boolean>;
    /**
     * this is the primary exectuion method for a token
     */
    execute(inputData): Promise<any>;
    applyInput(inputData: any): void;
    /**
     *  is called by Gateways to cancel current token
     *
     * */
    terminate(): void;
    signal(data: any): Promise<any>;
    end(): Promise<void>;
    goNext(): Promise<void>;
    log(msg: any): void;
}

interface IExecution {
    id: any;
    name: any;
    startedAt: any;
    endedAt: any;
    saved: any;
    status: EXECUTION_STATUS;
    tokens: Map<any, IToken>;
    definition: IDefinition;
    appDelegate: IAppDelegate;
    source: any;
    logger: ILogger;
    data: any;
    logs: any[];
    parentItemId: any;
    listener: EventEmitter;
    executionContext: IExecutionContext;
    promises;

    getNodeById(id: any): Node;
    getToken(id: number): IToken;
    tokenEnded(token: IToken): void;
    getItemsData(): IItemData[];
    end(): Promise<void>;
    /**
     *
     * causes the execution to stop from running any further
     * */
    stop(): void;
    execute(startNodeId?: any, inputData?: {}): Promise<void>;
    /**
     *
     * invoke scenarios:
     *      itemId
     *      elementId   - but only one is active
     *      elementId   - for a startEvent in a secondary process
     *
     * @param executionId
     * @param inputData
     */
    signal(executionId: any, inputData: any): Promise<void>;
    getItems(query?: any): IItem[];
    getState(): IInstanceData;
    restored(): void;
    resume(): void;
    report(): void;
    uids: {};
    getNewId(scope: string): number;
    getUUID(): any;
    doExecutionEvent(event: any): Promise<any>;
    doItemEvent(item: any, event: any): Promise<any>;
    log(msg: any): void;
    applyInput(inputData: any, dataPath?: any): void;
    getData(dataPath: any): any;
    getAndCreateData(dataPath: any, asArray?: boolean): any;
}
interface IItemData {
    id: string;            // System generated unique Id
    itemKey: string;        // application assigned key to call the item by
    elementId: string;   // bpmn element
    name: string;       // name of bpmn element
    type: string;       // bpmn element type
    tokenId: any;         // execution Token
    startedAt: any;
    endedAt: any;
    seq: any;
    timeDue: Date;
    status: ITEM_STATUS;
    data: any;
    messageId;
    signalId;
}
interface IInstanceData {
    id;
    name;
    status;
    startedAt;
    endedAt;
    saved;
    data;
    items;
    source;
    logs;
    tokens;
    loops;
    parentItemId;   // used for subProcess Calls
}

interface IItem extends IItemData {
    element: Element;
    token: Token;
    context: IExecutionContext;
    node: Node;
}


interface IExecutionResponse {
    instance: IInstanceData;
    errors;
    items: IItemData[];
}

interface IExecutionResponse {
    input;
    output;
    action;
    messageMatchingKey;
}

interface IExecutionContext {
    //  components
    server;
    configuration;
    logger;
    dataStore;
    engine;
    cron;
    cache;
    definitions;
    appDelegate;

    execution?: IExecution;
    listener;
    //  context
    instance;

    process;
    item;
    response: IExecutionResponse;

    //  results
    errors;
    items: IItem[];
    error(error): IExecutionContext;


    // scope
    parentContext?: IExecutionContext;


}


export { IItem, IItemData, IInstanceData, IToken, IExecution,IExecutionContext }