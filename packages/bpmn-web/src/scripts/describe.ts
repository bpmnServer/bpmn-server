import fs from 'node:fs';
import path from 'node:path';
import { argv } from 'node:process';
import pug from 'pug';
import { configuration} from '../sample-app/configuration.js';
import { BPMNServer,BPMNAPI, Logger ,Definition} from "bpmn-server";
const logger = new Logger({ toConsole: false});
const server = new BPMNServer(configuration, logger, { cron: false });
const api = new BPMNAPI(server);

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

if (args.length<3)
    {
        console.log("Require 3 parameters: \n1) Model Name \n2) Format (json/md) \n3) filename ")
        process.exit(-1);
    }
    
    
    let outputFile= args[2];

    describe(args[0],args[1]);


async function describe(model,format) {

    var definition: Definition
    const server = new BPMNServer(configuration, logger, { cron: false });

    definition = await server.definitions.load(model);

    const json = JSON.parse(definition.getJson());

    if (format=='json') {
        fs.writeFileSync(outputFile,definition.getJson());
        console.log('file ',outputFile,' written');
            
        process.exit(0);
        return;
    }


   let svg = null;
   try {
       svg = await server.definitions.getSVG(model);

   }
   catch (ex) {

   }
   let text="<div>"+svg+"</div>";

   const templatePath = path.join(__dirname, '../views/includes/') ;
   text = text + pug.renderFile(templatePath+ 'modelDoc.pug', { docs:json });

   fs.writeFileSync(outputFile,text);
}
