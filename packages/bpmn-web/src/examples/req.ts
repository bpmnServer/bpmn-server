import { USER_ROLE } from "./";

const { BPMNServer, DefaultAppDelegate, Logger  } = require("./");
const { BPMNAPI, SecureUser,SystemUser} = require("./");
const { configuration } = require('./');


const logger = new Logger({ toConsole: true});

//const bpmnServer = new BPMNServer(configuration, logger, { cron: false });

const bpmnServer = new BPMNServer(configuration);
//const API = new BPMNAPI(new BPMNServer(configuration));

//bpmnServer.engine.start('Issue124.bpmn',null,null);

//test2();
//test1();
async function sample() {
/* Most simple Script to start a process 
*/
const api = new BPMNAPI(new BPMNServer(configuration));

let response=await api.engine.start('Leave Request',{type:'Vacation'},SystemUser);

} /*
//testVacation();
//noWait();
class QueryToSQL{

	childName;
	constructor(childName) {
		this.childName = childName;
    }
    // condition is an object ,
    private expandCondition(condition,alias) {
		const keys=Object.keys(condition);
		for (let k=0; k< Object.keys(query).length;k++)  {
			const key=keys[k];
			let cond= query[key];
console.log('cond',cond,key);
			if (key==this.childName)
				sql= this.expandCondition(cond['$elemMatch'],this.childName);
			else if (key=='$or')
				pass = this.filterOr(cond);
            else if (alias)
                sql+=' and '+alias+'.'+key+'="'+cond+'"';
            else 
                sql+=' and '+key+'="'+cond+'"';
        }
        return sql;

    }
toSQL(query)
	{
        let sql='';
		console.log('--toSQL--', JSON.stringify(query),this.childName);
		let pass = true;
		const keys=Object.keys(query);
		for (let k=0; k< Object.keys(query).length;k++)  {
			const key=keys[k];
			let condition = query[key];
console.log('condition',condition,key);
			if (key==this.childName)
				sql= this.evaluateCondition(condition['$elemMatch'],this.childName);
			else if (key=='$or')
				pass = this.filterOr(condition);
            else
                sql+=' and '+key+'="'+condition+'"';

//			console.log('key:', key, 'pass', pass);
			if (!pass)
				break;
		}
        console.log(sql)
		return sql;

	}
	private filterOr(condition) {
		let pass = false;
		for (let c = 0; c < condition.length; c++) {
//			pass = this.filterItem(item, condition[c]);

		}
		return pass;
    }

	private evaluateCondition(condition) {
		let sql='';
		let pass = true;
		console.log('	evaluateCondition', condition);
		const keys = Object.keys(condition);
		for (let k = 0; k < keys.length; k++) {
			const key = keys[k];
			let cond = condition[key];
			console.log('key', key, condition[key]);
			if (key.includes('.')) {
				let ks = key.split('.');
				ks.forEach(k => {
//					val = val[k];
				});
			}
			else if (typeof cond === 'object' &&
				!Array.isArray(cond) &&
				cond !== null) {
				pass = this.parseComplexCondition(cond);
			}

//			console.log('		cond:', cond, key, i[key], pass);

			if (pass == false)
				return false;
		}
		return sql;
    }
	private parseComplexCondition(condition) 
	{
		let ret=false;
		Object.keys(condition).forEach(cond=>{
			let term=condition[cond];
            let oper;
			switch(cond) {
				case '$gte':
					oper='>='
					break;
				case '$gt':
					oper='>'
					
					break;
				case '$eq':
					oper='='
					
					break;
				case '$lte':
					oper='<='
					
					break;
				case '$lt':
					oper='<'
					break;
				case '$exists':
					oper='is not null'
					break;
				default:
					break;
				}
			if (ret==false)
				return false;
		});
		return ret;
	}

}
const trans=new QueryToSQL('items');

trans.toSQL({status:'wait'});
*/
options(); 

