import { BPMNServer, DefaultAppDelegate, Logger } from '..';
import { configuration } from './';
import { IAppDelegate } from './';


const logger = new Logger({ toConsole: true });

const server = new BPMNServer(configuration, logger);
console.log(configuration);

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

    let name = 'msgThrow';
    console.log(name);

    let response = await server.engine.start(name, { caseId: caseId });

    var item1 = response.instance.items.filter(item => { 
        return (item.elementId == 'throw_msg1');
    });

    console.log(item1);

    response.logger.save('msgs.log');

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