import  { configuration }   from './';;
import { BPMNServer, Logger } from './';
import { EventEmitter } from 'events';

const logger = new Logger({ toConsole: true});


let name = 'crash';
let process;
let needsRepairs = true;
let needsCleaning = true;
let response;
let items;
let item;
let query, query1;

let instanceId;
const server = new BPMNServer(configuration, logger, { cron: false });

server.engine.start('test-system-crash',{crash:'Yes'});
