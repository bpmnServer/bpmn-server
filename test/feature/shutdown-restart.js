const config = require('../../configuration.js').configuration;
const Server = require("../../src/BPMNServer");
const Helper = require("../ServerHelper").ServerHelper;


const helper = new Helper();
let server= new Server.BPMNServer(config,helper.getLogger());


Feature('Shutdown and restart', () => {
  Scenario('All path', () => {
      let name;
      let execution, engine, instance, source;
      let item,itemUrl;
      name = 'Buy Used Car';

   Given('a process defintion is executed', async () => {
          execution = await server.execute(name);
      });
      
   When('I shutdown the server ', async () => {
       await server.shutdown();

      });
      and('My engine is stopped', () => {
          expect(execution.engine.state == 'stopped');
      });
      and('No live instances', () => {
          expect(Server.BPMNServer.getLives()).to.have.length(0);
      });

   When('I restart the server ', async () => {
          await server.restart();
      });


      and('Now I have some lives', async () => {
//          await helper.delay(2500, function () { console.log("done"); })
          helper.log("now checking how many are alive");
          console.log("got:" + Server.BPMNServer.getLives().length);
          expect(Server.BPMNServer.getLives()).not.to.have.length(0);

          assert(Server.BPMNServer.getLives().length > 0, 'should have more than 0 lives');
 
      });
      and('Now I should get my instance back', async () => {

          //console.log(execution);
          let myInstance = Server.BPMNServer.getLive(execution.instance.id);
//          expect(myInstance.instance.id).equal(execution.instance.id);

      });
      and('write log file', async () => {
          helper.log(__filename);
          helper.saveLog('shutdown-restart');
      });


  });
}); 

