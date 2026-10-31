import  { configuration }   from './';
import { BPMNServer, Logger } from './';
import { EventEmitter } from 'events';

const logger = new Logger({ toConsole: true});


let name = 'recover';
let process;
let needsRepairs = true;
let needsCleaning = true;
let response;
let items;
let item;
let query, query1;

let instanceId;
const server = new BPMNServer(configuration, logger, { cron: false });

console.log('Recover.ts');
recover();
async function recover() {
        var query = { "items.status": "start" };

        var list = await server.dataStore.findItems(query);
        if (list.length > 0) {

            console.log("...items query returend " + list.length);
            for (var i = 0; i < list.length; i++) {
                let item = list[i];
                if (item.type=='bpmn:ScriptTask')
                {
                    console.log(item.processName,item.elementId,item.type,item.startedAt,item.status);
                    console.log('recovering');
                    let response =await server.engine.invoke({"items.id":item.id}, {crash:'No'},null, {recover:true});
                }
            }
        }

}
