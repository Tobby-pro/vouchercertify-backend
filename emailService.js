// emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,      // your.email@gmail.com
    pass: process.env.EMAIL_PASS       // Gmail app password
  }
});

async function sendVoucherEmail(to, voucherCode) {
  const mailOptions = {
    from: `"VoucherCertify" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Voucher Code is Here 🎉',
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>Your voucher code is: <strong>${voucherCode}</strong></p>
      <p>Enjoy and see you soon!</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendVoucherEmail };
