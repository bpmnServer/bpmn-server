import  { configuration }   from './';
import { BPMNServer, Logger } from './';

const server = new BPMNServer(configuration);

const model = 'multiStart';

server.definitions.rebuild(model);
