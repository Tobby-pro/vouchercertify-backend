// emailService.js
require("dotenv").config();
const nodemailer = require("nodemailer");

// Create the reusable transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address from .env
    pass: process.env.EMAIL_PASS, // Gmail App Password from .env
  },
});

// Send voucher email
async function sendVoucherEmail(to, voucherCode) {
  try {
    const mailOptions = {
      from: `"VoucherCertify" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your Voucher Code is Here 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #4CAF50;">Thank you for your purchase!</h2>
          <p>Your voucher code is:</p>
          <p style="font-size: 18px; font-weight: bold; background: #f4f4f4; padding: 10px; border-radius: 5px; display: inline-block;">
            ${voucherCode}
          </p>
          <p>Enjoy and see you soon!</p>
          <hr />
          <small>Need help? Reply to this email or visit <a href="${process.env.DOMAIN}">${process.env.DOMAIN}</a></small>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
  }
}

module.exports = { sendVoucherEmail };
