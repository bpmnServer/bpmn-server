
const config = require('../configuration.js').configuration;
const Server = require("../src/BPMNServer");
const Helper = require("../test/ServerHelper").ServerHelper;


const helper = new Helper();
let bpmnServer = new Server.BPMNServer(config, helper.getLogger());


let server, name;
let execution, engine, instance, source;

server = bpmnServer;

test();
async function test() {

            let item, itemUrl;
            name = 'Cash Request';

            server = bpmnServer;
            execution = await server.execute(name);

            await invoke('User Request', {});
            await invoke('Approval', { approval: 'yes' });
            let waiting = await server.findItems(
                { instanceId: execution.instance.id, status: 'wait' });
            helper.dumpInfo(execution);
            helper.saveLog('cashRequest');

}

async function invoke(name, data = {}) {

    helper.log(`-----invokeing <${name}> ---------------`);
    let list = await server.findItems({ instanceId: execution.instance.id, name });
    item = list[0];

    if (!item)
        helper.log(`-- expecting error items not found`);
    else if (item.status != 'wait')
        helper.log(`-- expecting error items status is ${item.status} should be 'wait'`);
    //    expect(item.status).to.equal('wait');


    execution = await server.invoke({
        instanceId: execution.instance.id, status: 'wait', name: name
    }, 'rhanna', data);

    list = await server.findItems(
        { instanceId: execution.instance.id, name: name });
    item = list[0];
    //    expect(item.status).to.equal('end');
    if (item.status != 'end')
        helper.log(`-- expecting error items status is '${item.status}' should be 'end'`);

    helper.log(`--- after invokeing <${name}>`);
    helper.dumpInfo(execution);
    helper.log(`--------------------`);

}
