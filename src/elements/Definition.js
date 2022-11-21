"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Definition = void 0;
const BpmnModdle = require('bpmn-moddle');
const _1 = require(".");
const interfaces_1 = require("../interfaces");
const _2 = require(".");
const fs = require('fs');
//DEBUG(moddleOptions);
function DEBUG(...args) {
    //    console.log('Definition.ts',...args);
}
class Definition {
    constructor(name, source, server) {
        this.processes = new Map();
        this.nodes = new Map();
        this.flows = [];
        this.accessRules = [];
        this.server = server;
        this.name = name;
        this.source = source;
        this.logger = server.logger;
        const moddleOptions = this.server.appDelegate.moddleOptions;
        this.moddle = new BpmnModdle({ moddleOptions });
    }
    loadProcess(definition, processElement, parentProcess) {
        const children = [];
        const process = new _1.Process(processElement, parentProcess);
        const eventSubProcesses = [];
        // process flowElements i.e. nodes 
        processElement.flowElements.forEach(child => {
            //
            let el = definition.elementsById[child.id];
            let node;
            if (el.$type == 'bpmn:SubProcess') { // subprocess
                node = new _2.SubProcess(el.id, process, el.$type, el);
                node.childProcess = this.loadProcess(definition, el, process);
                if (el.triggeredByEvent)
                    eventSubProcesses.push(node.childProcess);
            }
            else if (el.$type == 'bpmn:Transaction') { // subprocess
                node = new _2.Transaction(el.id, process, el.$type, el);
                //node = new SubProcess(el.id, process, el.$type, el);
                node.childProcess = this.loadProcess(definition, el, process);
                if (el.triggeredByEvent)
                    eventSubProcesses.push(node.childProcess);
            }
            else {
                node = _1.NodeLoader.loadNode(el, process);
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
                        const flow = new _1.Flow(art.id, art.type, fromNode, toNode, definition.elementsById[art.id]);
                        this.flows.push(flow);
                        DEBUG("assoc: ", from.id, to.id, fromNode.id, toNode.id);
                        fromNode.outbounds.push(flow);
                        toNode.inbounds.push(flow);
                    }
                }
            });
        }
        process.init(children, eventSubProcesses);
        return process;
    }
    /**
     *
     * */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            let definition = yield this.getDefinition(this.source, this.logger);
            yield fs.writeFile('definition.txt', JSON.stringify(definition), function (err) {
                if (err)
                    throw err;
            });
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
                        eventDef[ref.property] = ref.id;
                    }
                    else
                        eventDef = definition.elementsById[ref.id];
                }
            });
            refs.forEach(ref => {
                const fromNode = this.getNodeById(ref.from);
                const toNode = this.getNodeById(ref.to);
                const flow = new _1.Flow(ref.id, ref.type, fromNode, toNode, definition.elementsById[ref.id]);
                this.flows.push(flow);
                fromNode.outbounds.push(flow);
                toNode.inbounds.push(flow);
            });
            // last step get messageFlows:
            //  root
            definition.rootElement.rootElements.forEach(e => {
                if (e.$type == 'bpmn:Collaboration') {
                    if (e.messageFlows) {
                        e.messageFlows.forEach(mf => {
                            const fromNode = this.getNodeById(mf.sourceRef.id);
                            const toNode = this.getNodeById(mf.targetRef.id);
                            const flow = new _1.MessageFlow(mf.id, mf.$type, fromNode, toNode, mf);
                            fromNode.outbounds.push(flow);
                            toNode.inbounds.push(flow);
                        });
                    }
                }
            });
            const event = interfaces_1.EXECUTION_EVENT.process_loaded;
            yield this.server.listener.emit(event, { event, context: this });
            return definition;
        });
    }
    getJson() {
        const elements = [];
        const flows = [];
        const processes = [];
        this.processes.forEach(process => {
            processes.push({ id: process.id, name: process.name, isExecutable: process.isExecutable });
        });
        this.nodes.forEach(node => {
            let behaviours = [];
            node.behaviours.forEach(behav => {
                behaviours.push(behav.describe());
            });
            elements.push({ id: node.id, name: node.name, type: node.type, process: node.processId, def: node.def, description: node.describe(), behaviours });
        });
        this.flows.forEach(flow => {
            flows.push({ id: flow.id, from: flow.from.id, to: flow.to.id, type: flow.type, description: flow.describe() });
        });
        return JSON.stringify({ root: this.rootElements, processes, elements, flows });
    }
    getDefinition(source, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.moddle.fromXML(source);
            return result;
        });
    }
    getFields(elementId) {
        return __awaiter(this, void 0, void 0, function* () {
            let node = this.getNodeById(elementId);
            let extName = _1.Behaviour_names.CamundaFormData;
            let ext = node.getBehaviour(extName);
            if (ext) {
                return ext.fields;
            }
            else
                return null;
        });
    }
    getStartNodes(userInvokable = false) {
        let starts = [];
        this.processes.forEach(proc => {
            var node;
            proc.getStartNodes(userInvokable).forEach(node => {
                starts.push(node);
            });
        });
        return starts;
    }
    getStartNode() {
        return this.getStartNodes()[0];
    }
    getNodeById(id) {
        return this.nodes.get(id);
    }
}
exports.Definition = Definition;
//# sourceMappingURL=Definition.js.map