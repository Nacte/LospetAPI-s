const mongoose = require('mongoose');

// Define Client Schema
const clientSchema = new mongoose.Schema({
  company_id: {
    type: Number,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  address: {
    type: String,
  },
  gender: {
    type: String,
  },
  notes: {
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
  deleted_at: {
    type: Date,
    default: null,
  },
});

// Create Clients Model
const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
