
const BpmnModdle = require('bpmn-moddle');

import { moddleOptions} from './js-bpmn-moddle';

//const moddleOptions = require('./js-bpmn-moddle.json');

import { Logger } from '../common/Logger';
import { Node, Process, Flow, SubProcess } from './Elements';
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
}

//console.log(moddleOptions);
const moddle = new BpmnModdle({ moddleOptions });


class Definition {
    name;
    processes = new Map();
    elements;
    rootElements;
    nodes = new Map();
    flows = [];
    source;
    logger;
    constructor(name:string,source:string,logger:Logger) {

        this.name = name;
        this.source = source;
        this.logger = logger;

    }
    private loadProcess(definition, processElement) {

        let processId = processElement.id;
        const children = [];
        // process flowElements i.e. nodes 
        processElement.flowElements.forEach(child => {
            //
            let el = definition.elementsById[child.id];
            let node;
            if (el.$type == 'bpmn:SubProcess') { // subprocess
                node = new SubProcess(el.id, processId, el.$type, el);

                node.childProcess = this.loadProcess(definition, el);
            }
            else {
                node = Node.loadNode(el, processId);

             }
            this.nodes.set(el.id, node);
            children.push(node);
        });
        return new Process(processElement, children);
    }
    async load() {

        let definition = await this.getDefinition(this.source, this.logger);

        await fs.writeFile('definition.txt', JSON.stringify(definition), function (err) {
            if (err) throw err;
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
            let flow = new Flow(ref.id, ref.type, fromNode, toNode, definition.elementsById[ref.id]);
            this.flows.push(flow);
            fromNode.outbounds.push(flow);
            toNode.inbounds.push(flow)
        });

        return definition;
    }

    async getDefinition(source, logger) {

    logger.log('getDefinition');

    const result = await moddle.fromXML(source);
    /*    fs.writeFile('modlle2.txt', JSON.stringify(result), function (err) {
        if (err) throw err;
    }); */

    return result;
    }
    public getStartNode() {
        let start = null;
        this.processes.forEach(proc => {
            start = proc.getStartNode();
        });
        return start;
    }
    public getNodeById(id) {
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
export { Definition }