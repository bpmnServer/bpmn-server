import { EMPTY_DIAGRAM } from './emptyDiagram.js';

export class ModelerNoProp {
    bpmnServer;
    constructor(bpmnServer) {
        this.bpmnServer = bpmnServer;
    }
    async displayNew(name, request, response) {
        response.render('modeler-classic', { title: name, processName: name, xml: EMPTY_DIAGRAM, withProps: false });
    }
    async display(processName, request, response) {
        const xml = await this.bpmnServer.definitions.getSource(processName);
        response.render('modeler-classic', { title: processName, processName, xml, withProps: false });
    }
}
