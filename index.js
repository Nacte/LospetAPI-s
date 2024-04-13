const express = require('express');
const connectToDatabase = require('./utils/database');
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
