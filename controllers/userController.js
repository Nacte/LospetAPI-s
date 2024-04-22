const User = require('../Models/users');
const dotenv = require('dotenv');
const { registerService } = require('../services/user/registerService');
const { loginService } = require('../services/user/login');
const { verifyEmailService } = require('../services/user/verifyEmail');
const { forgotPasswordService } = require('../services/user/forgotPassword');
const { resetPasswordService } = require('../services/user/resetPassword');
const { logoutService } = require('../services/user/logout');

// Load environment variables from config.env file
dotenv.config({ path: './config.env' });

// Function to register a new user
exports.registerUser = async (req, res, next) => {
  try {
    const response = await registerService(req);

    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Function to verify user's email
exports.verifyEmail = async (req, res, next) => {
  try {
    const response = await verifyEmailService(req);

    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Function to login a user
exports.loginUser = async (req, res, next) => {
  try {
    const response = await loginService(req, res);

    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};

//  Function for Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try {
    const response = await forgotPasswordService(req);

    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Function for Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const response = await resetPasswordService(req);

    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Logout function
exports.logoutUser = async (req, res, next) => {
  try {
    const response = await logoutService(req, res);

    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};
