const mongoose = require('mongoose');

// Define Event Schema
const eventSchema = new mongoose.Schema({
  company_id: {
    type: Number,
  },
  client_id: {
    type: Number,
  },
  name: {
    type: String,
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  status_id: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  deleted_at: {
    type: Date,
    default: null,
  },
});

// Create Event Model
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
