// The scenarios' root setup (mocha `file`): chai's expect and assert as globals, as the feature specs
// use them; and the scenarios' database emptied and its indexes made, before any of them runs.
import { expect, assert } from 'chai';
import { MongoClient } from 'mongodb';
import { BPMNServer, Logger } from '../../../dist/index.js';
import { configuration, MONGO_URL, DATABASE } from '../testConfiguration.js';

process.env.NODE_ENV = 'test';
Error.stackTraceLimit = 20;
global.expect = expect;
global.assert = assert;

const client = new MongoClient(MONGO_URL);
await client.connect();
await client.db(DATABASE).dropDatabase();
await client.close();
const server = await BPMNServer.create(configuration, new Logger({ toConsole: false }), { cron: false });
await server.dataStore.install();
await server.definitions.install();
await server.shutdown();
