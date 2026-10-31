import { configuration }  from './';
import { BPMNServer,BPMNAPI,SecureUser, Logger, Process, SubProcess, TOKEN_TYPE } from '..';


const logger = new Logger({ toConsole: false });
const server:BPMNServer = new BPMNServer(configuration, logger, { cron: false }); 
const api:BPMNAPI = new BPMNAPI(server);
const user:SecureUser = new SecureUser({userName:'user1',userGroups:['Employee']});
const listener = server.listener;


/*    let self = this;
    server.listener.on('all', async function (eventApi) {
        await self.executionEvent(eventApi);
    });
    */
listener.on('all', async function ({ context, event, }) {
    return;
    if (context.item)
        console.log(`----->Event: '${event}' for ${context.item.element.type} '${context.item.element.id}' id: ${context.item.id} Instance: ${context.instance.id}`);
    else
        console.log('----->All:' + event, context.definition.name);

        if (context.item && event=='wait')
        {
            console.log(' start item',context.item.node.id);
            let ex=context.execution;
            let items=ex.getItems();
            items.forEach(item=>{console.log(item.node.id);});
//            console.log(res.length);

        }

    });


listener.on('wait', function ({ object, event }) {
          console.log('----->Wait:' + event);
    });
console.log('---------------------- noWait-invoke.ts')
test(server);

async function test(server)
{
    console.log('-------------------------------------------------')
    let res = await api.engine.start('test-wait-invoke', {},user);

    console.log('about to invoke with noWait option')
    res=await api.engine.invoke({ "id": res.instance.id, "items.elementId": 'Activity_0z113lq'},{},user,{noWait:true}),
    console.log(`invoked`,res.item.element.type,res.item.status);

    report(res.instance);

    /*
    await new Promise(function (resolve) {
        setTimeout(function () {
            console.log(`after wait`);

            report(res.instance);
                }, 500);
    });
    */
    console.log("Invoking script is all Done");
}

function report(instance) {
    instance.items.forEach(item => {
        console.log('--item',item.seq,item.elementId,item.type,item.status,item.userName,'assignee:',item.assignee,item.candidateUsers,item.candidateGroups,item.dueDate);
    });
}
