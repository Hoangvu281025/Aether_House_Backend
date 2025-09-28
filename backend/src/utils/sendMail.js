// utils/sendMail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true, // nếu dùng port 465 thì đổi thành true
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendMail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"AetherHouse" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
}

module.exports = sendMail;
