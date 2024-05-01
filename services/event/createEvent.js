const Event = require('../../Models/events');
const { isValidDate } = require('../../utils/dateUtils');
const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');

exports.createEventService = async (req, res) => {
  try {
    // Validate request data
    const { client_id, name, start_date, end_date } = req.body;
    const { userId } = req.user.userId;

    if (!client_id || !name || !start_date || !end_date) {
      return res
        .status(httpCodes.HTTP_BAD_REQUEST)
        .json({ message: msg.en.ALL_REQUIRED });
    }

    // Check date format validity
    if (!isValidDate(start_date) || !isValidDate(end_date)) {
      return res
        .status(httpCodes.HTTP_BAD_REQUEST)
        .json({ message: msg.en.INVALID_DATE });
    }

    // Create new event
    const event = await Event.create({
      company_id: userId,
      client_id,
      name,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
    });
    // Respond with the created event
    return res
      .status(httpCodes.HTTP_CREATED)
      .json({ message: msg.en.EVENT_CREATED, event });
  } catch (error) {
    console.error(error);
  }
};
