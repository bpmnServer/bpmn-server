// The connector `hr`: the business application's API, which models call (`hr/listEmployees`, ...). The application is a
// server of its own, beside this one: its address is HR_API_BASE_URL, and the key OWF sends it is HR_SERVICE_KEY (header
// x-hr-key). The connector's document is what the application publishes at /openapi.json, so what a model may call is what
// the application says it offers. The key is kept by this server, encrypted (SECRETS_KEY): never in the connector's file.
export async function hrConnector(server) {
    const baseUrl = (process.env.HR_API_BASE_URL || 'http://localhost:3101/api/hr').replace(/\/+$/, '');
    const kept = await server.connectors.get('hr');
    if (!kept) {
        let document;
        try {
            const answer = await fetch(`${baseUrl}/openapi.json`, { signal: AbortSignal.timeout(10_000) });
            if (!answer.ok) throw new Error(`HTTP ${answer.status}`);
            document = await answer.json();
        }
        catch (error) {
            return console.warn(`HR: the connector 'hr' was not made: ${baseUrl}/openapi.json could not be read (${error.message}). Start the HR application and this server again.`);
        }
        await server.connectors.add({ id: 'hr', name: 'HR application', document, baseUrl });
    }
    else if (kept.baseUrl !== baseUrl) await server.connectors.update('hr', { baseUrl });
    if (!process.env.HR_SERVICE_KEY || (!(process.env.SECRETS_KEY || process.env.CONNECTORS_KEY) && !process.env.ENGINE_AT))
        return console.warn('HR: HR_SERVICE_KEY and a SECRETS_KEY are needed in .env for the workflows to call the HR application');
    // how the key is sent, in the connector's file; the key itself kept by the engine
    await server.connectors.setScheme('hr', { type: 'apiKey', in: 'header', name: 'x-hr-key' });
    await server.engine.setConnectorKey('hr', process.env.HR_SERVICE_KEY);
}
