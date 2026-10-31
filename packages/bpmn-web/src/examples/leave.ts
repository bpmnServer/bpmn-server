// Configuration is the entry point to Application; defining your setup and customization
import { configuration } from './';

// import the objects we need from 'bpmn-server'
import { BPMNServer,BPMNAPI, SecureUser } from 'bpmn-server';

// get Server and API 
const server = new BPMNServer(configuration); 
const api = new BPMNAPI(server);

leave();

let response;

async function leave() {
    
        // Simulate a user object

        let user1 = new SecureUser({userName:'user1',userGroups:['Employee']});
        let caseId =1052;
        
        let id;
    
        console.log('-------------------');
        console.log('Starting a Leave Application');

        // syntax: ▸ start(name, data?, user?, options?): Promise<IExecution>
        let response = await api.engine.start('Leave Application',{caseId} ,user1);
        
        console.log(
                'instance',response.instance.id,
                'status:',response.instance.status,
                'items:',response.instance.items.length);

        response.instance.items.forEach(item=>{
            console.log('   item:',item.seq,item.elementId,'status:',item.status,'assignee:',item.assignee?? '');
        });
        // syntax: ▸ invoke(query, data?, user?, options?): Promise<IExecution>

        response = await api.engine.invoke({ "id": response.instance.id, "items.elementId": 'Request'},
            {   RequestReason:"Feels Like it",
                LeaveType:"Sick",
                StartDate:"2024-05-16",
                EndDate:"2024-05-22"},
            user1);

        console.log('---------------------------- after Request ');

        response.instance.items.forEach(item=>{
            console.log('   item:',item.seq,item.elementId,'status:',item.status,'assignee:',item.assignee?? '-');
        });

    let manager1 = new SecureUser({userName:'manager1',userGroups:['Manager']});

    let list=await api.data.findItems({ "items.status": 'wait', "items.type":'bpmn:UserTask' },manager1);
        
        list.forEach(item=>{
                console.log('findItems: item: ',item.elementId,'model',item.processName,'caseId',item.data.caseId,
                'started:',item.startedAt.toISOString().split('T')[0],item.type);

        });    
    
        
        response = await api.engine.invoke(
            { "id": response.instance.id, "items.elementId": 'Approve'}, // query
            {   approval:"A" },     // data
            manager1);

        console.log('---------------------------- after Approve ');

        response.instance.items.forEach(item=>{
            console.log('   item:',item.seq,item.elementId,'status:',item.status,'assignee:',item.assignee?? '-');
        });

    return;
    
    }
   
