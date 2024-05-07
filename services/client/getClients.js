const Client = require('../../Models/clients');
const { httpCodes } = require('../../utils/response_codes');
const { msg } = require('../../utils/messages');


// Pagination
exports.getAllClientsService = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit of 10 items per page

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch clients with pagination
    const clients = await Client.find({}, null, { skip, limit }); // Find all, no projection, with skip and limit

    // Get total count (optional for client-side pagination)
    const total = await Client.countDocuments({}); // Count all documents

    // Respond with paginated data (including total count if needed)
    return {
      code: httpCodes.HTTP_OK,
      data: {
        clients,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(total / limit), // Calculate total pages
        },
      },
    };
  } catch (error) {
    return {
      code: httpCodes.HTTP_INTERNAL_SERVER_ERROR,
      status: { message: msg.en.SERVER_ERROR },
    };
  }
};
