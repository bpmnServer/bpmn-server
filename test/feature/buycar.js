const config = require('../../configuration.js').configuration;
const Server = require("../../src/BPMNServer");
const Helper = require("../ServerHelper").ServerHelper;


const helper = new Helper();
let bpmnServer = new Server.BPMNServer(config,helper.getLogger());

let server, name;
let execution, engine, instance, source;
let item, itemUrl;

Feature('Buy Used Car', () => {
  Scenario('All path', () => {
    name = 'Buy Used Car';
    Given('a bpmn source with one user task', () => {
       // server = new BPMNServer.BPMNServer(config);
        server = bpmnServer;
    });

    When('a process defintion is executed', async () => {
        execution = await server.execute(name);
    });

    let state;
      Then('check for output to have engine', () => {
          expect(execution).to.have.property('engine');
          expect(execution).to.have.property('instance');
          expect(execution).to.have.property('events');
      });


      and('Buy the car', async () => {
          await invoke('Buy', { model: 'Thunderbir' });
      });
      and('Clean it', async () => {
          await invoke('Clean');
      });
      and('Repair it', async () => {
          await invoke('Repair');
      });
      and('Drive it', async () => {
          await invoke('Drive');
      });
      
      and('Case Complete', async () => {
          let waiting = await server.findItems(
              { instanceId: execution.instance.id, status: 'wait'});
          expect(waiting).to.have.length(0);
      });

      and('write log file to' + name + '.log', async () => {
          helper.dumpInfo(execution);
          helper.saveLog('buycar');
      });


  });
}); 

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
        instanceId: execution.instance.id, status: 'wait', name: name  },data);

    list = await server.findItems(
        { instanceId: execution.instance.id, name: name  });
    item = list[0];
//    expect(item.status).to.equal('end');
    if (item.status != 'end')
        helper.log(`-- expecting error items status is '${item.status}' should be 'end'`);

    helper.log(`--- after invokeing <${name}>`);
    helper.dumpInfo(execution);
    helper.log(`--------------------`);

}
