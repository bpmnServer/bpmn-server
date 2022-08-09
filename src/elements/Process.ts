import { Execution } from '../engine/Execution';
import { Token, TOKEN_TYPE } from '../engine/Token';
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
    parent: Process;        // Null for root process , value if subProcess
    childrenNodes: Node[];
    eventSubProcesses: any[];
    subProcessEvents: any[];

    constructor(definition,parent=null) {
        this.id = definition.id;
        this.isExecutable = definition.isExecutable;
        this.name = definition.name;
        this.def = definition;
        this.parent = parent;
    }
    init(children, eventSubProcesses) {
        this.childrenNodes = children;
        this.eventSubProcesses = eventSubProcesses;
    }
    /**
     * Notify process that it started
     * */
    async start(execution: Execution,parentToken) {
        this.subProcessEvents = [];
        const events = [];
        this.eventSubProcesses.forEach(p => {
            p.getStartNodes().forEach(st => {
                events.push(st);
            });
        });
        let i;
        for (i = 0; i < events.length; i++) {
            const st = events[i];
            execution.log('..starting event start subporcess ' + st.id)
            const newToken = await Token.startNewToken(TOKEN_TYPE.EventSubProcess,execution, st, null, parentToken, null, null);
            this.subProcessEvents.push(newToken.currentItem);
        }
    }
    /**
     * Notify process that it ended
     * */
    async end() {
        /* removed; already done by token
        let i;
        for (i = 0; i < this.subProcessEvents.length;i++) {
            const event = this.subProcessEvents[i];
            await event.token.terminate();
        }
        */
    }
    public getStartNode(userInvokable = false) {
        return this.getStartNodes(userInvokable)[0];
    }
    public getStartNodes(userInvokable = false) {
        let starts = [];
        this.childrenNodes.forEach(node => {
            if (node.type == 'bpmn:StartEvent') {
                if (!(userInvokable && (
                    (node.subType == NODE_SUBTYPE.timer) ||
                    (node.subType == NODE_SUBTYPE.error) ||
                    (node.subType == NODE_SUBTYPE.message) ||
                    (node.subType == NODE_SUBTYPE.signal)))) {

                    starts.push(node);
                }
            }

        })
        return starts;
    }
    getEventSubProcessStart(): Node[] {

        let starts = [];
        this.eventSubProcesses.forEach(sp => {

            const startNodes = sp.getStartNodes();

            startNodes.forEach(n => {
                starts.push(n);
            });
        });
        return starts;
    }
}

export { Process }