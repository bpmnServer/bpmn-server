'use strict';

const Helper = require('./testHelper.js');
const Server = require("../src/Server");

const config = require('../configuration.js').configuration;

const helper = new Helper.TestHelper();
let server, instance;

// test();
async function test() {
    let name = 'Buy Used Car';
    server = new Server.BPMNServer(config);
    let results = await server.execute(name, { caseId: 999 });
    let instance = results.instance;
    let items =  results.items;
    let engine = results.engine;
    console.log("instance");
    console.log('instanceId:'+ instance.id+" items "+ items.length);
    let waiting = await server.findItems({ instanceId: instance.id, status: 'wait', data: { caseId: 999 } });
    if (waiting.length > 0) {
        let item = waiting[0];
        console.log(`item ${name} is waiting - let us invoke it`);
        let newResults= await server.invoke({ instanceId: instance.id, status: 'wait', name: 'Buy Car' }
            , { model: 'Thunderbird' });
        console.log("new results");
//        console.log(newResults);
    }
    else {
        console.log("Error something went wrong");
    }
}


console.log(config);

Feature('Buy Used Car', () => {
  Scenario('All path', () => {
      let server,  name;
      let results, engine, instance, source;
      let item,itemUrl;
      name = 'Buy Used Car';
    Given('a bpmn source with one user task', () => {
        server = new Server.BPMNServer(config);
    });

    Given('an engine with source', () => {

    });

    When('a process defintion is executed', async () => {
        results = await server.execute(name);
    });

    let state;
      Then('check for output to have engine', () => {

          expect(results).to.have.property('engine');
    });
      and('check for output to instance', () => {

          expect(results).to.have.property('instance');
      });
      and('check for output to have items', async () => {

          expect(results).to.have.property('items');
      });

      and('Query on items from db', async () => {

          let waiting = await server.findItems(
              { instanceId: results.instance.id, status: 'wait', name: 'Buy Car' });
          expect(waiting).to.have.length(1);
          item = waiting[0];
      });
      and('Check Url for Pending Item', async () => {
          //itemUrl = item.getUrl();

      });
      and('Invoke Pending Item', async () => {
          
          let newResults = await server.invoke({ instanceId: results.instance.id, status: 'wait', name: 'Buy Car' }
              , { model: 'Thunderbird' });

      });


  });
}); 