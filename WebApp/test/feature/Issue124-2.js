///@gateway.md
///# Call Activity:

///![BPMN Diagram](ebg1.png)

///Event Based Gateway launches all valid outbound flows, but once on event is completed, it must cancel the rest.

///```javascript

const { BPMNServer , DefaultHandler , Logger } = require("../../");
const { configuration } = require('../testConfiguration');


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger, { cron: true });

let name = 'test-throw';

let process;
let response;
let items;
let instances;
let caseId = 5501;
Feature('Test-Throw Test-Catch', () => {

        Scenario('All', () => {

            Given('Throw signals', async () => {
                await server.dataStore.deleteInstances({ "data.caseId": caseId });
                response = await server.engine.start(name, { caseId: caseId});
            });
            Then('find 1 item waiting:', async () => {
                items= await server.dataStore.findItems(
                    { name: 'test-throw', "data.caseId": caseId , "items.status": 'wait' });
                expect(items.length).equals(1);
            });
            Then('invoke the item:', async () => {
                response = await server.engine.invoke({ "items.id": items[0].id });
                //console.log('instance2', response.instance.items);
                delay(5000);
            });
            Then('find test-catch invoked and complete:', async () => {
                instances = await server.dataStore.findInstances({
                    name: 'test-catch', "data.caseId": caseId
                    
                });
                console.log('test-catch:', instances);
                expect(instances.length).equals(1);
            });
            let fileName = __dirname + '/../logs/throw-catch.log';

            and('write log file to ' + fileName, async () => {
                logger.save(fileName);
                //                console.log('filename:', __filename);
            });

        });

}); 
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
function getItem(id)
{
    const item = response.instance.items.filter(item => { return item.elementId == id; })[0]
    if (!item) {
        log('item ' + id + ' not found');
    }
    return item;
}

///```
