const nodemailer = require('nodemailer');

// config
const {
  usernameEmail,
  passwordEmail,
  toEmail
} = require('../config/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: usernameEmail,
    pass: passwordEmail
  }
});

const sendEmail = async ({ subject, text }) => {
  const mailOptions = {
    from: usernameEmail,
    to: toEmail,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${toEmail}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
}

module.exports = {
  sendEmail
};
