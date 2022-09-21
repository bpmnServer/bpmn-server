"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Behaviour_names = exports.BehaviourLoader = void 0;
const _1 = require(".");
const Script_1 = require("./Script");
const TransEvents_1 = require("./TransEvents");
const Escalation_1 = require("./Escalation");
const Error_1 = require("./Error");
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
    ErrorEventDefinition: 'bpmn:ErrorEventDefinition',
    EscalationEventDefinition: 'bpmn:EscalationEventDefinition',
    CancelEventDefinition: 'bpmn:CancelEventDefinition',
    CompensateEventDefinition: 'bpmn:CompensateEventDefinition',
    CamundaFormData: 'camunda:formData',
    CamundaScript: 'camunda:script',
    CamundaScript2: 'camunda:executionListener',
    CamundaIO: 'camunda:inputOutput'
};
exports.Behaviour_names = Behaviour_names;
class BehaviourLoader {
    static register(name, funct) {
        BehaviourLoader.behaviours.push({ name, funct });
    }
    /**
     *
     *  1.  node.definition[<name>]
     *  2.  node.definition.eventDefinitions
     *          $type == <name>
     *
     *          example:
     *
            <bpmn:timerEventDefinition id="TimerEventDefinition_07xu06a">
               <bpmn:timeDuration xsi:type="bpmn:tExpression">PT2S</bpmn:timeDuration>
            </bpmn:timerEventDefinition>
     *
     *  3.  node.definitions.extensionElements
     *          $type == <name>
     *          example: 'camunda:formData'
                <extensionElements>
                    <camunda:formData >
                        <camunda: formField id = "surname" label = "Surname" type = "string" />
                            <camunda: formField id = "givenName" label = "Given name" type = "string" />
                    </camunda:formData>
               < /extensionElements>
     *
     * @param node
     */
    static load(node) {
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
        if (node.def.extensionElements && node.def.extensionElements.values) {
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
exports.BehaviourLoader = BehaviourLoader;
BehaviourLoader.behaviours = [
    {
        name: Behaviour_names.TimerEventDefinition, funct: function (node, def) {
            return new _1.TimerBehaviour(node, def);
        }
    },
    {
        name: Behaviour_names.LoopCharacteristics, funct: function (node, def) {
            return new _1.LoopBehaviour(node, def);
        }
    },
    {
        name: Behaviour_names.CamundaFormData, funct: function (node, def) {
            return new _1.CamundaFormData(node, def);
        }
    },
    {
        name: Behaviour_names.CamundaIO, funct: function (node, def) {
            return new _1.IOBehaviour(node, def);
        }
    },
    {
        name: Behaviour_names.MessageEventDefinition, funct: function (node, def) {
            return new _1.MessageEventBehaviour(node, def);
        }
    },
    {
        name: Behaviour_names.SignalEventDefinition, funct: function (node, def) {
            return new _1.SignalEventBehaviour(node, def);
        }
    },
    {
        name: Behaviour_names.ErrorEventDefinition, funct: function (node, def) {
            return new Error_1.ErrorEventBehaviour(node, def);
        }
    },
    {
        name: Behaviour_names.EscalationEventDefinition, funct: function (node, def) {
            return new Escalation_1.EscalationEventBehaviour(node, def);
        }
    },
    {
        name: Behaviour_names.CompensateEventDefinition, funct: function (node, def) {
            return new TransEvents_1.CompensateEventBehaviour(node, def);
        }
    },
    {
        name: Behaviour_names.CancelEventDefinition, funct: function (node, def) {
            return new TransEvents_1.CancelEventBehaviour(node, def);
        }
    },
    {
        name: Behaviour_names.CamundaScript2, funct: function (node, def) {
            return new Script_1.ScriptBehaviour(node, def);
        }
    },
    {
        name: Behaviour_names.CamundaScript, funct: function (node, def) {
            return new Script_1.ScriptBehaviour(node, def);
        }
    },
    {
        name: Behaviour_names.TerminateEventDefinition, funct: function (node, def) {
            return new _1.TerminateBehaviour(node, def);
        }
    }
];
//# sourceMappingURL=BehaviourLoader.js.map