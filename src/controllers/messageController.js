const Message = require('../models/Message');

/**
 * Get all messages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ created_at: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
};

/**
 * Create a new message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Datos requeridos faltantes.' });
        }

        const sanitize = (str) => typeof str === 'string' ? str.substring(0, 500).replace(/[<>&"']/g, "") : "";

        const newMessage = new Message({
            name: sanitize(name),
            email: sanitize(email).toLowerCase(),
            message: sanitize(message)
        });
        await newMessage.save();

        res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al procesar el mensaje' });
    }
};
