
const BpmnModdle = require('bpmn-moddle');

//import { moddleOptions} from './js-bpmn-moddle';

//const moddleOptions = require('./js-bpmn-moddle.json');

import { Flow , MessageFlow ,NodeLoader , Process, Behaviour_names } from '.'; 
import { BPMN_TYPE } from './NodeLoader';
import { IDefinition } from '../interfaces/elements';
import { BPMNServer } from '../server/BPMNServer';
import { EXECUTION_EVENT } from '../interfaces';
import { Transaction, SubProcess , AdHocSubProcess } from '.';

//DEBUG(moddleOptions);
function DEBUG(...args) {
//    console.log('Definition.ts',...args);
}

class Definition implements IDefinition{
    name;
    processes = new Map();
    rootElements;
    nodes = new Map();
    flows = [];
    source;
    logger;
    server;
    moddle;
    accessRules = [];
    constructor(name:string,source:string,server:BPMNServer) {
        this.server = server;
        this.name = name;
        this.source = source;
        this.logger = server.logger;

        const moddleOptions = this.server.appDelegate.moddleOptions;

        this.moddle = new BpmnModdle({ moddleOptions });
    }
    loadProcess(definition, processElement ,parentProcess) {

        const children = [];
        const process=new Process(processElement,parentProcess);
        if (processElement.extensionElements && processElement.extensionElements.values) {
            processElement.extensionElements.values.forEach(ext=>{
                let scripts = [];
                var scrs = ext['$children'];
                if (scrs) {
                    for (var i = 0; i < scrs.length; i++) {
                        var scr = scrs[i];
                        scripts.push(scr.$body);
                    }
                    process.scripts.set(ext.event, scripts);
                }
           });
        }
        
        const eventSubProcesses = [];
        // process flowElements i.e. nodes 
        processElement.flowElements.forEach(child => {
            //
            let el = definition.elementsById[child.id];
            let node;
            if (el.$type == 'bpmn:SubProcess') { // subprocess
                node = new SubProcess(el.id, process, el.$type, el);

                node.childProcess = this.loadProcess(definition, el,process);
                if (el.triggeredByEvent)
                    eventSubProcesses.push(node.childProcess);
            }
            else if (el.$type == BPMN_TYPE.AdHocSubProcess) { // subprocess
                node = new AdHocSubProcess(el.id, process, el.$type, el);

                node.childProcess = this.loadProcess(definition, el,process);
                if (el.triggeredByEvent)
                    eventSubProcesses.push(node.childProcess);
            }
            else if (el.$type == 'bpmn:Transaction') { // subprocess
                  node = new Transaction(el.id, process, el.$type, el);
                  //node = new SubProcess(el.id, process, el.$type, el);

                node.childProcess = this.loadProcess(definition, el, process);
                if (el.triggeredByEvent)
                    eventSubProcesses.push(node.childProcess);
            }
       
            else {
                node = NodeLoader.loadNode(el, process);

             }
            this.nodes.set(el.id, node);
            children.push(node);
        });
        // handle compensate association
        // associationDirection="One" 
        if (processElement.artifacts) {
            processElement.artifacts.forEach(art => {
                if (art.associationDirection == "One") {
                    let from = art.sourceRef;
                    let to = art.targetRef;
                    if (from && to) {
                        let src = definition.elementsById[from.id];
                        let target = definition.elementsById[to.id];

                        const fromNode = this.getNodeById(from.id);
                        const toNode = this.getNodeById(to.id);
                        const flow = new Flow(art.id, art.type, fromNode, toNode, definition.elementsById[art.id]);
                        this.flows.push(flow);
                        DEBUG("assoc: ", from.id, to.id, fromNode.id, toNode.id);
                        fromNode.outbounds.push(flow);
                        toNode.inbounds.push(flow)
                    }
                }
            });
        }

        process.init(children, eventSubProcesses)
        if (processElement.laneSets)
        {

        processElement.laneSets.forEach(ls=>{
            ls.lanes.forEach(lane=>{
                if (lane.flowNodeRef) {
                    lane.flowNodeRef.forEach(fnr=>{
                        let target = this.getNodeById(fnr.id);
                        target.lane=lane.name;
                    });
                }

                });
            });
        }

        return process;
    }
    /**
     * 
     * */
    async load() {
        let definition;
        try 
        {
            definition = await this.getDefinition(this.source, this.logger);
            // console.log("************************************")
            // console.log(definition)
            // console.log("************************************")
        }
        catch(exc)
        {
            throw exc;
            return null;
        }
        

        definition.rootElement.rootElements.forEach(e => {
            switch (e.$type) {
                case 'bpmn:Process':    
                    {
                        const proc = this.loadProcess(definition, e, null);
                        proc.name = this.name;
                        this.processes.set(e.id, proc);
                    }
                    break;
            }
        });

        let refs = new Map();
        /*
references:         
    element                                 part 1
		    $type : "bpmn:SequenceFlow"
		    id : "flow_start_user"
	    property : "bpmn:sourceRef"
	    id : "event_start"
    element                                 part 2
		    $type : "bpmn:SequenceFlow"
		    id : "flow_start_user"
	    property : "bpmn:targetRef"
	    id : "user_task"

         */
        definition.references.forEach(ref => {
            if (ref.element.$type == 'bpmn:SequenceFlow') {
                //                this.log(`-ref  <${ref.element.id}> <${ref.element.$type}> <${ref.property}> ref to: <${ref.id}>`);
                let id, type, from, to;
                id = ref.element.id;
                type = ref.element.type;
                let flow = refs.get(id);
                if (!flow) {
                    flow = { id, type, from, to };
                    refs.set(id, flow);
                }
                flow.type = ref.element.$type;
                if (ref.property == 'bpmn:sourceRef') {
                    flow.from = ref.id;
                }
                else
                    flow.to = ref.id;
            }
            // 
            // get boundary events
            /*
    reference
        element
            $type : "bpmn:BoundaryEvent"
            id : "BoundaryEvent_0qdlc8p"
        property : "bpmn:attachedToRef"
        id : "user_task"
    
    
    element
    $type : "bpmn:MessageEventDefinition"
    property : "bpmn:messageRef"
    id : "newInvoice"
    
    
    element
    $type : "bpmn:SignalEventDefinition"
    id : "signalEventDef1"
    property : "bpmn:signalRef"
    id : "cancelAll"
    
             */
            if (ref.element.$type == "bpmn:BoundaryEvent") {
                const event = this.getNodeById(ref.element.id);
                const owner = this.getNodeById(ref.id);
                if (owner.type !== 'bpmn:SequenceFlow') {
                    event.attachedTo = owner;
                    owner.attachments.push(event);
                }
            }
            else if ((ref.element.$type == "bpmn:MessageEventDefinition")
                || (ref.element.$type == "bpmn:SignalEventDefinition")
                || (ref.element.$type == "bpmn:EscalationEventDefinition")
                || (ref.element.$type == "bpmn:CancelEventDefinition")
                || (ref.element.$type == "bpmn:CompensateEventDefinition")
                || (ref.element.$type == "bpmn:ErrorEventDefinition")) {
                var eventDef;
                if (ref.element.id) {
                    eventDef = definition.elementsById[ref.element.id];
                    let refDef=definition.elementsById[ref.id];
                    eventDef[ref.property] = refDef;
                }
                else
                    eventDef = definition.elementsById[ref.id];
            }
        });
        refs.forEach(ref => {
            const fromNode = this.getNodeById(ref.from);
            const toNode = this.getNodeById(ref.to);
            const flow = new Flow(ref.id, ref.type, fromNode, toNode, definition.elementsById[ref.id]);
            this.flows.push(flow);
            fromNode.outbounds.push(flow);
            toNode.inbounds.push(flow)
        });
        // last step get messageFlows:
        //  root
        definition.rootElement.rootElements.forEach(e => {
            if (e.$type == 'bpmn:Collaboration') {
                if (e.messageFlows) {
                    e.messageFlows.forEach(mf => {
                        const fromNode=this.getNodeById(mf.sourceRef.id);
                        const toNode= this.getNodeById(mf.targetRef.id);
                        const flow = new MessageFlow(mf.id, mf.$type, fromNode,toNode,mf);
                        fromNode.outbounds.push(flow);
                        toNode.inbounds.push(flow)
                    });

                }

            }
        });

        const event = EXECUTION_EVENT.process_loaded;
        await this.server.listener.emit(event, { event, context: this } );

        return definition;
    }


