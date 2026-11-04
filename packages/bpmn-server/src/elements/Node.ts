import { Element } from './Element.js';
import { Flow } from './Flow.js';
import { EventBasedGateway } from './Gateway.js';

import { Token, TOKEN_TYPE } from '../engine/Token.js';
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS, NODE_SUBTYPE} from '../interfaces/Enums.js';
import { Item } from '../engine/Item.js';
import { BPMN_TYPE } from '../interfaces/Enums.js';
import { Behaviour_names, BehaviourLoader } from './behaviours/BehaviourLoader.js';
import { ScriptHandler } from '../engine/ScriptHandler.js';


// ---------------------------------------------
class Node extends Element {
    name='';
    process;
    def;
    outbounds: Flow[];
    inbounds: Flow[];
    attachments: Node[];
    attachedTo: Node;
    messageId;
    signalId;
    initiator;
    assignee;
    candidateGroups;
    candidateUsers;
    scripts = new Map();
    get processId() : any {

        return this.process.id;
    } 

    constructor(id, process , type, def) {
        super();
        this.id = id;
        this.process = process;
        this.type = type;
        this.def = def;
        this.inbounds = [];
        this.outbounds = [];
        if (def.name)
            this.name = def.name;
        this.attachments = [];

        BehaviourLoader.load(this);
    }
    async validate(item: Item) {

        let validate = await item.node.doEvent(item, EXECUTION_EVENT.node_validate,item.status);
        validate.forEach(retVal => {
            if (retVal) {
                const err = retVal['error'];
                if (err) {
                    item.token.execution.error('Validation failed with error:' + err);
                }
            }
        });

    }
    async doEvent(item: Item, event: EXECUTION_EVENT, newStatus: ITEM_STATUS=null,eventDetails={}) {
        item.token.log('Node('+this.name+'|'+this.id+').doEvent: executing script for event:' + event + ' newStatus:'+newStatus);

        if (newStatus)
            item.status = newStatus;
        ///item.token.log('..>' + event + ' ' + this.id);
        const scripts = this.scripts.get(event);
        const rets = [];
        if (scripts) {
            for (var s = 0; s < scripts.length; s++) {
                var script = scripts[s];
                item.token.log('--executing script for event:' + event);

                // named by event (start.js; start-2.js for a second script on the same event)
                const ret = await item.context.scriptHandler.executeScript(item, script, scripts.length > 1 ? event + '-' + (s + 1) : event);
                rets.push(ret);

                if (ret && ret.escalation) {
                    await item.token.processEscalation(ret.escalation,item);
                }
                if (ret && ret.bpmnError) {
                    await item.token.processError(ret.bpmnError,item);
                }

            }
        }
        const ret1 = await item.token.execution.doItemEvent(item, event,eventDetails);
        rets.push(ret1);
        item.token.log('Node('+this.name+'|'+this.id+').doEvent: executing script for event:' + event + ' ended');
        return rets;

    }
    /**
     * is Called after execution 
     * transform data using input rules
     * todo
     * @param item
     */
    async setInput(item: Item, input) {
        item.token.log('Node('+this.name+'|'+this.id+').setInput: input' + JSON.stringify(input));
        //
        //item.token.log('--setting input ' + JSON.stringify(input));

        const data = await this.getInput(item, input);

        item.token.appendData(data,item);

    }
    async getInput(item: Item, input) {
        item.token.log('Node('+this.name+'|'+this.id+').getInput: input' + JSON.stringify(input));

        item.input = input;

        await this.doEvent(item, EXECUTION_EVENT.transform_input, null);

        return item.input;
    }
    /**
     * transform data using output rules
     * todo
     * @param item
     */
    async getOutput(item: Item) {
        return item.output;

    }
    enter(item: Item) {
        item.token.log('Node('+this.name+'|'+this.id+').enter: item=' + item.id);
        item.startedAt = new Date();

    }
    /*
     * does the need require to go into wait 
     * tasks like UserTasks, receiveTask, timer 
     */
    get requiresWait() { return false; }
    /* 
     * Can the Node be invoked externally (not from the workflow)
     * tasks like UserTasks, receiveTask, or events like receive,signal can be invoked
     */
    get canBeInvoked() { return false; }

