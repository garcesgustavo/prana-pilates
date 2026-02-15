const mongoose = require('mongoose');

/**
 * Message Schema
 * Represents a contact form submission
 */
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
