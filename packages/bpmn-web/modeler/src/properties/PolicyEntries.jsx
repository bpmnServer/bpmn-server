// A user task's assignment policy (docs/docs/assignment-policies.md): camunda:assignmentPolicy names a decision table
// of the models folder, policies/<name>.dmn.xml, whose first matching rule assigns the task when it starts. The list
// of policies, a link to open (or make) one in the decision editor, and a preview with the Test tab's data.
import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { useEffect, useState } from '@bpmn-io/properties-panel/preact/hooks';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { request } from '../testing/common.js';
import { usePreview } from './LabelGroup.jsx';

const ATTRIBUTE = 'camunda:assignmentPolicy';

// ---- the policies of the models folder, read once a page and again when it gets the focus back
let policies = null;
const listeners = new Set();
async function loadPolicies() {
    try {
        const { policies: list } = await request('GET', '/model/policies');
        policies = (list || []).map(p => p.name);
    }
    catch { policies = []; }
    listeners.forEach(fn => fn());
}
if (typeof window !== 'undefined')
    window.addEventListener('focus', () => { if (policies) loadPolicies(); });

function usePolicies() {
    const [, setVersion] = useState(0);
    useEffect(() => {
        const changed = () => setVersion(v => v + 1);
        listeners.add(changed);
        if (!policies) loadPolicies();
        return () => listeners.delete(changed);
    }, []);
    return policies;
}

const openPolicy = name => window.open(`/model/policy/${encodeURIComponent(name)}`, 'policy-' + name);

function PolicyField({ element, id }) {
    const modeling = useService('modeling');
    const translate = useService('translate');
    const list = usePolicies();
    const bo = getBusinessObject(element);
    const getValue = () => bo.get(ATTRIBUTE) || '';
    return <SelectEntry
        element={element}
        id={id}
        label={translate('Assignment policy')}
        description={translate('A policy of the models folder (policies/<name>.dmn.xml): its first matching rule assigns the task when it starts, over the fields above')}
        getValue={getValue}
        setValue={value => modeling.updateProperties(element, { [ATTRIBUTE]: value || undefined })}
        getOptions={() => {
            const current = getValue();
            const names = list ?? [];
            const own = current && !names.includes(current) ? [{ value: current, label: `${current} (${list ? 'not found' : 'reading…'})` }] : [];
            return [{ value: '', label: translate('<none>') }, ...own, ...names.map(name => ({ value: name, label: name }))];
        }}
    />;
}

/** Who the policy gives the task to with the Test tab's data. */
function usePolicyPreview(policy) {
    const preview = usePreview();
    const [answer, setAnswer] = useState(null);
    const data = preview?.data;
    const key = policy && preview ? `${policy}\u0000${JSON.stringify(data)}` : '';
    useEffect(() => {
        if (!key) { setAnswer(null); return; }
        let live = true;
        request('POST', `/model/policy/${encodeURIComponent(policy)}/preview`, { data })
            .then(result => live && setAnswer(result))
            .catch(err => live && setAnswer({ error: err.message }));
        return () => { live = false; };
    }, [key]);
    return { preview, answer };
}

const listText = value => Array.isArray(value) ? value.join(', ') : String(value);

/** What a preview says: who, by which rule; nobody; or why it couldn't tell. */
export function previewText(answer) {
    if (!answer) return '';
    if (answer.error) return `The policy fails: ${answer.error}`;
    if (!answer.rule || !answer.outputs) return 'No rule matches: the task stays unassigned';
    const runs = new Set(answer.expressions ?? []);
    const part = (field, words) => answer.outputs[field] == null ? null
        : `${words} ${runs.has(field) ? `${answer.outputs[field]} (worked out when the task starts)` : listText(answer.outputs[field])}`;
    const who = [part('assignee', 'assigned to'), part('candidateUsers', 'offered to'), part('candidateGroups', 'offered to')].filter(Boolean);
    return `Rule ${answer.rule}: ${who.length ? who.join('; ') : 'gives no one'}`;
}

function PolicySummary({ element, id }) {
    const list = usePolicies();
    const modeling = useService('modeling');
    const bo = getBusinessObject(element);
    const policy = bo.get(ATTRIBUTE) || '';
    const { preview, answer } = usePolicyPreview(list?.includes(policy) ? policy : '');
    const create = () => {
        const name = (window.prompt('Name of the new policy (policies/<name>.dmn.xml):', policy || 'Approval') || '').trim();
        if (!name) return;
        if (name !== policy) modeling.updateProperties(element, { [ATTRIBUTE]: name });
        openPolicy(name);
    };
    const from = preview ? (preview.run ? `${preview.scenario}'s last run` : `${preview.scenario}'s start data`) : '';
    return <div class="bio-properties-panel-entry bpmn-server-policy" data-entry-id={id}>
        <div class="bpmn-server-policy-actions">
            {policy && list?.includes(policy) ? <button type="button" class="bpmn-server-policy-open" onClick={() => openPolicy(policy)}>Open {policy}</button> : null}
            <button type="button" class="bpmn-server-policy-new" onClick={create}>{policy && list && !list.includes(policy) ? `Make ${policy}` : 'New policy'}</button>
        </div>
        {policy && list?.includes(policy)
            ? <div class="bpmn-server-label-preview" data-preview-for="assignment-policy">
                {preview
                    ? <><span class="bpmn-server-label-preview-text">{previewText(answer) || '…'}</span><span class="bpmn-server-label-preview-from"> · {from}</span></>
                    : <span class="muted">Open a scenario in the Test tab to see who this policy gives the task to.</span>}
            </div>
            : null}
    </div>;
}

/** The entries of the User assignment group for a task's policy. */
export function policyEntries(element) {
    return [
        { id: 'assignment-policy', element, component: PolicyField, isEdited: isSelectEntryEdited },
        { id: 'assignment-policy-summary', element, component: PolicySummary },
    ];
}
