///```javascript

const { BPMNServer, DefaultHandler, Logger } = require("../../");
const { configuration } = require('../testConfiguration');

const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);
//var caseId = Math.floor(Math.random() * 10000);

let name = 'test-service-input';
let response;
let caseId = 6001;
let instanceId;
let fileName = __dirname + '/../logs/' + name + '.log';

Feature('Service Input', () => {
    ///```
    ///## Do the task right-away
    ///```javascript
    Scenario('Start Process', () => {
        Given('Start ' + name + ' Process', async () => {
            response = await server.engine.start(name, { caseId: caseId });
        });
        Then('check for status', () => {
            expect(response).to.have.property('execution');
            instanceId = response.execution.id;
            displayItems();
            var item = getItem('service1');
            console.log('item:',item.id,item.name);
            expect(getItem('service1').status).equals('end');
            //                expect(getItem('Expired-Timer').status).equals('wait');
            //                expect(getItem('Cancel-Message').status).equals('wait');


        });
        Then('check for query', async () => {

            query = { "data.caseId": caseId, "items.vars.param1": 'value1' };
            items = await server.dataStore.findItems(query);
            console.log('items count',items);
        });

        and('write log file to ' + fileName, async () => {
            logger.save(fileName);
        });

    });
});

function log(msg) {
    logger.log(msg);
}
function displayItems() {
    console.log('instance data:', response.instance.data);
    response.instance.items.forEach(item => {

        log(`${item.elementId} -  ${item.status} - Item ${item.id} - input ${JSON.stringify(item.input)} - data ${JSON.stringify(item.data)}`);   
    });

}
function getItem(id)
{
    return response.instance.items.filter(item => { return item.elementId == id; })[0];
}