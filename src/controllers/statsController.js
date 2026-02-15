const Stat = require('../models/Stat');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

/**
 * Initialize stats if they don't exist
 */
exports.initStats = async () => {
    try {
        await Stat.findOneAndUpdate({}, { $setOnInsert: { visits: 0 } }, { upsert: true });
    } catch (err) {
        console.error('Error initializing stats:', err);
    }
};

/**
 * Get dashboard stats
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getStats = async (req, res) => {
    try {
        const stats = await Stat.findOne();
        const appointmentsCount = await Appointment.countDocuments();
        const usersCount = await User.countDocuments();
        res.json({
            visits: stats ? stats.visits : 0,
            appointments: appointmentsCount,
            users: usersCount
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

/**
 * Log a new visit
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.logVisit = async (req, res) => {
    try {
        const stats = await Stat.findOneAndUpdate({}, { $inc: { visits: 1 } }, { new: true, upsert: true });
        res.json({ visits: stats.visits });
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar visita' });
    }
};
