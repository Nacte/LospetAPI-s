const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register for registering a new user
router.post('/register', userController.registerUser);

// Route for verifying email
router.get('/verify-email/:token', userController.verifyEmail);

// // Login users
router.post('/login', userController.loginUser);

// Forgot password
router.post('/forgot-password', userController.forgotPassword);

// Reset password
router.post('/reset-password', userController.resetPassword);

// Logout user
router.post('/logout', userController.logoutUser);

module.exports = router;
