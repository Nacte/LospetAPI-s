const jwt = require('jsonwebtoken');
const User = require('../Models/users');
const dotenv = require('dotenv');
const { httpCodes } = require('../utils/response_codes');
const { msg } = require('../utils/messages');

// Load environment variables from config.env file
dotenv.config({ path: './config.env' });

// Middleware to protect routes that require authentication
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization.replace('Bearer ', '');
    // Check if token exists
    if (!token) {
      return res
        .status(httpCodes.HTTP_UNAUTHORIZED)
        .json({ message: msg.en.NO_AUTHORIZATION });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findById(decoded.userId);

    // Check if user exists
    if (!user) {
      return res
        .status(httpCodes.HTTP_NOT_FOUND)
        .json({ message: msg.en.USER_NOT_FOUND });
    }

    // Attach user to request object
    req.user = {
      userId: user._id,
      name: user.name,
      email: user.email,
    };
    // Proceed to next middleware
    next();
  } catch (error) {
    console.error(error);
    res
      .status(httpCodes.HTTP_UNAUTHORIZED)
      .json({ message: msg.en.INVALID_TOKEN });
  }
};

module.exports = authMiddleware;
