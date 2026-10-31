import { CamundaFormData } from './Form.js';
import { IOBehaviour } from './IOBehaviour.js';
import { LoopBehaviour } from './Loop.js';
import { MessageEventBehaviour, SignalEventBehaviour } from './MessageSignal.js';
import { TerminateBehaviour } from './Terminate.js';
import { TimerBehaviour } from './Timer.js';
import { Node } from "../Node.js";
import { Item } from "../../engine/Item.js";
import type { IItem } from '../../interfaces/engine.js';
import { ScriptBehaviour } from "./Script.js";
import { CancelEventBehaviour, CompensateEventBehaviour } from "./TransEvents.js";
import { EscalationEventBehaviour } from "./Escalation.js";
import { ErrorEventBehaviour } from './Error.js';


import * as duration from 'iso8601-duration';
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
    CamundaScript3: 'camunda:taskListener',
    CamundaIO: 'camunda:inputOutput'

}

class BehaviourLoader {
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
            name: Behaviour_names.CamundaIO, funct: function (node, def) {
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
            name: Behaviour_names.ErrorEventDefinition, funct: function (node, def) {

                return new ErrorEventBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.EscalationEventDefinition, funct: function (node, def) {

                return new EscalationEventBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.CompensateEventDefinition, funct: function (node, def) {

                return new CompensateEventBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.CancelEventDefinition, funct: function (node, def) {

                return new CancelEventBehaviour(node, def);
            }
        } ,


        {
            name: Behaviour_names.CamundaScript2, funct: function (node, def) {
                 return new ScriptBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.CamundaScript, funct: function (node, def) {
                return new ScriptBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.CamundaScript3, funct: function (node, def) {
                return new ScriptBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.TerminateEventDefinition, funct: function (node, def) {
                return new TerminateBehaviour(node, def);
            }
        }
    ];
    /**
     * Adds a behaviour for a BPMN element, extension or event definition, by its name (`funct(node, def)`
     * makes it). The registry is the library's, for every server in the process, as a moddle extension
     * is: it extends what BPMN the engine understands, not one server's configuration. Register once,
     * at start, before servers load definitions.
     */
    static register(name,funct) {

        BehaviourLoader.behaviours.push({ name, funct });
    }
    /**
     * #### 1. Load behaviours from node definition
     * 
     * `node.definition[<name>]`
     * 
     * #### 2. Load behaviours from node definition.eventDefinitions
     * 
     * ```ts
     * node.definition.eventDefinitions
     *          $type == <name>
     * ```
     * example:
     * 
     * ```xml  
            <bpmn:timerEventDefinition id="TimerEventDefinition_07xu06a">
               <bpmn:timeDuration xsi:type="bpmn:tExpression">PT2S</bpmn:timeDuration>
            </bpmn:timerEventDefinition>
     *  ```
     *  #### 3. Load behaviours from node definition.extensionElements
     * 
     * ```ts
     * node.definitions.extensionElements
     *          $type == <name>
     * ```
     * example:
     * 
     * ```xml
     * 'camunda:formData'
        <extensionElements>
            <camunda:formData >
                <camunda: formField id = "surname" label = "Surname" type = "string" />
                    <camunda: formField id = "givenName" label = "Given name" type = "string" />
            </camunda:formData>
        < /extensionElements>
     * ```
     * 
     * @param node
     */
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


export { BehaviourLoader, Behaviour_names }