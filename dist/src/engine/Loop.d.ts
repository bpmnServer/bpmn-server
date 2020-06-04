import { Token } from './Token';
import { LoopBehaviour } from '../elements/Behaviour';
import { Node } from '../elements/Elements';
declare class Loop {
    id: any;
    node: any;
    ownerToken: any;
    definition: LoopBehaviour;
    sequence: any;
    dataPath: any;
    items: any[];
    completed: any;
    isSequential(): any;
    constructor(node: Node, token: Token, dataObject?: any);
    save(): {
        id: any;
        nodeId: any;
        ownerTokenId: any;
        dataPath: any;
        items: any[];
        completed: any;
        sequence: any;
    };
    static load(execution: any, dataObject: any): Loop;
    getKeyName(): string;
    isDone(): boolean;
    getNext(): any;
    static checkStart(token: any): Promise<boolean>;
    static checkNext(token: Token): Promise<boolean>;
}
export { Loop };
