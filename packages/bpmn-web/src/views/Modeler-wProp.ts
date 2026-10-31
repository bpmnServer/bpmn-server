import { EMPTY_DIAGRAM } from './emptyDiagram.js';

/** The model editor page: the new modeler, or the classic bundle when MODELER=classic. */
function render(response, processName: string, xml: string) {
    if (process.env.MODELER === 'classic')
        return response.render('modeler-classic', {
            title: processName, processName, xml,
            withProps: true, cspHost: process.env.ITSM_HOST,
        });
    response.render('modeler', {
        processName,
        // as JSON inside a script element: no "</" can close the element early
        modelJson: JSON.stringify(xml).replace(/</g, '\u003c'),
        cspHost: process.env.ITSM_HOST,
    });
}

export class ModelerWProp {
    async displayNew(name, request, response) {
        render(response, name, EMPTY_DIAGRAM);
    }
    async display(processName, xml, request, response) {
        render(response, processName, xml);
    }
}
