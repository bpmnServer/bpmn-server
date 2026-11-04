// A data object's name, field and loaders as bpmn-server uses them: for the properties panel and the Report
// (without the panel, so the Report can run on its own: report/view.js).
import { is } from 'bpmn-js/lib/util/ModelUtil';

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

/** The name bpmn-server stores it under: as the diagram shows it, else the data object's, else the id. */
export function dataObjectName(bo) {
    const target = bo.get('dataObjectRef') || bo.get('dataStoreRef') || bo;
    return bo.get('name') || target.get('name') || target.id || bo.id;
}

/** How scripts reach it: data.client, or data['my client'] for a name that is not an identifier. */
export function dataField(name) {
    return IDENTIFIER.test(name) ? `data.${name}` : `data[${JSON.stringify(name)}]`;
}

/** The elements connected to a data object reference by a data association, either way. */
export function loadersOf(bo) {
    const found = [];
    const walk = container => (container.get('flowElements') || []).forEach(e => {
        const reads = (e.get('dataInputAssociations') || []).some(a => (a.get('sourceRef') || []).includes(bo));
        const writes = (e.get('dataOutputAssociations') || []).some(a => a.get('targetRef') === bo);
        if (reads || writes) found.push(e);
        if (is(e, 'bpmn:SubProcess')) walk(e);
    });
    let process = bo.$parent;
    while (process && !is(process, 'bpmn:Process')) process = process.$parent;
    if (process) walk(process);
    return found;
}
