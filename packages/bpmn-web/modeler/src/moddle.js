// The descriptors the editor reads models with (docs/design/owf-namespace.md):
//  - camunda: Camunda 7's own, as bpmn-server models use it, plus camunda:candidateUsers and camunda:candidateGroups
//    on start events (who may start the process: Camunda defines them, on other elements);
//  - owf: OmniWorkflow's own attributes, which Camunda does not define. Four were written as camunda: before;
//    upgradeToOwf moves them when a model is opened, so the editor saves them as owf:.
import camunda from 'camunda-bpmn-moddle/resources/camunda.json';

export const OWF_NAMESPACE = 'http://omniworkflow.com/schema/owf/1.0';

/** OWF's attributes once written as camunda: (engine: elements/owfAttributes.ts). */
export const LEGACY_CAMUNDA = ['assignmentPolicy', 'label', 'endLabel', 'exceptionsAsErrors'];

export const owf = {
    name: 'OmniWorkflow',
    uri: OWF_NAMESPACE,
    prefix: 'owf',
    xml: { tagAlias: 'lowerCase' },
    associations: [],
    types: [
        {
            // the labels (engine/Labels.ts): a template, with its values named
            name: 'Labeled',
            isAbstract: true,
            extends: ['bpmn:Process', 'bpmn:FlowNode'],
            properties: [
                { name: 'label', isAttr: true, type: 'String' },
                { name: 'endLabel', isAttr: true, type: 'String' }
            ]
        },
        {
            // a user task's assignment policy (engine/AssignmentPolicy.ts)
            name: 'AssignmentPolicy',
            isAbstract: true,
            extends: ['bpmn:UserTask'],
            properties: [{ name: 'assignmentPolicy', isAttr: true, type: 'String' }]
        },
        {
            // a process's or a task's security policy (engine/SecurityPolicy.ts)
            name: 'SecurityPolicy',
            isAbstract: true,
            extends: ['bpmn:Process', 'bpmn:UserTask', 'bpmn:StartEvent'],
            properties: [{ name: 'securityPolicy', isAttr: true, type: 'String' }]
        },
        {
            // Node.failed: an exception of the task's work is raised as a BPMN error
            name: 'ExceptionsAsErrors',
            isAbstract: true,
            extends: ['bpmn:ServiceTask', 'bpmn:SendTask', 'bpmn:ScriptTask'],
            properties: [{ name: 'exceptionsAsErrors', isAttr: true, type: 'Boolean' }]
        }
    ]
};

const camundaExtended = {
    ...camunda,
    types: [
        ...camunda.types,
        {
            name: 'AssignableStart',
            isAbstract: true,
            extends: ['bpmn:StartEvent'],
            properties: [
                { name: 'candidateUsers', isAttr: true, type: 'String' },
                { name: 'candidateGroups', isAttr: true, type: 'String' }
            ]
        }
    ]
};

/** The editor's and the viewers' moddle extensions. */
export const moddleExtensions = { camunda: camundaExtended, owf };

/**
 * A model's OWF attributes still under their old camunda: names, moved to owf: (a value already under owf: wins).
 * `definitions`: the model's root, as read. Returns how many it moved.
 */
export function upgradeToOwf(definitions) {
    let moved = 0;
    const seen = new Set();
    const visit = element => {
        if (!element || typeof element !== 'object' || seen.has(element)) return;
        seen.add(element);
        const attrs = element.$attrs;
        if (attrs && element.$type)
            for (const name of LEGACY_CAMUNDA) {
                const old = `camunda:${name}`;
                if (!(old in attrs)) continue;
                if (element.get(`owf:${name}`) === undefined) {
                    const value = attrs[old];
                    element.set(`owf:${name}`, name === 'exceptionsAsErrors' ? String(value) === 'true' : value);
                }
                delete attrs[old];
                moved++;
            }
        for (const key of ['rootElements', 'flowElements', 'participants'])
            (element.get?.(key) ?? []).forEach(visit);
    };
    visit(definitions);
    return moved;
}

export default camundaExtended;
