const User = require("../Models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {sendRegistrationEmail} = require("../services/mailService");
const {httpCodes} = require("../utils/response_codes");


exports.registerUserService = async (req, res, next) => {
    // Extract user data from request body
    const { name, email, password, password_confirmation } = req.body;

    // Check if all required fields are provided
    if (!email || !password || !password_confirmation) {
        return res.status(httpCodes.HTTP_BAD_REQUEST).json({ message: 'All fields are required' });
    }

    // Check if passwords match
    if (password !== password_confirmation) {
        return res.status(httpCodes.HTTP_BAD_REQUEST).json({ error: 'Passwords do not match' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(httpCodes.HTTP_BAD_REQUEST)
                .json({ message: 'An account with that email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const user = new User({ name, password: hashedPassword, email });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        // Send registration email with verification link
        await sendRegistrationEmail(token, email);

        // Respond with success message
        res.status(httpCodes.HTTP_CREATED).json({
            message:
                'User registered successfully. Please check your email for verification.',
        });
    } catch (error) {
        next(error);
    }
}