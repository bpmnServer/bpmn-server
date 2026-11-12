// The Label group (docs/design/labels.md): on the process, the case's label; on any element of the diagram, its
// label and its label once done. A label is a template: `${Name = data.path}` names a value (the lists offer it as a
// filter), `${data.path}` is plain text. Checked as it is typed, as the engine reads it; previewed with the Test
// tab's data.
import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { useEffect, useState } from '@bpmn-io/properties-panel/preact/hooks';
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { templateProblems, fillTemplate } from 'bpmn-server/dist/engine/LabelTemplate.js';

const CASE_HELP = 'What a case is called in the lists: text, with values named, e.g. Client: ${Client = data.clientId}';
const ELEMENT_HELP = 'Shown in the lists and on the instance page, e.g. Approve ${Amount = data.amount} for ${instance.Client}';
const DONE_HELP = 'Once it has ended, e.g. Approved by ${completedBy}';

/** The element whose attribute it is: a pool's label is its process's. */
const targetOf = bo => is(bo, 'bpmn:Participant') ? bo.get('processRef') : bo;

/** The process an element is in (its pool's, for a pool). */
function processOf(bo) {
    let at = targetOf(bo);
    while (at && !is(at, 'bpmn:Process')) at = at.$parent;
    return at;
}

/** The Test tab's data for previews, again whenever the tab changes; null without a scenario (or a Test tab). */
export function usePreview() {
    const testPanel = useService('testPanel', false);
    const eventBus = useService('eventBus');
    const [, setVersion] = useState(0);
    useEffect(() => {
        const changed = () => setVersion(v => v + 1);
        eventBus.on('testPanel.changed', changed);
        return () => eventBus.off('testPanel.changed', changed);
    }, [eventBus]);
    return testPanel?.labelPreview?.() ?? null;
}

/**
 * What a template shows with the preview's data, as the engine fills it (engine/Labels.ts): the case's label sees
 * the data; an element's also its own fields (from the run, when it ran) and the case's named values as `instance.*`.
 */
export function previewLabel(template, { bo, attribute, preview }) {
    const data = preview.data ?? {};
    const scope = { data, model: preview.model };
    if (is(targetOf(bo), 'bpmn:Process'))
        return fillTemplate(template, scope).text;
    const caseTemplate = processOf(bo)?.get('camunda:label');
    const caseValues = caseTemplate ? fillTemplate(caseTemplate, scope).values : [];
    const item = [...(preview.items ?? [])].reverse().find(i => i.elementId === bo.id) ?? {};
    return fillTemplate(template, {
        ...scope, name: bo.name, elementId: bo.id, status: item.status, assignee: item.assignee, userName: item.userName,
        completedBy: attribute === 'camunda:endLabel' ? item.userName : undefined, startedAt: item.startedAt, endedAt: item.endedAt,
        instance: Object.fromEntries(caseValues.map(v => [v.name, v.value])),
    }).text;
}

function Preview({ id, template, bo, attribute }) {
    const preview = usePreview();
    if (!template || templateProblems(template).length) return null;
    if (!preview)
        return <div class="bpmn-server-label-preview muted" data-preview-for={id}>Open a scenario in the Test tab to preview this label with its data.</div>;
    const text = previewLabel(template, { bo, attribute, preview });
    const from = preview.run ? `${preview.scenario}'s last run` : `${preview.scenario}'s start data`;
    const ended = (preview.items ?? []).some(i => i.elementId === bo.id && ['end', 'terminated', 'cancelled', 'discard'].includes(i.status));
    const empty = attribute === 'camunda:endLabel' && !ended ? '(not ended here: its Label shows until it ends)' : '(nothing: every value is missing)';
    return <div class="bpmn-server-label-preview" data-preview-for={id} title={`With ${from}`}>
        <span class="bpmn-server-label-preview-text">{text || empty}</span>
        <span class="bpmn-server-label-preview-from"> · {from}</span>
    </div>;
}

function LabelField({ element, id, attribute, label, description }) {
    const modeling = useService('modeling');
    const debounce = useService('debounceInput');
    const translate = useService('translate');
    const bo = getBusinessObject(element);
    const target = targetOf(bo);
    const template = target?.get(attribute) || '';
    const write = value => is(bo, 'bpmn:Participant')
        ? modeling.updateModdleProperties(element, target, { [attribute]: value || undefined })
        : modeling.updateProperties(element, { [attribute]: value || undefined });

    return <>
        <TextFieldEntry
            element={element}
            id={id}
            label={translate(label)}
            description={translate(description)}
            debounce={debounce}
            getValue={() => target?.get(attribute) || ''}
            setValue={write}
            validate={value => (value ? templateProblems(value)[0] : undefined)}
        />
        <Preview id={id} template={template} bo={bo} attribute={attribute} />
    </>;
}

const entry = (element, props) => ({ element, ...props, component: LabelField, isEdited: isTextFieldEntryEdited });

/** The Label group for the process (or its pool) and for any flow element but a sequence flow; else null. */
export function LabelGroup(element, translate) {
    const bo = getBusinessObject(element);
    if (is(bo, 'bpmn:Process') || (is(bo, 'bpmn:Participant') && bo.get('processRef')))
        return {
            id: 'BpmnServer__Label', label: translate('Label'),
            entries: [entry(element, { id: 'case-label', attribute: 'camunda:label', label: 'Case label', description: CASE_HELP })],
        };
    if (!is(bo, 'bpmn:FlowNode'))
        return null;
    return {
        id: 'BpmnServer__Label', label: translate('Label'),
        entries: [
            entry(element, { id: 'element-label', attribute: 'camunda:label', label: 'Label', description: ELEMENT_HELP }),
            entry(element, { id: 'element-end-label', attribute: 'camunda:endLabel', label: 'Label once done', description: DONE_HELP }),
        ],
    };
}
