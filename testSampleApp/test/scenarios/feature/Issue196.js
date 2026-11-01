import { fileURLToPath as __f2p } from 'url';
import { dirname as __dn } from 'path';
const __dirname = __dn(__f2p(import.meta.url));
import { BPMNServer, DefaultAppDelegate, Logger } from './index.js';
import { configuration } from './index.js';


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);


//=-=-=-==============================

let name = 'Issue 196';

let response;
let needsRepairs = true;
let needsCleaning = true;
let items;

Feature('Loop inside loop', () => {
  Scenario('All path', () => {
    Given('a bpmn source with one user task',async () => {

        response = await server.engine.start(name, {});
        response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT1',"items.itemKey":"1"});
        response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT1',"items.itemKey":"2"});
        
    });

      and('User Task', async () => {
          let items = response.instance.items;
          expect(items.filter(i => i.status == 'wait').length).equals(12);
          expect(items.filter(i => i.status == 'start').length).equals(0);
          items.forEach(item=>{
            console.log('item>:',item.seq,item.elementId,item.status,item.endedAt);
          });
      });

      and('write log file to' + name + '.log', async () => {
          let fileName = __dirname + '/../logs/' + name + '.log';
          logger.save(fileName);
      });

  });

  Scenario('Cancel', () => {
    Given('a bpmn source with one user task',async () => {

        response = await server.engine.start(name, {});
        response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT1',"items.itemKey":"1"});
        response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT1',"items.itemKey":"2"});
        response=await server.engine.invoke({id:response.id,"items.elementId":'Event_Cancel',"items.itemKey":"2"});
        
    });

      and('User Task', async () => {
          let items = response.instance.items;
          items.forEach(item=>{
            console.log('item>:',item.seq,item.elementId,item.status,item.endedAt,item.itemKey);
          });
          expect(items.filter(i => i.status == 'wait').length).equals(0);
          expect(items.filter(i => i.status == 'start').length).equals(0);
      });

      and('write log file to' + name + '.log', async () => {
          let fileName = __dirname + '/../logs/' + name + '2.log';
          logger.save(fileName);
      });

  });
  Scenario('Error', () => {
    Given('a bpmn source with one user task',async () => {

        response = await server.engine.start(name, {});
        response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT1',"items.itemKey":"1"});
        response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT1',"items.itemKey":"2"});
        response=await server.engine.invoke({id:response.id,"items.elementId":'Event_Error',"items.itemKey":"2"});
        
    });

      and('User Task', async () => {
          let items = response.instance.items;
          items.forEach(item=>{
            console.log('item>:',item.seq,item.elementId,item.status,item.endedAt,item.itemKey);
          });
          expect(items.filter(i => i.status == 'wait').length).equals(0);
          expect(items.filter(i => i.status == 'start').length).equals(0);
      });

      and('write log file to' + name + '.log', async () => {
          let fileName = __dirname + '/../logs/' + name + '3.log';
          logger.save(fileName);
      });

  });

}); 

