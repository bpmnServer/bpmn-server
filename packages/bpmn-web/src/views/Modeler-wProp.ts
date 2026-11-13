import { EMPTY_DIAGRAM } from './emptyDiagram.js';
import { templatesOn } from '../routes/elementTemplates.js';

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
        elementTemplates: templatesOn(),
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
