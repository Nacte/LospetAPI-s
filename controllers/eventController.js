const { createEventService } = require('../services/event/createEvent');
const { getAllEventsService } = require('../services/event/getEvents');
const { getEventService } = require('../services/event/getEventsById');
const { updateEventService } = require('../services/event/updateEvent');
const { deleteEventService } = require('../services/event/deleteEvent');

// Function to create a new event
exports.createEvent = async (req, res, next) => {
  try {
    const response = await createEventService(req, res);

    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Function to get all events
exports.getAllEvents = async (req, res, next) => {
  try {
    const response = await getAllEventsService(req, res);
    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Function to get event by Id
exports.getEvent = async (req, res, next) => {
  try {
    const response = await getEventService(req, res);
    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Function to update event by Id
exports.updateEvent = async (req, res, next) => {
  try {
    const response = await updateEventService(req, res);
    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};

// Function to delete event by Id
exports.deleteEvent = async (req, res, next) => {
  try {
    const response = await deleteEventService(req, res);
    return res.status(response.code).json(response.data);
  } catch (error) {
    next(error);
  }
};
