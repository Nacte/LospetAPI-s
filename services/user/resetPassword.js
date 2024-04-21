const User = require('../../Models/users');
const bcrypt = require('bcryptjs');
const { httpCodes } = require('../../utils/response_codes');
const {.msg } = require('../../utils/messages');

exports.resetPasswordService = async (req, res, next) => {
  try {
    const { token, password, password_confirmation } = req.body;

    // Check if token, email, newPassword and password_confirmation are provided
    if (!token || !password || !password_confirmation) {
      return res.status(httpCodes.HTTP_BAD_REQUEST).json({
        message: msg.en.REQUIRED_FIELDS,
      });
    }

    // Check if newPassword and confirmPassword match
    if (password !== password_confirmation) {
      return res.status(httpCodes.HTTP_BAD_REQUEST).json({
        message: msg.en.NO_MATCH,
      });
    }

    // Find user by token
    const user = await User.findOne({ reset_token: token });
    console.log(user);

    // If user not found or reset token expired
    if (!user) {
      return res
        .status(httpCodes.HTTP_BAD_REQUEST)
        .json({ message: msg.en.INVALID_TOKEN });
    }

    // Check to see if the token is not expired
    if (Date.toISOString < user.reset_token_expires) {
      return res
        .status(httpCodes.HTTP_BAD_REQUEST)
        .json({ message: msg.en.INVALID_TOKEN });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password
    user.password = hashedPassword;
    user.reset_token = null;
    user.reset_token_expires = null;
    await user.save();

    // Respond with success message
    res
      .status(httpCodes.HTTP_OK)
      .json({ message: msg.en.PASSWORD_RESET });
  } catch (error) {
    console.error(error);
    res
      .status(httpCodes.HTTP_INTERNAL_SERVER_ERROR)
      .json({ message: msg.en.INTERNAL_SERVER_ERROR });
  }
};
