const Client = require('../../Models/clients');
const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');

exports.createClientService = async (req, res) => {
  try {
    // Extract user ID from the request object (set by the authMiddleware)
    const userId = req.user.userId;

    // Extract client data from the request body
    const { updated_at, deleted_at, ...clientData } = req.body;

    // Create a new client instance
    const newClient = new Client({
      user: userId, // Associate the client with the user
      ...clientData, // Spread the client data passed as arguments
    });

    // Save the new client to the database
    await newClient.save();

    // Respond with success message
    return res.status(httpCodes.HTTP_CREATED).json({
      message: msg.en.CLIENT_CREATED,
      client: newClient, // Optionally, you can send back the created client
    });
  } catch (error) {
    console.error(error);
    return res
      .status(httpCodes.HTTP_SERVER_ERROR)
      .json({ message: msg.en.CLIENT_NOT_CREATED });
  }
};
