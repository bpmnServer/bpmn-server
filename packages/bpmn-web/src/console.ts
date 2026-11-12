/**
 * The console: start processes, list and complete tasks, recover hung items, check locks, set passwords.
 *   an application: npm run cli (start({ console: true }));  bpmn-web itself: npm run cli (src/scripts/cli.ts)
 */
import { BPMNServer, dateDiff, SystemUser, BPMNAPI } from "bpmn-server";
import * as readline from "node:readline";
import FS from "node:fs";
import { UserService } from "./userAccess/UserService.js";

let server: BPMNServer;
let userService: UserService;
let api: BPMNAPI;

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
let cl: readline.Interface;
const pending: string[] = [];
let waiting: ((answer: string) => void) | null = null;
let ended = false;
// a command given on the command line (npm run cli -- cod asana): it runs, its words answering its questions in
// order (then the keyboard), and the console quits
let fromCommandLine = false;
function listen() {
cl = readline.createInterface({input: process.stdin, output: process.stdout,terminal:false});
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
}

const question = function(q):Promise<string> {

	// answered by the command line: the question and its answer
	if (fromCommandLine && pending.length) {
		const answer = pending.shift();
		if (q) console.log(`${String(q).trimEnd()} ${answer}`);
		return Promise.resolve(answer);
	}
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


/**
 * Runs the console on a server until the user quits (q), then exits the process. `args`: a command and the answers
 * to its questions (default: the words after --cli, as in `npm run cli -- cod asana`): it runs, then the console
 * quits; a yes/no question it does not answer is yes (the command line said so).
 */
export async function runConsole(bpmnServer: BPMNServer, args: string[] = commandLineArgs()) {
	server = bpmnServer;
	api = new BPMNAPI(server);
	userService = new UserService();
	listen();
	if (args.length) {
		fromCommandLine = true;
		pending.push(...args);
	}
	console.log('');
	await completeUserTask();
}

/** The words after --cli on the command line. */
export function commandLineArgs(argv = process.argv): string[] {
	const at = argv.indexOf('--cli');
	return at < 0 ? [] : argv.slice(at + 1).filter(word => word !== '--');
}

/** A yes/no question; from the command line, one its words do not answer is yes. */
async function confirm(q: string): Promise<boolean> {
	if (fromCommandLine && !pending.length) {
		console.log(q + ' yes (the command line)');
		return true;
	}
	return /^y/i.test((await question(q)).trim());
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
	console.log('	co	List connectors (coa add, cok set its key, coe enable/disable, cot test, cor refresh, cod delete, coc call)');
	console.log('	?	repeat this list');
	console.log('');
	console.log('From the command line, a command and its answers: npm run cli -- cod asana (then it quits)');

}
async function completeUserTask() {

	if (!fromCommandLine)
		menu();
  let option='';
  let command = '';
  let commands = 0;
  while(option!=='q')
  {
	// from the command line: its one command, then quit
	if (fromCommandLine && commands++ > 0)
		break;
	command= await question(fromCommandLine ? '' : 'Enter Command, q to quit, or ? to list commands');
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
			var users = await userService.findUsers({});
			console.log('users:\n name\t email\t userGroups');
			users.forEach(u => {
				console.log(`${u.userName} \t${u.email} \t ${u.userGroups}`)
			});
			console.log();
			break;
		case 'co': case 'coa': case 'cok': case 'coe': case 'cot': case 'cor': case 'cod': case 'coc':
			try {
				await connectorCommand(option);
			}
			catch (error) {
				console.log('error:', error.message);
			}
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
/**
 * The engine's own calls, where it has them (a launched server: docs/design/engine-isolation.md): a connector's key,
 * test and removal, locks, instances deleted. An embedded server has none: its own objects do it.
 */
const engineCalls = () => typeof (server.engine as any).releaseLocks === 'function' ? server.engine as any : null;
async function releaseLocks(instanceId?: string) {
	const engine = engineCalls();
	if (engine) return engine.releaseLocks(instanceId);
	await (server.dataStore.locker as any).delete(instanceId ? { id: instanceId } : {});
}

/** Connectors (docs/docs/connectors.md): REST APIs described by OpenAPI, which service tasks call. */
async function connectorCommand(option: string) {
	const connectors = server.connectors;
	const id = option === 'co' ? '' : (await question('Connector id: ')).trim();
	switch (option) {
		case 'co': {
			const list = await connectors.list();
			if (!list.length) console.log('No connectors: coa adds one');
			for (const c of list) {
				const ops = Object.values(c.operations);
				console.log(`${c.id}\t${c.enabled ? 'enabled' : 'DISABLED'}\t${c.name}\t${c.baseUrl}\t${ops.filter(Boolean).length}/${ops.length} operations`
					+ `\tkey: ${c.auth?.last4 ? `${c.auth.type} ...${c.auth.last4}` : 'none'}${c.test ? `\ttest: ${c.test.ok ? 'ok' : 'failed'} (${c.test.message})` : ''}`);
			}
			break;
		}
		case 'coa': {
			const where = (await question('OpenAPI document (a URL, or a file): ')).trim();
			const isFile = !/^https?:\/\//i.test(where);
			const baseUrl = (await question('Base URL (empty: the document\'s server): ')).trim();
			const name = (await question('Name (empty: the document\'s title): ')).trim();
			const added = await connectors.add({ id, name: name || undefined, baseUrl: baseUrl || undefined,
				...(isFile ? { document: FS.readFileSync(where, 'utf8') } : { source: where }) });
			const ops = Object.keys(added.operations);
			console.log(`added '${added.id}' (${added.baseUrl}): ${ops.length} operations: ${ops.join(', ')}`);
			break;
		}
		case 'cok': {
			const scheme = (await question('Security scheme (empty: the document\'s only one; or bearer, basic, apiKey:<header>): ')).trim();
			const key = await question('Key (basic: user:password): ');
			const how = scheme === 'bearer' || scheme === 'basic' ? { type: scheme as any }
				: scheme.startsWith('apiKey:') ? { type: 'apiKey' as const, in: 'header' as const, name: scheme.slice(7) } : scheme || undefined;
			const engine = engineCalls();
			// how it is sent, into the connector's file; the key itself to the engine, which encrypts it
			const updated = engine
				? (await connectors.setScheme(id, how as any, key.trim()), await engine.setConnectorKey(id, key.trim()))
				: await connectors.setKey(id, key.trim(), how);
			console.log(`key set for '${id}': ${updated.auth.type} ...${updated.auth.last4}`);
			break;
		}
		case 'coe': {
			const on = /^(y|yes|on|enable|true)$/i.test((await question('Enable it? (y/n): ')).trim());
			await connectors.update(id, { enabled: on });
			console.log(`'${id}' ${on ? 'enabled' : 'disabled'}`);
			break;
		}
		case 'cot': {
			const operation = (await question('Operation (empty: a GET that needs no input): ')).trim();
			const engine = engineCalls();
			const result = engine ? await engine.testConnector(id, operation || undefined) : await connectors.test(id, operation || undefined);
			console.log(`${result.ok ? 'ok' : 'failed'}: ${result.operation}: ${result.message}`);
			break;
		}
		case 'cor': {
			const file = (await question('A new document file (empty: read it again from its URL): ')).trim();
			const changed = await connectors.refresh(id, file ? FS.readFileSync(file, 'utf8') : undefined);
			console.log(`refreshed: added ${changed.added.join(', ') || 'none'}; removed ${changed.removed.join(', ') || 'none'}`);
			break;
		}
		case 'cod': {
			if (!await confirm(`Delete the connector '${id}'? (y/n): `)) break;
			const engine = engineCalls();
			// its file, then its key and test, the engine's
			let removed: boolean;
			if (engine) {
				const file = connectors.removeFile(id);
				removed = (await engine.connectorRemoved(id)) || file;
			}
			else
				removed = await connectors.remove(id);
			console.log(removed ? `'${id}' deleted` : `no connector '${id}'`);
			break;
		}
		case 'coc': {
			const operation = (await question('Operation: ')).trim();
			const input = await getCriteria('Input');
			const { status, output } = await connectors.call(`${id}/${operation}`, input ?? {});
			console.log(`HTTP ${status}`);
			console.log(JSON.stringify(output, null, 2));
			break;
		}
	}
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

	const { deletedCount } = await server.engine.deleteInstances({ name: name });

	console.log("Instances Deleted:", deletedCount);
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
			await releaseLocks();
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
						await releaseLocks(item.instanceId);
						await server.engine.deleteInstances({id: item.instanceId});
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

					await releaseLocks(item.instanceId);

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