    get loopDefinition() {
        return this.getBehaviour(Behaviour_names.LoopCharacteristics);
    } 

    get isCatching(): boolean { return false; } // catching events and tasks
    /**
     * this is the primary exectuion method for a node
     * 
     * considerations: the following are handled by Token
     *      1.  Loops we are inside a loop already (if any)
     *      2.  Gatways 
     *      3.  Subprocess the parent node is fired as normal
     *              run method will fire the subprocess invoking a new token and will go into wait
     */
    /**
     * The data objects connected to this element by a data association, either way: their names, as the diagram
     * shows them (the reference's name, else the data object's or data store's, else its id).
     */
    get dataObjectNames(): string[] {
        const def = this.def || {};
        const refs = [
            ...(def.dataInputAssociations || []).flatMap(a => a.sourceRef || []),
            ...(def.dataOutputAssociations || []).map(a => a.targetRef).filter(Boolean)
        ];
        const names = refs.map(ref => {
            const target = ref.dataObjectRef || ref.dataStoreRef || ref;
            return ref.name || target.name || target.id || ref.id;
        }).filter(Boolean);
        return [...new Set(names)];
    }

    /**
     * Load the element's data objects into the instance data (appDelegate.loadDataObject), where they are saved
     * with the instance: `data.client` for a data object 'client'. They load each time the element runs.
     */
    async loadDataObjects(item: Item) {
        const names = this.dataObjectNames;
        if (!names.length)
            return;
        const delegate = item.token.execution.appDelegate;
        if (typeof delegate?.loadDataObject !== 'function') {
            item.token.log(`..data objects ${names.join(', ')}: the application has no loadDataObject; not loaded`);
            return;
        }
        for (const name of names) {
            const value = await delegate.loadDataObject(name, item);
            item.token.data[name] = value;
            item.token.log(`..data object ${name} loaded`);
        }
    }

