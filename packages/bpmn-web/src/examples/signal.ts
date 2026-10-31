
import { configuration } from './';
import { BPMNServer,BPMNAPI, Logger, SecureUser } from './';

const logger = new Logger({ toConsole: false});
const server = new BPMNServer(configuration, logger, { cron: false });
const api = new BPMNAPI(server);
let user = new SecureUser({userName:'user1',userGroups:['admin']});


testSignal();

async function testSignal() {

    let name = 'signal';
    console.log('starting ',name);
    //  delete existing cases
    await api.data.deleteInstances({caseId:1001},user);

    //  start the process
    let response = await api.engine.start(name, {caseId:1001},user);
    report(response.instance);

    console.log('--------------------');

    // throw the signal - once only     - should be caught by 3 items
    //  we restrict the signal to only one particualr caseId:1001

    let instances = await api.engine.throwSignal('Cancel_All',{},{"data.caseId":1001},user);
    
    console.log(`sigal was caught by ${instances.length} items`);

    for(let  i=0;i<instances.length;i++){
        let item=await api.data.findItem({"items.id":instances[i].itemId},user);
        console.log(`-Item  ${item.elementId} - ${item.status}  was invoked by the signal`);
    }

}
function report(instance) {
    var item1 = instance.items.forEach(item => {
        console.log(`- ${item.elementId} - ${item.status} `);
    })
}

