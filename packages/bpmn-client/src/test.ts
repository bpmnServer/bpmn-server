import { BPMNClient } from './';

test1();
async function test1() {
        const dotenv = require('dotenv');
        dotenv.config();
        console.log('env:',process.env.HOST, process.env.PORT, process.env.API_KEY);

        const server1 = new BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);
        
        let insts=await server1.datastore.findInstances({},{"name":1,"data":1});
        console.log(insts);
}
async function testLong() {
        console.log('testlong');
        const dotenv = require('dotenv');
        dotenv.config();
        console.log('env:',process.env.HOST, process.env.PORT, process.env.API_KEY);

        var caseId = Math.floor(Math.random() * 10000);

        let name = 'test-concurrency';
        let response;
        let instanceId;
        let userId='user1';

        let options={noWait:true};

        const server1 = new BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);

        response = await server1.engine.start(name, {caseId: caseId},null,userId);
        console.log(response.id,response);
        response.items.forEach(item=>{console.log(item.id,item.name,item.type,item.status);});

        response = await server1.engine.invoke({id: response.id , "items.elementId": 'UserLong' },null,userId,options);
        console.log('invoked userLong',response.items.length);

        response = await server1.engine.invoke({id: response.id , "items.elementId": 'UserShort' },null,userId,options);
        console.log('invoked userShort',response.items.length);

}

async function test() {
        const dotenv = require('dotenv');
        dotenv.config();
        console.log('env:',process.env.HOST, process.env.PORT, process.env.API_KEY);

        var caseId = Math.floor(Math.random() * 10000);

        let name = 'Buy Used Car';
        let response;
        let instanceId;
        let userId='user1';

        let options={noWait:true};

        const server1 = new BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);
        const server2 = new BPMNClient(process.env.HOST, 3030, process.env.API_KEY);

        response = await server1.engine.start(name, {caseId: caseId},null,userId,options);
        console.log(response.id);

        response = await server2.engine.invoke({id: response.id , "items.elementId": 'task_Buy' },null,userId,options);
        console.log('invoked',response.id);


}
async function importModel() {

    console.log('from client lib');
	try {
//    const server = new BPMNClient('localhost', 3000, '12345');

        const dotenv = require('dotenv');
        dotenv.config();
        console.log('env:',process.env.HOST, process.env.PORT, process.env.API_KEY);

        const server = new BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);

    var name = 'test-import';
    var file = '..\\WebApp\\processes\\Trans.bpmn';
    var file2 = '..\\WebApp\\processes\\Trans.svg';

    var res=await server.definitions.import(name, file,file2);
    return res;
	}
	catch(exc)
	{
		console.log('*******ERROR********');
		console.log(exc);
	}
}