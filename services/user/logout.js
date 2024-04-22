const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');
const cookie = require('cookie');

exports.logoutService = async (req, res) => {
  // Clear the JWT token cookie
  const serialized = cookie.serialize('token', null, {
    httpOnly: true,
    secure: 'production',
    sameSite: 'strict',
    maxAge: -1,
    path: '/',
  });
  res.setHeader('Set-Cookie', serialized);

  return {
    code: httpCodes.HTTP_OK,
    data: {
      message: msg.en.USER_LOGOUT,
    },
  };
};
