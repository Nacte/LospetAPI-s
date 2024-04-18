const User = require('../Models/users');
const bcrypt = require('bcryptjs');
const { httpCodes } = require('../utils/response_codes');

exports.resetPasswordService = async (req, res, next) => {
  try {
    const { token, password, password_confirmation } = req.body;

    // Check if token, email, newPassword and password_confirmation are provided
    if (!token || !password || !password_confirmation) {
      return res.status(httpCodes.HTTP_BAD_REQUEST).json({
        message: 'Token,  new password, and password confirmation are required',
      });
    }

    // Check if newPassword and confirmPassword match
    if (password !== password_confirmation) {
      return res.status(httpCodes.HTTP_BAD_REQUEST).json({
        message: 'New password and password_confirmation do not match',
      });
    }

    // Find user by token
    const user = await User.findOne({ reset_token: token });
    console.log(user);

    // If user not found or reset token expired
    if (!user) {
      return res
        .status(httpCodes.HTTP_BAD_REQUEST)
        .json({ message: 'Invalid or expired reset token' });
    }

    // Check to see if the token is not expired
    if (Date.toISOString < user.reset_token_expires) {
      return res
        .status(httpCodes.HTTP_BAD_REQUEST)
        .json({ message: 'Invalid or expired reset token' });
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
      .json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(httpCodes.HTTP_INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
};
