const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Function to send registration email with verification link

const sendRegistrationEmail = async (token, email) => {
  // Create transporter using Mailtrap SMTP settings
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  // verification link
  const verificationLink = `http://localhost:3000/verify-email/${token}`;

  //   Email options
  const mailOptions = {
    from: 'lospet@lospet.com',
    to: email,
    subject: 'Account Created Successfully',
    html: `
        <p>Congratulations! Your account has been successfully created.</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `,
  };
  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendRegistrationEmail;
