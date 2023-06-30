const { BPMNServer, Execution, DefaultAppDelegate, Logger, ServerContext } = require("../../");

const { configuration } = require('../testConfiguration');

const logger = new Logger({ toConsole: false });


//=-=-=-==============================

let name = 'messageFlow';
let server;
let response;
let items;

Feature('messageFlow', () => {
  Scenario('All path', () => {
    Given('a bpmn source with one user task', () => {
       
          server = new BPMNServer(configuration, logger);        
    });

    When('a process defintion is executed', async () => {

        response = await server.engine.start(name, null, 'StartEvent_1');

    });

      and('Case Complete', async () => {
          expect(response.execution.status).equals('end');
      });


      and('write log file to' + name + '.log', async () => {
          let fileName = __dirname + '/../logs/' + name + '.log';
          logger.save(fileName);
      });


  });
}); 


async function delay(time, result) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(result);
        }, time);
    });
}