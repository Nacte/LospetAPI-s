const { createClientService } = require('../services/client/createClient');
const { getAllClientsService } = require('../services/client/getClients');

// Function to register a new client
exports.createClient = async (req, res, next) => {
  try {
    const response = await createClientService(req, res);

    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Function to get all clients
exports.getAllClients = async (req, res, next) => {
  try {
    const response = await getAllClientsService(req, res);
    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};
