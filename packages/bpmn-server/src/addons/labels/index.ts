/**
 * The Labels add-on (docs/docs/labels.md): what each case and task is called, from the model's templates (`owf:label`,
 * `owf:endLabel`) and the case's data; each value a column of the lists. Off, a case is shown by its default
 * (`<model> #<caseId>`) and a task by its name. It depends on the engine only.
 */
import type { IAddOn, IAddOnManifest, IModelCheck } from '../../engine/AddOns.js';
import { owfAttribute } from '../../elements/owfAttributes.js';
import manifest from './addon.json' with { type: 'json' };
import { templateProblems } from './LabelTemplate.js';

export * from './Labels.js';

export const labelsManifest: IAddOnManifest = manifest;

/** A label's template: its parts each a path, at most one value to a part, a name once; the earlier form, said. */
function checkLabels(check, def) {
    for (const attr of ['label', 'endLabel']) {
        const template = owfAttribute(def, attr);
        if (template == null) continue;
        for (const problem of templateProblems(template))
            check.add('error', 'label-template', `Label '${template}': ${problem}.`, def);
        // written before 3.7.5: still read
        if (typeof template == 'string' && /\$\{[^}]*=/.test(template))
            check.add('warning', 'label-old-form', `Label '${template}': \${Name = path} is the earlier form. Write the label in parts, each its text and its value: Client: \${data.clientId}; Order: \${data.orderNo}.`, def);
    }
}

const modelCheck: IModelCheck = {
    name: 'labels',
    verifyProcess(check, proc, def) { checkLabels(check, def); },
    verifyNode(check, node, def) { checkLabels(check, def); },
};

export const labelsAddOn: IAddOn = {
    name: manifest.name,
    register(server) {
        server.registrations.addModelCheck(modelCheck);
    },
};
