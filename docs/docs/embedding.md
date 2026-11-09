# Embedding the engine

Journey D: run processes from your own Node.js code, with no web application. Your code holds the engine, its configuration and its lifetime: [Embedded](architecture.md#embedded).

## 1. Install

```sh
npm install bpmn-server
```

## 2. Configure and start it

The configuration names the models folder, the storage and your app delegate (the services your service tasks call). See [Setup](setup.md#configuration), [Custom persistence](persistence.md) and [Custom delegates](delegates.md).

```ts
import { BPMNServer, BPMNAPI, Logger } from 'bpmn-server';
import { configuration } from './configuration.js';

const server = await BPMNServer.create(configuration, new Logger({ toConsole: false }));
const api = new BPMNAPI(server);
```

## 3. Run processes

`api.engine.start`, `invoke`, `throwMessage` and the rest, each with the user it acts for, and `api.data` to find instances and items: [Invoking workflows](invokation.md), [Engine API](api-summary.md). [Tutorial 6](tutorial/tutorial-script.md) runs the leave request this way.

## 4. Lifecycle and persistence

Keep the server for your process's lifetime, and `await server.shutdown()` when it stops: running work finishes first and timers stop. Timers only fire while a server runs; another server on the same storage takes them over. A step that was running when a process crashed is recovered by hand: see [Hung tasks](advanced.md#hung-tasks).

More: [Application integration](customization.md#embed-only-the-engine), [Runtime architecture](architecture.md).
