
import { configuration } from './';
import { BPMNServer, Logger } from './';

const logger = new Logger({ toConsole: false });
const server = new BPMNServer(configuration, logger);
let response;
let name = 'Issue 196';

test();

async function test() {


    // we execute a process by name; in this case 'Buy Used Car'

    response = await server.engine.start(name);
    let instanceId=response.instance.id;
            response = await server.engine.start(name, {});
            response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT1',"items.itemKey":"1"});
            response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT1',"items.itemKey":"2"});
            response=await server.engine.invoke({id:response.id,"items.elementId":'Event_Cancel',"items.itemKey":"2"});
            
    report();
    console.log('end.')
    logger.save('issue233.log');
    return;
 
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