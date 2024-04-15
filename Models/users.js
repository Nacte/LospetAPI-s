const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  email_verified_at: {
    type: Date,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  remember_token: {
    type: String,
    default: null,
  },
  reset_token: {
    type: String,
    default: null,
  },
  reset_token_expires: {
    type: Date,
    default: null,
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

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;
