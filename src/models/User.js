const mongoose = require('mongoose');

/**
 * User Schema
 * Represents a registered user/client
 */
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
