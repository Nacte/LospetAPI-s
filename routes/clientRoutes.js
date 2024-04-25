const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new client
router.post('/clients', authMiddleware, clientController.createClient);

// Get all clients
router.get('/clients', authMiddleware, clientController.getAllClients);

module.exports = router;
