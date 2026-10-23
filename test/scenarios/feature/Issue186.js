import { fileURLToPath as __f2p } from 'url';
import { dirname as __dn } from 'path';
const __dirname = __dn(__f2p(import.meta.url));
import { BPMNServer, DefaultAppDelegate, Logger } from './index.js';
import { configuration } from './index.js';


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);


//=-=-=-==============================

let name = 'Issue186';

let response;
let needsRepairs = true;
let needsCleaning = true;
let items;

Feature('Check Issue 186', () => {
  Scenario('straight path', () => {
    Given('start process',async () => {

        response = await server.engine.start(name, {});
      
    });

      and('expect a User Task', async () => {
          let items = response.instance.items;
          items.forEach(item=>{
            console.log('item>:',item.seq,item.elementId,item.status,item.endedAt);
          });
          expect(getItem('Activity_1olobi3').status).equals('wait');
      });

      Given('invoke user task',async () => {

        response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_1olobi3',"items.itemKey":"IT"});
        response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_1mx9fl7'});
      
    });

      and('expect a User Task', async () => {
          let items = response.instance.items;
          items.forEach(item=>{
            console.log('item>:',item.seq,item.elementId,item.itemKey,item.status,item.endedAt);
          });
          expect(getItem('Activity_1olobi3').status).equals('end');
          expect(getItem('Event_1jag0kh').status).equals('end');
      });
      and('write log file to' + name + '.log', async () => {
          let fileName = __dirname + '/../logs/' + name + '.log';
          logger.save(fileName);
      });

  });
});

  function getItem(id)
{
    const item = response.instance.items.filter(item => { return item.elementId == id; })[0]
    if (!item) {
        log('item ' + id + ' not found');
    }
    return item;
}
