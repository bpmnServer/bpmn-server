import fs from 'node:fs';
import nodemailer from 'nodemailer';
import { DefaultAppDelegate, dateDiff } from 'bpmn-server';

/**
 * The app delegate bpmn-web runs with: an application extends it with its services
 * (getServicesProvider), data objects (loadDataObject) and events.
 * It reports hung items and removes day-old locks on startup, and sends the notifications' emails.
 */
export class WebAppDelegate extends DefaultAppDelegate {

    /**
    * is fired on application startup
    **/
    async startUp(options) {

        await super.startUp(options);
		if (options['cron'] == false) {
			return;
		}

        var query = { "items.status": "start" };

        var list = await this.server.dataStore.findItems(query);
        if (list.length > 0) {
            this.server.logger.log("** There are " + list.length," items that seems to be hung");
            console.log("** There are " + list.length," items that seems to be hung");
            list.forEach(it=>{
                console.log(`   item hung: '${it.elementId}' seq: ${it.seq} ${it.type} ${it.status} in process:'${it.processName}' - Instance id: '${it.instanceId}' `);
            });
        }

        let date=new Date();
        date.setDate(date.getDate() -1);

        var list = await this.server.dataStore.locker.delete({ time: { $lte: date } });

        if (list.length > 0) {
            console.log('Current locks ...', list.length);
            for (var i = 0; i < list.length; i++) {
                let item = list[i];
                console.log('lock:', item.id, item.server, item.time,dateDiff(item.time));
            }
        }
    }
    /**
     * sends emails is called by Notification class
     *   EMAIL_ENABLE=true sends them through gmail (SMTP_USER, SMTP_PASSWORD, EMAIL_FROM); EMAIL_LOG names a file they are written to
     */
    async sendEmail(to, subject, text) {

        let emailMsg;
        if (process.env.EMAIL_ENABLE == 'true')
        {
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
                subject: subject,
                text: text,
                html: text
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
}
