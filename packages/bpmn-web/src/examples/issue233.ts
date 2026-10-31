
import { configuration } from './';
import { BPMNServer, Logger } from './';

const logger = new Logger({ toConsole: false });
const server = new BPMNServer(configuration, logger);
let response;
test();

async function test() {


    // we execute a process by name; in this case 'Buy Used Car'

    response = await server.engine.start('Issue 233');
    let instanceId=response.instance.id;
    response = await server.engine.invoke({"items.elementId": 'Activity_0s1j60f',"id":instanceId  });
    report();
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

    report();
    console.log('end.')
    logger.save('issue233.log');
    return;
    report();

    response = await server.engine.invoke({"items.elementId": 'Activity_F',"id":instanceId,"items.status":"wait" });
    response = await server.engine.invoke({"items.elementId": 'Activity_Z',"id":instanceId,"items.status":"wait"});

    report();

    //    response = await server.engine.invoke({"items.id": itemId  },
//        { model: 'Thunderbird', needsRepairs: false, needsCleaning: false });
 
}
async function reportItems(qry) {
    console.log('-----------------------------------');
    let items=await server.dataStore.findItems(qry);
    items.forEach(item=>{
        console.log(`   item query <${ item.name }> -<${ item.elementId }> id: <${ item.instanceId }>  ${item.status} -key: <${item.itemKey}>`);

    });
}

function report() {
    console.log('-----------------------------------');
    response.instance.items.forEach(item => {
        console.log(`  item# ${item.seq} -<${ item.elementId }> id: <${ item.id }>  ${item.status} - ${item.itemKey}`);
    });

}