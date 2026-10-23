import { fileURLToPath as __f2p } from 'url';
import { dirname as __dn } from 'path';
const __filename = __f2p(import.meta.url);
const __dirname = __dn(__filename);
console.log('----', __filename);
import { BPMNServer, Execution, Logger } from './index.js';

import { configuration as config } from '../testConfiguration.js';

const logger = new Logger({ toConsole: false });

//=-=-=-==============================

let name = 'scripts and services';
let server;
let response;
let items;
let definition;
let node;
Feature('Test Defintions', () => {
    Scenario('defs.js for:' + name, () => {
        Given('a bpmn source ', async () => {

            server = new BPMNServer(config, logger);

            definition = await server.definitions.load(name);

//            response = await server.engine.start(name);

        });

        When('a process defintion is executed', async () => {

            //console.log(definition);
            node = definition.getNodeById('StartEvent_0iay4ar');
            //console.log(node);
            let timerName = 'bpmn: TimerEventDefinition';
            if (node.hasBehaviour(timerName)) {
                let timer = node.getBehaviour(timerName);
                //console.log(timer);
            }
            //console.log(node.behaviours);
            //            await process.execute(null, { needsCleaning: needsCleaning, needsRepairs: needsRepairs, records: [1, 2, 3] });

        });
        and('wait a bit ', async () => {

            //          process.signal('userTask', {}); // Buy
        });

        and('User Task', async () => {
            //            expect(items.filter(i => i.element.id == 'scriptTask').length).equals(3);
            //            expect(items.filter(i => i.element.id == 'serviceTask').length).equals(3);
            //          process.signal('userTask', {}); // Buy
        });

        and('Case Complete', async () => {
            //     expect(process.status).equals('idle');

        });

        and('write log file to' + name + '.log', async () => {
            let fileName = __dirname + '/../logs/' + name + '.log';
            logger.save(fileName);
        });


    });
});





