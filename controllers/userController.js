const User = require('../Models/users');
const dotenv = require('dotenv');
const { registerService } = require('../services/user/registerService');
const { loginService } = require('../services/user/login');
const { verifyEmailService } = require('../services/verifyEmail');
const { forgotPasswordService } = require('../services/user/forgotPassword');
const { resetPasswordService } = require('../services/user/resetPassword');

// Load environment variables from config.env file
dotenv.config({ path: './config.env' });

// Function to register a new user
exports.registerUser = async (req, res, next) => {
  await registerService(req, res, next);
};

// Function to verify user's email
exports.verifyEmail = async (req, res, next) => {
  await verifyEmailService(req, res, next);
};

// Function to login a user
exports.loginUser = async (req, res, next) => {
  await loginService(req, res, next);
};

//  Function for Forgot Password
exports.forgotPassword = async (req, res, next) => {
  await forgotPasswordService(req, res, next);
};

// Function for Reset Password
exports.resetPassword = async (req, res, next) => {
  await resetPasswordService(req, res, next);
};

// // Logout logic for Jwt authentication
// exports.logoutUser = async (req, res, next) => {
//   try {
//     // Clear JWT token from the request
//     delete req.headers['authorization'];
//     // Respond with success message
//     res.json({ message: 'Logout successful' });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(httpCodes.HTTP_INTERNAL_SERVER_ERROR)
//       .json({ message: 'Internal Server Error' });
//   }
// };
