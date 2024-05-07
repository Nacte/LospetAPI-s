const Event = require('../../Models/events');
const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');

exports.deleteEventService = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Find event by ID and delete (if found)
    const deleteEvent = await Event.findByIdAndDelete(eventId);

    // Check if event exists
    if (!deleteEvent) {
      return {
        code: httpCodes.HTTP_NOT_FOUND,
        status: { message: msg.en.EVENT_NOT_FOUND },
      };
    }

    return {
      code: httpCodes.HTTP_OK,
      status: { message: msg.en.EVENT_DELETED },
    };
  } catch (error) {
    console.error('Error deleting event', error);
    return {
      code: httpCodes.HTTP_INTERNAL_SERVER_ERROR,
      status: { message: msg.en.GENERIC_ERROR },
    };
  }
};
