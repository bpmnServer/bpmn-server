import { BPMNServer,dateDiff, DefaultAppDelegate, Logger, SystemUser ,BPMNAPI} from "bpmn-server";
import { configuration} from '../sample-app/configuration';
import * as readline from "readline";
import "dotenv/config";
import { UserService } from "../userAccess/UserService";

const logger = new Logger({ toConsole: false});


const server = new BPMNServer(configuration, logger,{cron:false});

const userService =new UserService();

const api=new BPMNAPI(server);

//const cl = readline.createInterface(process.stdin,null);


function removeBS(str:string):string {
	if (str.indexOf('\b')===-1)
		return str;
	let l;
	while(str.indexOf('\b')>-1)
	{
		l=str.indexOf('\b');
		str=str.substring(0,l-1)+str.substring(l+1);

	}
	return str;

}
// one reader for the whole session: lines typed (or piped in) ahead of a question wait for it, and the end of
// the input quits
const cl = readline.createInterface({input: process.stdin, output: process.stdout,terminal:false});
const pending: string[] = [];
let waiting: ((answer: string) => void) | null = null;
let ended = false;
cl.on('line', line => {
	const answer = removeBS(line);
	if (waiting) {
		const res = waiting;
		waiting = null;
		res(answer);
	}
	else
		pending.push(answer);
});
cl.on('close', () => {
	ended = true;
	if (waiting) waiting('q');
});

const question = function(q):Promise<string> {

    console.log(q);
	if (ended)
		process.stdout.write('>');
	else {
		cl.setPrompt('>');
		cl.prompt();
	}

	if (pending.length)
		return Promise.resolve(pending.shift());
	if (ended)
		return Promise.resolve('q');
    return new Promise(res => { waiting = res; });
}


start();

async function start() {
	let option='';
	console.log('')
	completeUserTask();
}



