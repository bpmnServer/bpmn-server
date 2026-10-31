import {  Item, FLOW_ACTION , NODE_ACTION, IExecution  } from './';
import { DefaultAppDelegate } from './';
import { AppServices } from './appServices';
import { AppUtils } from './appUtils';

const Mailer = require('../userAccess/config/mail');

const fs = require('fs');

var seq = 1;

const MULTI_APP_SERVICES =false;

const nodemailer = require("nodemailer");


class MyAppDelegate extends DefaultAppDelegate{
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
        if (this.appServices == null)
        this.appServices = new AppServices(this);
        return this.appServices
        }
        
    }
    /**
    * is fired on application startup
    **/
    async startUp(options) {

        await super.startUp(options);
		if (options['cron'] == false) {
			return;
		}

        console.log('myserver started');

        var query = { "items.status": "start" };

        var list = await this.server.dataStore.findItems(query);
        if (list.length > 0) {
            this.server.logger.log("** There are " + list.length," items that seems to be hung");
        }

    }
    /**
     * sends emails is called by Notification class
     * 
     * @param to
     * @param subject
     * @param text
     */

    async sendEmail(to, subject, text) {

        let emailMsg;
        if (process.env.EMAIL_ENABLE == 'true')
        {
            // send mail with defined transport object
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            });

            const info = await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: to,
                subject: subject,  //"Hello ?", // Subject line
                text: text, // plain text body
                html: text //"<b>Hello world?</b>", // html body
            });
            emailMsg=info.messageId;
            console.log("Message sent: %s", info.messageId);
        }
        else
            emailMsg='email disabled by .env';

        let emailLog=process.env.EMAIL_LOG;
        if(emailLog && emailLog!=='' ) {
            let log=`\n\nto:${to}\n${subject}\n${text}\n${emailMsg}`;
            fs.appendFileSync(emailLog,log);        
        }
        return emailMsg;
    }

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
export {MyAppDelegate}