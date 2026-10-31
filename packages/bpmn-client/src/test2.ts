import { BPMNClient2 } from './';

test();
async function test() {
        const dotenv = require('dotenv');
        dotenv.config();
        console.log('env:',process.env.HOST, process.env.PORT, process.env.API_KEY);

        var caseId = Math.floor(Math.random() * 10000);

        let user={userName:"John",userGroups:['employee']};

        let name = 'Buy Used Car';
        let response;
        let instanceId;

        let options={noWait:true};

        const server1 = new BPMNClient2(process.env.HOST, process.env.PORT, process.env.API_KEY);

        response = await server1.engine.start(name, {caseId: caseId},user,options);
        console.log(response.id);

        response = await server1.engine.invoke({id: response.id , "items.elementId": 'task_Buy' },null,user,options);
        console.log('invoked',response.id);

}
async function importModel() {

    console.log('from client lib');
	try {
//    const server = new BPMNClient('localhost', 3000, '12345');

        const dotenv = require('dotenv');
        dotenv.config();
        console.log('env:',process.env.HOST, process.env.PORT, process.env.API_KEY);

        const server = new BPMNClient2(process.env.HOST, process.env.PORT, process.env.API_KEY);

    var name = 'test-import';
    var file = '..\\WebApp\\processes\\Trans.bpmn';
    var file2 = '..\\WebApp\\processes\\Trans.svg';

    var res=await server.model.import(name, file,file2,{});
    return res;
	}
	catch(exc)
	{
		console.log('*******ERROR********');
		console.log(exc);
	}
}