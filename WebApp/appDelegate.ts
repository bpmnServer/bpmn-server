import {  Item, FLOW_ACTION , NODE_ACTION, IExecution  } from './';
import { DefaultAppDelegate } from './index';

const fs = require('fs');

var seq = 1;

class MyAppDelegate extends DefaultAppDelegate{
    winSocket;
    constructor(server) {
        super(server);
        this.servicesProvider = new MyServices();
    }
    /**
    * is fired on application startup
    **/
    async startUp(options) {

        await super.startUp(options);
		if (options['cron'] == false) {
			return;
		}

        console.log('myserver started.. checking for incomplete processes');

        var query = { "items.status": "start" };

        var list = await this.server.dataStore.findItems(query);
        if (list.length > 0) {

            this.server.logger.log("...items query returend " + list.length);
            for (var i = 0; i < list.length; i++) {
                let item = list[i];
                //console.log('-->',item.processName,item.elementId,item.type,item.startedAt,item.status);
                if (item.type=='bpmn:ScriptTask' || item.type=='bpmn:ServiceTask' )
                {
                    console.log('item needs recovering:',item.elementId,item.name,item.processName,item.startedAt);
                    //let response =await this.server.engine.invoke({"items.id":item.id}, {},null, {recover:true});
                }
            }
        }

    }

    sendEmail(to, msg, body) {

        console.log(`Sending email to ${to}`);

        const key = process.env.SENDGRID_API_KEY;

        if (key && (key != '')) {
            const sgMail = require('@sendgrid/mail')
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)

            const email = {
                to: to,
                from: 'ralphhanna@hotmail.com', // Change to your verified sender
                subject: msg,
                text: body,
                html: body
            }

            sgMail
                .send(email)
                .then((response) => {
                    this.server.logger.log('responseCode', response[0].statusCode)
                    this.server.logger.log('responseHeaders', response[0].headers)
                })
                .catch((error) => {
                    console.error('Email Error:' + error)
                })

        }
        else {
            console.log(`email is disabled`);
        }

    }

    async executionStarted(execution: IExecution) {
        await super.executionStarted(execution);
    }

    async executionEvent(context, event) {

        if (context.item) {

//            console.log(`----->Event: '${event}' for ${context.item.element.type} '${context.item.element.id}' id: ${context.item.id}`);
//            if (event == 'wait' && context.item.element.type == 'bpmn:UserTask')
//                console.log(`----->Waiting for User Input for '${context.item.element.id}' id: ${context.item.id}`);
        }
 //       else
 //           console.log('----->All:' + event, context.definition.name);

    
    }
    async messageThrown(messageId, data, matchingQuery, item: Item) {
        await super.messageThrown(messageId, data, matchingQuery,item);
    }
    async signalThrown(signalId, data, matchingQuery, item: Item) {
        await super.signalThrown(signalId, data, matchingQuery, item);
    }
    async serviceCalled(input, context) {
        this.server.logger.log("service called");

    }
}

async function delay(time, result) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(result);
        }, time);
    });
}
import * as readline from 'readline';
const cl = readline.createInterface(process.stdin, process.stdout);
const question = function (q) {
    return new Promise((res, rej) => {
        cl.question(q, answer => {
            res(answer);
        })
    });
};
class MyServices {
    async promptUser(input, context) {
        console.log('executing prompt user');

        var result = await question("continue?");
        console.log('result:', result);
        return null;

    }
    async serviceTask(input, context) {
        let item = context.item;
        console.log(" Hi this is the serviceTask from appDelegate");
        console.log(item.elementId);
        await delay(5000, 'test');
        console.log(" Hi this is the serviceTask from appDelegate says bye");
    }
    async simulateCrash(input, context) {
        let item = context.item;
        let data = item.token.data;
        if (data['crash']=='Yes')
        {
         data['crash']='No';
         await item.token.execution.save();
         console.log('Will Crash now',item.token.data);
         process.exit(100);
        }
        else
            console.log('no crash');
    }
    async add({ v1, v2 }) {
        console.log("Add Service", v1, v2);

        return Number(v1) + Number(v2);
    }
    async service99() {
        console.log('>>>>>>>>>>appDelegate service99');
    }
    async notifyhead() {
        console.log('>>>>>>>>>>appDelegate notifyhead');
    }
    async service1(input, context) {
        let item = context.item;
        let wait=5000;
        if (input.wait)
            wait=input.wait;
        item.vars = input;
        seq++;
        await delay(wait, 'test');
        item.token.log("SERVICE 1: input: " + JSON.stringify(input)+ item.token.currentNode.id + " current seq: " + seq);

        console.log('appDelegate service1 is now complete input:',input, 'output:',seq,'item.data',item.data);
        return { seq , text: 'test' };
    }
    async DummyService1(input, context) {
        context.item.data.service1Result = 'Service1Exec';
    }

    async DummyService2(input, context) {
        await delay(126000, '2.1mins'); // Wait for 2.1 mins
        context.item.data.service2Result = 'Service2Exec';
    }
}
export {MyAppDelegate}