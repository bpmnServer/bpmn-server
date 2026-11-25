/*
 * The model editor's catalog of element templates: configured service tasks, user tasks and so on, in the
 * Camunda 7 element template format (https://docs.camunda.io/docs/components/modeler/desktop-modeler/element-templates/c7-element-templates/).
 *
 * The format can set things bpmn-server does not run (Java classes, connectors, field injection, ...). Each
 * template is checked against what the engine reads; one that sets anything else is left out of the catalog
 * with the reasons, so a template in the editor always does what it says. A template naming a service the
 * application does not provide is kept, with a warning: appDelegate.serviceCalled handles such calls.
 */
import fs from 'node:fs';
import path from 'node:path';

/**
 * Whether the editor offers element templates: ELEMENT_TEMPLATES=on. Off by default in 3.7.1: they are a preview,
 * to be finished (docs/design/roadmap.md: what they set shown in the editor, the owf: attributes, their docs).
 */
export const templatesOn = (): boolean => /^(on|true|1|yes)$/i.test(String(process.env.ELEMENT_TEMPLATES ?? '').trim());

/** Attributes bpmn-server reads (elements/Tasks.ts, Events.ts, Definition.ts), as template `property` bindings. */
const PROPERTIES = new Set([
    'name',
    'implementation', 'camunda:delegateExpression',                  // the service a service task calls
    'camunda:assignee', 'camunda:candidateUsers', 'camunda:candidateGroups',
    'camunda:dueDate', 'camunda:followUpDate', 'camunda:priority',   // user task assignment
    'camunda:formKey',
    'camunda:initiator',                                             // start event: data field for the starter
    'camunda:decisionRef',                                           // business rule task
    'calledElement',                                                 // call activity
    'scriptFormat', 'script'                                         // script task
]);

const SERVICE_PROPERTIES = new Set(['implementation', 'camunda:delegateExpression']);

export interface TemplateCheck {
    /** why the template can not be offered: it sets something bpmn-server does not run */
    problems: string[];
    /** it can be offered, but this may not be what was meant */
    warnings: string[];
}

export interface RejectedTemplate extends TemplateCheck {
    file: string;
    id?: string;
    name?: string;
}

export interface TemplateCatalog {
    templates: any[];
    rejected: RejectedTemplate[];
    warnings: { file: string; id?: string; name?: string; warnings: string[] }[];
}

/** Whether a template only sets what bpmn-server runs; `services` is the application's services provider. */
export function checkTemplate(template, services?): TemplateCheck {
    const problems: string[] = [], warnings: string[] = [];
    if (!template || typeof template !== 'object')
        return { problems: ['is not a JSON object'], warnings };
    for (const key of ['id', 'name'])
        if (typeof template[key] !== 'string' || !template[key])
            problems.push(`has no ${key}`);
    if (!Array.isArray(template.appliesTo) || !template.appliesTo.length)
        problems.push('does not say which elements it applies to (appliesTo)');
    if (!Array.isArray(template.properties))
        problems.push('has no properties');
    if (template.scopes)
        problems.push('uses scopes (Camunda connectors), which bpmn-server does not run');

    for (const property of Array.isArray(template.properties) ? template.properties : []) {
        const binding = property?.binding || {};
        const label = property?.label ? `'${property.label}'` : `a ${binding.type || 'property'} binding`;
        switch (binding.type) {
            case 'property':
                if (!PROPERTIES.has(binding.name))
                    problems.push(`${label} sets ${binding.name}, which bpmn-server does not read`);
                else if (SERVICE_PROPERTIES.has(binding.name) && property.value && services && !hasService(services, property.value))
                    warnings.push(`${label} names the service '${property.value}', which the application does not provide`);
                break;
            case 'camunda:inputParameter':
            case 'camunda:outputParameter':
                if (binding.scriptFormat && !/^javascript$/i.test(binding.scriptFormat))
                    problems.push(`${label} is a ${binding.scriptFormat} script; bpmn-server runs JavaScript`);
                break;
            case 'camunda:executionListener':
                if (!binding.scriptFormat && binding.implementationType !== 'script')
                    problems.push(`${label} is a listener implemented in Java; bpmn-server runs only script listeners`);
                else if (binding.scriptFormat && !/^javascript$/i.test(binding.scriptFormat))
                    problems.push(`${label} is a ${binding.scriptFormat} script; bpmn-server runs JavaScript`);
                break;
            default:
                problems.push(`${label} uses the ${binding.type || 'missing'} binding, which bpmn-server does not run`);
        }
    }
    return { problems, warnings };
}

function hasService(provider, name: string): boolean {
    let obj = provider;
    for (const part of String(name).split('.')) {
        if (obj && typeof obj[part] === 'function') return true;
        if (obj && typeof obj[part] === 'object') obj = obj[part];
        else return false;
    }
    return false;
}

/** The templates of a folder: each *.json file holds one template or a list of them. */
export function loadTemplateCatalog(folder: string | undefined, services?): TemplateCatalog {
    const catalog: TemplateCatalog = { templates: [], rejected: [], warnings: [] };
    if (!folder || !fs.existsSync(folder))
        return catalog;
    for (const file of fs.readdirSync(folder).filter(f => f.endsWith('.json')).sort()) {
        let content;
        try {
            content = JSON.parse(fs.readFileSync(path.join(folder, file), 'utf8'));
        }
        catch (exc) {
            catalog.rejected.push({ file, problems: ['is not valid JSON: ' + exc.message], warnings: [] });
            continue;
        }
        for (const template of Array.isArray(content) ? content : [content]) {
            const { problems, warnings } = checkTemplate(template, services);
            const about = { file, id: template?.id, name: template?.name };
            if (problems.length)
                catalog.rejected.push({ ...about, problems, warnings });
            else {
                catalog.templates.push(template);
                if (warnings.length)
                    catalog.warnings.push({ ...about, warnings });
            }
        }
    }
    return catalog;
}
