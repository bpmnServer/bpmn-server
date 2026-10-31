import { exec } from 'child_process';

import { SystemUser, USER_ROLE } from "bpmn-server";
import { configuration} from '../sample-app/configuration';
import { BPMNServer,BPMNAPI, Logger, Definition ,SecureUser } from "bpmn-server";
import { inherits } from 'util';
const logger = new Logger({ toConsole: false});
const server = new BPMNServer(configuration, logger, { cron: false });
const api = new BPMNAPI(server);
let user = new SecureUser({userName:'user1',userGroups:[USER_ROLE.ADMIN]});

if (process.argv.length<3)
{
    console.log("Require 2 parameters: 1) daysToArchive 2) daysToCleanArchive")
    process.exit(-1);
}
console.log(process.argv);

let date=new Date();
let days=parseInt(process.argv[2]);
let archiveDays=parseInt(process.argv[3]);

console.log(days,archiveDays);
date.setDate(date.getDate() -archiveDays);

console.log('will archive all instances before ',date);

let archiveDate:Date=new Date();
archiveDate.setDate(archiveDate.getDate()- archiveDays);

console.log('will delete all archives before ',date)


console.log(date);

server.dataStore.archive({endedAt: { $lte: date}});
let ds=server.dataStore;
ds.db.remove(ds.dbConfiguration.db,ds.db.dbConfiguration.Archive_collection,{endedAt:{$lte:archiveDate}});

process.exit(0);
