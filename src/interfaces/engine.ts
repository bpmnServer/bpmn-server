import { NODE_ACTION, TOKEN_STATUS } from './Enums';
import { IItemData , IInstanceData } from './';
import { ILogger, IAppDelegate, IBPMNServer, IDefinition, Token, Item, Element, Node, IServerComponent } from '../';

interface IToken {

    id: any;
    type;
    execution: IExecution;
    dataPath: string;
    startNodeId: any;
    parentToken?: IToken;
    //  branchNode?: any;
    originItem: IItem;
    path: IItem[];
    loop;
    currentNode: any;
    processId: any;
    status: TOKEN_STATUS;
    data;
    currentItem: IItem;
    lastItem: IItem;
    firstItem: Item;
    childrenTokens: Token[];

    save(): {
        id: any;
        type;
        status: TOKEN_STATUS;
        dataPath: string;
        loopId: any;
        parentToken: any;
        originItem: any;
        startNodeId: any;
        currentNode: any;
    };
    resume(): void;
    stop(): void;
    
    processError(errorCode,callingEvent);
    processEscalation(escalationCode,callingEvent);
    processCancel(callingEvent);
    

    restored(): void;
    getChildrenTokens(): any[];
    preExecute(): Promise<boolean>;
    preNext(): Promise<boolean>;
    /**
     * this is the primary exectuion method for a token
     */
    execute(inputData): Promise<any>;
    appendData(inputData: any,item: IItem): void;
    /**
     *  is called by Gateways to cancel current token
     *
     * */
    terminate(): void;
    signal(data: any): Promise<any>;
    getFullPath(fullPath?: any): Item[];
    end(): Promise<void>;
    goNext(): Promise<void>;
    getSubProcessToken(): IToken;
    log(...msg: any): void;
    info(...msg: any): void;
    error(msg: any): void;
}

interface IExecution extends IServerComponent {
    instance: IInstanceData;
    server: IBPMNServer;
    tokens: Map<any, IToken>;
    definition: IDefinition;
    appDelegate: IAppDelegate;
    logger: ILogger;
    process: any;
    promises;
    listener;
    isLocked:boolean;

    errors;
    item;
    messageMatchingKey;
    worker;
    userName;

    id;
    status;
    action: NODE_ACTION;
    options;
    name;

    getNodeById(id: any): Node;
    getToken(id: number): IToken;
    tokenEnded(token: IToken): void;
    getItemsData(): IItemData[];
    save(): Promise<void>;
    end(): Promise<void>;
    /**
     *
     * causes the execution to stop from running any further
     * */
    stop(): void;
    terminate(): void;
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
    signalItem(executionId: any, inputData: any,options?:{}): Promise<IExecution>;
    signalEvent(executionId: any, inputData: any,options?:{}): Promise<IExecution>;
    signalRepeatTimerEvent(executionId,prevItem, inputData:any,options?:{}): Promise<IExecution>;

    getItems(query?: any): IItem[];
    getState(): IInstanceData;
    restored(): void;
    resume(): void;
    report(): void;
    uids: {};
    getNewId(scope: string): number;
    getUUID(): any;
    doExecutionEvent(process:any, event: any,eventDetails?:any): Promise<any>;
    doItemEvent(item: any, event: any,eventDetails?: any): Promise<any>;
    log(...msg: any): void;
    logS(...msg: any): void;
    logE(...msg: any): void;
    info(...msg: any): void;
    error(msg: any): void;
    appendData(inputData: any,item:IItem, dataPath?: any,assignment?:any): void;
    getData(dataPath: any): any;
//    getAndCreateData(dataPath: any, asArray?: boolean): any;
}

interface IItem extends IItemData {
    element: Element;
    token: Token;
    context: IExecution;
    node: Node;
}


export { IItem, IToken, IExecution}