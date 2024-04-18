const jwt = require('jsonwebtoken');
const User = require('../Models/users');
const { httpCodes } = require('../utils/response_codes');

// Middleware to protect routes that require authentication
exports.authMiddleware = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization;
    // Check if token exists
    if (!token) {
      return res
        .status(httpCodes.HTTP_UNAUTHORIZED)
        .json({ message: 'Not authorized to access this resource' });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findById(decoded.userId);

    // Check if user exists
    if (!user) {
      return res
        .status(httpCodes.HTTP_NOT_FOUND)
        .json({ message: 'User not found' });
    }
    // Attach user to request object
    req.user = {
      name: user.name,
      email: user.email,
    };
    // Proceed to next middleware
    next();
  } catch (error) {
    console.error(error);
    res.status(httpCodes.HTTP_UNAUTHORIZED).json({ message: 'Invalid token' });
  }
};
