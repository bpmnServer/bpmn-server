import { exec } from 'child_process';
import { ScriptHandler, SystemUser, configuration } from './';
import { BPMNServer,BPMNAPI, Logger, Definition ,SecureUser } from './';
import { inherits } from 'util';

const logger = new Logger({ toConsole: false});
const server = new BPMNServer(configuration, logger, { cron: false });
const api = new BPMNAPI(server);
let user = new SecureUser({userName:'user1',userGroups:['admin']});


//testSubProcess();

let process;
let response;
let instanceId;



async function debugScript(instanceId,itemSeq,script) {
    
    let ex=await server.engine.get({id:instanceId});

    let items=ex.getItems();
    
    let item=items[itemSeq];
    
    logger.callback=logCall;

    await server.scriptHandler.executeScript(item,script);

    logger.callback=null;
    
    return;

}
function logCall(msg,type) {
    console.log('>>logCall',msg,type);
}
