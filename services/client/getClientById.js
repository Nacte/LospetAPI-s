const Client = require('../../Models/clients');
const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');

exports.getClientService = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;

    // Fetch the client from the database by ID
    const client = await Client.findById(clientId);

    // Check if client exists
    if (!client) {
      return {
        code: httpCodes.HTTP_NOT_FOUND,
        status: { message: msg.en.CLIENT_NOT_FOUND },
      };
    }

    // Return the client data
    return res.status(httpCodes.HTTP_OK).json(client);
  } catch (error) {
    return {
      code: httpCodes.HTTP_INTERNAL_SERVER_ERROR,
      status: { message: msg.en.SERVER_ERROR },
    };
  }
};
