const nodemailer = require("nodemailer");

async function sendEmail(to, subject, html) {
  // Create the transporter (this example uses Gmail)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS  // Your email password or app password
    }
  });

  // Send the email
  await transporter.sendMail({
    from: `"Btonenet" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}

module.exports = sendEmail;
