import { exec } from 'child_process';
import { ScriptHandler, SystemUser, configuration } from './';
import { BPMNServer,BPMNAPI, Logger, Definition ,SecureUser } from './';
import { inherits } from 'util';
const logger = new Logger({ toConsole: true});
const server = new BPMNServer(configuration, logger, { cron: false });
const api = new BPMNAPI(server);
let user = new SecureUser({userName:'user1',userGroups:['admin']});

api.engine.throwSignal('signal1','',user)
//testSubProcess();

let process;
let response;
let instanceId;


testAdHoc();


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
async function testAdHoc() {
    

    //    let id = await execute('boundary-event', ['user_task'] ,'user_task');
    let id = await execute('ad hoc',{ needsCleaning: "Yes", needsRepairs: "Yes" },['option1','option2'],'')
    //let id = await execute('ad hoc',{ needsCleaning: "Yes", needsRepairs: "Yes" },['closeOption'],'')


}
async function testSubProcess() {
    
    //    let id = await execute('boundary-event', ['user_task'] ,'user_task');
    let id = await execute('SubProcess',{ needsCleaning: "Yes", needsRepairs: "Yes" },['Task_design','sub_usertask_2'],'')
    
    
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
        response = await server.engine.invoke({ "id": id, "items.elementId": tasks[i] },{});
        await delay(300);


    }

    console.log('executed '+process);
    let itemId;

    response.instance.items.forEach(item=>{
        if (item.elementId==restartTask)
            itemId=item.id;
        console.log('item:',item.seq,item.type,item.elementId,item.status);
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
async function testCar() {
    
    /*
    let id=await car();

    return;
    console.log(' car is done -----');
    */
    let id='8dd82cd1-0567-4aff-9dfd-819fc4ed6a6e';
    let itemId='ec9c217f-c448-4ca4-a062-4ad18b5e71c7';  //drive
    //let itemId='0a6d5429-3645-413c-9b1d-9dccd481d702'; // buy

    response=await server.engine.restart({id,"items.id":itemId},{restart:1},user,{restart:true});
    console.log('done');


}
async function test1() {

    api.defaultUser= user;
    let caseId =1051;
    let id;


    //await api.data.deleteInstances({ "data.caseId": 1050 });

    let response = await api.engine.start('restart', { caseId } , user, {startNodeId:'StartEvent_1'} );

    id=response.id;
console.log('---------------- invoke 1');

    response = await server.engine.invoke({ "id": response.id, "items.elementId": 'act_1' },
        { needsCleaning: "Yes", needsRepairs: "Yes" });

console.log('---------------- invoke 2');
    await api.engine.invoke({ "id": response.id, "items.elementId": 'act_2' },{},user,{noWait:false,myOption:'abc',anObj:{}});
console.log("-------------------- restart -----------------");
    response=await api.engine.restart({id:response.id,"item.elementId":"act_1"},{},user,{restart:true});

console.log("-------------------- restart results-----------------");

    response.instance.items.forEach(it=>{console.log('item',it.id,it.elementId,it.status);});

//    await api.engine.invoke({ "data.caseId": caseId, "items.elementId": 'task_clean' },{},user);

}

async function testRestartEvent() {

    let user = new SecureUser({userName:'user1',userGroups:['admin']});
    api.defaultUser= user;
    let caseId =1051;
    let id;
    //await api.data.deleteInstances({ "data.caseId": 1050 });

    let response = await api.engine.start('restart', { caseId } , user, {startNodeId:'StartEvent_1'} );

    id=response.id;
console.log('---------------- invoke 1');

    response = await server.engine.invoke({ "id": response.id, "items.elementId": 'task1' },
        { needsCleaning: "Yes", needsRepairs: "Yes" });

console.log('---------------- invoke 2');
    response=await api.engine.invoke({ "id": response.id, "items.elementId": 'task2' },{},user,{noWait:false,myOption:'abc',anObj:{}});

    response.instance.items.forEach(it=>{
        console.log('item=>',it.elementId);
    });

    response=await api.engine.startEvent(response.id,"start2",{},user,{restart:true});

    response.instance.items.forEach(it=>{console.log('item',it.id,it.elementId);});

//    await api.engine.invoke({ "data.caseId": caseId, "items.elementId": 'task_clean' },{},user);

}
async function car() {

    let user = new SecureUser({userName:'user1',userGroups:['admin']});
    api.defaultUser= user;
    let caseId =1051;
    let id;

    //await api.data.deleteInstances({ "data.caseId": 1050 });

    let response = await api.engine.start('Buy Used Car', { caseId } );

    id =response.id;

    response = await server.engine.invoke({ "id": id, "items.elementId": 'task_Buy' },
        { needsCleaning: "Yes", needsRepairs: "Yes" });


    await api.engine.invoke({ "id": id, "items.elementId": 'task_repair' },{},user,{noWait:false,myOption:'abc',anObj:{}});

    await api.engine.invoke({ "id": id, "items.elementId": 'task_clean' },{},user);

    await api.engine.invoke({ "id": id, "items.elementId": 'task_Drive' },{},user);

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
 