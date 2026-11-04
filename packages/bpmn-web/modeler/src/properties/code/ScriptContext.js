// What a script or expression can name when bpmn-server runs it (ScriptHandler.getJSvars): for completion in
// the editor's code fields. The application's service names come from GET config.scriptContext.servicesUrl;
// the data fields from the model (form fields, outputs, the start event's initiator).
import { is, isAny } from 'bpmn-js/lib/util/ModelUtil';
import { dataObjectName } from '../dataObjects.js';

/** In a task's (or event's, or flow's) scripts and expressions `this` is the item. */
const ITEM_NAMES = [
    ['data', 'the instance data'], ['input', 'the item\'s input'], ['output', 'the item\'s output'],
    ['item', 'the item (this)'], ['instance', 'the instance'], ['appServices', 'the application\'s services'],
    ['appUtils', 'the application\'s helpers'], ['appDelegate', 'the application delegate']
];
/** In a process's scripts `this` is the execution. */
const EXECUTION_NAMES = [
    ['instance', 'the instance; instance.data holds the data'], ['appServices', 'the application\'s services'],
    ['appUtils', 'the application\'s helpers'], ['appDelegate', 'the application delegate']
];
const ITEM_MEMBERS = ['data', 'input', 'output', 'id', 'itemKey', 'elementId', 'name', 'type', 'status', 'userName',
    'assignee', 'candidateGroups', 'candidateUsers', 'dueDate', 'followUpDate', 'priority', 'startedAt', 'endedAt',
    'instanceId', 'processName', 'vars', 'token'];
const INSTANCE_MEMBERS = ['data', 'id', 'name', 'status', 'startedAt', 'endedAt', 'items', 'parentItemId', 'tenantId'];
const EXECUTION_MEMBERS = ['instance', 'appDelegate', 'servicesProvider', 'name', 'id', 'userName', 'tokens'];

export default class ScriptContext {
    constructor(config, bpmnjs) {
        this._bpmnjs = bpmnjs;
        this.services = [];
        const url = config?.servicesUrl;
        if (url)
            fetch(url).then(r => r.ok ? r.json() : { services: [] }).then(({ services }) => { this.services = services || []; })
                .catch(() => { this.services = []; });
    }

    /** Names in scope for a script of `element` (a process's scripts see the execution). */
    globals(element) {
        return isProcess(element) ? EXECUTION_NAMES : ITEM_NAMES;
    }

    /** What may follow `base.` in a script of `element`. */
    members(base, element) {
        const process = isProcess(element);
        switch (base) {
            case 'appServices':
            case 'this.appServices':
            case 'this.servicesProvider':
                return this.services.filter(s => !s.name.includes('.')).map(s => [s.name, s.kind]);
            case 'data':
            case 'this.data':
            case 'item.data':
            case 'instance.data':
                return this.dataFields().map(name => [name, 'data field']);
            case 'this':
                return (process ? EXECUTION_MEMBERS : ITEM_MEMBERS).map(name => [name, process ? 'execution' : 'item']);
            case 'item':
                return ITEM_MEMBERS.map(name => [name, 'item']);
            case 'instance':
            case 'this.instance':
                return INSTANCE_MEMBERS.map(name => [name, 'instance']);
            case 'input':
            case 'this.input':
                return inputNames(element).map(name => [name, 'input']);
        }
        const nested = base.replace(/^this\./, '');
        if (nested.startsWith('appServices.')) {
            const prefix = nested.slice('appServices.'.length) + '.';
            return this.services.filter(s => s.name.startsWith(prefix)).map(s => [s.name.slice(prefix.length), s.kind]);
        }
        return [];
    }

    /** The data fields the model names: form fields, output parameters, the initiator, data objects, decision results. */
    dataFields() {
        const fields = new Set(['caseId']);
        const visit = obj => {
            if (!obj || typeof obj !== 'object' || !obj.$type) return;
            if (is(obj, 'camunda:FormField') && obj.get('id')) fields.add(obj.get('id'));
            if (is(obj, 'camunda:OutputParameter') && obj.get('name')) fields.add(obj.get('name'));
            if (is(obj, 'bpmn:StartEvent') && obj.get('camunda:initiator')) fields.add(obj.get('camunda:initiator'));
            if (is(obj, 'bpmn:BusinessRuleTask') && obj.get('camunda:resultVariable')) fields.add(obj.get('camunda:resultVariable'));
            if (isAny(obj, ['bpmn:DataObjectReference', 'bpmn:DataStoreReference'])) fields.add(dataObjectName(obj));
            for (const p of obj.$descriptor.properties || []) {
                if (p.isReference || ['di', 'sourceRef', 'targetRef', 'incoming', 'outgoing'].includes(p.name)) continue;
                const value = obj[p.name];
                if (Array.isArray(value)) value.forEach(visit);
                else if (value && typeof value === 'object') visit(value);
            }
        };
        visit(this._bpmnjs.getDefinitions());
        return [...fields].filter(name => /^[A-Za-z_$][\w$]*$/.test(name)).sort();
    }
}

function isProcess(element) {
    return is(element, 'bpmn:Process') || is(element, 'bpmn:Participant') || is(element, 'bpmn:Collaboration');
}

function inputNames(element) {
    const bo = element?.businessObject;
    const io = (bo?.get('extensionElements')?.get('values') || []).find(v => is(v, 'camunda:InputOutput'));
    return (io?.get('inputParameters') || []).map(p => p.get('name')).filter(Boolean);
}

ScriptContext.$inject = ['config.scriptContext', 'bpmnjs'];
