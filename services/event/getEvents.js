const Event = require('../../Models/events');
const { isValidDate } = require('../../utils/dateUtils');
const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');

exports.getAllEventsService = async (req, res) => {
  try {
    const start_date = req.query.start;
    const end_date = req.query.end;

    // Validate date format
    if (!isValidDate(start_date) || !isValidDate(end_date)) {
      return {
        code: httpCodes.HTTP_NOT_FOUND,
        data: { message: msg.en.EVENT_NOT_FOUND },
      };
    }
    // Build query object dynamically based on presence of parameters
    const query = {
      start_date: { $gte: new Date(start_date) },
      end_date: { $lte: new Date(end_date) },
    };

    const events = await Event.find(query);

    return res.json(events);
  } catch (error) {
    console.error(error);
    return {
      code: httpCodes.HTTP_INTERNAL_SERVER_ERROR,
      data: { message: msg.en.INTERNAL_SERVER_ERROR },
    };
  }
};
