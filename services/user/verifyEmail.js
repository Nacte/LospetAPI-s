const User = require('../../Models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');

// Load environment variables from .env file
require('dotenv').config();

exports.verifyEmailService = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by id
    const user = await User.findById(decoded.userId);

    // Check if the user exists
    if (!user) {
      return {
        code: httpCodes.HTTP_BAD_REQUEST,
        data: { message: msg.en.INVALID_LINK },
      };
    }

    if (user.email_verified_at !== null) {
      return {
        code: httpCodes.HTTP_BAD_REQUEST,
        data: { message: msg.en.INVALID_LINK_ANYMORE },
      };
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
