const { createEventActionsService } = require('../services/eventAction/createEventAction');
const { getAllEventsService } = require('../services/event/getEvents');
const { getEventService } = require('../services/event/getEventsById');
const { updateEventService } = require('../services/event/updateEvent');
const { deleteEventService } = require('../services/event/deleteEvent');


// Function to create a new event-action
exports.createEventActions = async (req, res, next) => {
    try {
      const response = await createEventActionsService(req, res);
  
      return res.status(response.code).json(response.data);
    } catch (error) {
      next(error);
    }
  };