    async execute(item: Item) {
        item.token.logS('Node('+this.name+'|'+this.id+').execute: item=' + item.id+' token:'+item.token.id);

        //  2  enter
        //  --------
        item.token.log('Node('+this.name+'|'+this.id+').execute: execute enter ...');
        await this.doEvent(item, EXECUTION_EVENT.node_enter, ITEM_STATUS.enter);

        this.enter(item);   // no choice
        await this.loadDataObjects(item);
        const behaviourlist = [];
        this.behaviours.forEach(b => { behaviourlist.push(b) });


        for (var i = 0; i < behaviourlist.length; i++) {
            const b = behaviourlist[i];
            const bRet = await b.enter(item);
        }

        //  3   start
        //  --------

        item.token.info(`{"seq":${item.seq},"type":'${this.type}',"id":'${this.id}',"action":'Started'}`);
        item.token.log('Node('+this.name+'|'+this.id+').execute: execute start ...');

        await this.doEvent(item, EXECUTION_EVENT.node_start, ITEM_STATUS.start);

        let ret =await this.start(item);

        item.token.log('Node('+this.name+'|'+this.id+').execute: start complete ...token:'+item.token.id+' ret:'+ret);

        for (var i = 0; i < behaviourlist.length; i++) {
            const b = behaviourlist[i];
            const bRet = await b.start(item);
            if (bRet > ret) ret = bRet;
        }
        // check for attachments - boundary events:

        if (ret == NODE_ACTION.error || ret == NODE_ACTION.abort) {
            item.token.info(`{"seq":${item.seq},"type":'${this.type}',"id":'${this.id}',"action":'Aborted'}`);

            item.token.log('Node('+this.name+'|'+this.id+').execute: start complete ...token:'+item.token.id+' ret:'+ret);
            return ret;
        }
        else if (ret ==NODE_ACTION.wait) {
            await this.doEvent(item, EXECUTION_EVENT.node_wait, ITEM_STATUS.wait);
            item.token.info(`{"seq":${item.seq},"type":'${this.type}',"id":'${this.id}',"action":'Waiting'}`);
            item.token.log('Node('+this.name+'|'+this.id+').execute: start complete ...token:'+item.token.id+' ret:'+ret);
            return ret;
        }
        else if (ret ==NODE_ACTION.end) {
            await this.doEvent(item, EXECUTION_EVENT.node_end, ITEM_STATUS.end);

            item.token.info(`{"seq":${item.seq},"type":'${this.type}',"id":'${this.id}',"action":'Ended'}`);

            item.token.log('Node('+this.name+'|'+this.id+').execute: start complete ...token:'+item.token.id+' ret:'+ret);
            return ret;
        }
        return this.perform(item);
    }
    /**
     * Steps 4 and 5 of execute: the work (run), then on. Also a failed item's retry (Token.retry): the work again.
     */
    async perform(item: Item) {
        //  4   run  perform the work
        //  --------
        //  Save before performing the work
        await item.token.execution.save();

        item.token.log('Node('+this.name+'|'+this.id+').execute: execute run ...token:'+item.token.id);

        let ret;
        try {
            ret = await this.run(item);
        }
        catch (error) {
            ret = await this.failed(item, error);
        }
        switch (ret) {
            case NODE_ACTION.error:
                item.token.log('Node('+this.name+'|'+this.id+').execute: start complete ...token:'+item.token.id+' ret:'+ret);
                return ret;
                break;
            case NODE_ACTION.abort:
                item.token.log('Node('+this.name+'|'+this.id+').execute: start complete ...token:'+item.token.id+' ret:'+ret);
                return ret;
                break;
        }
        //  5   continue    
        //  --------
        //          end


        let ret2=await this.continue(item);
        item.token.logE('Node('+this.name+'|'+this.id+').execute: execute continue...');
        return ret2;

    }
    /** `camunda:exceptionsAsErrors="true"`: an exception of the task's work is raised as a BPMN error. */
    get exceptionsAsErrors(): boolean {
        return String(this.def?.$attrs?.['camunda:exceptionsAsErrors'] ?? this.def?.exceptionsAsErrors ?? '') === 'true';
    }
    /**
     * The task's work threw. With exceptionsAsErrors and an error event that catches it (by the exception's code,
     * else its name; an error event with no code catches any), it is raised there as a BPMN error and the task
     * ends. Otherwise the item's status is `error`, with the message, saved so the instance shows it and the item
     * can be retried (engine.retry), and the exception is thrown to the caller as before.
     */
    async failed(item: Item, error): Promise<NODE_ACTION> {
        const message = error?.message ?? String(error);
        const code = error?.code != null && error.code !== '' ? String(error.code) : error?.name;
        const what = this.name ? `'${this.name}' (${this.id})` : this.id;
        if (this.exceptionsAsErrors && code && item.token.getScopeCatchEvent('error', code)) {
            item.log(`exception: ${message}`);
            item.token.decision(`${what}: the exception "${message}" raised as the BPMN error ${code} (exceptions as BPMN errors)`);
            item.output = { error: message, code };
            await item.token.processError(code, item);
            item.statusDetails = { ...(item.statusDetails ?? {}), exception: message };
            return NODE_ACTION.end;
        }
        item.status = ITEM_STATUS.error;
        item.statusDetails = { ...(item.statusDetails ?? {}), error: message, ...(code ? { code } : {}) };
        item.log(`exception: ${message}; the item's status is error, it can be retried`);
        try {
            await item.token.execution.save();
        }
        catch (saveError) {
            item.token.log('the failed item could not be saved: ' + saveError?.message);
        }
        throw error;
    }
    /*
     *  called by execute or by token.invoke to continue work already started
     */
    async continue(item: Item) {
        item.token.log('Node('+this.name+'|'+this.id+').continue: item=' + item.id);
        await this.end(item);
        return;
    }
    async start(item: Item): Promise<NODE_ACTION> {
        item.token.log('Node('+this.name+'|'+this.id+').start: item=' + item.id);

        await this.startBoundaryEvents(item, item.token);
        if (this.requiresWait) {
            return NODE_ACTION.wait;
        }
        return NODE_ACTION.continue;
    }

