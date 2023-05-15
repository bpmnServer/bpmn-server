///```javascript

const { BPMNServer, DefaultHandler, Logger } = require("../../");
const { configuration } = require('../testConfiguration');

const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);
var caseId = Math.floor(Math.random() * 10000);

let name = 'test-service-input';
let response;
let instanceId;

Feature('Service Input', () => {
    ///```
    ///## Do the task right-away
    ///```javascript
    Scenario('Start Process', () => {
        Given('Start ' + name + ' Process', async () => {
            response = await server.engine.start(name, { caseId: 1001 });
        });
        Then('check for output', () => {
            expect(response).to.have.property('execution');
            instanceId = response.execution.id;
            displayItems();
            var item = getItem('service1');
            console.log('item:',item.id,item.name);
            expect(getItem('service1').status).equals('end');
            //                expect(getItem('Expired-Timer').status).equals('wait');
            //                expect(getItem('Cancel-Message').status).equals('wait');

            let fileName = __dirname + '/../logs/' + name + '.log';

            and('write log file to ' + fileName, async () => {
                logger.save(fileName);
            });

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