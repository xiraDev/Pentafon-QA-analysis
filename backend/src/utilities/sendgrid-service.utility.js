const fs = require("fs");
const path = require("path");
const sgMail = require("@sendgrid/mail");

// ----------------------------------------------------------------------

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const EMAIL_FROM = process.env.SENDGRID_FROM;

// ----------------------------------------------------------------------

const onSendgridEmail = async ({
  fileName = "default-customer-template.html",
  subject = "Seguimiento cobranza BanCoppel",
  text = "Notificación Cobranza",
  personalizations = [],
}) => {
  try {
    const filePath = path.join(__dirname, "../../../robot/src/uploads/templates/", fileName);
    const source = fs.readFileSync(filePath, "utf-8");

    const msg = {
      from: EMAIL_FROM,
      subject,
      text,
      html: source,
      personalizations,
      emailHeader: process.env.EMAIL_HEADER,
      emailFooter: process.env.EMAIL_FOOTER,
    };

    let response = {};
    await sgMail
      .send(msg)
      .then((resp) => {
        response = resp[0];
      })
      .catch((error) => {
        // Log friendly error
        console.error(error);

        if (error.response) {
          // Extract error msg
          const { message, code, response } = error;

          // Extract response msg
          const { headers, body } = response;

          console.error(body);
        }
        response = error;
      });

    return response;
  } catch (error) {
    console.log("Error", error.message);
  }
};

module.exports = { onSendgridEmail };
