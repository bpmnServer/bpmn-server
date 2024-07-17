import { Definition } from "../";
import { IProcessData, IBpmnModelData, IEventData } from "../interfaces/";

class BpmnModelData implements IBpmnModelData {
    name;
    source;
    svg;
    processes: IProcessData[];
    events: IEventData[];
    historyTimeToLive;
    saved;
    constructor(name,source,svg,processes,events) {
        this.name=name;
        this.source = source;
        this.svg = svg;
        this.processes = [];
        this.events = [];
        if (processes)
            this.processes = processes;
        if (events)
            this.events = events;
    }

    parse(definition: Definition) {

        definition.nodes.forEach(n => {

            if (n.type == 'bpmn:StartEvent') {
                const event = new EventData();
                event.elementId = n.id;
                event.name = n.name;
                event.type = n.type;
                event.lane = n.lane;
                event.subType = n.subType;
                event.candidateGroups=n.candidateGroups;
                event.candidateUsers=n.candidateUsers;
                event.processId = n.processId;
                let doc;
                if (n.def.documentation)
                    {
                        n.def.documentation.forEach(d=>{ doc=d.text;})
                        event.documentation = doc;

                    }

                let timer = n.hasTimer();
                if (timer) {
                    event.timeDue = timer.timeDue();
                    event.subType = 'Timer';
                    event.expression = timer.timeCycle;
                    event.referenceDateTime = new Date().getTime();
                }
                let msg = n.hasMessage();
                if (msg) {
                    event.messageId = msg.messageId;
                    event.subType = 'Message';
                    //console.log('timer:' + timer.timeDueInSeconds());
                }
                let signal = n.hasSignal();
                if (signal) {
                    event.signalId = signal.signalId;
                    event.subType = 'Signal';
                }
                this.events.push(event);
            }

        });

        definition.processes.forEach(p => {
            let proc = new ProcessData();
            proc.id = p.def.id;
            proc.name = p.def.name;
            proc.isExecutable = p.def.isExecutable;
            proc.candidateStarterGroups=p.def.candidateStarterGroups;
            proc.candidateStarterUsers=p.def.candidateStarterUsers;
            proc.historyTimeToLive=p.def.historyTimeToLive;
            proc.isStartableInTasklist=p.def.isStartableInTasklist;
            let doc;
            if (p.def.documentation)
                {
                    p.def.documentation.forEach(d=>{ doc=d.text;})
                    proc.documentation = doc;

                }
            this.processes.push(proc);
        });
    }
}
class ProcessData implements IProcessData {
    id;
    name;
    documentation;
    isExecutable;
    candidateStarterGroups;
    candidateStarterUsers;
    historyTimeToLive;
    isStartableInTasklist;
}
class EventData implements IEventData  {
    elementId;
    type;
    subType;
    name;
    processId;
    signalId;
    messageId;
    // timer info
    expression;
    expressionFormat; // cron/iso
    referenceDateTime; //        start time of event   or last time timer ran
    maxRepeat;
    repeatCount;
    timeDue;
    lane;
    candidateGroups;
    candidateUsers;
    documentation;
}


export {ProcessData, EventData , BpmnModelData }