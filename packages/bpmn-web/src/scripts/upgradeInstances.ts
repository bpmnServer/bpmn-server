import { exec } from 'node:child_process';

import { SystemUser, USER_ROLE } from "bpmn-server";
import { configuration} from '../sample-app/configuration.js';
import { BPMNServer,BPMNAPI, Logger, Definition ,SecureUser } from "bpmn-server";
import { inherits } from 'node:util';
const logger = new Logger({ toConsole: false});
const server = new BPMNServer(configuration, logger, { cron: false });
const api = new BPMNAPI(server);
let user = new SecureUser({userName:'user1',userGroups:[USER_ROLE.ADMIN]});


////////////////////
// Import the required modules
import { argv } from 'node:process';

// Function to parse command-line arguments
function parseArguments(args) {
  const parsedArgs = [];
  let currentArg = '';
  let inQuotes = false;

  args.forEach(arg => {
    if (arg.startsWith('"') || arg.startsWith("'")) {
      inQuotes = true;
      currentArg = arg.slice(1);
    } else if (inQuotes && (arg.endsWith('"') || arg.endsWith("'"))) {
      currentArg += ' ' + arg.slice(0, -1);
      parsedArgs.push(currentArg);
      currentArg = '';
      inQuotes = false;
    } else if (inQuotes) {
      currentArg += ' ' + arg;
    } else {
      parsedArgs.push(arg);
    }
  });

  return parsedArgs;
}

// Get the command-line arguments, excluding the first two (node and script path)
const rawArgs = process.argv.slice(2);

// Parse the arguments to handle quotes
const args = parseArguments(rawArgs);

// Output the parsed arguments
console.log('Parsed arguments:', args);

//////////////////////


//  syntax: 
/**
 *  model       name of model to be applied
 *  afterNode   nodeId to check if instances already started
 *    
 */
if (args.length<2)
{
    console.log("Require 2 parameters: \n1) Model Name \n2) afterNodeId ")
    process.exit(-1);
}

upgrade(args[0],args.splice(1));
/**
 * 
 * @param model 
 * @param afterNodeIds
 */
async function upgrade(model,afterNodeIds) {
    console.log(" upgrading ",model," after",afterNodeIds);

//    server.dataStore.archive({endedAt: { $lte: date}});
    const results=await server.engine.upgrade(model,afterNodeIds);

    console.log(results);
    
    process.exit(0);
    
}
