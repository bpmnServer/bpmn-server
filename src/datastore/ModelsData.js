"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpmnModelData = exports.EventData = exports.ProcessData = void 0;
const fs = require('fs');
const Path = require('path');
const MongoDB = require('./MongoDB').MongoDB;
class BpmnModelData {
    constructor(name, source, svg, processes, events) {
        this.name = name;
        this.source = source;
        this.svg = svg;
        this.processes = [];
        this.events = [];
        if (processes)
            this.processes = processes;
        if (events)
            this.events = events;
    }
    parse(definition) {
        definition.nodes.forEach(n => {
            if (n.type == 'bpmn:StartEvent') {
                const event = new EventData();
                event.elementId = n.id;
                event.name = n.name;
                event.type = n.type;
                event.processId = n.processId;
                let timer = n.hasTimer();
                if (timer) {
                    event.timeDue = timer.timeDue();
                    event.subType = 'Timer';
                    event.expression = timer.timeCycle;
                    event.referenceDateTime = new Date().getTime();
                    console.log('reference Time:' + event.referenceDateTime);
                }
                let msg = n.hasMessage();
                if (msg) {
                    event.messageId = msg.messageId;
                    event.subType = 'Message';
                    console.log('message:' + msg.messageId);
                    //console.log('timer:' + timer.timeDueInSeconds());
                }
                let signal = n.hasSignal();
                if (signal) {
                    event.signalId = signal.signalId;
                    event.subType = 'Signal';
                    console.log('signal:' + signal.signalId);
                }
                this.events.push(event);
            }
        });
        definition.processes.forEach(p => {
            let proc = new ProcessData();
            proc.id = p.def.id;
            proc.name = p.def.name;
            proc.isExecutable = p.def.isExecutable;
            this.processes.push(proc);
        });
    }
}
exports.BpmnModelData = BpmnModelData;
class ProcessData {
}
exports.ProcessData = ProcessData;
class EventData {
}
exports.EventData = EventData;
//# sourceMappingURL=ModelsData.js.map