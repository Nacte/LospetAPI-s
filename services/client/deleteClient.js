const Client = require('../../Models/clients');
const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');

exports.deleteClientService = async (req, res) => {
  try {
    const clientId = req.params.clientId;

    // Find client by ID and delete (if found)
    const deleteClient = await Client.findByIdAndDelete(clientId);

    // Check if client exists
    if (!deleteClient) {
      return {
        code: httpCodes.HTTP_NOT_FOUND,
        status: { message: msg.en.CLIENT_NOT_FOUND },
      };
    }

    return {
      code: httpCodes.HTTP_OK,
      status: { message: msg.en.CLIENT_DELETED },
    };
  } catch (error) {
    console.error('Error deleting client', error);
    return {
      code: httpCodes.HTTP_INTERNAL_SERVER_ERROR,
      status: { message: msg.en.GENERIC_ERROR },
    };
  }
};
