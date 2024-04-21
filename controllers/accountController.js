const User = require('../Models/users');
const bcrypt = require('bcryptjs');
const { httpCodes } = require('../utils/response_codes');
const { msg } = require('../utils/messages');

exports.changePassword = async (req, res, next) => {
  try {
    // Extract the user ID from JWT token
    const userId = req.user.userId;

    // Extract old password , new password, and confirm password from request body
    const { old_password, new_password, confirm_password } = req.body;

    // Check if the new password and confirm password match
    if (new_password !== confirm_password) {
      return res
        .status(httpCodes.HTTP_BAD_REQUEST)
        .json({ message: msg.en.NO_MATCH });
    }
    // Find the user by ID
    const user = await User.findById(userId);
    // Check if user exists
    if (!user) {
      return res
        .status(httpCodes.HTTP_NOT_FOUND)
        .json({ message: msg.en.USER_NOT_FOUND });
    }
    // Check if old password is correct
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res
        .status(httpCodes.HTTP_UNAUTHORIZED)
        .json({ message: msg.en.PASSWORD_INCORRECT });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_password, 12);
    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();
    // Respond with success message
    res.status(httpCodes.HTTP_OK).json({ message: msg.en.PASSWORD_CHANGED });
  } catch (error) {
    console.error(error);
    res
      .status(httpCodes.HTTP_INTERNAL_SERVER_ERROR)
      .json({ message: msg.en.INTERNAL_SERVER_ERROR });
  }
};

exports.getUser = async (req, res, next) => {
  // Extract the user ID from JWT token
  const user = req.user;

  if (!user) {
    return res
      .status(httpCodes.HTTP_NOT_FOUND)
      .json({ message: msg.en.USER_NOT_FOUND });
  }

  return res.status(httpCodes.HTTP_OK).json({ data: user });
};
