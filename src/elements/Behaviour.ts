
import { Execution } from '../engine/Execution';
import { Token } from '../engine/Token';
import { Node } from './Elements';
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../engine/Enums';
import { Item } from '../engine/Item';

const duration = require('iso8601-duration');
const parse = duration.parse;
const end = duration.end;
const toSeconds = duration.toSeconds;


/** Behaviour
 *      ioSpecification
 *      timer 
 *      message
 *      signal
 *
 *   each behaviour is a class
 *      it scans def and insert itself to perform actions as required
 *
 */
interface IBehaviour {
    start(item: Item);
    run(item: Item);
    end(item: Item);
    resume(item: Item);
    getNodeAttributes(attributes: any[]);
    getItemAttributes(item:Item, attributes: any[]);
}
const Behaviour_names ={
    TimerEventDefinition    : 'bpmn: TimerEventDefinition',
    LoopCharacteristics     : 'loopCharacteristics',
    IOSpecification         : 'ioSpecification',
    TerminateEventDefinition: 'terminateEventDefinition',
    CamundaFormData         : 'camunda:formData'
}
class Behaviour implements IBehaviour {
    node: Node;
    definition;
    constructor(node: Node,definition) {
        this.node = node;
        this.definition = definition;
        this.init();
    }

    static behaviours = [
        {
            name: 'bpmn:TimerEventDefinition', funct: function (node,def) {
                return new TimerBehaviour(node,def);
            }
        },
        {
            name: 'loopCharacteristics', funct: function (node,def) {
                return new LoopBehaviour(node,def);
            }
        },
        {
            name: 'camunda:formData', funct: function (node,def) {
                return new CamundaFormData(node,def);
            }
        },
        {
            name: 'ioSpecification', funct: function (node,def) {
                return new IOBehaviour(node,def);
            }
        },
        {
            name: 'terminateEventDefinition', funct: function (node,def) {
                return new TerminateBehaviour(node,def);
            }
        }
    ];
    static scan(node: Node) {
        Behaviour.behaviours.forEach(behav => {
            if (node.def[behav.name]) {
                node.addBehaviour(behav.name, behav.funct(node, node.def[behav.name]));
            }
        });
        if (node.def.eventDefinitions) {
            node.def.eventDefinitions.forEach(ed => {
                Behaviour.behaviours.forEach(behav => {
                    if (ed.$type == behav.name) {
                        node.addBehaviour(behav.name, behav.funct(node, ed));
                    }
                });
            });
        }
        if (node.def.extensionElements) {
            console.log('extensionElements:');
             node.def.extensionElements.values.forEach(ext => {
                     Behaviour.behaviours.forEach(behav => {
                         if (ext.$type == behav.name) {
                             node.addBehaviour(behav.name, behav.funct(node,ext));
                         }
                     });
                });
        }
    }
    init() {}
    start(item: Item) { }
    run(item: Item) { }
    end(item: Item) { }
    resume(item: Item) { }
    getNodeAttributes(attributes: any[]) {}
    getItemAttributes(item: Item, attributes: any[]) { }
}
/*
 * will terminate all active nodes as a result of terminate end event
 * 
 */
class TerminateBehaviour extends Behaviour {
    start(item: Item) { }
    end(item: Item) {

    }
}
/*
 * will prepare input at start
 * will prepare output at end
 *
 */
class IOBehaviour extends Behaviour {
    start(item: Item) {
    }
    end(item: Item) {

    }
}
/*
 * will fire a timer at start and go into wait sleep
 * timer will later invoke the item when due
 * 
 *
 * 
 *  <timerEventDefinition>
        <timeDate>2011-03-11T12:13:14Z</timeDate>
    </timerEventDefinition>

Example (interval lasting 10 days):

    <timerEventDefinition>
        <timeDuration>P10D</timeDuration>
    </timerEventDefinition>

Time Cycle

Example (3 repeating intervals, each lasting 10 hours):

    <timerEventDefinition>
        <timeCycle>R3/PT10H</timeCycle>
    </timerEventDefinition>



      <bpmn:timerEventDefinition id="TimerEventDefinition_07xu06a">
        <bpmn:timeDuration xsi:type="bpmn:tExpression">PT2S</bpmn:timeDuration>
      </bpmn:timerEventDefinition>


      const startedAt = new Date().toISOString();;
      const timeout = isoDuration ? toSeconds(parse(isoDuration)) * 1000 : 0;
      timerContent = {...messageContent, isoDuration, timeout, startedAt, state: 'timer'};

      broker.publish('execution', 'execute.timer', cloneContent(timerContent));
      broker.publish('event', 'activity.timer', cloneContent(timerContent));

      timer = setTimeout(completed, timeout);
 */
class TimerBehaviour extends Behaviour {
    duration;
    inSeconds;
    init() {
        let def;

        this.node.def.eventDefinitions.forEach(ed => {

            if (ed.$type == 'bpmn:TimerEventDefinition') {
                console.log("------timer definition --- ");
                if (ed.timeDuration) {
                    console.log("------timer definition --- ");
                    console.log(ed);
                    console.log(ed.timeDuration.body);
                    this.duration = ed.timeDuration.body;
                    this.inSeconds = toSeconds((parse(this.duration)));
                    console.log("------timer definition --- " + this.inSeconds);
                }
                else {
                    console.log("Error No timeDuration is defined");
                }
            }
        });

    }
    start(item: Item) {

        let seconds = this.inSeconds;
        console.log("------timer running --- " + this.inSeconds);
        setTimeout(this.expires.bind(item), seconds * 1000);

        return NODE_ACTION.wait;
    }
    expires() {
        let item = this as unknown as Item;

        console.log("------timer Expired --- ");
        item.token.signal();
    }
    end(item: Item) {

    }
    resume() { }
}
class LoopBehaviour extends Behaviour {
    init() {
    }
    
    get collection() {
        return this.node.def.loopCharacteristics.collection;
    }
    isSequential() {
        return this.node.def.isSequential;
    }
}
/*  'camunda:formData'
  <extensionElements>
<camunda: formData >
    <camunda: formField id = "surname" label = "Surname" type = "string" />
        <camunda: formField id = "givenName" label = "Given name" type = "string" />
            </camunda:formData>
            < /extensionElements> */
class CamundaFormData extends Behaviour {
    fields;
    init() {
        this.fields = [];
        this.definition.$children.forEach(f => {
            console.log(' field: Id:' + f.id + " label: " + f.label + " type: " + f.type);
            this.fields.push(f);
        });
    }
    getFields() { return this.fields;}
}


export { IBehaviour, Behaviour, Behaviour_names , LoopBehaviour}