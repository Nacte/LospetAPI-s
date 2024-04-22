const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');

exports.logoutService = async (req, res) => {
  console.log(req.user);
  // Clear the JWT token cookie
  res.clearCookie(`user_${user._id}`);

  return {
    code: httpCodes.HTTP_OK,
    data: {
      message: msg.en.USER_LOGOUT,
    },
  };
};
