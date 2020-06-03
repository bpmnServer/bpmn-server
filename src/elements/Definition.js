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
const js_bpmn_moddle_1 = require("./js-bpmn-moddle");
const Elements_1 = require("./Elements");
const fs = require('fs');
//  bpmn element name - type - superType -
const bpmnTypes = {
    UserTask: { type: 'Task', canInvoke: true },
    ScriptTask: { type: 'Task' },
    ServiceTask: { type: 'Task' },
    SendTask: { type: 'Task' },
    ReceiveTask: { type: 'Task' },
    ParallelGateway: { type: 'Gateway' },
    InclusiveGateway: { type: 'Gateway' },
    StartEvent: { type: 'Event' },
    IntermediateCatchEvent: { type: 'Event' },
    EndEvent: { type: 'Event' },
    SequenceFlow: { type: 'Flow' },
};
//console.log(moddleOptions);
const moddle = new BpmnModdle({ moddleOptions: js_bpmn_moddle_1.moddleOptions });
class Definition {
    constructor(name, source, logger) {
        this.processes = new Map();
        this.nodes = new Map();
        this.flows = [];
        this.name = name;
        this.source = source;
        this.logger = logger;
    }
    loadProcess(definition, processElement) {
        let processId = processElement.id;
        const children = [];
        // process flowElements i.e. nodes 
        processElement.flowElements.forEach(child => {
            //
            let el = definition.elementsById[child.id];
            let node;
            if (el.$type == 'bpmn:SubProcess') { // subprocess
                node = new Elements_1.SubProcess(el.id, processId, el.$type, el);
                node.childProcess = this.loadProcess(definition, el);
            }
            else {
                node = Elements_1.Node.loadNode(el, processId);
            }
            this.nodes.set(el.id, node);
            children.push(node);
        });
        return new Elements_1.Process(processElement, children);
    }
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
                            const proc = this.loadProcess(definition, e);
                            this.processes.set(proc.id, proc);
                        }
                        break;
                }
            });
            let refs = new Map();
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
            });
            refs.forEach(ref => {
                let fromNode = this.getNodeById(ref.from);
                let toNode = this.getNodeById(ref.to);
                let flow = new Elements_1.Flow(ref.id, ref.type, fromNode, toNode, definition.elementsById[ref.id]);
                this.flows.push(flow);
                fromNode.outbounds.push(flow);
                toNode.inbounds.push(flow);
            });
            return definition;
        });
    }
    getDefinition(source, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.log('getDefinition');
            const result = yield moddle.fromXML(source);
            /*    fs.writeFile('modlle2.txt', JSON.stringify(result), function (err) {
                if (err) throw err;
            }); */
            return result;
        });
    }
    getStartNode() {
        let start = null;
        this.processes.forEach(proc => {
            start = proc.getStartNode();
        });
        return start;
    }
    getNodeById(id) {
        return this.nodes.get(id);
    }
    static getType(name) {
        name = name.replace('bpmn:', '');
        if (bpmnTypes[name]) {
            return bpmnTypes[name].type;
        }
        else
            return null;
    }
}
exports.Definition = Definition;
//# sourceMappingURL=Definition.js.map