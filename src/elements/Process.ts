import { Execution } from '../engine/Execution';
import { Token } from '../engine/Token';
import { IBehaviour, Behaviour } from "./behaviours";
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../../';

import { Item } from '../engine/Item';
import { Node, Definition } from '.';
import { NODE_SUBTYPE } from '../interfaces';


class Process {
    id;
    name;
    isExecutable;
    def: Definition;
    childrenNodes: Node[];

    constructor(definition, children) {
        this.id = definition.id;
        this.isExecutable = definition.isExecutable;
        this.name = definition.name;
        this.def = definition;
        this.childrenNodes = children;
    }
    public getStartNodes(userInvokable=false) {
        let starts = [];
        this.childrenNodes.forEach(node => {
            if (node.type == 'bpmn:StartEvent') {
                if (!( userInvokable && (
                    (node.subType == NODE_SUBTYPE.timer) ||
                    (node.subType == NODE_SUBTYPE.message) ||
                    (node.subType == NODE_SUBTYPE.signal) ) ) )
                    {

                    starts.push(node);
                    }
            }
                
        })
        return starts;
    }

}

export { Process }