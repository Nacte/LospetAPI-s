const jwt = require('jsonwebtoken');
const User = require('../Models/users');

// Middleware to protect routes that require authentication
exports.protect = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization;

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Not authorized to access this resource' });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findById(decoded.userId);

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    // Attach user to request object
    req.user = user;
    // Proceed to next middleware
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
