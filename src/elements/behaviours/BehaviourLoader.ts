import { TimerBehaviour, CamundaFormData, IOBehaviour, MessageEventBehaviour, SignalEventBehaviour, TerminateBehaviour, LoopBehaviour } from ".";
import { Node } from "..";
import { Item } from "../../engine/Item";
import { IItem } from "../../..";
import { ScriptBehaviour } from "./Script";


const duration = require('iso8601-duration');
const parse = duration.parse;
const end = duration.end;
const toSeconds = duration.toSeconds;

const Behaviour_names = {
    TimerEventDefinition: 'bpmn:TimerEventDefinition',
    LoopCharacteristics: 'loopCharacteristics',
    IOSpecification: 'ioSpecification',
    TerminateEventDefinition: 'bpmn:TerminateEventDefinition',
    MessageEventDefinition: 'bpmn:MessageEventDefinition',
    SignalEventDefinition: 'bpmn:SignalEventDefinition',
    CamundaFormData: 'camunda:formData',
    CamundaScript: 'camunda:script'
}

class BehaviourLoader {/*
    static Behaviours = {
        timerEventDefinition: function (node, def) { return new TimerBehaviour(node, def); },
        loopCharacteristics: function (node, def) { return new LoopBehaviour(node, def); },
        camunda_formData: function (node, def) { return new CamundaFormData(node, def); },
        ioSpecification: function (node, def) { return new IOBehaviour(node, def); },
        messageEventDefinition: function (node, def) { return new MessageEventBehaviour(node, def); },
        signalEventDefinition: function (node, def) { return new SignalEventBehaviour(node, def); },
        terminateEventDefinition: function (node, def) { return new TerminateBehaviour(node, def); }
    } */

    static behaviours = [
        {
            name: Behaviour_names.TimerEventDefinition, funct: function (node, def) {
                return new TimerBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.LoopCharacteristics, funct: function (node, def) {
                return new LoopBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.CamundaFormData, funct: function (node, def) {
                return new CamundaFormData(node, def);
            }
        },
        {
            name: Behaviour_names.IOSpecification, funct: function (node, def) {
                return new IOBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.MessageEventDefinition, funct: function (node, def) {
                return new MessageEventBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.SignalEventDefinition, funct: function (node, def) {
                return new SignalEventBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.CamundaScript, funct: function (node, def) {
                return new ScriptBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.TerminateEventDefinition, funct: function (node, def) {
                return new TerminateBehaviour(node, def);
            }
        }
    ];
    static load(node: Node) {
        BehaviourLoader.behaviours.forEach(behav => {
            if (node.def[behav.name]) {
                node.addBehaviour(behav.name, behav.funct(node, node.def[behav.name]));
            }
        });
        if (node.def.eventDefinitions) {
            node.def.eventDefinitions.forEach(ed => {
                BehaviourLoader.behaviours.forEach(behav => {
                    if (ed.$type == behav.name) {
                        node.addBehaviour(behav.name, behav.funct(node, ed));
                    }
                });
            });
        }
        if (node.def.extensionElements) {
            node.def.extensionElements.values.forEach(ext => {
                BehaviourLoader.behaviours.forEach(behav => {
                    if (ext.$type == behav.name) {
                        node.addBehaviour(behav.name, behav.funct(node, ext));
                    }
                });
            });
        }
    }
}


export { BehaviourLoader, Behaviour_names }