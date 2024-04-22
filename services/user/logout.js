const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');

exports.logoutService = async (req, res) => {
  // Clear the JWT token cookie
  res.clearCookie('jwt');

  return {
    code: httpCodes.HTTP_OK,
    data: {
      message: msg.en.USER_LOGOUT,
    },
  };
};
