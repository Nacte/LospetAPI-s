const User = require('../../Models/users');
const crypto = require('crypto');
const { httpCodes } = require('../../utils/response_codes');
const { sendResetLink } = require('../mail/sendRegistrationEmail');
const { msg } = require("../../utils/messages");

exports.forgotPasswordService = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Check if the email exists in the db
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(httpCodes.HTTP_NOT_FOUND)
        .json({ message: msg.en.USER_DOES_NOT_EXIST });
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
      .json({ message: msg.en.RESET_LINK_SENT });
  } catch (error) {
    console.error(error);
    res
      .status(httpCodes.HTTP_INTERNAL_SERVER_ERROR)
      .json({ message: msg.en.INTERNAL_SERVER_ERROR });
  }
};
