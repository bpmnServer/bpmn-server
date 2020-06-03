import { Node } from './Elements';
import { Definition } from './Definition';
declare class Process {
    id: any;
    def: Definition;
    childrenNodes: Node[];
    constructor(definition: any, children: any);
    getStartNode(): any;
}
export { Process };
