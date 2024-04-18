const User = require('../Models/users');
const bcrypt = require('bcryptjs');
const { httpCodes } = require('../utils/response_codes');

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
        .json({ message: 'New password and confirmation do not match' });
    }
    // Find the user by ID
    const user = await User.findById(userId);
    // Check if user exists
    if (!user) {
      return res
        .status(httpCodes.HTTP_NOT_FOUND)
        .json({ message: 'User not found' });
    }
    // Check if old password is correct
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res
        .status(httpCodes.HTTP_UNAUTHORIZED)
        .json({ message: 'Current password is incorrect' });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_password, 12);
    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();
    // Respond with success message
    res.status(httpCodes.HTTP_OK).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(httpCodes.HTTP_INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
};

exports.getUser = async (req, res, next) => {
  // Extract the user ID from JWT token
  const user = req.user;

  if (!user) {
    return res.status(httpCodes.HTTP_NOT_FOUND).json({ message: 'User not found' });
  }

  return res.status(httpCodes.HTTP_OK).json({ data: user });
};
