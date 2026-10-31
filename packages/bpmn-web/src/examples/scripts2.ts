    console.log('start');

    import { ScriptHandler } from '../';

    import { configuration } from './';
    import { BPMNServer, Logger, Definition } from './';
    import { inherits } from 'util';
    //import { MyDelegate } from './test2.js';
    const logger = new Logger({ toConsole: false});
    const server = new BPMNServer(configuration, logger, { cron: false });


    let process;
    let response;
    let instanceId;

    var myscope;
    var scripts = [
        ['S', `data.v1=1;data.v2=2;`,55],
        ['S', `console.log(data,input);return 55;`,55],
        ['S', `data.v1=1;data.v2=2;`,55],
        ['X', `$(this.data.needsCleaning + this.data.needsRepairs)`,'YesYes'],
        ['X', `$(this.data.v1 == this.data.v2)`,true],
        ['X', `$(this.data.v1 + this.data.v2)>0`,false],
        ['X', `$(this.data.v1 + this.data.v2)<4`,false],
        ['X', `$this.data.v1 + 4`],
        ['X', `$this.data.starterUserId + "testing"`],
        ['X', `$appServices.echo(100)`],
        ['X', `$appServices.getSupervisorUser('user1')`],
        ['X', `$appUtils.dateAdd(item.dateStarted,10,'days')`],
        ['T', `user1`],
        ['T', `$(appServices.echo('abc'))`],
        ['T', `$(appServices.getSupervisorUser('user1'))`],
        ['T', `abc,xyz,user group`],
        ['TD', `2022-10-11`],
        ['T', `$new Date('2022-10-11')`],
        ['T', `$appUtils.dateAdd(item.dateStarted,10,'days')`],
        ['S', `console.log('from inside');console.log('done');return 55;`],
        ['S', `appServices.getSupervisorUser('user1')`],
        ['S', `return(appServices.echo(100))`],
        ['S', `return(appDelegate.sendEmail('user1','testing','just a test'))`],
        ['S', `return(appServices.getSupervisorUser('user1'))`],
    ];

    async function runCar() {

        await server.dataStore.deleteInstances({ "data.caseId": 1050 });
        const listener = server.listener;

        listener.on('end',async function ({ context, event }) {
            if (context.item.elementId=='task_clean' && event=='end') {
                    console.log('==========>'+event+" "+ context.item.elementId);
                    //console.log(context.item);
                    myscope=context.item;
                    await runScripts(scripts,context.item);
                    myscope=context.item.token;
                    await runScripts(scripts,context.item.token);
                    }
        });


        let response = await server.engine.start('Buy Used Car', { caseId: 1050 }, null, 'user1');

        response = await server.engine.invoke({ id:response.id, "items.elementId": 'task_Buy' },
            { needsCleaning: "Yes", needsRepairs: "Yes" });

        await server.engine.invoke({ id:response.id, "items.elementId": 'task_repair' });

        response=await server.engine.invoke({ id:response.id, "items.elementId": 'task_clean' });

}

async function testScripter() {

    var script;
    var ret;
    var  token = myscope.token;

    var scriptHandler= myscope.token.execution.scriptHandler;

    console.log(myscope.token.execution, myscope.token.execution.servicesProvider,token);


    script = `$(this.data.v1+this.data.v2)`;
    console.log('eval script:', script, 'ret:', scriptHandler.evaluateExpression(myscope, script));


    script = `$(this.data.v1+this.data.v2)`;
    ret = (await scriptHandler.evaluateExpression(myscope, script));
    console.log('expression script:', script, 'ret:', ret);

    script = `console.log(this,data,input)`;
    console.log('expression script:', script, 'ret:', await scriptHandler.executeScript(token,script));


    script = `#(appServices.getSupervisorUser(this.data.requestor))`;
    console.log('expression script:', script, 'ret:', await scriptHandler.evaluateExpression(myscope, script));

}
async function runScripts(scripts, myscope) {
	var l;
    var scriptHandler= myscope.token.execution.scriptHandler;
	for(l=0;l<scripts.length;l++)
	{
        try {
    	    const test=scripts[l];
	      const type=test[0];
	      const script=test[1];
	      switch(type){
		      case 'T':
			    var ret=await scriptHandler.evaluateInputExpression(myscope, script);
			    console.log('Input Expression:', script, 'ret:',ret);
		      break;
		      case 'TD':
			    var ret=await scriptHandler.evaluateInputExpression(myscope, script,true);
			    console.log('Expression:', script, 'ret:',ret);
		      break;
		      case 'X':
			    var ret=await scriptHandler.evaluateExpression(myscope, script);
			    console.log('eval script:', script, 'ret:',ret);
	  
		      break;
		      case 'S':
			    var ret=await scriptHandler.executeScript(myscope, script);
			    console.log('Script:', script, 'ret:',ret);
	  
		      break;
	      }
        }
    catch(exc)
        {
            console.log('My error',exc);
        }
	}
}

//testScripter();
main();
async function main() {
    await runCar();
    console.log('myscope',myscope.id);
//    runScripts(scripts,myscope);

}
