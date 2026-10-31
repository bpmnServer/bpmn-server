import path from 'node:path';
import * as bpmnServerPackage from 'bpmn-server';

/**
 * PUT /rules/invoke: evaluate a decision of the models folder, as a business rule task does.
 *   body: { decision: '<name>' (a file <name>.dmn.xml, or a decision id), data: { ...inputs } }
 *   answer: { decision, file, result }
 * Needs bpmn-server with DMNEngine (3.3 and later).
 */
export async function invokeDecision(server, body): Promise<{ decision: string; file: string; result: unknown }> {
    const DMNEngine = (bpmnServerPackage as any).DMNEngine;
    if (!DMNEngine)
        throw new Error('Decisions need bpmn-server 3.3 or later (DMNEngine); this server runs an earlier one.');
    const ref = body && body.decision;
    if (typeof ref !== 'string' || !ref.trim())
        throw new Error("Name the decision: { decision: '<name>', data: { ... } }");
    const found = await DMNEngine.find(server.configuration.definitionsPath, ref.trim());
    const engine = await new DMNEngine().load(found.filePath, found.decision.id);
    const result = engine.evaluate((body.data && typeof body.data === 'object') ? body.data : {});
    return { decision: found.decision.id, file: path.basename(found.filePath), result };
}
