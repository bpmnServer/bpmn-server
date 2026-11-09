import { layoutProcess } from 'bpmn-auto-layout';
import { BpmnModdle } from 'bpmn-moddle';

const NAMESPACES = {
    bpmndi: 'http://www.omg.org/spec/BPMN/20100524/DI',
    dc: 'http://www.omg.org/spec/DD/20100524/DC',
    di: 'http://www.omg.org/spec/DD/20100524/DI',
};

/**
 * A model without diagram information (BPMN DI), with a diagram added to be drawn: its shapes and its flows' edges.
 * The model itself is kept as it was written: only the diagram is added (and the namespaces it needs).
 *
 * bpmn-auto-layout draws a flow from its ends' <incoming> and <outgoing>, which BPMN does not require: a model written
 * by hand, or by an AI, often has only the flows (sourceRef, targetRef). They are filled in on a copy, for the layout
 * alone; else every shape is drawn, and no flow between them.
 */
export async function layoutModel(source: string): Promise<string> {
    const moddle = new BpmnModdle();
    const { rootElement } = await moddle.fromXML(source);
    const containers = [...(rootElement.rootElements ?? []).filter(e => e.$type === 'bpmn:Process')];
    // a sub-process holds flows of its own
    for (let i = 0; i < containers.length; i++)
        containers.push(...(containers[i].flowElements ?? []).filter(e => e.$type === 'bpmn:SubProcess'));
    for (const container of containers)
        for (const flow of (container.flowElements ?? []).filter(e => e.$type === 'bpmn:SequenceFlow')) {
            if (flow.sourceRef && !(flow.sourceRef.outgoing ??= []).includes(flow)) flow.sourceRef.outgoing.push(flow);
            if (flow.targetRef && !(flow.targetRef.incoming ??= []).includes(flow)) flow.targetRef.incoming.push(flow);
        }
    const { xml } = await moddle.toXML(rootElement);
    const laidOut = await layoutProcess(xml);

    // the diagram alone, added to the model as written
    const diagram = /<bpmndi:BPMNDiagram[\s>][\s\S]*<\/bpmndi:BPMNDiagram>/.exec(laidOut)?.[0];
    const root = /<([\w-]+:)?definitions\b[^>]*>/.exec(source);
    const end = source.lastIndexOf('</' + (root?.[1] ?? '') + 'definitions>');
    if (!diagram || !root || end < 0) return source;
    const missing = Object.entries(NAMESPACES).filter(([prefix]) => !new RegExp(`\\sxmlns:${prefix}=`).test(root[0]))
        .map(([prefix, uri]) => ` xmlns:${prefix}="${uri}"`).join('');
    const opening = root[0].replace(/\s*(\/?)>$/, `${missing}$1>`);
    return source.slice(0, root.index) + opening + source.slice(root.index + root[0].length, end) + '  ' + diagram + '\n' + source.slice(end);
}
