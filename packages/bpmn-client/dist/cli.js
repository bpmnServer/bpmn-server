#!/usr/bin/env node
//import { BPMNClient } from "bpmn-client";
import { BPMNClient } from './index.js';
import * as readline from 'readline';
import dotenv from 'dotenv';
const res = dotenv.config();
const server = new BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);
const question = function (q) {
    const cl = readline.createInterface(process.stdin, process.stdout);
    console.log(q);
    cl.setPrompt('>');
    cl.prompt();
    return new Promise((res, rej) => {
        cl.on('line', answer => {
            answer = removeBS(answer);
            res(answer);
            cl.close();
        });
    });
};
function removeBS(str) {
    if (str.indexOf('\b') === -1)
        return str;
    let l;
    while (str.indexOf('\b') > -1) {
        l = str.indexOf('\b');
        str = str.substring(0, l - 1) + str.substring(l + 1);
    }
    return str;
}
completeUserTask();
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
    console.log('	es	Engine Status');
    console.log('	?	repeat this list');
}
async function completeUserTask() {
    menu();
    let option = '';
    var command;
    while (option !== 'q') {
        command = await question('Enter Command, q to quit\n\r');
        let opts = command.split(' ');
        option = opts[0];
        switch (option) {
            case '?':
                menu();
                break;
            case 'lo':
                console.log("Listing Outstanding Items");
                await findItems({ "items.status": "wait" });
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
                console.log("Displaying Instance Details");
                await displayInstance();
                break;
            case 'i':
                console.log("invoking");
                await invoke();
                break;
            case 's':
                console.log("Starting Process");
                await start();
                break;
            case 'sgl':
                console.log("Signalling Process");
                await signal();
                break;
            case 'msg':
                console.log("Message Process");
                await message();
                break;
            case 'rs':
                console.log("restarting a workflow");
                await restart();
                break;
            case 'se':
                console.log("Start Event");
                await startEvent();
                break;
            case 'lm':
                console.log("listing Models");
                var list = await server.definitions.list();
                list.forEach(m => { console.log(m['name']); });
                break;
            case 'es':
                console.log("Engine Status");
                var runnings = await server.engine.status();
                console.log(runnings);
                break;
            case 'd':
                console.log("deleting");
                await delInstances();
                break;
        }
    }
    console.log("bye");
}
async function getCriteria(prompt) {
    const answer = await question(prompt + ',in name value pair; example: items.status wait ');
    let str = '' + answer;
    if (str.trim() === '')
        return {};
    //const list = str.match(/li(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);//.match(/(?:[^\s"]+|"[^"]*")+/g);//str.split(' ');
    const list = str.split(/ +(?=(?:(?:[^"]*"){2})*[^"]*$)/g);
    if ((list.length % 2) !== 0) {
        console.log("must be pairs");
        return await getCriteria(prompt);
    }
    let criteria = {};
    console.log(list);
    for (var i = 0; i < list.length; i += 2) {
        let key = list[i];
        if (key.startsWith('"'))
            key = key.substring(1, key.length - 1);
        let val = list[i + 1];
        if (val.startsWith('"'))
            val = val.substring(1, val.length - 1);
        console.log(key, val);
        criteria[key] = val;
    }
    console.log(criteria);
    return criteria;
}
async function start() {
    const name = await question('Please provide your process name: ');
    let taskData = await getCriteria('Please provide your Task Data ');
    let response = await server.engine.start(name, taskData);
    console.log("Process " + name + " started:", 'InstanceId', response.id);
    return await displayInstance(response.id);
}
async function findItems(query) {
    var items = await server.datastore.findItems(query);
    console.log(`processName	item.name	item.elementId	instanceId	item.id`);
    for (var i = 0; i < items.length; i++) {
        let item = items[i];
        console.log(`${item['processName']}	${item.name}	${item.elementId}	${item['instanceId']}	${item.id}`);
    }
}
async function listItems() {
    const criteria = await getCriteria('provide items criteria');
    var items = await server.datastore.findItems(criteria);
    console.log(items.length);
    for (var j = 0; j < items.length; j++) {
        let item = items[j];
        console.log(`element: ${item.elementId} status: ${item.status}  processName: ${item['processName']} InstanceId: ${item['instanceId']}	id:	${item.id}`);
    }
}
async function listInstances() {
    const criteria = await getCriteria('provide instance criteria');
    let insts = await server.datastore.findInstances(criteria);
    for (var i = 0; i < insts.length; i++) {
        let inst = insts[i];
        console.log(`name: ${inst.name} status: ${inst.status}	instanceId:	${inst.id}
	startedAt: ${inst.startedAt} endedAt ${inst.endedAt}`, 'data:', inst.data);
    }
}
async function displayInstance(instanceId = null) {
    if (instanceId == null)
        instanceId = await question('Please provide your Instance ID: ');
    let insts = await server.datastore.findInstances({ id: instanceId });
    for (var i = 0; i < insts.length; i++) {
        let inst = insts[i];
        var items = inst.items;
        console.log(`name: ${inst.name} status: ${inst.status}	instanceId:	${inst.id}
	startedAt: ${inst.startedAt} endedAt ${inst.endedAt}`, 'data:', inst.data);
        for (var j = 0; j < items.length; j++) {
            let item = items[j];
            console.log(`element: ${item.elementId} status: ${item.status}	id:	${item.id}`);
        }
    }
}
async function invoke() {
    const criteria = await getCriteria('provide item criteria');
    const taskData = await getCriteria('provide task data');
    try {
        let response = await server.engine.invoke(criteria, taskData);
        console.log("Completed UserTask:", criteria);
        return await displayInstance(response.id);
    }
    catch (exc) {
        console.log("Invoking task failed for:", criteria);
    }
}
async function startEvent() {
    const instanceId = await question('Please provide your Instance ID: ');
    const nodeId = await question('Please provide start Event ID: ');
    const data = await getCriteria('provide input data');
    try {
        let response = await server.engine.startEvent(instanceId, nodeId, data);
        return await displayInstance(response.id);
    }
    catch (exc) {
        console.log("Invoking task failed for:", nodeId, instanceId);
    }
}
async function signal() {
    const signalId = await question('Please provide signal ID: ');
    const data = await getCriteria('provide input data');
    let response = await server.engine.throwSignal(signalId, data);
    console.log("Signal Response:", response);
}
async function message() {
    const messageId = await question('Please provide message ID: ');
    const data = await getCriteria('provide input data');
    let response = await server.engine.throwMessage(messageId, data);
    if (response['id'])
        return await displayInstance(response['id']);
    else {
        console.log(' no results.');
        return null;
    }
}
async function restart() {
    const query = await getCriteria("Instance Search criteria");
    try {
        let response = await server.engine.restart(query, {}, '');
        console.log(' Instance restarted: new Instance follows:');
        return await displayInstance(response.id);
    }
    catch (exc) {
        console.log("Invoking task failed for:", exc);
    }
}
async function delInstances() {
    const criteria = await getCriteria('provide instance criteria');
    let response = await server.datastore.deleteInstances(criteria);
    console.log("Instances Deleted:", response['result']['deletedCount']);
}
//# sourceMappingURL=cli.js.map