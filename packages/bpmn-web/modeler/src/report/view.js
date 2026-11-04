// The Report on a page without the editor (an instance's page): the same report as the model editor's Report tab,
// of the model in <script type="application/json" data-report-source>, written into the element that follows it
// (data-report-target). Not live: no problems or decision tables, as in the History tab's comparison.
import { BpmnModdle } from 'bpmn-moddle';
import camunda from '../moddle.js';
import Report from './Report.js';
import './report.css';

const nothing = { get: () => null, find: () => null, on() {}, fire() {} };

/** The report of a model's XML, as an element. */
export async function reportOf(xml) {
    const { rootElement } = await new BpmnModdle({ camunda }).fromXML(xml);
    const report = new Report({}, nothing, null, nothing, nothing, nothing, null, { get: () => null });
    return report.document(rootElement, false);
}

async function renderAll() {
    for (const source of document.querySelectorAll('script[data-report-source]')) {
        const target = document.getElementById(source.dataset.reportSource);
        if (!target)
            continue;
        try {
            target.replaceChildren(await reportOf(JSON.parse(source.textContent)));
        }
        catch (error) {
            target.textContent = 'The model could not be read: ' + error.message;
        }
    }
}

if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', renderAll);
else
    renderAll();