function menu() {
	console.log('Commands:');
	console.log('	q	to quit');
	console.log('	s	start process ');
	console.log('	lo	list outstanding items');
	console.log('	li	list items');
	console.log('	l	list instances for a process');
	console.log('	di	display Instance information');
	console.log('	i	Invoke Task');
	console.log('	sgl	Signal Task');
	console.log('	msg	Message Task');
	console.log('	se	Start Event');
	console.log('	rs	Restart an Instance');
	console.log('	d	delete instnaces');
	console.log('	lm	List of Models');
	console.log('	lme	List of Model Events');
	console.log('	ck	Check locked instnaces');
	console.log('	re	Recover hung processes');
	console.log('	lu	List Users');
	console.log('	spw	Set User Password');
	console.log('	?	repeat this list');

}
async function completeUserTask() {

	menu();
  let option='';
  let command = '';
  while(option!=='q')
  {
	command= await question('Enter Command, q to quit, or ? to list commands');
	let opts=command.split(' ');
	option=opts[0];
	switch(option)
	{
		case '?':
			menu();
			break;
		case 're':
			await recover();
			break;
		case 'ck':
			await checkLocks();
			break;
		case 'lo':
			console.log("Listing Outstanding Items");
			await findItems({ "items.status": "wait"});
			break;
		case 'l':
			console.log("Listing Instances for a Process");
			await listInstances();
			break;
		case 'li':
			console.log("list items");
			await listItems();
			break;
		case 'di':
			await displayInstance();
			break;
		case 'i':
			console.log("invoking");
			await invoke();
			break;
		case 'rs':
			console.log("restarting a workflow");
			await restart();
			break;
				
		case 's':
			console.log("Starting Process");
			await startProc();
			break;
		case 'sgl':
			console.log("Signalling Process");
			await signal();
			break;
		case 'msg':
			console.log("Message Process");
			await message();
			break;
		case 'se':
			console.log("Start Event");
			await startEvent();
			break;
	
		case 'd':
			console.log("deleting");
			await delInstances();
			break;
		case 'lm':
			console.log("listing Models");
			var list=await server.definitions.getList({});
			list.forEach(m=>{console.log(m.name);});
			console.log();

			break;
		case 'lme':
			console.log("listing Models");
			var list = await server.definitions.findEvents({});
			console.log(list);
			break;
		case 'lu':
			console.log("listing Users");
			var list = await userService.findUsers({});
			console.log('users:\n name\t email\t userGroups');
			list.forEach(u => {
				console.log(`${u.userName} \t${u.email} \t ${u.userGroups}`)
			});
			console.log();
			break;
		case 'spw':
			console.log("setting user password");

			const userName = await question('UserName: ');
			const newPassword = await question('NewPassword: ');

			list = await userService.setPassword(userName, newPassword);
	}
  
  }


  console.log("bye");
	process.exit();

}
async function startProc()
{
  const name = await question('Please provide your process name: ');
  const taskData = await getCriteria('Please provide your Task Data: ');
  
  let response=await server.engine.start(name, taskData);

	console.log("Process " + name + " started:", 'InstanceId', response.id);
	return await displayInstance(response.id);
}
async function findItems(query) {
	var items = await server.dataStore.findItems(query);

	console.log(`processName	item.name	item.elementId	instanceId	item.id`);
	for (var i = 0; i < items.length; i++) {
		let item = items[i];
		console.log(`${item['processName']}	${item.name}	${item.elementId}	${item['instanceId']}	${item.id}`);
	}
	return items;

}
async function getCriteria(prompt) {
	const answer = await question(prompt+',in name value pair; example: items.status wait ');
	let str=''+ answer;

	if (str.trim()==='')
		return {};

	//const list = str.match(/li(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);//.match(/(?:[^\s"]+|"[^"]*")+/g);//str.split(' ');
	const list = str.split(/ +(?=(?:(?:[^"]*"){2})*[^"]*$)/g);
	
	if ((list.length % 2)!==0)
		{
			console.log("must be pairs");
			return await getCriteria(prompt);
		}

	let criteria = {};
	console.log(list);
	for (var i = 0; i < list.length; i += 2) {
		let key=list[i];
		if (key.startsWith('"'))
			key=key.substring(1,key.length-1);
		let val=list[i+1]
		if (val.startsWith('"'))
			val=val.substring(1,val.length-1);
		console.log(key,val);
		criteria[key] = val;
    }
	console.log(criteria);	

	return criteria;

}
async function listItems() {

	var criteria = await getCriteria("provide Items search criteria");
	var items = await server.dataStore.findItems(criteria)
	console.log(items.length);

	for (var j = 0; j < items.length; j++) {
		let item = items[j];
		console.log(`element: ${item.elementId} status: ${item.status}  processName: ${item['processName']} InstanceId: ${item['instanceId']}	id:	${item.id}`);
	}
}

async function listInstances() {
	var criteria = await getCriteria("Instances search criteria");

	let insts = await server.dataStore.findInstances(criteria,'full')

	for (var i = 0; i < insts.length; i++) {
		let inst = insts[i];
		console.log(`name: ${inst.name} status: ${inst.status}	instanceId:	${inst.id}
	startedAt: ${inst.startedAt} endedAt ${inst.endedAt}`, 'data:', inst.data);
	}
}

async function displayInstance(instanceId=null) {

	if (instanceId==null)
		instanceId = await question('Please provide your Instance ID: ');

	console.log("Displaying Instance Details for"+instanceId);

	let insts = await server.dataStore.findInstances({id: instanceId},'full')
	console.log(insts.length);
	for (var i = 0; i < insts.length; i++) {
		let inst = insts[i];
		var items = inst.items;
		console.log(`name: ${inst.name} status: ${inst.status}	instanceId:	${inst.id}
	startedAt: ${inst.startedAt} endedAt ${inst.endedAt}`,'data:', inst.data);
		for (var j = 0; j < items.length; j++) {
			let item= items[j];
			console.log(`element: ${item.elementId} status: ${item.status}	id:	${item.id}`);
		}
	}
}
async function invoke()
{
  const instanceId = await question('Please provide your Instance ID: ');
  const taskId = await question('Please provide your Task ID: ');
  let taskData = await question('Please provide your Task Data ');

  try {
		let response = await server.engine.invoke(
			{ id: instanceId, "items.elementId": taskId }
			, taskData);

		console.log("Completed UserTask:", taskId);

		return await displayInstance(response.id);
	}
	catch (exc) {
		console.log("Invoking task failed for:", taskId, instanceId);
		await findItems({ id: instanceId, "items.elementId": taskId });


    }
}

async function restart()
{
  const query=await getCriteria("Instance Search criteria");

	try {
		let response = await server.engine.restart(query,{},'');
		console.log(' Instance restarted: new Instance follows:');
		return await displayInstance(response.id);
	}
	catch (exc) {
		console.log("Invoking task failed for:", exc);

    }
}

async function signal() {
	const signalId = await question('Please provide signal ID: ');

	const signalData = await question('Please provide your Data');

	let response = await server.engine.throwSignal(signalId, signalData);

	console.log("Signal Response:", response);
}

async function message() {
	const messageId = await question('Please provide message ID: ');

	const messageData = await question('Please provide your Data');
	let response = await server.engine.throwMessage(messageId, messageData);

	if (response['id'])
		return await displayInstance(response['id']);
	else {
		console.log(' no results.');
		return null;
    }
}
async function startEvent()
{
  const instanceId = await question('Please provide your Instance ID: ');
  const nodeId = await question('Please provide start Event ID: ');
  const data = await getCriteria('provide input data');

	try {
		let response = await server.engine.startEvent(instanceId,nodeId,data);

		return await displayInstance(response.id);
	}
	catch (exc) {
		console.log("Invoking task failed for:", nodeId, instanceId);
    }
}



async function delInstances() {
	const name = await question('Please provide process name to delete instances for process: ');

	let response = await server.dataStore.deleteInstances({ name: name });

	console.log("Instances Deleted:", response['result']['deletedCount']);
}

async function checkLocks() {
	console.log('--- checking locks ---');
	var list = await server.dataStore.locker.list();
	if (list.length > 0) {
		console.log('current locks ...', list.length);
		for (var i = 0; i < list.length; i++) {
			let item = list[i];
			console.log('lock:', item.id, item.server, item.time,dateDiff(item.time));
		}
		const response = await question('delete all(Y/N?')
		if (response == 'Y' || response == 'y') {
			await server.dataStore.locker.delete({});
		}
	}

}

async function recover() {
	var query = { "items.status": "start" };

	var list = await server.dataStore.findItems(query);
	console.log("items to recover: " + list.length);
	if (list.length > 0) {

		for (var i = 0; i < list.length; i++) {
			let item = list[i];

//			if (item.type == 'bpmn:ScriptTask' || item.type == 'bpmn:ServiceTask') 
			{
				console.log();
				console.log('>Process:',item.processName, 'item:',item.elementId, item.type, item.startedAt, item.status,'since:',dateDiff(item.startedAt));

				const response = await question('\n\tRE-INVOKE this item(Y/N) or D to delete instance');

				if (response.toUpperCase()=='D') {

					console.log('deleting ',item.id);

					try {
						await server.dataStore.locker.delete({id: item.instanceId});
						await server.dataStore.deleteInstances({id: item.instanceId});
					}
					catch(exc) {
						console.log(exc);
					}
					
					console.log('deleted',item.id);
					console.log();

				}
				else if (response.toUpperCase() == 'Y') {
					console.log('invoking item',item.id);

					try {

					await server.dataStore.locker.delete({id: item.instanceId});

					let ret = await server.engine.invoke({ "items.id": item.id }, {}, null, { recover: true });
					console.log('done');
				}
				catch(exc) {
					console.log(exc);
				}
			}
			}

		}
	}
	else
		console.log('nothing to recover');

}
