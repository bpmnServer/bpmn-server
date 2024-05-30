import { Execution } from '../engine/Execution';
import { Token, TOKEN_TYPE } from '../engine/Token';
import { IBehaviour, Behaviour } from "./behaviours";
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS, ScriptHandler } from '../';

import { Item } from '../engine/Item';
import { Node, Definition } from '.';
import { IExecution, NODE_SUBTYPE } from '../interfaces';
import { exec } from 'child_process';


class Process {
    id;
    name;
    isExecutable;
    def: Definition;
    parent: Process;        // Null for root process , value if subProcess
    childrenNodes: Node[];
    eventSubProcesses: any[];
    subProcessEvents: any[];
    scripts = new Map();
    candidateStarterGroups;
    candidateStarterUsers;
    historyTimeToLive;
    isStartableInTasklist;

    constructor(definition,parent=null) {
        this.id = definition.id;
        this.isExecutable = definition.isExecutable;
        this.name = definition.name;
        this.def = definition;
        this.parent = parent;
        this.candidateStarterGroups=definition.candidateStarterGroups;
        this.candidateStarterUsers=definition.candidateStarterUsers;
        this.historyTimeToLive=definition.historyTimeToLive;
        this.isStartableInTasklist=definition.isStartableInTasklist;

    }
    init(children, eventSubProcesses) {
        this.childrenNodes = children;
        this.eventSubProcesses = eventSubProcesses;
    }
    /**
     * Notify process that it started
     * */
    async start(execution: Execution, parentToken) {
        this.doEvent(execution, 'start');

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
            if (parentToken && parentToken.id==0) 
                parentToken=null;
            const newToken = await Token.startNewToken(TOKEN_TYPE.EventSubProcess,execution, st, null, parentToken , null, null);
            this.subProcessEvents.push(newToken.currentItem);
        }
    }
    /**
     * Notify process that it ended
     * */
    async end(execution:IExecution) {
        if (execution['ending'])
            return;
        execution['ending']=true;
        this.doEvent(execution, 'end');
        let i;
        /* does not work because subProcessEvents is not saved 
        for (i = 0; i < this.subProcessEvents.length;i++) {
            const event = this.subProcessEvents[i];
            await event.token.terminate();
        } */
        let tks=[];
        execution.tokens.forEach(tk=>{
            if (tk.type==TOKEN_TYPE.EventSubProcess && tk.parentToken == null)
                tks.push(tk);
        });
        for(i=0;i<tks.length;i++) {
            await tks[i].terminate();
        }
        delete execution['ending'];
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
    async doEvent(execution,event,eventDetails={}) {
        execution.log('Process(' + this.name + '|' + this.id + ').doEvent: executing script for event:' + event);
        const scripts = this.scripts.get(event);
        if (scripts) {
            for (var s = 0; s < scripts.length; s++) {
                var script = scripts[s];
                const ret = await ScriptHandler.executeScript(execution, script);

            }
        }
        await execution.doExecutionEvent(this,event,eventDetails);
    }
    describe() {
        var desc = [];

        this.scripts.forEach((scripts, event) => {
            scripts.forEach(scr => {
                desc.push([`script on ${event} `, `${scr}`]);
            });
        })
        return desc;
    }

}

export { Process }