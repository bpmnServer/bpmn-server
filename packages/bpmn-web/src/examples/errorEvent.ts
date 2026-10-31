import { configuration } from './';
import { BPMNServer, Logger } from './';
import { EventEmitter } from 'events';

const logger = new Logger({ toConsole: true });
//readMe();

test("B");
async function test(scenario) {
    console.log('test');
    const server = new BPMNServer(configuration, logger, { cron: false });
    let context;
    let response;


    context = await server.engine.start('error', { caseId: 1050, errorCode: "" });

    return;
    
    switch (scenario) 
    {
        case "A":
            context = await server.engine.start('Error events', { caseId: 1050, errorCode: "" });
            break;
        case "B":
            context = await server.engine.start('Error events', { caseId: 1051, Error_Code: "Error1" });
            break;
        case "C":
            context = await server.engine.start('Error events', { caseId: 1052, SubProcess_A: { Error_Code: "Error2" }});
            break;
    }
    
    console.log('cache : '+server.cache.list().length);
    server.cache.shutdown();
    console.log('cache : ' + server.cache.list().length);


    console.log('--- invoking waiting item '+context.execution.id);

    response = await server.engine.invoke({ id: context.execution.id, "items.elementId": 'UserTask1' }, { Error_Code: "Error1" });
    response = await server.engine.invoke({ id: context.execution.id, "items.elementId": 'UserTask2' }, { Error_Code: "Error1" });

    response.execution.report();

    await logger.save('errorEvent.log');

    return;

    const def = context.execution.definition;

    const startNode = def.getStartNode();
    const proc = startNode.process;
    proc.eventSubProcesses.forEach(p => {
        console.log('event subProc ' + p.id);
        console.log('start nodes ');
        p.getStartNodes().forEach(st => {console.log(st.id)});
    });


    console.log('Processes');
    def.processes.forEach(proc => { console.log('Process: ' + proc.id) });
    console.log('Nodes');
    def.nodes.forEach(node => {
        if (!node.isFlow) console.log('Node: ' + node.type + ":" + node.subType + node.id + ' proc:' + node.processId);
        if (node.type == 'bpmn:SubProcess' && node.def.triggeredByEvent) {
            console.log(node);
            console.log(node.def);
            console.log('-- start node ');
            const nodes = node.childProcess.getStartNodes();
            nodes.forEach(n => {
                console.log('startNode'+ n.type+ "subtype="+ n.subType);
            });
        }
    });
    return;
    def.eventSubProcesses.forEach(sp => {
        console.log(sp);
    });
    console.log('error handler');
//    console.log(def.getErrorSubProcessStart());
//    console.log(def.getJson());
//    context.execution.report();
    return;
    console.log(context);
    let out = await context.tillDone();


    console.log('return from start');
    return;


    console.log('return from start');
    return;
    //    console.log(response.items);
    response.items.forEach(item => { console.log(item.id); });

    // let us get the items
    const items = response.items.filter(item => {
        return (item.status == 'wait');
    });
    console.log('-------------------------------------');

    items.forEach(item => {
        console.log(`====  waiting for <${item.name}> -<${item.elementId}> id: <${item.id}> `);
    });
    console.log('Invoking Buy');
    console.log('ID:' + response.execution.id);
    //    return;

    const insts = await server.dataStore.findInstance({ id: response.execution.id }, {});
    console.log(insts.items);
    return;
    response = await server.engine.invoke({ id: response.execution.id, "items.elementId": 'Buy' },
        { model: 'Thunderbird', needsRepairs: false, needsCleaning: false });

    console.log("Ready to drive");
    console.log(response.items.length);
    return;
    let item = response.items.filter(item => {
        return (item.name == 'Drive');
    })[0];

    console.log('item: -------------');

    console.log(item.data);
    item.data = { cost: 45000 };
    console.log('item: -------------');
    console.log(item.data);

    response = await server.engine.invoke({ id: response.execution.id, "items.elementId": 'Drive' });

    console.log(`that is it!, process is now complete status=<${response.execution.status}>`)

    await logger.save('car.log');

}
async function readMe() {
    console.log("ReadMe");
    const server = new BPMNServer(configuration, logger);

    let response = await server.engine.start('Buy Used Car');

    // let us get the items
    const items = response.instance.items.filter(item => {
        return (item.status == 'wait');
    });

    items.forEach(item => {
        console.log(`  waiting for <${item.name}> -<${item.elementId}> id: <${item.id}> `);
    });
    console.log('response.execution.id');
    console.log(response.execution.id);

    console.log('Invoking Buy');

    response = await server.engine.invoke({ id: response.execution.id, "items.elementId": 'task_Buy' },
        { model: 'Thunderbird', needsRepairs: false, needsCleaning: false });

    console.log("Ready to drive");

    response = await server.engine.invoke({ id: response.execution.id, "items.elementId": 'task_Drive' });


    console.log(`that is it!, process is now complete status=<${response.execution.status}>`)

}