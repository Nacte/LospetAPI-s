const User = require('../Models/users');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { registerUserService } = require('../services/userService');
const { httpCodes } = require('../utils/response_codes');
const { verifyEmailService } = require('../services/verifyEmailService');
const { loginUserService } = require('../services/loginUserService');

// Load environment variables from config.env file
dotenv.config({ path: './config.env' });

// Function to register a new user
exports.registerUser = async (req, res, next) => {
  await registerUserService(req, res, next);
};

// Function to verify user's email
exports.verifyEmail = async (req, res, next) => {
  await verifyEmailService(req, res, next);
};

// Function to login a user

exports.loginUser = async (req, res, next) => {
  await loginUserService(req, res, next);
};

//  Function for Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Check if the email exists in the db
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(httpCodes.HTTP_NOT_FOUND)
        .json({ message: 'User with that email does not exist!' });
    }

    // Generate reset token and expiry date
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; //1hour

    // Save token and expiry date to the user
    user.reset_token = resetToken;
    user.reset_token_expires = resetTokenExpires;
    await user.save();
    // Send reset link via email
    await sendResetLink(email, resetToken);
    res
      .status(httpCodes.HTTP_OK)
      .json({ message: 'Reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res
      .status(httpCodes.HTTP_INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
};

// Function for Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password, password_confirmation } = req.body;

    // Check if token, email, newPassword and password_confirmation are provided
    if (!token || !password || !password_confirmation) {
      return res.status(httpCodes.HTTP_BAD_REQUEST).json({
        message: 'Token,  new password, and password confirmation are required',
      });
    }

    // Check if newPassword and confirmPassword match
    if (password !== password_confirmation) {
      return res.status(httpCodes.HTTP_BAD_REQUEST).json({
        message: 'New password and password_confirmation do not match',
      });
    }

    // Find user by token
    const user = await User.findOne({ reset_token: token });
    console.log(user);

    // If user not found or reset token expired
    if (!user) {
      return res
        .status(httpCodes.HTTP_BAD_REQUEST)
        .json({ message: 'Invalid or expired reset token' });
    }

    // Check to see if the token is not expired
    if (Date.toISOString < user.reset_token_expires) {
      return res
        .status(httpCodes.HTTP_BAD_REQUEST)
        .json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password
    user.password = hashedPassword;
    user.reset_token = null;
    user.reset_token_expires = null;
    await user.save();

    // Respond with success message
    res
      .status(httpCodes.HTTP_OK)
      .json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(httpCodes.HTTP_INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
};

// Logout logic for Jwt authentication
exports.logoutUser = async (req, res, next) => {
  try {
    // Clear JWT token from the request
    delete req.headers['authorization'];
    // Respond with success message
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.log(error);
    res
      .status(httpCodes.HTTP_INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
};
