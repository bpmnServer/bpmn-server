import nodemailer from 'nodemailer';




/**
 * Helper Function to Send Mail.
 */
async  function sendMail({from,to,subject,text,html}: {from?:any;to?:any;subject?:any;text?:any;html?:any}) {
    // send mail with defined transport object
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const info = await transporter.sendMail({
        from:from, // '"BPMN Server??" <bpmn.server@gmail.com>', // sender address
        to: to, //"ralphhanna@hotmail.com, hanna.ralph@gmail.com", // list of receivers
        subject:subject, // "Hello ?", // Subject line
        text: text,//"Hello world?", // plain text body
        html: html //"<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);

    return info;
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
}
export { sendMail };