    getJson() {
        const elements = [];
        
        const flows = [];
        const processes = [];
        this.processes.forEach(process => {
            processes.push({
                id: process.id, name: process.name, isExecutable: process.isExecutable,
                description: process.describe() , docs: process.def.documentation
            });
        });
        this.nodes.forEach(node => {
            if (node.type != 'bpmn:SequenceFlow') {
                let behaviours = [];
                node.behaviours.forEach(behav => {
                    behaviours.push(behav.describe());
                });
                elements.push({ id: node.id, name: node.name, type: node.type, process: node.processId, def: node.def, description: node.describe(), behaviours ,docs:node.def.documentation });
            }
        });

        this.flows.forEach(flow=> {
            flows.push({ id: flow.id, name: flow.name, from: flow.from.id, to: flow.to.id, type: flow.type, description: flow.describe() });
        });

        return JSON.stringify({ root: this.rootElements, processes , elements, flows });
    }

    async getDefinition(source, logger) {

        try {
            const result = await this.moddle.fromXML(source);
            return result;
            }
   		catch (exc) {
            console.log('getDefinition:error',exc);
            throw new Error('Error Reading XML');
			//return this.logger.error(exc);
            }

    }
    async getFields(elementId) {

        let node = this.getNodeById(elementId);
        let extName = Behaviour_names.CamundaFormData;
        let ext = node.getBehaviour(extName);
        if (ext) {
            return ext.fields;
        }
        else
            return null;
    }
    public getStartNodes(userInvokable=false) {
        let starts =[];
        this.processes.forEach(proc => {
            var node;
            proc.getStartNodes(userInvokable).forEach(node => {
                starts.push(node);
            });
        });
        return starts;
    }

    public getStartNode() {
        return this.getStartNodes()[0];
    }
    public getNodeById(id) {
            return this.nodes.get(id);
    }


}

    // sorting of json elements
    let nodes=new Map();
let sortedNodes=new Map();
let sortedFlows=new Map();

function sort(def) {
    def.nodes.forEach(el => {
        if (el.type=='bpmn:StartEvent')
            addSorted(el)
        else
            nodes.set(el.id,el);

    });
    let seq=0;
    let newNodes=[];
    sortedNodes.forEach(s=>{
        console.log('sorted',seq,s.id,s.type);
        newNodes.push(s);
        s['seq']=seq++; 
        }
    );
    let newFlows=[];
    sortedFlows.forEach(f=>{newFlows.push(f)});
    def.nodes=newNodes;
    def.flows=newFlows;

    return;
}

 
function addSorted(el) {
    nodes.delete(el.id);
    sortedNodes.set(el.id,el);
    el.outbounds.forEach(o=>{
        sortedFlows.set(o.id,o);
        addSorted(o.to);
    })
}

    // end of sorting

export { Definition }
