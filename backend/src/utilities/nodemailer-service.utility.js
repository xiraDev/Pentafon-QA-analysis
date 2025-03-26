const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  secure: true,
});

const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("Your config is correct");
  } catch (error) {
    console.error("Error in transporter configuration", error);
    throw error;
  }
};

const getTemplate = () => {
  const filePath = path.join(
    __dirname,
    "../public/templates/default-template.html"
  );
  const source = fs.readFileSync(filePath, "utf-8");
  return handlebars.compile(source);
};

const sendEmail = async (options) => {
  try {
    await verifyTransporter();

    const template = getTemplate();
    const replacements = {
      title: options.title,
      message: options.message.replace(/\n/g, "<br>"), // replace newline with <br>
      emailHeader: process.env.EMAIL_HEADER,
      emailFooter: process.env.EMAIL_FOOTER,
    };
    const htmlToSend = template(replacements);

    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: htmlToSend,
    };

    // Check if the file exists before adding it to the attachments
    if (fs.existsSync(options.csvFilePath)) {
      message.attachments = [
        {
          // file on disk as an attachment
          filename: path.basename(options.csvFilePath),
          path: options.csvFilePath, // stream this file
        },
      ];
    }

    const info = await transporter.sendMail(message);

    console.log("Message :>> %s", info.messageId);
    return info;
  } catch (error) {
    console.log("Error", error.message);
    throw error;
  }
};

module.exports = {
  sendEmail,
};
