const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new event
router.post('/events', authMiddleware, eventController.createEvent);

// // Get all events
router.get('/events', authMiddleware, eventController.getAllEvents);

// // Get event by ID
router.get('/events/:eventId', authMiddleware, eventController.getEvent);

// // PUT (Update)  event by id
router.put('/events/:eventId', authMiddleware, eventController.updateEvent);

// // DEL (Delete) event by id
router.delete('/events/:eventId', authMiddleware, eventController.deleteEvent);

module.exports = router;
