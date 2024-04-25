const Client = require('../../Models/clients');
const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');

exports.getAllClientsService = async (req, res, next) => {
  try {
    // Fetch all clients from the database
    const clients = await Client.find();

    // Respond with the list of clients
    return res.status(httpCodes.HTTP_OK).json(clients);
  } catch (error) {
    return {
      code: httpCodes.HTTP_INTERNAL_SERVER_ERROR,
      status: { message: msg.en.SERVER_ERROR },
    };
  }
};
