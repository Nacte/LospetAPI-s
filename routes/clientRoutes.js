const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new client
router.post('/clients', authMiddleware, clientController.createClient);

// Get all clients
router.get('/clients', authMiddleware, clientController.getAllClients);

// Get client by ID
router.get('/clients/:clientId', authMiddleware, clientController.getClient);

// PUT (Update)  client by id
router.put('/clients/:clientId', authMiddleware, clientController.updateClient);

// DEL (Delete) client by id
router.delete(
  '/clients/:clientId',
  authMiddleware,
  clientController.deleteClient
);

module.exports = router;
