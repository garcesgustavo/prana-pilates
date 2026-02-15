const mongoose = require('mongoose');

/**
 * Stat Schema
 * Tracks general statistics like site visits
 */
const statSchema = new mongoose.Schema({
    visits: { type: Number, default: 0 }
});

module.exports = mongoose.model('Stat', statSchema);
