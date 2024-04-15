const User = require('../Models/users');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const {
  sendRegistrationEmail,
  sendResetLink,
} = require('../services/mailService');
const crypto = require('crypto');

// Load environment variables from config.env file
dotenv.config({ path: './config.env' });

// Function to register a new user
exports.registerUser = async (req, res, next) => {
  try {
    // Extract user data from request body
    const { name, email, password, password_confirmation } = req.body;

    // Check if all required fields are provided
    if (!email || !password || !password_confirmation) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if passwords match
    if (password !== password_confirmation) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'An account with that email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const user = new User({ name, password: hashedPassword, email });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    // Send registration email with verification link
    await sendRegistrationEmail(token, email);

    // Respond with success message
    res.status(201).json({
      message:
        'User registered successfully. Please check your email for verification.',
    });
  } catch (error) {
    next(error);
  }
};

// Function to verify user's email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    console.log(token);

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by id
    const user = await User.findById(decoded.userId);

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification link' });
    }

    if (user.email_verified_at !== null) {
      return res.status(400).json({ message: 'The link is not valid anymore' });
    }

    // Update user's email verification status
    const currentTime = new Date(Date.now()).toISOString();
    user.email_verified_at = currentTime;
    await user.save();

    // Respond and redirect to dashboard

    res.redirect(301, process.env.FRONTEND_URL + '/login');
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //Find user my email
    const user = await User.findOne({ email });

    //Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the email_verified_at column === null, if yes account is not activated
    if (!user.email_verified_at === null) {
      return res.status(400).json({
        message: 'Your account is not activated, please check your email',
      });
    }

    //User is authenticated return JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    // Return JWT token in response
    res.json({ message: 'Login successful', token });
  } catch (error) {
    next(error);
  }
};

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Check if the email exists in the db
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: 'User with that email does not exist!' });
    }

    // Generate reset token and expiry date
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; //1hour

    // Save token and expiry date to the user
    user.reset_token = resetToken;
    user.reset_token_expires = resetTokenExpires;
    await user.save();
    // Send reset link via email
    await sendResetLink(email, resetToken);
    res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password, password_confirmation } = req.body;

    // Check if token, email, newPassword and password_confirmation are provided
    if (!token || !password || !password_confirmation) {
      return res.status(400).json({
        message: 'Token,  new password, and password confirmation are required',
      });
    }

    // Check if newPassword and confirmPassword match
    if (password !== password_confirmation) {
      return res.status(400).json({
        message: 'New password and password_confirmation do not match',
      });
    }

    // Find user by token
    const user = await User.findOne({ reset_token: token });
    console.log(user);

    // If user not found or reset token expired
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired reset token' });
    }

    // Check to see if the token is not expired
    if (Date.toISOString < user.reset_token_expires) {
      console.log(Date.toISOString);
      console.log(user.reset_token_expires);
      return res
        .status(400)
        .json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password
    user.password = hashedPassword;
    user.reset_token = null;
    user.reset_token_expires = null;
    await user.save();

    // Respond with success message
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
