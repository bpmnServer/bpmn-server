import { Execution } from '../engine/Execution';
import { Token } from '../engine/Token';
import { IBehaviour, Behaviour } from './Behaviour';
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../engine/Enums';
import { Node } from './Elements';
import { Item } from '../engine/Item';
import { Definition } from './Definition';


class Process {
    id;
    def: Definition;
    childrenNodes: Node[];

    constructor(definition, children) {
        this.def = definition;
        this.childrenNodes = children;
    }
    public getStartNode() {
        let start = null;
        this.childrenNodes.forEach(node => {
            if (node.type == 'bpmn:StartEvent')
                start = node;
        })
        return start;
    }

}

export { Process }