    async run(item: Item): Promise<NODE_ACTION> {
        item.token.log('Node('+this.name+'|'+this.id+').run: item=' + item.id);
        return NODE_ACTION.end;
    }
    async cancelEBG(item) {
        const ebgItem=item.token.originItem;
        if (ebgItem && ebgItem.node.type===BPMN_TYPE.EventBasedGateway)
        {   // we need to cancel all other events 
            const ebg=(ebgItem.node) as EventBasedGateway;
            await ebg.cancelAllBranched(item);
        }
    }
    async cancelBoundaryEvents(item) {
        // cancel boundary events
        let i,t;
        for (i = 0; i < this.attachments.length; i++) {
            let boundaryEvent = this.attachments[i];
            item.token.log('        cancelBoundaryEvent:'+boundaryEvent.id);
            let childrenTokens;
            if (this.type==BPMN_TYPE.SubProcess || this.type==BPMN_TYPE.AdHocSubProcess || this.type==BPMN_TYPE.Transaction) // subprocess
            {
                //find the subprocess token
                item.token.execution.tokens.forEach(tok =>
                {
                    if (tok.originItem)
                    {
                       //item.token.log('--check token :'+tok.id+' ' +tok.originItem.id+' '+item.id);
                        if (tok.originItem.id == item.id &&  tok.type==TOKEN_TYPE.SubProcess)
                            childrenTokens = tok.getChildrenTokens();
                    }
                });
            }
            else            
                childrenTokens = item.token.getChildrenTokens();

            if (childrenTokens) {
                for (t = 0; t < childrenTokens.length; t++) {
                    let token = childrenTokens[t];
                    if (token.firstItem)
                    {
                        item.token.log('     cancellBoundaryEvents childToken:'+token.id+' startnode:'+token.startNodeId+' status:'+token.firstItem.status);
                        if (token.startNodeId == boundaryEvent.id) {
                            if (token.firstItem.status != ITEM_STATUS.end)
                                await token.terminate();
                        }
                    }
                }  
            }
        }
    }
    getBoundaryEventItems(item) {

        let i,t;
        let boundaryItems=[];

        for (i = 0; i < this.attachments.length; i++) {
            let boundaryEvent = this.attachments[i];
            item.token.log('        boundaryEvent:'+boundaryEvent.id);
            let childrenTokens;
            if (this.type==BPMN_TYPE.SubProcess || this.type==BPMN_TYPE.AdHocSubProcess || this.type==BPMN_TYPE.Transaction) // subprocess
            {
                //find the subprocess token
                item.token.execution.tokens.forEach(tok =>
                {
                    if (tok.originItem)
                    {
                       //item.token.log('--check token :'+tok.id+' ' +tok.originItem.id+' '+item.id);
                        if (tok.originItem.id == item.id &&  tok.type==TOKEN_TYPE.SubProcess)
                            childrenTokens = tok.getChildrenTokens();
                    }
                });
            }
            else            
                childrenTokens = item.token.getChildrenTokens();

            if (childrenTokens) {
                for (t = 0; t < childrenTokens.length; t++) {
                    let token = childrenTokens[t];
                    item.token.log('     childToken:'+token.id+' startnode:'+token.startNodeId+' status:'+token.currentItem.status);
                    if (token.startNodeId == boundaryEvent.id) {
                        boundaryItems.push(token.currentItem);
                    }
                }  
            }
        }
        return boundaryItems;

    }
    async end(item: Item,cancel:Boolean=false) {
        if (!item  || item.status==ITEM_STATUS.end)
            return;

        if (cancel==true)
            item.token.info(`{"seq":${item.seq},"type":'${this.type}',"id":'${this.id}',"action":'Cancelled'}`);
        else 
        item.token.info(`{"seq":${item.seq},"type":'${this.type}',"id":'${this.id}',"action":'Ended'}`);

        item.token.logS('Node('+this.name+'|'+this.id+'|'+item.seq+').end: item=' + item.id+ ' cancel:'+cancel + ' attachments:'+this.attachments.length);

        /**
         * Rule:    boundary events are canceled when owner task status is 'end'
         * */
        this.behaviours.forEach(async function (b) { await b.end(item); });
        await this.doEvent(item, EXECUTION_EVENT.node_end, ITEM_STATUS.end, {cancel});
        item.token.log('Node('+this.name+'|'+this.id+').end: setting item status to end itemId=' + item.id + ' itemStatus=' + item.status + ' cancel: '+cancel+' endedat '+item.endedAt);
        this.behaviours.forEach(async function (b) { await b.exit(item); });
        item.token.log('Node(' + this.name + '|' + this.id + ').end: finished');

        let result=await this.cancelBoundaryEvents(item);

        if (cancel===false)
            await this.cancelEBG(item);
        
        {
            let i;
            for (i = 0; i < this.outbounds.length; i++) {
                let flow = this.outbounds[i];
                    if (flow.type == BPMN_TYPE.MessageFlow) {
                        let flowItem = new Item(flow, item.token);
                        await flow.execute(flowItem);
                    }
            }
        }
        item.status=ITEM_STATUS.end;
        if (cancel)
            item.endedAt = null;
        else
            item.endedAt = new Date();
                item.token.logE('Node('+this.name+'|'+this.id+').end: ended item=' + item.id);
                
    }
    /**
     * is called by the token after an execution resume for every active (in wait) item
     * different than init, which is called for all items
     * @param item
     */
    resume(item: Item) {

    }
    init(item: Item) {

    }
    /* to be overwritten by XOR gateway */

