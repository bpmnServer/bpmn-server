/**
 * PUT /rules/invoke: evaluate a decision of the models folder, as a business rule task does.
 *   body: { decision: '<name>' (a file <name>.dmn.xml, or a decision id), data: { ...inputs } }
 *   answer: { decision, file, result }
 * The route is the host's; what evaluates is the engine.
 */
export async function invokeDecision(server, body): Promise<{ decision: string; file: string; result: unknown }> {
    const ref = body && body.decision;
    if (typeof ref !== 'string' || !ref.trim())
        throw new Error("Name the decision: { decision: '<name>', data: { ... } }");
    return server.engine.invokeDecision(ref.trim(), (body.data && typeof body.data === 'object') ? body.data : {});
}
