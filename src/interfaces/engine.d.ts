import { TOKEN_STATUS } from './Enums';
import { IItemData, IInstanceData } from './';
import { ILogger, IAppDelegate, IDefinition, Token, Item, Element, Node, IServerComponent } from '../../';
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
    appendData(inputData: any): void;
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
interface IExecution extends IServerComponent {
    instance: IInstanceData;
    tokens: Map<any, IToken>;
    definition: IDefinition;
    appDelegate: IAppDelegate;
    logger: ILogger;
    process: any;
    promises: any;
    listener: any;
    errors: any;
    item: any;
    input: any;
    output: any;
    messageMatchingKey: any;
    worker: any;
    currentUser: any;
    id: any;
    status: any;
    name: any;
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
    doExecutionEvent(process: any, event: any): Promise<any>;
    doItemEvent(item: any, event: any): Promise<any>;
    log(msg: any): void;
    error(msg: any): void;
    appendData(inputData: any, dataPath?: any): void;
    getData(dataPath: any): any;
    getAndCreateData(dataPath: any, asArray?: boolean): any;
}
interface IItem extends IItemData {
    element: Element;
    token: Token;
    context: IExecution;
    node: Node;
}
export { IItem, IToken, IExecution };
