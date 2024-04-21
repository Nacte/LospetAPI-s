const User = require('../../Models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendRegistrationEmail } = require('../mail/sendRegistrationEmail');
const { httpCodes } = require('../../utils/response_codes');
const {.msg } = require('../../utils/messages');

// Load environment variables from .env file
require('dotenv').config();

exports.registerService = async (req, res, next) => {
  // Extract user data from request body
  const { name, email, password, password_confirmation } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !password_confirmation) {
    return res
      .status(httpCodes.HTTP_BAD_REQUEST)
      .json({ message: msg.en.ALL_REQUIRED });
  }

  // Check if passwords match
  if (password !== password_confirmation) {
    return res
      .status(httpCodes.HTTP_BAD_REQUEST)
      .json({ error: msg.en.NO_MATCH });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(httpCodes.HTTP_BAD_REQUEST)
        .json({ message: msg.en.DUPLICATE_EMAIL });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const user = new User({ name, password: hashedPassword, email });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Send registration email with verification link
    await sendRegistrationEmail(token, email);

    // Respond with success message
    res.status(httpCodes.HTTP_CREATED).json({
      message:msg.en.USER_CREATED
        ,
    });
  } catch (error) {
    next(error);
  }
};
