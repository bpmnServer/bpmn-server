import { exec } from 'child_process';
import { SystemUser, configuration } from './';
import { BPMNServer,BPMNAPI, Logger, Definition ,SecureUser } from './';
import { inherits } from 'util';
const logger = new Logger({ toConsole: true});
const server = new BPMNServer(configuration, logger, { cron: false });
const api = new BPMNAPI(server);
let user = new SecureUser({userName:'user1',userGroups:['admin']});


testCancel();

let process;
let response;
let instanceId;

async function testCancel() {
    


//    let id = await execute('boundary-event', ['user_task'] ,'user_task');
let id = await execute('Cancel Application',{ needsCleaning: "Yes", needsRepairs: "Yes" },['apply','cancel'],'')


}

async function execute(process,data,tasks,restartTask) {
    let user = new SecureUser({userName:'user1',userGroups:['admin']});
    api.defaultUser= user;
    let caseId =1051;
    let id;

    let response = await api.engine.start(process, data );

    id =response.id;

    for(let i=0;i<tasks.length;i++)
    {
        console.log('>>>>> invoking ',tasks[i]);
        response = await server.engine.invoke({ "id": id, "items.elementId": tasks[i] },{});
        await delay(300);


    }

    console.log('executed '+process);
    let itemId;
    response.instance.items.forEach(item=>{
        if (item.elementId==restartTask)
            itemId=item.id;
        console.log('item:',item.id,item.elementId,item.status);
    });
    console.log('data:',response.instance.data);

    return;
    console.log("-------------------- restart -----------------");

    console.log('restarting ',itemId);

 //   response=await server.engine.restart({"items.id":itemId},{},user,{});
    console.log('restarted ',itemId);
    console.log("-------------------- restart Items-----------------");

    response.instance.items.forEach(item=>{
        if (item.elementId==restartTask)
            itemId=item.id;
        console.log('item:',item.id,item.elementId,item.status);
    });
    console.log('data:',response.instance.data);

    return id;
}

async function delay(time) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(time);
        }, time);
    });
}
 