const Appointment = require('../models/Appointment');
const User = require('../models/User');

/**
 * Get all appointments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ created_at: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
};

/**
 * Create a new appointment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createAppointment = async (req, res) => {
    try {
        const { name, email, activity, day, time, phone } = req.body;
        if (!name || !email || !activity) {
            return res.status(400).json({ error: 'Datos requeridos faltantes.' });
        }

        const sanitize = (str) => typeof str === 'string' ? str.substring(0, 100).replace(/[<>&"']/g, "") : "";

        const newAppointment = new Appointment({
            name: sanitize(name),
            email: sanitize(email).toLowerCase(),
            phone: sanitize(phone).substring(0, 20),
            activity: sanitize(activity).substring(0, 50),
            day: sanitize(day),
            time: sanitize(time)
        });
        await newAppointment.save();

        // Update or create user
        await User.findOneAndUpdate(
            { email: sanitize(email).toLowerCase() },
            {
                name: sanitize(name),
                phone: sanitize(phone).substring(0, 20)
            },
            { upsert: true, new: true }
        );

        res.status(201).json(newAppointment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al procesar la reserva' });
    }
};

/**
 * Get availability slots (Static for now)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAvailability = async (req, res) => {
    res.json({
        hours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
    });
};
