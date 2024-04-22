const User = require('../../Models/users');
const crypto = require('crypto');
const { httpCodes } = require('../../utils/response_codes');
const { sendResetLink } = require('../mail/sendRegistrationEmail');
const { msg } = require('../../utils/messages');

exports.forgotPasswordService = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Check if the email exists in the db
    const user = await User.findOne({ email });
    if (!user) {
      return {
        code: httpCodes.HTTP_NOT_FOUND,
        data: { message: msg.en.USER_DOES_NOT_EXIST },
      };
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
    return {
      code: httpCodes.HTTP_OK,
      data: { message: msg.en.RESET_LINK_SENT },
    };
  } catch (error) {
    console.error(error);
    return {
      code: httpCodes.HTTP_INTERNAL_SERVER_ERROR,
      data: { message: msg.en.INTERNAL_SERVER_ERROR },
    };
  }
};
