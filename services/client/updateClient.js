const Client = require('../../Models/clients');
const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');

exports.updateClientService = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const updatedData = req.body;

    // Find client by ID
    const client = await Client.findById(clientId);

    // Check if client exists
    if (!client) {
      return {
        code: httpCodes.HTTP_NOT_FOUND,
        status: { message: msg.en.CLIENT_NOT_FOUND },
      };
    }
    // Update client data
    Object.assign(client, updatedData);

    // Save the updated client document
    await client.save();

    return {
      code: httpCodes.HTTP_OK,
      data: client,
      status: { message: msg.en.CLIENT_UPDATED },
    };
  } catch (error) {
    console.error('Error updating client', error);
    return {
      code: httpCodes.HTTP_INTERNAL_SERVER_ERROR,
      status: { message: msg.en.GENERIC_ERROR },
    };
  }
};
