const Event = require('../../Models/events');
const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');

exports.updateEventService = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const updatedData = req.body;

    // Find client by ID
    const event = await Event.findById(eventId);

    // Check if event exists
    if (!event) {
      return {
        code: httpCodes.HTTP_NOT_FOUND,
        status: { message: msg.en.EVENT_NOT_FOUND },
      };
    }
    // Update event data
    Object.assign(event, updatedData);

    // Save the updated event document
    await event.save();

    return {
      code: httpCodes.HTTP_OK,
      data: event,
      status: { message: msg.en.EVENT_UPDATED },
    };
  } catch (error) {
    console.error('Error updating event', error);
    return {
      code: httpCodes.HTTP_INTERNAL_SERVER_ERROR,
      status: { message: msg.en.GENERIC_ERROR },
    };
  }
};
