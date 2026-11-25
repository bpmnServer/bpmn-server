// The HR demo's workflow engine for a separated deployment. The public host runs index.ts;
// this process owns execution, timers, connector keys and the engine's database access.
import { BPMNServer, Logger, startEngineService, webConfiguration } from 'bpmn-web';
import { config } from './workflow/settings/config.js';
import { AppDelegate } from './workflow/delegates/appDelegate.js';

const server = new BPMNServer(
    webConfiguration(config(), AppDelegate),
    new Logger({ toConsole: true }),
);

await server.ready;
await server.dataStore.install();
await server.definitions.install();
await server.connectors.install();

const service = await startEngineService(server, {
    port: Number(process.env.ENGINE_PORT ?? 3001),
    host: process.env.ENGINE_LISTEN ?? '0.0.0.0',
    key: process.env.ENGINE_KEY,
});

const { address, port } = service.address() as { address: string; port: number };
console.log(`ENGINE_READY ${address}:${port}`);

const stop = async () => {
    service.close();
    await server.shutdown();
    process.exit(0);
};
process.once('SIGTERM', stop);
process.once('SIGINT', stop);
