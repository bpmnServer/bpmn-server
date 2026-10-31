import { exec } from 'child_process';
import { SystemUser, USER_ROLE, configuration } from './';
import { BPMNServer,BPMNAPI, Logger, Definition ,SecureUser } from './';
import { inherits } from 'util';
import { copyFileSync } from 'fs';

const logger = new Logger({ toConsole: false});
const server = new BPMNServer(configuration, logger, { cron: false });
const api = new BPMNAPI(server);
let user = new SecureUser({userName:'user1',userGroups:[USER_ROLE.ADMIN]});

stressLoad(100,10000);


let process;
let response;
let instanceId;
async function stressLoad(waitCount,caseCount) {

    await api.data.deleteInstances({},user);
    
    console.log('=====');
    console.profile();
    console.time('STRESS');

    for(var i=0;i<=waitCount;i++)
    {
        console.log('   ');
        console.time('car-'+i);
        await car(false);
        console.timeEnd('car-'+i);
    }


    for(var i=0;i<=caseCount;i++)
    {
        console.log('   ');
        console.time('car-'+i);
        await car();
        console.timeEnd('car-'+i);
    }
    console.timeEnd('STRESS');
    console.profileEnd();

    process.exit(0);
}
var caseId = 1001;//Math.floor(Math.random() * 10000);

var dueDate=(new Date(Date.now()));

async function car(drive=true) {

    //await delay(1000*60, 'wait 1 min'); 
    let user = new SecureUser({userName:'user1',userGroups:['admin']});
    api.defaultUser= user;

    let id;

    console.log('start Buy Used Car');
    let response = await api.engine.start('Buy Used Car', { caseId:caseId++ } );

    id =response.id;

    
    console.time('invoke');
    response = await server.engine.invoke({ "id": id, "items.elementId": 'task_Buy' },
        { needsCleaning: "Yes", needsRepairs: "Yes" });

    console.timeEnd('invoke');

    await api.engine.invoke({ "id": id, "items.elementId": 'task_repair' },{},user,{noWait:false,myOption:'abc',anObj:{}});

    console.time('invoke');
    await api.engine.invoke({ "id": id, "items.elementId": 'task_clean' },{},user);
    console.timeEnd('invoke');

    console.time('find');
    let list = await api.data.findInstances({"items.status":"wait"});
    console.timeEnd('find');
    console.log('find returned ',list.length);

    if (drive) {
        console.time('invoke');
        await api.engine.invoke({ "id": id, "items.elementId": 'task_Drive' },{},user);
        console.timeEnd('invoke');
    }
    else {
        dueDate.setDate(dueDate.getDate()+1);

        await api.engine.assign({ "id": id, "items.elementId": 'task_Drive' },{},{dueDate},user);
    }

    return id;

}


async function delay(time, result) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(result);
        }, time);
    });
}