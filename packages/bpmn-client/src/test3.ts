//import { BPMNClient } from "bpmn-client";
import { BPMNClient } from './';

import * as readline from 'readline';

const dotenv = require('dotenv');
const res = dotenv.config();

const cl = readline.createInterface( process.stdin, process.stdout );
const question = function(q) {
  return new Promise( (res, rej) => {
      cl.question( q, answer => {
          res(answer);
      })
  });
};

completeUserTask();

async function completeUserTask() {
  const server = new BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);

  const instanceId = await question('Please provide your Instance ID: ');
  const taskId = await question('Please provide your Task ID: ');
  let taskData = await question('Please provide your Task Data (json obj) if any: ');

  cl.close();

  if (taskData === ""){
      taskData = {};
  }else{
      taskData = JSON.parse(taskData.toString());
  }

  await server.engine.invoke(
      { id: instanceId, "items.elementId": taskId }
      , taskData);

  console.log("Completed UserTask:", taskId);
}