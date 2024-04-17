const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const accountController = require('../controllers/accountController');
const { protect } = require('../middleware/authMiddleware');

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

// Put request to change the password
router.put('/change-password', protect, accountController.changePassword);

module.exports = router;
