const { createClientService } = require('../services/client/createClient');

// Function to register a new client
exports.createClient = async (req, res, next) => {
  try {
    const response = await createClientService(req, res);

    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};
