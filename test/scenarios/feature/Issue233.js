import { fileURLToPath as __f2p } from 'url';
import { dirname as __dn } from 'path';
const __dirname = __dn(__f2p(import.meta.url));
import { BPMNServer, DefaultAppDelegate, Logger } from './index.js';
import { configuration } from './index.js';


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);
//=-=-=-==============================

let name = 'Issue 233';

let response;
let needsRepairs = true;
let needsCleaning = true;
let items;

Feature('Loops subprocess inside subprocess-issue 233', () => {
  Scenario('All path', () => {
    Given('a bpmn source with one user task',async () => {

        response = await server.engine.start(name, {});

        let instanceId=response.instance.id;

        response = await server.engine.invoke({"items.elementId": 'Activity_0s1j60f',"id":instanceId  });
        response = await server.engine.invoke({"items.elementId": 'Activity_F',"id":instanceId ,"items.status":"wait","items.itemKey":"0.0" });
        response = await server.engine.invoke({"items.elementId": 'Activity_Z',"id":instanceId ,"items.status":"wait","items.itemKey":"0.0" });
        response = await server.engine.invoke({"items.elementId": 'Activity_F',"id":instanceId ,"items.status":"wait","items.itemKey":"0.1" });
        response = await server.engine.invoke({"items.elementId": 'Activity_Z',"id":instanceId ,"items.status":"wait","items.itemKey":"0.1" });
    
        response = await server.engine.invoke({"items.elementId": 'Activity_F',"id":instanceId ,"items.status":"wait","items.itemKey":"1.0" });
        response = await server.engine.invoke({"items.elementId": 'Activity_Z',"id":instanceId ,"items.status":"wait","items.itemKey":"1.0" });
        response = await server.engine.invoke({"items.elementId": 'Activity_F',"id":instanceId ,"items.status":"wait","items.itemKey":"1.1" });
        response = await server.engine.invoke({"items.elementId": 'Activity_Z',"id":instanceId ,"items.status":"wait","items.itemKey":"1.1" });
    
        response = await server.engine.invoke({"items.elementId": 'Activity_F',"id":instanceId ,"items.status":"wait","items.itemKey":"2.0" });
        response = await server.engine.invoke({"items.elementId": 'Activity_Z',"id":instanceId ,"items.status":"wait","items.itemKey":"2.0" });
        response = await server.engine.invoke({"items.elementId": 'Activity_F',"id":instanceId ,"items.status":"wait","items.itemKey":"2.1" });
        response = await server.engine.invoke({"items.elementId": 'Activity_Z',"id":instanceId ,"items.status":"wait","items.itemKey":"2.1" });
    
        
    });

    and('Process ended', async () => {
        let items = response.instance.items;
        expect(items.filter(i => i.status == 'wait').length).equals(0);
        expect((items.filter(i => i.elementId == 'Event_1gkaeoz'))[0].status).equals('end');
    });

	

      and('write log file to' + name + '.log', async () => {
          let fileName = __dirname + '/../logs/' + name + '.log';
          logger.save(fileName);
      });

  });


}); 

