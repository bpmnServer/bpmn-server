import  { Execution, configuration }   from './';
import { BPMNServer, Logger } from './';
import { EventEmitter } from 'events';
import { Definition } from './';

const logger = new Logger({ toConsole: true});


let name = 'Trans'; //      'error event';
let process;
let needsRepairs = true;
let needsCleaning = true;
let response;
let items;
let item;
let query, query1;

let server;
let instanceId;
Play({"data.caseId":8446});

async function Play(query) {

    
    const server = new BPMNServer(configuration, logger, { cron: false });
    let instance = await server.dataStore.findInstance(query, 'Full');
    let savePoints=getSavePoints(instance);

    console.log(savePoints);

    for(let i=0;i<savePoints.length;i++) {

        let sp=savePoints[i];
        console.log('retrieving for sp',sp);

        let execution = await Execution.restore(server,instance,sp.key);
        display(execution)
    }
    //display(instance);

}
function getSavePoints(instance) {
    let sps=[];
    for (let key in instance.savePoints)
        {
            let sp=instance.savePoints[key];
            let lastItem=sp.items[sp.items.length-1];
            sps.push({key,element:lastItem.elementId,status:lastItem.status,seq:lastItem.seq});
        }
    return sps;
    
}
function display(execution) {
    console.log(execution.instance.data);

    
    execution.getItems().forEach(item=>{
        console.log('item:',item.seq,item.elementId,item.status);
    })
}