    async getOutbounds(item: Item): Promise<Item[]> {
        item.token.log('Node('+this.name+'|'+this.id+').getOutbounds: itemId='+item.id);
        const outbounds = [];

        for(const flow of this.outbounds) {
            if (flow.type == BPMN_TYPE.MessageFlow) {

            }
            else {
                let flowItem = new Item(flow, item.token);
                if (await flow.run(flowItem) == FLOW_ACTION.take)
                    outbounds.push(flowItem);
                else 
                    flowItem.token=null;
            }

        }/*
        this.outbounds.forEach(async flow => {
            if (flow.type == BPMN_TYPE.MessageFlow) {

            }
            else {
                let flowItem = new Item(flow, item.token);
                if (await flow.run(flowItem) == FLOW_ACTION.take)
                    outbounds.push(flowItem);
                else 
                    flowItem.token=null;
            }
        }); */
        //item.token.log('..return outbounds' + outbounds.length);
        item.token.log('Node('+this.name+'|'+this.id+').getOutbounds: return outbounds'+outbounds.length);
        return outbounds;
    }
    async startBoundaryEvents(item,token) {
        let i;
        // check for attachments - boundary events:
        for (i = 0; i < this.attachments.length; i++) {
            let event = this.attachments[i];
            if (event.subType!==NODE_SUBTYPE.compensate) {
                // The boundary token stays a child of `token` (so getScopeCatchEvent can find it),
                // but its DATA scope must be the scope the attached activity lives in. For an
                // embedded subprocess `token` is the child token scoped to the subprocess
                // (dataPath = subprocess id); inheriting that leaks the whole downstream path
                // into instance.data[<subprocessId>] once the boundary fires.
                const bt = await Token.startNewToken(TOKEN_TYPE.BoundaryEvent, item.token.execution, event, null, token, item, null, null, true);
                bt.dataPath = item.token.dataPath;
                await bt.execute(null);
            }
        }


    }
    describe() {
        var desc = [];
        if (this.initiator)
            desc.push(['Initiator', this.initiator]);
        if (this.assignee)
            desc.push(['assignee', this.assignee]);

        this.scripts.forEach((scripts, event) => {
            scripts.forEach(scr => {
                desc.push([`script on ${event} `, `${scr}`]);
            });
        })

        return desc;
    }
}


export { Node}