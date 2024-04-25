const { createClientService } = require('../services/client/createClient');
const { getAllClientsService } = require('../services/client/getClients');
const { getClientService } = require('../services/client/getClientById');
const { updateClientService } = require('../services/client/updateClient');
const { deleteClientService } = require('../services/client/deleteClient');

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

// Function to get client by Id
exports.getClient = async (req, res, next) => {
  try {
    const response = await getClientService(req, res);
    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Function to update client by Id
exports.updateClient = async (req, res, next) => {
  try {
    const response = await updateClientService(req, res);
    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Function to delete client by Id
exports.deleteClient = async (req, res, next) => {
  try {
    const response = await deleteClientService(req, res);
    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};
