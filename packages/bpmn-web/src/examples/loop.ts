import { BPMNServer, DefaultAppDelegate, EXECUTION_EVENT, Logger } from '../.';
import { configuration } from './';


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);

let response;

//=-=-=-==============================
test();
async function test() {

    let name = 'loop';
    
    let context;
        let items;
    
    
        server.listener.on(EXECUTION_EVENT.process_end,
            function ({ context, event, }) {
                console.log(`----->Event: ${event}`, context.instance.id);
            });
    
        let data = {};// records: [1, 2, 3] };
        response = await server.engine.start(name, data);
    
        list();
        return;
    
                      delay(500, 'test');
                      items = response.instance.items;
    //console.log('items:',context.instance.items);
    
                      console.log(items.filter(i => i.elementId == 'scriptTask').length+" Should be 3");
                      console.log(items.filter(i => i.elementId == 'serviceTask').length+" should be 3");
    
                console.log(response.execution.status);
            
                let fileName = __dirname + '/' + name + '.log';
                logger.save(fileName);
    }
    
    
async function test2() {

let name = 'loop2';

let context;
    let items;


    server.listener.on(EXECUTION_EVENT.process_end,
        function ({ context, event, }) {
            console.log(`----->Event: ${event}`, context.instance.id);
        });

    let data = {};// records: [1, 2, 3] };
    context = await server.engine.start(name, data);


                  delay(500, 'test');
                  items = context.instance.items;
//console.log('items:',context.instance.items);

                  console.log(items.filter(i => i.elementId == 'scriptTask').length+" Should be 3");
                  console.log(items.filter(i => i.elementId == 'serviceTask').length+" should be 3");

            console.log(context.execution.status);
        
            let fileName = __dirname + '/' + name + '.log';
            logger.save(fileName);
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
function list() {

    response.getItems().forEach(item=>{
        console.log('item:',item.seq,item.elementId,item.itemKey,item.status,item.endedAt);
    });

}