const Event = require('../../Models/events');
const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');

exports.getEventService = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;

    // Fetch the event from the database by ID
    const event = await Event.findById(eventId);

    // Check if event exists
    if (!event) {
      return {
        code: httpCodes.HTTP_NOT_FOUND,
        status: { message: msg.en.EVENT_NOT_FOUND_NOT_FOUND },
      };
    }

    // Return the event data
    return res.status(httpCodes.HTTP_OK).json(event);
  } catch (error) {
    return {
      code: httpCodes.HTTP_INTERNAL_SERVER_ERROR,
      status: { message: msg.en.SERVER_ERROR },
    };
  }
};
