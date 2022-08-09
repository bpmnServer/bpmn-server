const { BPMNServer, DefaultAppDelegate, Logger } = require("../../");
const { configuration } = require('../testConfiguration');


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);
console.log(configuration);

//=-=-=-==============================

let name = 'loop';

let response;
let needsRepairs = true;
let needsCleaning = true;
let items;

Feature('Loop', () => {
  Scenario('All path', () => {
    Given('a bpmn source with one user task',async () => {

        let data = { records: [1, 2, 3] };
        response = await server.engine.start(name, data);
        
    });

      and('User Task', async () => {
          let items = response.instance.items;
          expect(items.filter(i => i.elementId == 'script_task').length).equals(5);
          expect(items.filter(i => i.elementId == 'service_task').length).equals(5);
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