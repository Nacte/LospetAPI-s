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
  password_confirmation: {
    type: String,
  },
  remember_token: {
    type: String,
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
