import { Execution } from '../engine/Execution';
import { Token } from '../engine/Token';
import { IBehaviour, Behaviour } from "./behaviours";
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../../';

import { Item } from '../engine/Item';
import { Node, Definition } from '.';


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