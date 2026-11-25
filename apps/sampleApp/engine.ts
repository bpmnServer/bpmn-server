// The sample application's separated workflow engine. The native host runs
// index.ts; this process owns execution, timers, delegates and engine storage.
import { BPMNServer, Logger, startEngineService, webConfiguration } from 'bpmn-web';
import { config } from './settings/config.js';
import { AppDelegate } from './delegates/appDelegate.js';

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
