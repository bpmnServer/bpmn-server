import { Execution } from '../engine/Execution';
import { Node, Definition } from '.';
declare class Process {
    id: any;
    name: any;
    isExecutable: any;
    def: Definition;
    parent: Process;
    childrenNodes: Node[];
    eventSubProcesses: any[];
    subProcessEvents: any[];
    constructor(definition: any, parent?: any);
    init(children: any, eventSubProcesses: any): void;
    /**
     * Notify process that it started
     * */
    start(execution: Execution, parentToken: any): Promise<void>;
    /**
     * Notify process that it ended
     * */
    end(): Promise<void>;
    getStartNode(userInvokable?: boolean): any;
    getStartNodes(userInvokable?: boolean): any[];
    getEventSubProcessStart(): Node[];
}
export { Process };
