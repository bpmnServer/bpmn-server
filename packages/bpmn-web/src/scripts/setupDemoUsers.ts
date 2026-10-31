import { SystemUser } from '../';
import { configuration } from '../sample-app/configuration.js';
import { BPMNServer, Logger ,SecureUser,BPMNAPI} from '../';

import { UserService } from "../userAccess/UserService";
  

const logger = new Logger({ toConsole: false });
const server = new BPMNServer(configuration, logger, { cron: false });
const userService =new UserService();

const dburl=server.dataStore.dbConfiguration.db; // process.env.MONGO_DB_URL;

const db=server.dataStore.db;


addUsers();
  
async function addUsers() {


      await userService.addUser('user1', 'user1@mySite.com', 'user1', ['Employee']);
      await userService.addUser('user2', 'user2@mySite.com', 'user2', ['Employee']);
      await userService.addUser('manager1', 'manager1@mySite.com', 'manager1', ['Employee','Manager']);
      await userService.addUser('manager2', 'manager2@mySite.com', 'manager2', ['Employee','Manager']);

      await db.createIndex(dburl,'usersManager' , { employee: 1 }, { unique: true });

      await addRelation('user1','manager1');
      await addRelation('user2','manager1');


}
async function addRelation(user,manager) {
    try {
        await db.insert(dburl,'usersManager',[{employee:user,manager:manager}]);
      }
      catch(exc) {
        if (exc.code==11000)
            console.log('record already exists for',user,manager);
        else  
            console.log('msg:',exc.message,'code:',exc.code,exc);
      }

}
