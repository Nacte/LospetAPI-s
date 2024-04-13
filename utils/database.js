const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    const connectDB = process.env.DATABASE.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD
    );

    mongoose
      .connect(connectDB)
      .then(() => {
        console.log('Connected to MongoDB');
        resolve();
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
        reject(error);
      });
  });
};

module.exports = connectToDatabase;
