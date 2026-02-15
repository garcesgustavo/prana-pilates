const User = require('../models/User');

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ created_at: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};
