const express = require('express');
const connectToDatabase = require('./utils/database');
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const { httpCodes } = require('../utils/response_codes');

// Middleware for JSON parsing
app.use(express.json());

// Cors for all routes
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Connect to MongoDB
connectToDatabase();

// mount user routes
app.use('/', userRoutes);

// mount account routes
app.use('/api/account', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res
    .status(httpCodes.HTTP_INTERNAL_SERVER_ERROR)
    .send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
