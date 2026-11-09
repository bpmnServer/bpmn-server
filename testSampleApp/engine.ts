// This application's engine, by itself, with its delegate and services inside: what ENGINE_AT of its host points to.
//   ENGINE_KEY=... npm run engine        on this machine only, port 3001 (ENGINE_PORT, ENGINE_LISTEN to change them)
// Private: nothing but the host is to reach it. Timers run here, not in the host.
import { BPMNServer, engineTests, Logger, startEngineService, webConfiguration } from 'bpmn-web';
import { config } from './settings/config.js';
import { AppDelegate } from './delegates/appDelegate.js';

const server = new BPMNServer(webConfiguration(config(), AppDelegate), new Logger({ toConsole: false }));
await server.ready;
const service = await startEngineService(server, {
    port: Number(process.env.ENGINE_PORT ?? 3001),
    host: process.env.ENGINE_LISTEN ?? '127.0.0.1',
    key: process.env.ENGINE_KEY,
    calls: engineTests,
});
const { address, port } = service.address() as { address: string; port: number };
console.log(`ENGINE_READY ${address}:${port}`);

const stop = async () => {
    service.close();
    await server.shutdown();
    process.exit(0);
};
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
