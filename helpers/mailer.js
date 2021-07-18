//Mailer code to send email
const mailer = require("nodemailer");
require("dotenv").config();

let smtpConfig = {
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const transporter = mailer.createTransport(smtpConfig);

module.exports = (to, subject, text, html) => {
  transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to: to,
    subject: subject,
    text: text,
    html: html,
  });
};
