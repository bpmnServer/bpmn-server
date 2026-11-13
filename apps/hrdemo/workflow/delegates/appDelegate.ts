import fs from 'node:fs';
import { Item, IExecution, WebAppDelegate } from 'bpmn-web';
import { AppServices } from '../connectors/appServices.js';
import { AppUtils } from './appUtils.js';


var seq = 1;

const MULTI_APP_SERVICES =false;

console.log('appDelegate from ', import.meta.filename);


class AppDelegate extends WebAppDelegate{
    winSocket;
    appServices;
    appUtils;
    
    constructor(server) {
        super(server);
        this.appUtils = new AppUtils(server);
    }

    async getServicesProvider(context) {

        // for multiple appServices  -start 
        if (MULTI_APP_SERVICES) {
            this.appServices = new Map();

                console.log('call services provider', context.instance.tenantId);
                const path = './' + context.instance.tenantId + '_appServices';

                let instance = this.appServices.get(path);

                if (!instance) {
                    const IMPORT = await import(path)
                    const aClass = IMPORT.AppServices;
                    instance = new aClass(this);
                    this.appServices.set(path, instance);
                    console.log('instance loaded', path, instance);
                }
                return instance;
            // for multiple appServices  -end 
        }
    else
        {
        // the environment's services: the test environment (APP_ENV=test) has its own; production never loads them
        if (this.appServices == null)
        this.appServices = process.env.APP_ENV === 'test'
            ? new (await import('../connectors/testServices.js')).TestServices(this)
            : new AppServices(this);
        return this.appServices
        }
        
    }
    // startUp (housekeeping) and sendEmail (notifications) come from WebAppDelegate

    /**
     * A notification policy's notification (policies/notification/LeaveNotices.dmn.xml): delivered here. The demo
     * writes it to the console; an application sends it by its channel (email, its inbox, ...). Not called for a test
     * run's instance, nor with NOTIFICATIONS=record: those are only kept (wf_notifications).
     */
    async notify(notification) {
        const by = notification.channel ? ` by ${notification.channel}` : '';
        const body = notification.message && notification.message !== notification.subject
            ? '\n  ' + notification.message.replace(/\n/g, '\n  ') : '';
        console.log(`notify ${notification.to.join(', ')}${by}: ${notification.subject}${body}`);
    }

    
    ///
    
    /* only for show 
    sendEmailSendGrid(to, msg, body) {

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
    */

    /**
     * is Called everytime a workflow is completed
     * @param execution 
     */
    async executionEnded(execution: IExecution) {
        
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
    /**
     * Loads a model's data object into the instance data when an element connected to it runs (a start event, a
     * service task): data.client for a data object 'client'. It is saved with the instance. The sample keeps a
     * few clients in memory; an application loads from its own store.
     */
    async loadDataObject(name: string, item: Item) {
        if (name === 'client') {
            const id = item.data?.clientId ?? 'C-1';
            return { ...(SAMPLE_CLIENTS[id] ?? { name: 'Unknown client', tier: 'standard' }), id };
        }
        this.server.logger.log(`loadDataObject: the sample application has no data object '${name}'`);
        return null;
    }
}

/** The sample's clients, by id: what loadDataObject('client') gives for data.clientId. */
const SAMPLE_CLIENTS = {
    'C-1': { name: 'Kim Lee', tier: 'gold', since: '2019-04-01' },
    'C-2': { name: 'Sam Patel', tier: 'standard', since: '2024-11-15' },
};
class Utils {

}
export {AppDelegate}