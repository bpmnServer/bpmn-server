import { ITEM_STATUS, EXECUTION_STATUS, TOKEN_STATUS } from './Enums';
import { ILogger, IAppDelegate, IDefinition, Token, Item, Element, Node } from '../../';
interface IToken {
    id: any;
    type: any;
    execution: IExecution;
    dataPath: string;
    startNodeId: any;
    parentToken?: IToken;
    originItem: IItem;
    path: IItem[];
    loop: any;
    currentNode: any;
    processId: any;
    status: TOKEN_STATUS;
    data: any;
    currentItem: IItem;
    lastItem: IItem;
    firstItem: Item;
    childrenTokens: Token[];
    save(): {
        id: any;
        type: any;
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
    processError(): any;
    restored(): void;
    getChildrenTokens(): any[];
    preExecute(): Promise<boolean>;
    preNext(): Promise<boolean>;
    /**
     * this is the primary exectuion method for a token
     */
    execute(inputData: any): Promise<any>;
    applyInput(inputData: any): void;
    /**
     *  is called by Gateways to cancel current token
     *
     * */
    terminate(): void;
    signal(data: any): Promise<any>;
    end(): Promise<void>;
    goNext(): Promise<void>;
    getSubProcessToken(): IToken;
    log(msg: any): void;
    error(msg: any): void;
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
    executionContext: IExecutionContext;
    promises: any;
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
    error(msg: any): void;
    applyInput(inputData: any, dataPath?: any): void;
    getData(dataPath: any): any;
    getAndCreateData(dataPath: any, asArray?: boolean): any;
}
interface IItemData {
    id: string;
    itemKey: string;
    elementId: string;
    name: string;
    type: string;
    tokenId: any;
    startedAt: any;
    endedAt: any;
    seq: any;
    timeDue: Date;
    status: ITEM_STATUS;
    data: any;
    messageId: any;
    signalId: any;
}
interface IInstanceData {
    id: any;
    name: any;
    status: any;
    startedAt: any;
    endedAt: any;
    saved: any;
    data: any;
    items: any;
    source: any;
    logs: any;
    tokens: any;
    loops: any;
    parentItemId: any;
}
interface IItem extends IItemData {
    element: Element;
    token: Token;
    context: IExecutionContext;
    node: Node;
}
interface IExecutionContext {
    server: any;
    configuration: any;
    logger: any;
    dataStore: any;
    engine: any;
    cron: any;
    cache: any;
    definitions: any;
    appDelegate: any;
    execution?: IExecution;
    instance: any;
    listener: any;
    process: any;
    item: any;
    errors: any;
    items: IItem[];
    error(error: any): IExecutionContext;
    input: any;
    output: any;
    messageMatchingKey: any;
    parentContext?: IExecutionContext;
    worker: any;
    tillDone(): any;
}
export { IItem, IItemData, IInstanceData, IToken, IExecution, IExecutionContext };
