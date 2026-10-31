import * as readline from 'node:readline';
import axios from 'axios';
import { ApprovalManager } from './ApprovalManager.js';

const cl = readline.createInterface(process.stdin, process.stdout);
const question = function (q) {
    return new Promise((res, rej) => {
        cl.question(q, answer => {
            res(answer);
        })
    });
};
async function delay(time, result) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(result);
        }, time);
    });
}

// var seq = 0;
class AppServices {
    appDelegate;
    constructor(delegate) {
        this.appDelegate = delegate;
    }
    async echo(input, context) {
        console.log('service echo - input', input);
        context.item.data['echo']=input;
        return input;
    }

  async webService(
    method: 'GET' | 'POST',
    url: string,
    data?: any,
    headers?: Record<string, string>
      ): Promise<any> {
        try {
        const defaultHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...headers, // merge user-provided headers
        };

        const options: RequestInit = {
            method,
            headers: defaultHeaders,
        };

        if (method === 'POST' && data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
        } catch (error) {
        console.error('❌ Service call failed:', error);
        throw error;
        }
    }

    async webService2(input,context) {

        let url='http://localhost:5000/run';
        let data={ a: 2, b: 3 };

        let res=await axios.post(url, data) 
        console.log('Result from Python:', res.data);

    }
    /**
        * Sample Code for Leave Application 
    * to demonstrate how to access DB and return results into scripts
    * This is called as such:
        *  	assignee	#(appServices.getSupervisorUser(this.data.requester))
    * 
        * @param userName
    * @param context 
    * @returns 
    */

    async service99() {
        console.log('>>>>>>>>>>appDelegate service99');
    }
    async notifyhead() {
        console.log('>>>>>>>>>>appDelegate notifyhead');
    }
    async getCollection(token) {
        console.log('get collection',token.currentNode.id);
        return ['A','B','C'];

    }
    async flowCondition(input) {
        console.log('flow condition',input);
        return false;

    }
    getTimerDelay(item) {
        // item passed is that of the boundary event
        // need to find parent item
        const parentItem = item.token.parentToken.currentItem;
        const priority= parentItem.priority;
        if (priority === 'high') {  
            return 'PT5S'; // 5 Seconds ISO 8601 duration format
        } else if (priority === 'medium') {
            return 'PT10S'; // 10 Seconds ISO 8601 duration format
        } else if (priority === 'low') {
            return 'PT15S'; // 15 Seconds ISO 8601 duration format
        }
    }
    async add({v1,v2},context)
    {
        console.log('add',v1,v2);
        return Number.parseInt(v1)+Number.parseInt(v2);
    }
 
    IsApprovalDone(context) {

        if (context.itemKey==null)
            return false;

        let keys=context.itemKey.split('.');
        let stage=keys[0];

        let allItems=context.token.execution.getItems();
    
        let completed={};
        allItems.forEach(item=>{
          if (item.itemKey && item.status==='end' && item.endedAt!==null && item.type=='bpmn:UserTask' && item.itemKey.startsWith(stage+'.'))
          { 
            let team=item.itemKey.split('.')[1];
            let count=0;
            if (completed[team])
                count=completed[team];
            count++;
            completed[team]=count;
          }
        });

        console.log(completed);
        let ret=ApprovalManager.isStageApproved(stage,completed);
        console.log(ret);
        return ret;
      
    }
    async getApprovers(stage) {

        let items=[];
        let requiredTeams=ApprovalManager.getRequiredTeams(stage);
        
        for (const [team, approvers] of Object.entries(requiredTeams))
        {
            console.log(`- ${team}: ${approvers} approvers required`);
            for(let i=0;i<approvers;i++)
            {
              items.push(stage+'.'+team+'.'+(i+1))
            }
        
        }
        return items;
      
    }
    async service1(input, context) {
        console.log('appService.service1 starting...');
        let item = context.item;
        let wait=5000;
        if (input.wait)
            wait=input.wait;
        item.vars = input;
        await delay(wait, 'test');

        console.log('appDelegate service1 is now complete input:',input, 'output:','item.data',item.data);
        return {  text: 'test' };
    }
    async DummyService1(input, context) {
        console.log('appServcie.DummyService1 starting');
        context.item.data.service1Result = 'Service1Exec';
    }

    async raiseBPMNError(input, context) {
        return({bpmnError:' Something went wrong'});
    }
}
export {AppServices}
