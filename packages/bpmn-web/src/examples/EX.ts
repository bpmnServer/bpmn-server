console.log('----------------------------- EX.ts ------------------');

//require('./concurrent');

// Configuration is the entry point to Application; defining your setup and customization
import { configuration } from './';

// import the objects we need from 'bpmn-server'
import { BPMNServer, Logger, BPMNAPI, SecureUser } from 'bpmn-server';

// get Server and API 
//const logger = new Logger({ toConsole: false});
//const server = new BPMNServer(configuration, logger, { cron: true });

//const server = new BPMNServer(configuration,); 
require('./errorEvent');
