const User = require('../../Models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');

// Load environment variables from .env file
require('dotenv').config();

exports.loginService = async (req, res) => {
  const { email, password } = req.body;
  //Find user my email
  const user = await User.findOne({ email });

  //Check if user exists
  if (!user) {
    return {
      code: httpCodes.HTTP_UNAUTHORIZED,
      data: {
        message: msg.en.INVALID_CREDENTIALS,
      },
    };
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return {
      code: httpCodes.HTTP_UNAUTHORIZED,
      data: {
        message: msg.en.INVALID_CREDENTIALS,
      },
    };
  }

  // Check if the email_verified_at column === null, if yes account is not activated
  if (!user.email_verified_at === null) {
    return {
      code: httpCodes.HTTP_BAD_REQUEST,
      data: {
        message: msg.en.ACCOUNT_NOT_ACTIVE,
      },
    };
  }

  //User is authenticated return JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie(`user_${user._id}`, token, {
    httpOnly: true,
    maxAge: process.env.JWT_EXPIRES_IN * 1000,
  });

  // Return JWT token in response
  return {
    code: httpCodes.HTTP_OK,
    data: {
      message: msg.en.SUCCESSFUL_LOGIN,
      token: token,
    },
  };
};
