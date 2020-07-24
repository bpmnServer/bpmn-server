import { Execution } from './Execution';
import { Node } from '../elements/';
import { TOKEN_STATUS } from '../../';
import { Loop } from './Loop';
import { Item } from './Item';
import { IToken, IExecution } from '../interfaces/engine';
declare class Token implements IToken {
    id: any;
    execution: IExecution;
    dataPath: string;
    startNodeId: any;
    parentToken?: Token;
    branchNode?: Node;
    path: Item[];
    loop: Loop;
    currentNode: Node;
    processId: any;
    status: TOKEN_STATUS;
    get data(): any;
    get currentItem(): Item;
    get lastItem(): Item;
    constructor(execution: Execution, startNode: Node, dataPath?: any, parentToken?: Token, branchNode?: Node);
    static startNewToken(execution: any, startNode: any, dataPath: any, parentToken: Token, branchNode: Node, loop: Loop, data?: any): Promise<Token>;
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
    static load(execution: Execution, da: any): Token;
    resume(): void;
    restored(): void;
    getChildrenTokens(): any[];
    preExecute(): Promise<boolean>;
    preNext(): Promise<boolean>;
    /**
     * this is the primary exectuion method for a token
     */
    execute(input: any): Promise<void>;
    applyInput(inputData: any): void;
    /**
     *  is called by Gateways to cancel current token
     *
     * */
    terminate(): void;
    signal(data: any): Promise<void>;
    end(): Promise<void>;
    goNext(): Promise<void>;
    log(msg: any): void;
}
export { Token };
