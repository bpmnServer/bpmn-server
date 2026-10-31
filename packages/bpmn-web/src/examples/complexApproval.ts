import { SystemUser, configuration } from './';
import { BPMNServer,BPMNAPI, Logger, Definition ,SecureUser } from './';
const logger = new Logger({ toConsole: false});
const server = new BPMNServer(configuration, logger, { cron: false });
const api = new BPMNAPI(server);
const user = SecureUser.SystemUser();

import { ApprovalManager } from '../sample-app/ApprovalManager';


let process;
let response;
let instanceId;
let name='Multi-Stage Approval';


const data1=
    {title:'my first case',
    steps:
    [{team:"A.Treasury Officers Team.2",input:"Approved",user:"Smith"},
     {team:"A.Treasury Officers Team.1",input:"Approved",user:"Jones"}
    ]}
    ;
    const data2=
    {title:'my second  case',
    steps:
    [
     {team:"A.HR Head Team.1",input:"Approved",user:"Smith"},
     {team:"B.Risk Officers Team.1",input:"Approved",user:"Jones"},
     {team:"B.Compliance Officers Team.1",input:"Approved",user:"Jane"},
     {team:"B.Compliance Officers Team.2",input:"Approved",user:"Jacks"},
     {team:"C.Treasury Head Team.1",input:"Approved",user:"Jacks I"},
     {team:"C.Finance Controllers Team.1",input:"Approved",user:"Jacks II"},
     {team:"D.Senior Ops Team.1",input:"Approved",user:"Jacks II"},
     {team:"D.Senior Ops Team.2",input:"Approved",user:"Jacks III"},
     {team:"D.Senior Ops Team.3",input:"Approved",user:"Jacks IV"},
     {team:"E.Board Member.1",input:"Approved",user:"User1"},
     {team:"E.CEO.1",input:"Approved",user:"User2"},
     {team:"E.Regulator.1",input:"Approved",user:"User3"},

    ]}
    ;
    const data3=
    {title:'my third  case',
    steps:
    [
     {team:"A.HR Head Team.1",input:"Approved",user:"Smith"},
     {team:"B.Risk Officers Team.1",input:"Rejected",user:"Jones"}

    ]}
    ;

test();

async function test() {

    await deleteCases();
    //await simulate(data1);
    await simulate(data2);
    //await simulate(data3);

    await listCases();
}
async function deleteCases() {
    await api.data.deleteInstances({name},user);
}
async function listCases() {
    let list=await api.data.findInstances({name},user)
    list.forEach(inst=>{
        let lastItem=inst.items[inst.items.length-1].elementId;
        let rejected='';
        if (lastItem=='Event_Rejected_end')
            rejected='Rejected';
        if (inst.status=='end')
            console.log('case -------',inst.data.title,inst.status,inst.endedAt,rejected);
        else
            console.log('case -------',inst.data.title,inst.status,);
        console.log();
        report(inst);
    })
}
async function simulate(data) {
    response=await api.engine.start(name,{},user)
    response=await api.engine.invoke({id:response.id,"items.elementId":"Activity_prepare"},{title:data.title},user);
    
    for(let i=0;i<data.steps.length;i++)
    {
        let step=data.steps[i];
        user.userName=step.user;
        response=await api.engine.invoke({id:response.id,"items.type":"bpmn:UserTask","items.itemKey":step.team},{approval:step.input},user);
    };

    report(response.instance);

    logger.save('complexApproval.log');
}
function getItem(id) {
    const item = response.instance.items.filter(item => { return item.elementId == id; })[0]
    if (!item) {
        log('item ' + id + ' not found');
    }
    return item;
}
function report(instance) {
    instance.items.forEach(item => {
        if (item.type == 'bpmn:UserTask' && item.itemKey)
        {
            if (item.status=='wait')
                console.log(`Item: ${item.seq} ${item.elementId} '${item.itemKey}' ${item.status} - Assigned to: ${item.candidateGroups}`);
            else if (item.status=='end' && item.endedAt==null)
                console.log(`Item: ${item.seq} ${item.elementId} '${item.itemKey}' Cancelled - Assigned to: ${item.candidateGroups}`);
            else 
                console.log(`Item: ${item.seq} ${item.elementId} '${item.itemKey}'  ${item.status} - Assigned to: ${item.candidateGroups} ended at ${item.endedAt} by ${item.userName} - result ${item.vars.approval}`);

        }
    });
}
function log(msg) {
    logger.log(msg);
}
