/*console.log('start');

import { ScriptHandler } from '../';

class Item {
    id = 2;
    name = 'test';
    data = { 'v1': 1, 'v2': 2 ,requester:'user1'};
    input = this.data;
    output = this.data;
    token = new Token();

}
class Token { execution = new Execution(); appDelegate = null; startNodeId=111; }
class Execution { 
    servicesProvider = new ServicesProvider();appDelegate= new ServicesProvider();
 }
class ServicesProvider {
    helper;
    constructor() {
        this.helper=this;
    }
    async getSupervisorUser(input, context) {
        return input + 'Supervisor';
    } 
    test1(input,context) {
        return input;
    }
    dateAdd(date,amount,period) {
        return period;
    }
}

var myscope = new Item();

    var scripts = [
        ['S', `console.log(this);`],
        ['X', `$(this.data.v1 + this.data.v2)`],
        ['X', `$(this.data.v1 == this.data.v2)`],
        ['X', `$(this.data.v1 + this.data.v2)>0`],
        ['X', `$(this.data.v1 + this.data.v2)<4`],
        ['X', `$this.data.v1 + 4`],
        ['X', `$this.data.name + "testing"`],
        ['X', `$appServices.test1(100)`],
        ['X', `$appServices.getSupervisorUser('user1')`],
        ['X', `$appServices.dateAdd(item.dateStarted,10,'days')`],
        ['T', `user1`],
        ['T', `$(appServices.test1(100))`],
        ['T', `$(appServices.getSupervisorUser('user1'))`],
        ['T', `abc,xyz,user group`],
        ['TD', `2022-10-11`],
        ['T', `$new Date('2022-10-11')`],
        ['T', `$appServices.helper.dateAdd(item.dateStarted,10,'days')`],
        ['S', `console.log('from inside');console.log('done');return 55;`],
        ['S', `appServices.getSupervisorUser('user1')`],
        ['S', `return(appServices.test1(100))`],
        ['S', `return(appServices.getSupervisorUser('user1'))`],
    ];
async function testScripter() {

    var script;
    var ret;
    var  token = new Token();

    console.log(myscope.token.execution, myscope.token.execution.servicesProvider,token);


    script = `$(this.data.v1+this.data.v2)`;
    console.log('eval script:', script, 'ret:', ScriptHandler.evaluateExpression(token, script));


    script = `$(this.data.v1+this.data.v2)`;
    ret = (await ScriptHandler.evaluateExpression(myscope, script));
    console.log('expression script:', script, 'ret:', ret);

    script = `console.log(this,data,input)`;
    console.log('expression script:', script, 'ret:', await ScriptHandler.executeScript(token,script));


    script = `#(appServices.getSupervisorUser(this.data.requestor))`;
    console.log('expression script:', script, 'ret:', await ScriptHandler.evaluateExpression(myscope, script));

}
async function runScripts(scripts, scope) {
	var l;
	for(l=0;l<scripts.length;l++)
	{
        try {
    	    const test=scripts[l];
	      const type=test[0];
	      const script=test[1];
	      switch(type){
		      case 'T':
			    var ret=await ScriptHandler.evaluateInputExpression(myscope, script);
			    console.log('Input Expression:', script, 'ret:',ret);
		      break;
		      case 'TD':
			    var ret=await ScriptHandler.evaluateInputExpression(myscope, script,true);
			    console.log('Expression:', script, 'ret:',ret);
		      break;
		      case 'X':
			    var ret=await ScriptHandler.evaluateExpression(myscope, script);
			    console.log('eval script:', script, 'ret:',ret);
	  
		      break;
		      case 'S':
			    var ret=await ScriptHandler.executeScript(myscope, script);
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
runScripts(scripts,myscope);

testScripter();
async function asyncFunction()
{
		var ret=await ScriptHandler.executeScript(myscope,  `console.log(111);return 55;`);
        console.log('async function ret',ret);
        return ret;
}
async function main() {

console.log('----');
}

//main();
*/