///@gateway.md
///# Call Activity:

///![BPMN Diagram](ebg1.png)

///Event Based Gateway launches all valid outbound flows, but once on event is completed, it must cancel the rest.

///```javascript

const { BPMNServer , DefaultHandler , Logger } = require("../../");
const { configuration } = require('../testConfiguration');


const logger = new Logger({ toConsole: true });

const server = new BPMNServer(configuration, logger, { cron: false });

let name = 't-throw-signals';

let process;
let response;
let instanceId;

Feature('Throwing Signals from t-throw-signals', () => {

        Scenario('All', () => {

            Given('Throw signals', async () => {
                await server.dataStore.deleteInstances({ "data.caseId": 5001 });
                response = await server.engine.start(name, { caseId: 5001 });
            });
            Then('signals 1 need to have caught 1:', async () => {
                var data = response.instance.data;
                console.log('data:', data);
                let instances1 = await server.dataStore.findInstances(
                    { name: 't-catch-signals1', "data.caseId": 5001 , "data.signal": 'signal-101' });
                let instances2 = await server.dataStore.findInstances(
                    { name: 't-catch-signals1', "data.caseId": 5001, "data.signal": 'signal-102' });
                let instances3 = await server.dataStore.findInstances(
                    { name: 't-catch-signals2', "data.caseId": 5001, "data.signal": 'signal-101' });
                let instances4 = await server.dataStore.findInstances(
                    { name: 't-catch-signals2', "data.caseId": 5001, "data.signal": 'signal-102' });

                expect(instances1.length).equals(1);
                expect(instances2.length).equals(1);
                expect(instances3.length).equals(1);
                expect(instances4.length).equals(1);

                console.log(instances1.length, instances2.length, instances3.length, instances4.length);
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
