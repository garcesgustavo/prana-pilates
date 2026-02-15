/**
 * Database Configuration
 * Handles logic for connecting to MongoDB
 */
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Connects to the MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    if (!MONGODB_URI) {
        console.warn('MONGODB_URI not found. Server running without DB (limited functionality).');
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
