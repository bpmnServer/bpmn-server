// The policies an element names, each a decision table of the models folder, chosen from a list with a link to open
// (or make) it in the decision editor: a user task's assignment policy (docs/docs/assignment-policies.md, with a
// preview from the Test tab's data), a process's or a user task's security and notification policies
// (docs/design/security-policies.md, docs/docs/notification-policies.md). A pool's are its process's.
import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { useEffect, useState } from '@bpmn-io/properties-panel/preact/hooks';
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { request } from '../testing/common.js';
import { usePreview } from './LabelGroup.jsx';

const ATTRIBUTE = 'owf:assignmentPolicy';

/** The kinds of policy: where their files are, where the decision editor opens one. */
export const POLICY_KINDS = {
    assignment: { folder: 'policies/assignment', page: 'policy', none: '<none>' },
    security: { folder: 'policies/security', page: 'security-policy', none: '<none: the default>' },
    notification: { folder: 'policies/notification', page: 'notification-policy', none: '<none>' },
};

// ---- each kind's policies in the models folder, read once a page and again when it gets the focus back
const policies = {};
const listeners = new Set();
async function loadPolicies(kind) {
    try {
        const { policies: list } = await request('GET', `/model/policies?kind=${kind}`);
        policies[kind] = (list || []).map(p => p.name);
    }
    catch { policies[kind] = []; }
    listeners.forEach(fn => fn());
}
if (typeof window !== 'undefined')
    window.addEventListener('focus', () => Object.keys(policies).forEach(loadPolicies));

function usePolicies(kind = 'assignment') {
    const [, setVersion] = useState(0);
    useEffect(() => {
        const changed = () => setVersion(v => v + 1);
        listeners.add(changed);
        if (!policies[kind]) loadPolicies(kind);
        return () => listeners.delete(changed);
    }, [kind]);
    return policies[kind] ?? null;
}

const openPolicy = (name, kind = 'assignment') =>
    window.open(`/model/${POLICY_KINDS[kind].page}/${encodeURIComponent(name)}`, `${kind}-policy-${name}`);

/** What an element's attribute is on: the element, or a pool's process. */
const ownerOf = bo => is(bo, 'bpmn:Participant') ? bo.get('processRef') : bo;
function useAttribute(element, attribute) {
    const modeling = useService('modeling');
    const bo = getBusinessObject(element);
    const owner = ownerOf(bo);
    const get = () => owner?.get(attribute) || '';
    const set = value => is(bo, 'bpmn:Participant')
        ? modeling.updateModdleProperties(element, owner, { [attribute]: value || undefined })
        : modeling.updateProperties(element, { [attribute]: value || undefined });
    return [get, set];
}

/** A policy chosen from its kind's list; one named but not there shows as not found. */
function KindPolicyField({ element, id, kind, attribute, label, description }) {
    const translate = useService('translate');
    const list = usePolicies(kind);
    const [getValue, setValue] = useAttribute(element, attribute);
    return <SelectEntry
        element={element}
        id={id}
        label={translate(label)}
        description={translate(description)}
        getValue={getValue}
        setValue={setValue}
        getOptions={() => {
            const current = getValue();
            const names = list ?? [];
            const own = current && !names.includes(current) ? [{ value: current, label: `${current} (${list ? 'not found' : 'reading…'})` }] : [];
            return [{ value: '', label: translate(POLICY_KINDS[kind].none) }, ...own, ...names.map(name => ({ value: name, label: name }))];
        }}
    />;
}

/** Open the policy chosen, or make a new one (named, then opened in the decision editor). */
function KindPolicyActions({ element, id, kind, attribute, suggestion }) {
    const list = usePolicies(kind);
    const [getValue, setValue] = useAttribute(element, attribute);
    const policy = getValue();
    const create = () => {
        const name = (window.prompt(`Name of the new policy (${POLICY_KINDS[kind].folder}/<name>.dmn.xml):`, policy || suggestion) || '').trim();
        if (!name) return;
        if (name !== policy) setValue(name);
        openPolicy(name, kind);
    };
    return <div class="bio-properties-panel-entry bpmn-server-policy" data-entry-id={id}>
        <div class="bpmn-server-policy-actions">
            {policy && list?.includes(policy) ? <button type="button" class="bpmn-server-policy-open" onClick={() => openPolicy(policy, kind)}>Open {policy}</button> : null}
            <button type="button" class="bpmn-server-policy-new" onClick={create}>{policy && list && !list.includes(policy) ? `Make ${policy}` : 'New policy'}</button>
        </div>
    </div>;
}

/**
 * The entries for a security or notification policy: its list, then Open or New. `idPrefix`: the entries' ids
 * (`<idPrefix>` and `<idPrefix>-actions`).
 */
export function kindPolicyEntries(element, { kind, attribute, idPrefix, label, description, suggestion }) {
    return [
        { id: idPrefix, element, kind, attribute, label, description, component: KindPolicyField, isEdited: isSelectEntryEdited },
        { id: `${idPrefix}-actions`, element, kind, attribute, suggestion, component: KindPolicyActions },
    ];
}

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
        description={translate('A policy of the models folder (policies/assignment/<name>.dmn.xml): its first matching rule assigns the task when it starts, over the fields above')}
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
        const name = (window.prompt('Name of the new policy (policies/assignment/<name>.dmn.xml):', policy || 'Approval') || '').trim();
        if (!name) return;
        if (name !== policy) modeling.updateProperties(element, { [ATTRIBUTE]: name });
        openPolicy(name);
    };
    // which data the preview is with: the Test tab's scenario, its last run's or its start data
    const from = preview ? `with the data of “${preview.scenario}” (${preview.run ? 'its last run' : 'its start data'})` : '';
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
