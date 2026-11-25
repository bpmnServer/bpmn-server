import { EMPTY_DIAGRAM } from './emptyDiagram.js';
import { templatesOn } from '../routes/elementTemplates.js';
import { addOnsOf } from '../index.js';

/** The model editor page: the new modeler, or the classic bundle when MODELER=classic. */
function render(response, processName: string, xml: string, bpmnServer?) {
    if (process.env.MODELER === 'classic')
        return response.render('modeler-classic', {
            title: processName, processName, xml,
            withProps: true, cspHost: process.env.ITSM_HOST,
        });
    response.render('modeler', {
        processName,
        // as JSON inside a script element: no "</" can close the element early
        modelJson: JSON.stringify(xml).replace(/</g, '\\u003c'),
        cspHost: process.env.ITSM_HOST,
        modelHistory: bpmnServer?.configuration.modelHistory !== false,
        // Model Options' Test (MODEL_TESTS=false: no Test tab)
        modelTests: !/^(false|off|0|no)$/i.test(String(process.env.MODEL_TESTS ?? '').trim()),
        elementTemplates: templatesOn(),
        // the add-ons that are on: their parts of the editor are loaded (modeler/src/addons)
        addOns: bpmnServer ? addOnsOf(bpmnServer).map(a => a.name) : undefined,
        // every add-on's manifest, on or off: the model report shows an off one's attributes as its, off
        manifests: bpmnServer?.configuration?.addOnManifests?.() ?? [],
    });
}

export class ModelerWProp {
    constructor(private bpmnServer?) {}
    async displayNew(name, request, response) {
        render(response, name, EMPTY_DIAGRAM, this.bpmnServer);
    }
    async display(processName, xml, request, response) {
        render(response, processName, xml, this.bpmnServer);
    }
}
