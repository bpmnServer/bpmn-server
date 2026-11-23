/**
 * The Extended Forms add-on (docs/design/form-lookups.md): a form field's choices from a source, asked as the form
 * is filled (a drop-down, `<owf:list>`; a search, `<owf:lookup>`), from the application's service or a connector's
 * operation; a list's value is one of its choices when the task is completed. Off, a field is the plain field Camunda
 * defines. It depends on the engine only.
 */
import type { IAddOn, IAddOnManifest, IModelCheck, IAddOnModelCheck, IFieldRule, IFieldChoices } from '../../engine/AddOns.js';
import { Behaviour_names } from '../../elements/behaviours/BehaviourLoader.js';
import manifest from './addon.json' with { type: 'json' };
import { formFieldLookup, lookupElements, filterPath, filterValue, lookupChoices } from './FormLookup.js';

export * from './FormLookup.js';

export const formsManifest: IAddOnManifest = manifest;

/**
 * A form's lists and lookups (FormLookup.ts; docs/design/form-lookups.md): one per field, its source a
 * service the application has or a connector's operation the server has; a filter is a data path. A connector's
 * text and filter go to inputs it has, and it needs no other input (only those are sent).
 */
async function checkFormLookups(check: IAddOnModelCheck, node, def) {
    const fields = node.getBehaviour(Behaviour_names.CamundaFormData)?.fields ?? [];
    for (const field of fields) {
        const elements = lookupElements(field);
        if (!elements.length)
            continue;
        const where = `The field '${field.id}'`;
        if (elements.length > 1)
            check.add('warning', 'lookup-and-list', `${where} has ${elements.length} lists and lookups: only the first is used; remove the others.`, def);
        const lookup = formFieldLookup(field);
        if (!lookup) {
            const written = elements[0].$attrs?.source ?? elements[0].source;
            check.add('error', 'lookup-source', written
                ? `${where}: '${written}' is not a source: service:<name> or connector:<connector>/<operationId>.`
                : `${where} has a ${elements[0].$type} with no source: service:<name> or connector:<connector>/<operationId>.`, def);
            continue;
        }
        if (lookup.filter && filterPath(lookup.filter) === undefined)
            check.add('error', 'lookup-filter', `${where}: the filter '${lookup.filter}' is not a data path, such as $` + `{data.department}.`, def);
        if (lookup.source.type === 'service') {
            if (check.hasService(lookup.source.name) === false)
                check.add('error', 'lookup-service-unknown', `${where}: the application's services have no '${lookup.source.name}'.`, def);
            continue;
        }
        const ref = lookup.source.operation;
        const slash = ref.indexOf('/');
        if (slash <= 0 || slash === ref.length - 1) {
            check.add('error', 'lookup-source', `${where}: '${ref}' does not name a connector's operation: connector:<connector>/<operationId>.`, def);
            continue;
        }
        if (lookup.kind === 'lookup' && !lookup.text)
            check.add('info', 'lookup-no-text', `${where} names no text input: '${ref}' is read whole at each search, and searched by the server.`, def);
        if (lookup.filter && !lookup.filterInput)
            check.add('error', 'lookup-filter-unsent', `${where} has a filter but no filterInput: '${ref}' is not given it.`, def);
        const operation = await check.connectorOperation(ref, def, `the field's ${lookup.kind} is empty`);
        if (!operation)
            continue;
        const names = new Set((operation.parameters ?? []).map(p => p.name));
        for (const [what, name] of [['text', lookup.text], ['filterInput', lookup.filterInput]])
            if (name && !names.has(name))
                check.add('error', 'lookup-input-unknown', `${where}: '${name}' (its ${what}) is not an input of '${ref}': it is not sent.`, def);
        const sent = [lookup.text, lookup.filterInput].filter(Boolean);
        for (const p of operation.parameters ?? [])
            if (p.required && !sent.includes(p.name))
                check.add('error', 'lookup-input-missing', `${where}: '${ref}' needs the input '${p.name}', and a ${lookup.kind} sends ${sent.length ? sent.map(n => `'${n}'`).join(' and ') : 'none'}.`, def);
        if (operation.body?.required)
            check.add('error', 'lookup-input-missing', `${where}: '${ref}' needs a request body, and a ${lookup.kind} sends none.`, def);
    }
}

const modelCheck: IModelCheck = {
    name: 'forms',
    verifyNode: (check, node, def) => checkFormLookups(check, node, def),
};

/** A list's value: one of its choices (an `<owf:lookup>`'s is not checked: its sources search by text). */
const listRule: IFieldRule = {
    name: 'list',
    async check(server, field, value, { data }, context) {
        const lookup = formFieldLookup(field);
        if (lookup?.kind !== 'list') return null;
        try {
            const choices = await lookupChoices(server, lookup, { filter: filterValue(lookup, data) }, context);
            return choices.some(c => String(c.key) === String(value)) ? null
                : { field: field.id, rule: 'list', message: `${field.label || field.id}: "${value}" is not one of its choices` };
        }
        catch (error) {
            return { field: field.id, rule: 'list', message: `${field.label || field.id}: its choices could not be read (${error?.message ?? error})` };
        }
    },
};

/** A field's choices as the form is filled: its list's or its lookup's. */
const fieldChoices: IFieldChoices = {
    name: 'forms',
    choices(server, field, criteria, context) {
        const lookup = formFieldLookup(field);
        return lookup ? lookupChoices(server, lookup, criteria, context) : null;
    },
};

export const formsAddOn: IAddOn = {
    name: manifest.name,
    register(server) {
        server.registrations.addModelCheck(modelCheck);
        server.registrations.addFieldRule(listRule);
        server.registrations.addFieldChoices(fieldChoices);
    },
};
