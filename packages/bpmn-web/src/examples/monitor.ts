import { BPMNServer, DefaultAppDelegate, Logger } from './';
import { CacheManager } from './';
import { configuration } from './';


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);
console.log(configuration);

//=-=-=-==============================
test();
async function test() {

let name = 'loop';

let context;
    let items;

    var caseId = 1000;
    await monitor('');
            let data = { records: [1, 2, 3] };
    context = await server.engine.start(name, { caseId: caseId++ }, null, null, { noWait: true });

    await server.engine.start(name, { caseId: caseId++ }, null, null, { noWait: true });
    await server.engine.start(name, { caseId: caseId++ }, null, null, { noWait: true });
    await server.engine.start(name, { caseId: caseId++ }, null, null, { noWait: true });
    const listener = server.listener;
    listener.on('all',async function ({ context, event, }) {

        let msg = '';
        if (context.instance.id)
            msg = '';// ' instanceId: ' + context.instance.id;
        if (context.item)
            msg += ' Item: ' + context.item.elementId;// + " itemId: " + context.item.id;
//        console.log('---Event: -->' + event + msg);
        await monitor(event + ' '+ context.instance.data.caseId + msg);

    });
    for (var i = 0; i < 1000; i++) {
//        await monitor();
//        delay(1000, 'test');
    }

    /*
                  delay(500, 'test');
                  items = context.items;
                  console.log(items.filter(i => i.element.id == 'scriptTask').length+" Should be 3");
                  console.log(items.filter(i => i.element.id == 'serviceTask').length+" should be 3");

            console.log('status:',context.execution.status);
     */   
}
async function monitor(reason) {
    

    var list=[];
    CacheManager.liveInstances.forEach(exec => {
        list.push({ instance: exec.instance, currentItem: exec.item, status: exec.instance.status });
    });

    var insT = 0, insR = 0, itmT = 0, itmR = 0, tokT = 0, tokR=0;
    for (var i = 0; i < list.length; i++) {
        var exec = list[i];
        var dInstance = null;
        insT++;
        tokT += exec.instance.tokens.length;
        if (exec.instance.status == 'running') insR++;


        /*
        if (exec.currentItem)
            console.log('Monitor '+reason+' instance:', exec.status,  'current item:', exec.currentItem.elementId, exec.instance.data.caseId);
        else if (exec.instance.data)
            console.log('Monitor ' + reason +' instance:', exec.status,  exec.instance.data.caseId);
        else
            console.log('Monitor ' + reason +' instance:', exec.status, );
        
        try {
            dInstance = await server.dataStore.findInstance({ id: exec.instance.id }, {});
            console.log(reason+' logs:',exec.instance.logs.length, dInstance.logs.length,dInstance.data.caseId);
            console.log(reason + ' items:', exec.instance.items.length, dInstance.items.length, dInstance.data.caseId);
            for (var j = 118; j < dInstance.logs.length; j++) {
//                console.log(dInstance.logs[j]);

            }
        }
        catch (exc) {
            console.log(reason + ' no instance ');
        }
        */

    }
    console.log(`${reason} ->Instances: Total: ${insT} Running: ${insR}`);// Tokens: ${tokT} `);
}

async function delay(time, result) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(result);
        }, time);
    });
}