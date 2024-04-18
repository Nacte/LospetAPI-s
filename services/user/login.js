const User = require('../Models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { httpCodes } = require('../utils/response_codes');

// Load environment variables from .env file
require('dotenv').config();

exports.loginService = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //Find user my email
    const user = await User.findOne({ email });

    //Check if user exists
    if (!user) {
      return res
        .status(httpCodes.HTTP_UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(httpCodes.HTTP_UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }

    // Check if the email_verified_at column === null, if yes account is not activated
    if (!user.email_verified_at === null) {
      return res.status(httpCodes.HTTP_BAD_REQUEST).json({
        message: 'Your account is not activated, please check your email',
      });
    }

    //User is authenticated return JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Return JWT token in response
    res.json({ message: 'Login successful', token });
  } catch (error) {
    next(error);
  }
};
