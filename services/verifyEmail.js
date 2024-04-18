const User = require('../Models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendRegistrationEmail } = require('./mailService');
const { httpCodes } = require('../utils/response_codes');

// Load environment variables from .env file
require('dotenv').config();

exports.verifyEmailServices = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by id
    const user = await User.findById(decoded.userId);

    // Check if the user exists
    if (!user) {
      return res
        .status(httpCodes.HTTP_BAD_REQUEST)
        .json({ message: 'Invalid verification link' });
    }

    if (user.email_verified_at !== null) {
      return res
        .status(httpCodes.HTTP_BAD_REQUEST)
        .json({ message: 'The link is not valid anymore' });
    }

    // Update user's email verification status
    const currentTime = new Date(Date.now()).toISOString();
    user.email_verified_at = currentTime;
    await user.save();

    // Respond and redirect to dashboard

    res.redirect(
      httpCodes.HTTP_MOVED_PERMANENTLY,
      process.env.FRONTEND_URL + '/login'
    );
  } catch (error) {
    next(error);
  }
};