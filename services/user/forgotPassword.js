const User = require('../../Models/users');
const crypto = require('crypto');
const { httpCodes } = require('../../utils/response_codes');
const { sendResetLink } = require('../mailService');

exports.forgotPasswordService = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Check if the email exists in the db
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(httpCodes.HTTP_NOT_FOUND)
        .json({ message: 'User with that email does not exist!' });
    }

    // Generate reset token and expiry date
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; //1hour

    // Save token and expiry date to the user
    user.reset_token = resetToken;
    user.reset_token_expires = resetTokenExpires;
    await user.save();
    // Send reset link via email
    await sendResetLink(email, resetToken);
    res
      .status(httpCodes.HTTP_OK)
      .json({ message: 'Reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res
      .status(httpCodes.HTTP_INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
};
