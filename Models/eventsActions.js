const mongoose = require('mongoose');

// Define Event actions Schema
const eventActionsSchema = new mongoose.Schema({
  event_id: {
    type: Number,
  },
  sent_status: {
    type: Number,
  },
  response: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Create Event Model
const EventActions = mongoose.model('EventActions', eventActionsSchema);
module.exports = EventActions;
