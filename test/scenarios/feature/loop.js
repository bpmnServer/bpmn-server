import { fileURLToPath as __f2p } from 'url';
import { dirname as __dn } from 'path';
const __dirname = __dn(__f2p(import.meta.url));


import { BPMNServer, DefaultAppDelegate, Logger } from './index.js';
import { configuration } from './index.js';


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);

//=-=-=-==============================

let name = 'loop';

let response;
let needsRepairs = true;
let needsCleaning = true;
let items;

Feature('Loop', () => {
  Scenario('All path', () => {
    Given('a bpmn source with one user task',async () => {

        let data = { records: [1, 2, 3] };
        response = await server.engine.start(name, data);
        console.log('data:',response.instance.data);
        
    });

      and('script Task', async () => {
          let items = response.instance.items;
          
          expect(items.filter(i => i.elementId == 'script_task').length).equals(5);

      });
      and('servicet Task', async () => {
        let items = response.instance.items;
        
        expect(items.filter(i => i.elementId == 'service_task').length).equals(5);
    });

    and('Sub_script', async () => {
        let items = response.instance.items;
        
        expect(items.filter(i => i.elementId == 'Sub_script').length).equals(6);

    });

    and('SubProcess', async () => {
        let items = response.instance.items;
        
        expect(items.filter(i => i.elementId == 'SubProcess').length).equals(3);;

    });



      and('write log file to' + name + '.log', async () => {
          let fileName = __dirname + '/../logs/' + name + '.log';
          logger.save(fileName);
      });

  });

}); 


async function delay(time, result) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(result);
        }, time);
    });
}

function report(instance) {
    instance.items.sort((a,b)=>(a.nodeId>b.nodeId)).forEach(item => {
        console.log('       --item',item.seq,item.elementId,item.type,item.status,item.userName,'assignee:',item.assignee,item.candidateUsers,item.candidateGroups,item.dueDate);
    });
}