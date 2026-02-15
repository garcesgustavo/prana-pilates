const mongoose = require('mongoose');

/**
 * Appointment Schema
 * Represents a class reservation
 */
const appointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    activity: { type: String, required: true },
    day: String,
    time: String,
    status: { type: String, default: 'pending' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
