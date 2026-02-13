const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'prana2026';

// ---------------------------------------------------------
// MongoDB Connection
// ---------------------------------------------------------
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('Connected to MongoDB Atlas'))
        .catch(err => console.error('MongoDB connection error:', err));
} else {
    console.warn('MONGODB_URI not found. Server running without DB (limited functionality).');
}

// ---------------------------------------------------------
// Schemas & Models
// ---------------------------------------------------------
const appointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    activity: { type: String, required: true },
    day: String,
    time: String,
    status: { type: String, default: 'pending' },
    created_at: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    created_at: { type: Date, default: Date.now }
});

const statSchema = new mongoose.Schema({
    visits: { type: Number, default: 0 }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
const User = mongoose.model('User', userSchema);
const Stat = mongoose.model('Stat', statSchema);

// Initialize visits if not exist
async function initStats() {
    const stats = await Stat.findOne();
    if (!stats) await Stat.create({ visits: 0 });
}
if (MONGODB_URI) initStats();

// ---------------------------------------------------------
// Middleware
// ---------------------------------------------------------
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https://images.unsplash.com"],
            "script-src": ["'self'", "'unsafe-inline'"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            "frame-src": ["'self'", "https://www.google.com"],
        },
    },
}));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Demasiadas peticiones. Intenta de nuevo más tarde.' }
});
app.use('/api/', limiter);

const requireAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === ADMIN_TOKEN) {
        next();
    } else {
        res.status(401).json({ error: 'unauthorized' });
    }
};

// ---------------------------------------------------------
// API Routes
// ---------------------------------------------------------

// Stats (Protected)
app.get('/api/stats', requireAdmin, async (req, res) => {
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
});

// Appointments
app.get('/api/appointments', requireAdmin, async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ created_at: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
});

app.post('/api/appointments', async (req, res) => {
    try {
        const { name, email, activity, day, time, phone } = req.body;
        if (!name || !email || !activity) {
            return res.status(400).json({ error: 'Datos requeridos faltantes.' });
        }

        const newAppointment = new Appointment({
            name: name.substring(0, 100).replace(/[<>]/g, ""),
            email: email.substring(0, 100).replace(/[<>]/g, ""),
            activity: activity.substring(0, 50),
            day,
            time
        });
        await newAppointment.save();

        // Update or create user
        await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            {
                name: name.substring(0, 100).replace(/[<>]/g, ""),
                phone: (phone || '').substring(0, 20)
            },
            { upsert: true, new: true }
        );

        res.status(201).json(newAppointment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al procesar la reserva' });
    }
});

// Users
app.get('/api/users', requireAdmin, async (req, res) => {
    try {
        const users = await User.find().sort({ created_at: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Availability (Static for now, could be move to DB later)
app.get('/api/availability', async (req, res) => {
    res.json({
        hours: ['08:00', '09:00', '10:00', '11:00', '17:00', '18:00', '19:00', '20:00']
    });
});

// Visit tracking
app.post('/api/visit', async (req, res) => {
    try {
        const stats = await Stat.findOneAndUpdate({}, { $inc: { visits: 1 } }, { new: true });
        res.json({ visits: stats.visits });
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar visita' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
