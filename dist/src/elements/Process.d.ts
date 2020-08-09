import { Node, Definition } from '.';
declare class Process {
    id: any;
    name: any;
    isExecutable: any;
    def: Definition;
    childrenNodes: Node[];
    constructor(definition: any, children: any);
    getStartNodes(userInvokable?: boolean): any[];
}
export { Process };
