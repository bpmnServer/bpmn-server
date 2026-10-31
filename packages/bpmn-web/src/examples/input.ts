const { BPMNServer, DefaultAppDelegate, Logger } = require("./");
const { BPMNAPI, SecureUser } = require("./");

const { configuration } = require('./');

const logger = new Logger({ toConsole: false });
const bpmnServer=new BPMNServer(configuration, logger, { cron: true });

checkInput();

async function checkInput() {
    console.log('starting');

    let definition = await bpmnServer.definitions.load('Check Input');

    const json = JSON.parse(definition.getJson());


    let response = await bpmnServer.engine.start('Check Input', { reason: 'I like it', type: 'Vacation' });
    console.log(response.instance.data);

    json.elements.forEach(el => {
        console.log();
        console.log('Element:', el.id, el.type, el.name,el.docs);
        el.description.forEach(desc => {
            console.log('-', desc);
        });
        el.behaviours.forEach(desc => {
            console.log('>', desc);
        });
    });

    return;

}
function report(instance) {
    instance.items.forEach(item => {
        console.log('--item', item.seq, item.elementId, item.type, item.status, item.userName, item.assignee, item.candidateUsers, item.candidateGroups, item.dueDate);
    });
}
