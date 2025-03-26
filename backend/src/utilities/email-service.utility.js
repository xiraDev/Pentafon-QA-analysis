const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

/**
 * It takes in an object with the email, subject, title, message, and link, and sends an email to the
 * email address with the subject, title, message, and link
 * @param options
 */
const sendEmail = async options => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    transporter.verify((err, success) => {
      if (err) console.error(err);
      console.log('Your config is correct');
    });

    const filePath = path.join(__dirname, '../public/templates/defaultTemplate.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      title: options.title,
      message: options.message,
      btnLabel: options.btnLabel,
      link: options.link,
      emailHeader: process.env.EMAIL_HEADER,
      emailFooter: process.env.EMAIL_FOOTER
    };
    const htmlToSend = template(replacements);

    // send mail with defined transport object
    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: htmlToSend
    };

    const info = await transporter.sendMail(message);

    console.log('Message :>> %s', info.messageId);
    return info;
  } catch (error) {
    console.log('Error', error.message);
  }
};
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  },
  // tls: {
  //   rejectUnauthorized: false,
  //   maxVersion: "TLSv1.2",
  // },
  secure: true
});

module.exports = { sendEmail };
