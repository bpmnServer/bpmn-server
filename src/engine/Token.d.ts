import { Execution } from './Execution';
import { Node } from '../elements/Elements';
import { TOKEN_STATUS } from './Enums';
import { Loop } from './Loop';
import { Item } from './Item';
declare class Token {
    id: any;
    execution: Execution;
    dataPath: string;
    startNodeId: any;
    parentToken?: Token;
    branchNode?: Node;
    path: Item[];
    loop: Loop;
    currentNode: Node;
    status: TOKEN_STATUS;
    get data(): any;
    get currentItem(): Item;
    constructor(execution: Execution, startNode: Node, dataPath?: any, parentToken?: Token, branchNode?: Node);
    static startNewToken(execution: any, startNode: any, dataPath: any, parentToken: Token, branchNode: Node, loop: Loop): Promise<Token>;
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
    resume(execution: any): void;
    getChildrenTokens(): any[];
    preExecute(): Promise<boolean>;
    preNext(): Promise<boolean>;
    /**
     * this is the primary exectuion method for a token
     */
    execute(): Promise<any>;
    applyInput(inputData: any): void;
    signal(data: any): Promise<any>;
    end(): Promise<void>;
    goNext(): Promise<void>;
    log(msg: any): void;
}
export { Token };
