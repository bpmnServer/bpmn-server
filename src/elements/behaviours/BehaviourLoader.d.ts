import { TerminateBehaviour } from ".";
import { Node } from "..";
import { ScriptBehaviour } from "./Script";
declare const Behaviour_names: {
    TimerEventDefinition: string;
    LoopCharacteristics: string;
    IOSpecification: string;
    TerminateEventDefinition: string;
    MessageEventDefinition: string;
    SignalEventDefinition: string;
    ErrorEventDefinition: string;
    CamundaFormData: string;
    CamundaScript: string;
    CamundaScript2: string;
    CamundaIO: string;
};
declare class BehaviourLoader {
    static behaviours: ({
        name: string;
        funct: (node: any, def: any) => ScriptBehaviour;
    } | {
        name: string;
        funct: (node: any, def: any) => TerminateBehaviour;
    })[];
    static register(name: any, funct: any): void;
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
    static load(node: Node): void;
}
export { BehaviourLoader, Behaviour_names };
