import { Execution } from './Execution';
import { Node } from '../elements/';
import { TOKEN_STATUS } from '../../';
import { Loop } from './Loop';
import { Item } from './Item';
import { IToken, IExecution } from '../interfaces/engine';
declare enum TOKEN_TYPE {
    Primary = "Primary",
    SubProcess = "SubProcess",
    Instance = "Instance",
    Diverge = "Diverge",
    EventSubProcess = "EventSubProces",
    BoundaryEvent = "BoundaryEvent"
}
declare class Token implements IToken {
    id: any;
    type: TOKEN_TYPE;
    execution: IExecution;
    dataPath: string;
    startNodeId: any;
    parentToken?: Token;
    originItem: Item;
    path: Item[];
    loop: Loop;
    currentNode: Node;
    processId: any;
    status: TOKEN_STATUS;
    input: {};
    output: {};
    messageMatchingKey: {};
    get data(): any;
    get currentItem(): Item;
    get firstItem(): Item;
    hasNode(nodeId: any): Boolean;
    get lastItem(): Item;
    get childrenTokens(): Token[];
    getFullPath(path?: any[]): Item[];
    constructor(type: TOKEN_TYPE, execution: Execution, startNode: Node, dataPath?: any, parentToken?: Token, originItem?: Item);
    /**
     *
     * @param execution
     * @param startNode
     * @param dataPath
     * @param parentToken
     * @param originItem
     * @param loop
     * @param data
     */
    static startNewToken(type: TOKEN_TYPE, execution: any, startNode: any, dataPath: any, parentToken: Token, originItem: Item, loop: Loop, data?: any, noExecute?: boolean): Promise<Token>;
    save(): {
        id: any;
        type: TOKEN_TYPE;
        status: TOKEN_STATUS;
        dataPath: string;
        loopId: any;
        parentToken: any;
        originItem: any;
        startNodeId: any;
        currentNode: any;
    };
    static load(execution: Execution, da: any): Token;
    stop(): void;
    resume(): void;
    restored(): void;
    getSubProcessToken(): Token;
    getChildrenTokens(): any[];
    preExecute(): Promise<boolean>;
    preNext(): Promise<boolean>;
    /**
     * this is the primary exectuion method for a token
     * Pre-Conditions:
     *      currentNode is set
     *      status!= end
     */
    execute(input: any): Promise<void>;
    processError(): Promise<void>;
    processEscalation(): Promise<void>;
    /**
     *
     *  renamed from applyInput to appendData
     * @param inputData
     */
    appendData(inputData: any): void;
    /**
     *  is called by Gateways to cancel current token
     *
     * */
    terminate(): Promise<void>;
    /**
     *  is called by events to cancel current token
     *
     * */
    continue(): Promise<void>;
    signal(data: any, options?: {}): Promise<void>;
    end(cancel?: Boolean): Promise<void>;
    setCurrentNode(newCurrentNode: Node): void;
    goNext(): Promise<void>;
    log(msg: any): void;
    error(msg: any): void;
}
export { Token, TOKEN_TYPE };
