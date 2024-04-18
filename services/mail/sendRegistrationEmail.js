const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Function to create a transporter
const createTransporter = () => {
  // Create transporter using Mailtrap SMTP settings
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });
};

// Function to send registration email with verification link

const sendRegistrationEmail = async (token, email) => {
  const transporter = createTransporter();

  // verification link
  const verificationLink = `${process.env.BACKEND_URL}/verify-email/${token}`;

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

// Function to send reset link via email
const sendResetLink = async (email, resetToken) => {
  console.log(resetToken);
  const resetLink = `http://localhost:5173/password-reset/${resetToken}`;
  const transporter = createTransporter();

  // Email options
  const mailOptions = {
    from: 'lospet@lospet.com',
    to: email,
    subject: 'Password Rest',
    html: ` It seems that you have forgotten your password please click <a href="${resetLink}">${resetLink}</a> to reset your password`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendRegistrationEmail, sendResetLink };
