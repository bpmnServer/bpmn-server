
import { configuration } from './';
import { BPMNServer, Logger } from './';

const logger = new Logger({ toConsole: false });
const server = new BPMNServer(configuration, logger);
let response;
test();

async function test() {


    // we execute a process by name; in this case 'Buy Used Car'

    response = await server.engine.start('loop1');
    let instanceId=response.instance.id;
    //response = await server.engine.invoke({"items.elementId": 'Activity_0s1j60f',"id":instanceId  });
    await report();
    await reportItems({"items.elementId": 'Activity_18dzrjx',"id":instanceId ,"items.status":"wait","items.itemKey":"1.1" });
    response = await server.engine.invoke({"items.elementId": 'Activity_18dzrjx',"id":instanceId ,"items.status":"wait","items.itemKey":"1.1" });
    response = await server.engine.invoke({"items.elementId": 'Activity_18dzrjx',"id":instanceId ,"items.status":"wait","items.itemKey":"1.2" });

    report();

    logger.save('issue233-1.log');
 
}
/*
```
The instance Items should look like this:

![Completed Process](buyUsedCarWithItems.png)
*/
async function reportItems(qry) {
    console.log('-----------------------------------');
    let items=await server.dataStore.findItems(qry);
    items.forEach(item=>{
        console.log(`   item query <${ item.name }> -<${ item.elementId }> id: <${ item.instanceId }>  ${item.status} -key: <${item.itemKey}>`);

    });
}
async function report() {
    console.log('-----------------------------------');

    response.instance.items.forEach(item => {
        console.log(`  item <${ item.name }> -<${ item.elementId }> id: <${ item.id }> ${item.type} - ${item.status} - <${item.itemKey}>`);
    });

}