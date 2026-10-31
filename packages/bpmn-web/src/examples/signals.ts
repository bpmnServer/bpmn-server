import { BPMNServer, DefaultAppDelegate, Logger } from '..';
import { configuration } from './';


const logger = new Logger({ toConsole: true });

const server = new BPMNServer(configuration, logger, { cron: true });

var caseId = Math.floor(Math.random() * 10000);


//=-=-=-==============================
test();
/*
 *          
 * 
 */


/** 
 *      threee scenarios:
 *          1.  input/output rules
 *          2.  trigger scripts
 *          3.  none - use entire data
 * */


async function test() {

    let name = 't-throw-signals';// 'test-throw';
    console.log(name);
    //name = 't-loop-std';
    //name = 'test-throw';
    let resp = await server.engine.throwSignal('Signal-101', { caseId: caseId });
    return;

    let response = await server.engine.start(name, { caseId: caseId });

    
    await server.engine.invoke({
        id: response.instance.id,
        "items.elementId": 'pick_hotel'
    });

    var item1 = response.instance.items.forEach(item => {
        console.log(`- ${item.elementId} - ${item.status} `);
    })



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