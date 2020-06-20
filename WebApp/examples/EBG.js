const { BPMNServer, DefaultAppDelegate, Logger } = require("../");
const { configuration } = require('../configuration');


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);


let name = 'Event Based Gateway';

let process;
let response;
let instanceId;

test();
async function test() {

            response = await server.execute(name, { reminderCounter: 0, caseId: 1005 });


            instanceId = response.execution.id;

/*           expect(getItem('timerEvent').status).equals('wait');
            expect(getItem('messageEvent').status).equals('wait');
            expect(getItem('Task_receive').status).equals('wait');
            expect(getItem('event_signal').status).equals('wait');
*/

            await delay(3000, 'test');

            response = await server.restore({ "id": instanceId });

/*            expect(getItem('timerEvent').status).equals('end');
            expect(getItem('messageEvent').status).equals('end');
            expect(getItem('Task_receive').status).equals('end');
            expect(getItem('event_signal').status).equals('end');
            expect(getItem('reminder').status).equals('wait');
*/
            const query = {
                instance: { id: instanceId },
                items: { elementId: 'reminder' }
            };
            response = await server.invoke(query, {});
            let fileName = __dirname + '/' + name + '.log';
            logger.save(fileName);
}
async function delay(time) {
    log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            log("delayed is done.");
            resolve();
        }, time);
    });
}
function log(msg) {
    logger.log(msg);
}
function getItem(id) {
    const item = response.items.filter(item => { return item.elementId == id; })[0]
    if (!item) {
        log('item ' + id + ' not found');
    }
    return item;
}