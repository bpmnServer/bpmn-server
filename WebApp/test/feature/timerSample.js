const { BPMNServer, Execution, DefaultAppDelegate, Logger, ServerContext } = require("../../");

const { configuration } = require('../testConfiguration');

const logger = new Logger({ toConsole: false });


//=-=-=-==============================

let name = 'timer-sample';
let server;
let response;
let items;

Feature('TimerSample', () => {
  Scenario('All path', () => {
    Given('a bpmn source with one user task', () => {
       
          server = new BPMNServer(configuration, logger);        
    });

    When('a process defintion is executed', async () => {

         response=await server.engine.start(name, null);

    });
      and('wait a bit ', async () => {
          server.cron.checkTimers();
          await delay(4500, 'test');
          response = await server.engine.restore({ id: response.execution.id });
          items = response.items;
      });

      and('Case Complete', async () => {
          logger.log('---case complete status:' + response.execution.status);
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