async function options() {

    const api = new BPMNAPI(new BPMNServer(configuration,new Logger({ toConsole: false}),{cron:false}));

    let options= {option1:1234}; //,option2:SystemUser};

    api.server.listener.on('all', async function ({ context, event, }) {
        if (event=='process.restored')
            {
            context.options=options;
            context.options['restored']=true;
            }
        if (event.startsWith('process.'))
            console.log('---Event: -->' + event, context.options);
        else if (event == 'start')
            console.log('---Event: -->' + event, 'item:', context.item.elementId, context.options,
                'input:', context.item.input);
        else if (event == 'transformInput') {
            console.log('---Event: -->' + event, 'item:', context.item.elementId,'input',context.item.input, context.options);

        }
        else
            console.log('---Event: -->'+event, 'item:',context.item.elementId,context.options ,
			'data:',context.item.data,'vars:',context.item.vars );
    });

    console.log('starting Leave Application with options:',options);
    console.log('---calling start----- ');

    let response = await api.engine.start('Leave Application', {reason:'I like it',type:'Vacation'}, SystemUser,
        options);

    console.log('---calling assign----- ');
    await api.engine.assign({ id: response.id, "items.elementId": 'Request' }, {},{}, SystemUser,options);


    console.log('---calling invoke----- ');
    await api.engine.invoke({ id: response.id, "items.elementId": 'Request' }, {duration:'20 days'}, SystemUser,options);

    console.log('---invoke Approve----- ');
    await api.engine.invoke({ id: response.id, "items.elementId": 'Approve' }, { }, SystemUser, options);

return;
}
async function noWait() {
    const api = new BPMNAPI(new BPMNServer(configuration,new Logger({ toConsole: false}),{cron:false}));

    console.log('starting serviceTask');
    let response=await api.engine.start('serviceTask', { v1: 1, v2: 2 }, SystemUser, {noWait:true});
    //the above will return immediatly after creatign the instance
    console.log('immediate response id',response.instance.id);

}
async function testVacation() {


    let user1 =new SecureUser({ userName: 'user1', userGroups: ['Owner', 'Others']});
    let user2 = new SecureUser( { userName: 'user2', userGroups: ['Owner', 'Others'] });
    let user3 = new SecureUser( { userName: 'stranger', userGroups: ['Employee'] });
    let userSupervisor = new SecureUser({ userName: 'Supervisor', userGroups: ['Owner', 'Others'] });
    
    let api = new BPMNAPI(bpmnServer);
    console.log('starting');

    setListener();
    let options= {Option1:1234,Option2:user3};
    let response = await api.engine.start('Leave Application', {reason:'I like it',type:'Vacation'}, user1,
        options);

return;
    console.log(`>  let response = await api.engine.start('Leave Application', { reason: 'I like it', type: 'Vacation' }, user1);`);

    report(response.instance);
    console.log('---------------- started -----------data:',JSON.stringify(response.instance.data));

    let requestItem=response.instance.items[response.instance.items.length-1];

    console.log(' check canInvoke and canAssign');
    
    console.log(requestItem);
    [user1,user2,user3]
        .forEach(user=>{
        console.log('--------------');
        console.log(user);
        console.log('can invoke:',user.canInvoke(requestItem));
        console.log('can assign:',user.canAssign(requestItem));
    });
    response = await api.engine.invoke({ id: response.id, "items.elementId": 'Request' }, {duration:'20 days'}, user1);
    
    report(response.instance);

return;


    response = await api.engine.assign({ id: response.id, "items.elementId": 'Request' }, {"vars.test":'test2'}, { duration: '10 days' }, user1);
    console.log(`>  response = await api.engine.assign({ id: response.id, "items.elementId": 'Request' }, { duration: '10 days' }, {},user1);`);
    console.log('---------------- Assigned -----------data:', JSON.stringify(response.instance.data));

    console.log('---------------- Trying with user2 with catch-----------');
    const items = await api.data.findItems({ id: response.id, "items.elementId": 'Request' },SecureUser.SystemUser());
    const item = items[0];
    const can1 = await user1.canInvoke(item);
    const can2 = await user2.canInvoke(item)
    console.log('can innvoke',item,can1,can2);
    try {
        response = await api.engine.invoke({ id: response.id, "items.elementId": 'Request' }, {duration:'20 days'}, user2);
        report(response.instance);
    }
    catch (exc) {
        console.log('exc msg', exc.message, 'name', exc.name);
        if ((exc.message).includes('query produced no items'))
            console.log('OK');
        //console.log(exc.code,JSON.stringify(exc));
    }
    /*
    console.log('---------------- Trying with user2 w/o catch-----------');

    response = await api.engine.invoke({ id: response.id, "items.elementId": 'Request' }, {}, user2);
    report(response.instance);




    console.log('try again');
    */
    console.log('---------------- Re-Trying with user1 -----------');

    response = await api.engine.invoke({ id: response.id, "items.elementId": 'Request' }, {"vars.test3":'test3',duration:'20 days'}, user1);
    console.log(`>    response = await api.engine.invoke({ id: response.id, "items.elementId": 'Request' }, {duration: '20 days'}, user1);
`);
    console.log('---------------- Requested -----------data:', JSON.stringify(response.instance.data));
    report(response.instance);

    console.log('---------------- Trying Approve -----------');

    response = await api.engine.invoke({ id: response.id, "items.elementId": 'Approve' }, {},userSupervisor);
    report(response.instance);


    logger.save('req.log');



}
function report(instance) {
    instance.items.forEach(item => {
        console.log('--item',item.seq,item.elementId,item.type,item.status,item.userName,'assignee:',item.assignee,item.candidateUsers,item.candidateGroups,item.dueDate);
    });
}

function setListener() {
    const listener = bpmnServer.listener;

    listener.on('all', async function ({ context, event, }) {

        let msg = '';
        if (context.item)
            msg += ' Item: ' + context.item.elementId;// + " itemId: " + context.item.id;

        console.log('---Event: -->' + event + msg,'options:',context.options);

    });


}