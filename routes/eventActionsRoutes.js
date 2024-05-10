const express = require('express');
const router = express.Router();
const eventActionsController = require('../controllers/eventActionsController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new event
router.post(
  '/event-actions',
  authMiddleware,
  eventActionsController.createEventActions
);

// // // Get all events
// router.get('/event-actions', authMiddleware, eventActionsController.getAllEventsActions);

// // // Get event by ID
// router.get('/events/:eventId', authMiddleware, eventActionsController.getEventActions);

// // // PUT (Update)  event by id
// router.put('/event-actions/:eventId', authMiddleware, eventActionsController.updateEventActions);

// // // DEL (Delete) event by id
// router.delete('/events/:eventId', authMiddleware, eventActionsController.deleteEventActions);

module.exports = router;
